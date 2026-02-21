import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// uses service role key — only runs on server
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
      chamaName, description, adminName, adminEmail,
      adminPhone, contributionAmount, contributionFrequency,
      meetingDay, plan,
    } = body;

    const tempPassword = generatePassword();

    // STEP 1
    console.log("Step 1: Creating auth user...");
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: tempPassword,
        email_confirm: true,
      });
    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    console.log("Step 1 done. userId:", authData.user.id);

    const userId = authData.user.id;

    // STEP 2
    console.log("Step 2: Inserting profile...");
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
    if (profileError) {
      console.error("Profile error:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }
    console.log("Step 2 done.");

    const frequency = contributionFrequency?.toLowerCase().trim() === "weekly" ? "weekly" : "monthly";

    // STEP 3
    console.log("Step 3: Inserting chama...");
    const { data: chama, error: chamaError } = await supabaseAdmin
      .from("chamas")
      .insert({
        name: chamaName,
        description: description || null,
        contribution_amount: Number(contributionAmount),
        contribution_frequency: frequency,
        meeting_day: meetingDay,
        created_by: userId,
        plan: plan,
      })
      .select()
      .single();
    if (chamaError) {
      console.error("Chama error:", chamaError);
      return NextResponse.json({ error: chamaError.message }, { status: 400 });
    }
    console.log("Step 3 done. chamaId:", chama.id);

    // STEP 4
    console.log("Step 4: Inserting chama member...");
    const { error: memberError } = await supabaseAdmin
      .from("chama_members")
      .insert({
        chama_id: chama.id,
        user_id: userId,
        role: "admin",
        status: "active",
      });
    if (memberError) {
      console.error("Member error:", memberError);
      return NextResponse.json({ error: memberError.message }, { status: 400 });
    }
    console.log("Step 4 done.");

    // STEP 5
    console.log("Step 5: Updating profile with chama_id...");
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ chama_id: chama.id })
      .eq("id", userId);
    if (updateError) {
      console.error("Profile update error:", updateError);
    }
    console.log("All steps done!");

    return NextResponse.json({ success: true, chamaId: chama.id, tempPassword });

  } catch (err) {
    console.error("UNCAUGHT ERROR:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}