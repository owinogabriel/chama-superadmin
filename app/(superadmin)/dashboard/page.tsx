"use client";

import {
  Building2,
  Users,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useChamas } from "@/hooks/useChama";

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  active: { label: "Active", icon: CheckCircle2, class: "text-emerald-400 bg-emerald-500/10" },
  suspended: { label: "Suspended", icon: XCircle, class: "text-red-400 bg-red-500/10" },
  pending: { label: "Pending", icon: Clock, class: "text-amber-400 bg-amber-500/10" },
};

const activityDot: Record<string, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  warning: "bg-amber-400",
};

const buildActivity = (chamas: any[]) => {
  return chamas.slice(0, 5).map((c) => ({
    id: c.id,
    action: "New chama created",
    detail: c.name,
    time: new Date(c.created_at).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    type: c.status === "active" ? "success" : "error",
  }));
};

const StatSkeleton = () => (
  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-9 h-9 rounded-xl bg-white/[0.06]" />
      <div className="w-16 h-6 rounded-full bg-white/[0.06]" />
    </div>
    <div className="w-24 h-7 rounded-lg bg-white/[0.06] mb-2" />
    <div className="w-20 h-3 rounded bg-white/[0.04]" />
  </div>
);

const RowSkeleton = () => (
  <tr className="border-b border-white/[0.04]">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 rounded bg-white/[0.05] animate-pulse" style={{ width: `${50 + i * 10}%` }} />
      </td>
    ))}
  </tr>
);

export default function OverviewPage() {
  const { data: chamas, isLoading, isError } = useChamas();

  const totalChamas = chamas?.length ?? 0;
  const totalMembers = chamas?.reduce((sum, c) => sum + (c.chama_members?.[0]?.count ?? 0), 0) ?? 0;
  const activeChamas = chamas?.filter((c) => c.status === "active").length ?? 0;
  const proChamas = chamas?.filter((c) => c.plan === "pro").length ?? 0;
  const basicChamas = chamas?.filter((c) => c.plan === "basic").length ?? 0;
  const monthlyRevenue = proChamas * 10000 + basicChamas * 5000;

  const stats = [
    {
      label: "Total Chamas",
      value: isLoading ? "—" : totalChamas.toString(),
      change: `${activeChamas} active`,
      trend: "up",
      icon: Building2,
      colorMap: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      iconBg: "bg-emerald-500/15 text-emerald-400",
    },
    {
      label: "Total Members",
      value: isLoading ? "—" : totalMembers.toLocaleString(),
      change: `across ${totalChamas} chamas`,
      trend: "up",
      icon: Users,
      colorMap: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      iconBg: "bg-sky-500/15 text-sky-400",
    },
    {
      label: "Monthly Revenue",
      value: isLoading ? "—" : `KES ${monthlyRevenue.toLocaleString()}`,
      change: `${proChamas} Pro · ${basicChamas} Basic`,
      trend: "up",
      icon: TrendingUp,
      colorMap: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      iconBg: "bg-violet-500/15 text-violet-400",
    },
    {
      label: "Active Plans",
      value: isLoading ? "—" : activeChamas.toString(),
      change: `${totalChamas - activeChamas} suspended`,
      trend: totalChamas - activeChamas > 0 ? "down" : "up",
      icon: CreditCard,
      colorMap: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      iconBg: "bg-amber-500/15 text-amber-400",
    },
  ];

  const recentChamas = chamas?.slice(0, 5) ?? [];
  const activity = buildActivity(chamas ?? []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="mb-8">
        <p className="text-white/40 text-sm tracking-widest uppercase mb-1">Super Admin</p>
        <h1 className="text-2xl font-semibold text-white">Platform Overview</h1>
        <p className="text-white/40 text-sm mt-1">
          {new Date().toLocaleDateString("en-KE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">Failed to load data. Please refresh the page.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)
          : stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                    <stat.icon size={17} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${stat.colorMap}`}>
                    {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </div>
            ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Chamas Table */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <h2 className="text-sm font-medium text-white">Recent Chamas</h2>
            <Link href="/dashboard/chamas" className="text-white/30 hover:text-white text-xs transition-colors">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {["Chama", "Admin", "Members", "Plan", "Status", "Created"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-white/30 text-xs font-medium tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => <RowSkeleton key={i} />)
                ) : recentChamas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-white/30 text-sm">
                      No chamas yet.{" "}
                      <Link href="/dashboard/chamas/create" className="text-emerald-400 hover:underline">
                        Create your first chama
                      </Link>
                    </td>
                  </tr>
                ) : (
                  recentChamas.map((chama, i) => {
                    const s = statusConfig[chama.status ?? "active"];
                    const memberCount = chama.chama_members?.[0]?.count ?? 0;
                    return (
                      <tr
                        key={chama.id}
                        className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                          i === recentChamas.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/dashboard/chamas/${chama.id}`}
                            className="text-white text-sm font-medium hover:text-emerald-400 transition-colors"
                          >
                            {chama.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-white/50 text-sm">
                          {chama.profiles?.full_name ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-white/50 text-sm">{memberCount}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                            chama.plan === "pro"
                              ? "bg-violet-500/10 text-violet-400"
                              : "bg-white/5 text-white/40"
                          }`}>
                            {chama.plan ?? "basic"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full w-fit font-medium ${s.class}`}>
                            <s.icon size={11} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-white/30 text-xs">
                          {new Date(chama.created_at).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <h2 className="text-sm font-medium text-white">Recent Activity</h2>
            <button className="text-white/30 hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="divide-y divide-white/[0.05]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-5 py-4 flex gap-3 animate-pulse">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-white/[0.08] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/[0.06] rounded w-3/4" />
                    <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                    <div className="h-2 bg-white/[0.03] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <div className="px-5 py-16 text-center text-white/30 text-sm">No activity yet</div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-4 flex gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="mt-1.5 shrink-0">
                    <span className={`block w-2 h-2 rounded-full ${activityDot[item.type]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.action}</p>
                    <p className="text-white/40 text-xs mt-0.5 truncate">{item.detail}</p>
                    <p className="text-white/25 text-xs mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}