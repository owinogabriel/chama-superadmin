import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const generatePassword = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!";
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      chamaName,
      description,
      adminName,
      adminEmail,
      adminPhone,
      contributionAmount,
      contributionFrequency,
      meetingDay,
      plan,
    } = body;

    const tempPassword = generatePassword();

    // STEP 1: Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: tempPassword,
        email_confirm: true,
      });
    if (authError)
      return NextResponse.json({ error: authError.message }, { status: 400 });

    const userId = authData.user.id;

    // STEP 2: Insert profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        full_name: adminName,
        email: adminEmail,
        phone_number: adminPhone,
        role: "admin",
        temp_password: tempPassword,
        is_first_login: true,
        status: "active",
      });
    if (profileError)
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 },
      );

    const frequency =
      contributionFrequency?.toLowerCase().trim() === "weekly"
        ? "weekly"
        : "monthly";

    // STEP 3: Insert chama
    const { data: chama, error: chamaError } = await supabaseAdmin
      .from("chamas")
      .insert({
        name: chamaName,
        description: description || null,
        contribution_amount: Number(contributionAmount),
        contribution_frequency: frequency,
        meeting_day: meetingDay,
        created_by: userId,
        plan,
      })
      .select()
      .single();
    if (chamaError)
      return NextResponse.json({ error: chamaError.message }, { status: 400 });

    // STEP 4: Insert chama member
    const { error: memberError } = await supabaseAdmin
      .from("chama_members")
      .insert({
        chama_id: chama.id,
        user_id: userId,
        role: "admin",
        status: "active",
      });
    if (memberError)
      return NextResponse.json({ error: memberError.message }, { status: 400 });

    // STEP 5: Update profile with chama_id
    await supabaseAdmin
      .from("profiles")
      .update({ chama_id: chama.id })
      .eq("id", userId);

    // STEP 6: Send credentials email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: adminEmail,
          adminName,
          adminEmail,
          temporaryPassword: tempPassword,
          chamaName,
          contributionAmount: Number(contributionAmount),
          contributionFrequency,
          meetingDay,
          plan,
        }),
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      chamaId: chama.id,
      tempPassword,
    });
  } catch (err) {
    console.error("UNCAUGHT ERROR:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
