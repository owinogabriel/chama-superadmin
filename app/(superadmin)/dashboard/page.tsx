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

// ── Dummy Data ─────────────────────────────────────────────
const stats = [
  {
    label: "Total Chamas",
    value: "124",
    change: "+12",
    trend: "up",
    sub: "vs last month",
    icon: Building2,
    color: "emerald",
  },
  {
    label: "Total Members",
    value: "3,842",
    change: "+284",
    trend: "up",
    sub: "vs last month",
    icon: Users,
    color: "sky",
  },
  {
    label: "Monthly Revenue",
    value: "KES 248,500",
    change: "+18.4%",
    trend: "up",
    sub: "vs last month",
    icon: TrendingUp,
    color: "violet",
  },
  {
    label: "Active Plans",
    value: "98",
    change: "-3",
    trend: "down",
    sub: "vs last month",
    icon: CreditCard,
    color: "amber",
  },
];

const recentChamas = [
  {
    id: 1,
    name: "Umoja Investment Group",
    admin: "Grace Wanjiku",
    members: 24,
    status: "active",
    plan: "Pro",
    joined: "Feb 14, 2026",
  },
  {
    id: 2,
    name: "Pamoja Savings Circle",
    admin: "James Otieno",
    members: 18,
    status: "active",
    plan: "Basic",
    joined: "Feb 11, 2026",
  },
  {
    id: 3,
    name: "Tumaini Welfare Fund",
    admin: "Mary Achieng",
    members: 31,
    status: "active",
    plan: "Pro",
    joined: "Feb 9, 2026",
  },
  {
    id: 4,
    name: "Nguvu Women's Group",
    admin: "Esther Kamau",
    members: 15,
    status: "suspended",
    plan: "Basic",
    joined: "Jan 30, 2026",
  },
  {
    id: 5,
    name: "Imani Youth Invest",
    admin: "Brian Mutua",
    members: 22,
    status: "active",
    plan: "Pro",
    joined: "Jan 27, 2026",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "New chama created",
    detail: "Umoja Investment Group",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    action: "Subscription renewed",
    detail: "Pamoja Savings Circle — Pro Plan",
    time: "5 hours ago",
    type: "success",
  },
  {
    id: 3,
    action: "Chama suspended",
    detail: "Nguvu Women's Group",
    time: "1 day ago",
    type: "error",
  },
  {
    id: 4,
    action: "New admin created",
    detail: "Brian Mutua added as admin",
    time: "1 day ago",
    type: "success",
  },
  {
    id: 5,
    action: "Subscription pending",
    detail: "Tumaini Welfare Fund — renewal due",
    time: "2 days ago",
    type: "warning",
  },
];

// ── Helpers ────────────────────────────────────────────────
const colorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const iconBg: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-400",
  sky: "bg-sky-500/15 text-sky-400",
  violet: "bg-violet-500/15 text-violet-400",
  amber: "bg-amber-500/15 text-amber-400",
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    class: "text-emerald-400 bg-emerald-500/10",
  },
  suspended: {
    label: "Suspended",
    icon: XCircle,
    class: "text-red-400 bg-red-500/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    class: "text-amber-400 bg-amber-500/10",
  },
};

const activityDot: Record<string, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  warning: "bg-amber-400",
};

// ── Component ──────────────────────────────────────────────
export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="mb-8">
        <p className="text-white/40 text-sm tracking-widest uppercase mb-1">
          Super Admin
        </p>
        <h1 className="text-2xl font-semibold text-white">Platform Overview</h1>
        <p className="text-white/40 text-sm mt-1">
          Saturday, 21 February 2026
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg[stat.color]}`}
              >
                <stat.icon size={17} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${colorMap[stat.color]}`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-white mb-1">
              {stat.value}
            </p>
            <p className="text-white/40 text-xs">{stat.label}</p>
            <p className="text-white/25 text-xs mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Chamas Table */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <h2 className="text-sm font-medium text-white">Recent Chamas</h2>
            <button className="text-white/30 hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {["Chama", "Admin", "Members", "Plan", "Status", "Joined"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-white/30 text-xs font-medium tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recentChamas.map((chama, i) => {
                  const s = statusConfig[chama.status];
                  return (
                    <tr
                      key={chama.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                        i === recentChamas.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-white text-sm font-medium">
                          {chama.name}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-white/50 text-sm">
                        {chama.admin}
                      </td>
                      <td className="px-5 py-3.5 text-white/50 text-sm">
                        {chama.members}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            chama.plan === "Pro"
                              ? "bg-violet-500/10 text-violet-400"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {chama.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full w-fit font-medium ${s.class}`}
                        >
                          <s.icon size={11} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/30 text-xs">
                        {chama.joined}
                      </td>
                    </tr>
                  );
                })}
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
          <div className="divide-y divide-white/[0.05]">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="px-5 py-4 flex gap-3 hover:bg-white/[0.02] transition-colors"
              >
                {/* dot */}
                <div className="mt-1.5 shrink-0">
                  <span
                    className={`block w-2 h-2 rounded-full ${activityDot[item.type]}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {item.action}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">
                    {item.detail}
                  </p>
                  <p className="text-white/25 text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}