"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Chamas", href: "/dashboard/chamas", icon: Building2, exact: false },
  { label: "Users", href: "/dashboard/users", icon: Users, exact: false },
  {
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    exact: false,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useUser();
  const { data: settings } = usePlatformSettings();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Collapse by default on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setCollapsed(isMobile);

    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const platformName = settings?.platform_name ?? "ChamaAdmin";

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-[#0f1117] border-r border-white/10
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-[72px]" : "w-[240px]"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {platformName.charAt(0)}
                </span>
              </div>
              <span className="text-white font-semibold text-sm tracking-wide truncate max-w-[140px]">
                {platformName}
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">
                {platformName.charAt(0)}
              </span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150 group
                  ${active ? "bg-emerald-500/15 text-emerald-400" : "text-white/50 hover:text-white hover:bg-white/5"}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon
                  size={18}
                  className={`shrink-0 ${active ? "text-emerald-400" : "text-white/40 group-hover:text-white"}`}
                />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          {!collapsed && user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="text-emerald-400 text-xs font-bold uppercase">
                  {user.full_name?.charAt(0) ?? "A"}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-medium truncate">
                  {user.full_name}
                </p>
                <p className="text-white/40 text-xs truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium text-white/50 hover:text-red-400
              hover:bg-red-500/10 transition-all duration-150
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && (
              <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
            )}
          </button>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${collapsed ? "ml-[72px]" : "ml-[240px]"}`}
      />
    </>
  );
};
