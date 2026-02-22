import { Sidebar } from "@/components/superadmin/Sidebar";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Re-check session whenever the tab becomes visible again
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0a0c10] flex">
      <Sidebar />
      <main className="flex-1 p-6 text-white">{children}</main>
    </div>
  );
}
