import { Sidebar } from "@/components/superadmin/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0c10] flex">
      <Sidebar />
      <main className="flex-1 p-6 text-white">
        {children}
      </main>
    </div>
  );
}