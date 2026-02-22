import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Tailwind, Row, Column,
} from "@react-email/components";

interface CredentialsEmailProps {
  adminName: string;
  adminEmail: string;
  temporaryPassword: string;
  chamaName: string;
  contributionAmount: number;
  contributionFrequency: string;
  meetingDay: string;
  plan: string;
  loginUrl?: string;
  platformName?: string;
}

export const CredentialsEmail = ({
  adminName = "Grace Wanjiku",
  adminEmail = "grace@email.com",
  temporaryPassword = "Temp@1234",
  chamaName = "Umoja Investment Group",
  contributionAmount = 5000,
  contributionFrequency = "Monthly",
  meetingDay = "Saturday",
  plan = "Basic",
  loginUrl = "https://chama-superadmin.vercel.app/login",
  platformName = "ChamaVault",
}: CredentialsEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Your {platformName} admin account for {chamaName} is ready — here are your login credentials
      </Preview>
      <Tailwind>
        <Body style={{ backgroundColor: "#0a0c10", fontFamily: "ui-monospace, 'Courier New', monospace" }}>
          <Container style={{
            maxWidth: "580px", margin: "40px auto",
            backgroundColor: "#0f1117", borderRadius: "20px",
            overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)",
          }}>

            {/* Header */}
            <Section style={{
              background: "linear-gradient(135deg, #0f1117 0%, #111820 100%)",
              padding: "32px 40px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <Row>
                <Column>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      backgroundColor: "#10b981", display: "inline-flex",
                      alignItems: "center", justifyContent: "center",
                      fontWeight: "bold", color: "#fff", fontSize: "14px",
                    }}>
                      {platformName.charAt(0)}
                    </div>
                    <Text style={{
                      color: "#ffffff", fontSize: "16px", fontWeight: "600",
                      margin: "0", letterSpacing: "0.02em",
                    }}>
                      {platformName}
                    </Text>
                  </div>
                </Column>
                <Column align="right">
                  <Text style={{
                    color: "rgba(255,255,255,0.3)", fontSize: "11px",
                    margin: "0", textTransform: "uppercase", letterSpacing: "0.1em",
                  }}>
                    Admin Credentials
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Accent bar */}
            <div style={{ height: "3px", background: "linear-gradient(90deg, #10b981 0%, #059669 50%, transparent 100%)" }} />

            {/* Greeting */}
            <Section style={{ padding: "36px 40px 0" }}>
              <Text style={{
                color: "rgba(255,255,255,0.4)", fontSize: "11px",
                textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 8px",
              }}>
                Welcome aboard
              </Text>
              <Heading style={{
                color: "#ffffff", fontSize: "24px", fontWeight: "700",
                margin: "0 0 12px", lineHeight: "1.3",
              }}>
                Hey {adminName} 👋
              </Heading>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.7", margin: "0" }}>
                Your chama admin account has been created on {platformName}. Below are
                your login credentials and chama details. Please log in and change your password immediately.
              </Text>
            </Section>

            {/* Credentials Card */}
            <Section style={{ padding: "24px 40px 0" }}>
              <div style={{
                backgroundColor: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "14px", padding: "24px",
              }}>
                <Text style={{
                  color: "#10b981", fontSize: "11px", textTransform: "uppercase",
                  letterSpacing: "0.1em", fontWeight: "600", margin: "0 0 16px",
                }}>
                  🔐 Your Login Credentials
                </Text>

                <div style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px", padding: "12px 16px", marginBottom: "10px",
                }}>
                  <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                    Email Address
                  </Text>
                  <Text style={{ color: "#ffffff", fontSize: "14px", fontWeight: "500", margin: "0" }}>
                    {adminEmail}
                  </Text>
                </div>

                <div style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px", padding: "12px 16px",
                }}>
                  <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                    Temporary Password
                  </Text>
                  <Text style={{ color: "#10b981", fontSize: "18px", fontWeight: "700", margin: "0", letterSpacing: "0.12em" }}>
                    {temporaryPassword}
                  </Text>
                </div>
              </div>
            </Section>

            {/* Chama Details */}
            <Section style={{ padding: "20px 40px 0" }}>
              <div style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "24px",
              }}>
                <Text style={{
                  color: "rgba(255,255,255,0.4)", fontSize: "11px",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  fontWeight: "600", margin: "0 0 16px",
                }}>
                  🏦 Chama Details
                </Text>

                {[
                  { label: "Chama Name", value: chamaName },
                  { label: "Contribution", value: `KES ${contributionAmount.toLocaleString()} / ${contributionFrequency}` },
                  { label: "Meeting Day", value: meetingDay },
                  { label: "Plan", value: plan },
                ].map((row, i, arr) => (
                  <Row key={row.label} style={{
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    paddingBottom: i < arr.length - 1 ? "10px" : "0",
                    marginBottom: i < arr.length - 1 ? "10px" : "0",
                  }}>
                    <Column>
                      <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "0" }}>
                        {row.label}
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", fontWeight: "500", margin: "0" }}>
                        {row.value}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </div>
            </Section>

            {/* CTA */}
            <Section style={{ padding: "28px 40px 0", textAlign: "center" as const }}>
              <a href={loginUrl} style={{
                display: "inline-block", backgroundColor: "#10b981",
                color: "#ffffff", fontSize: "14px", fontWeight: "600",
                padding: "14px 40px", borderRadius: "12px",
                textDecoration: "none", letterSpacing: "0.02em",
              }}>
                Log In to {platformName} →
              </a>
              <Text style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", margin: "12px 0 0" }}>
                Or visit: {loginUrl}
              </Text>
            </Section>

            {/* Warning */}
            <Section style={{ padding: "24px 40px 0" }}>
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
                borderRadius: "10px", padding: "14px 18px",
              }}>
                <Text style={{ color: "rgba(248, 113, 113, 0.9)", fontSize: "12px", lineHeight: "1.6", margin: "0" }}>
                  ⚠️ <strong style={{ color: "#f87171" }}>Change your password immediately</strong> after
                  logging in. This temporary password will expire in <strong style={{ color: "#f87171" }}>24 hours</strong>.
                  Do not share it with anyone.
                </Text>
              </div>
            </Section>

            <Hr style={{ borderColor: "rgba(255,255,255,0.07)", margin: "32px 40px 0" }} />

            {/* Footer */}
            <Section style={{ padding: "20px 40px 28px" }}>
              <Text style={{
                color: "rgba(255,255,255,0.2)", fontSize: "11px",
                textAlign: "center" as const, margin: "0", lineHeight: "1.7",
              }}>
                © {new Date().getFullYear()} {platformName} · All rights reserved
                <br />
                If you did not expect this email, please ignore it or contact support.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CredentialsEmail;