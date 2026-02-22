import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { CredentialsEmail } from "@/components/emails/CredentialsEmail";
import { createClient } from "@supabase/supabase-js";


const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await req.json();
  const {
    to,
    adminName,
    adminEmail,
    temporaryPassword,
    chamaName,
    contributionAmount,
    contributionFrequency,
    meetingDay,
    plan,
    loginUrl,
  } = body;

  // Pull platform name live from settings
  const { data: settingsRows } = await supabaseAdmin
    .from("platform_settings")
    .select("key, value");

  const settings = Object.fromEntries(
    (settingsRows ?? []).map((s: { key: string; value: string }) => [
      s.key,
      s.value,
    ]),
  );

  const platformName = settings.platform_name ?? "ChamaVault";

  try {
    const result = await resend.emails.send({
      from: "ChamaVault <onboarding@resend.dev>",
      to: "lyongabriel746@gmail.com",
      subject: `Your ${platformName} Admin Credentials — ${chamaName}`,
      react: CredentialsEmail({
        adminName,
        adminEmail,
        temporaryPassword,
        chamaName,
        contributionAmount,
        contributionFrequency,
        meetingDay,
        plan,
        loginUrl: loginUrl ?? process.env.NEXT_PUBLIC_APP_URL + "/login",
        platformName,
      }),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
