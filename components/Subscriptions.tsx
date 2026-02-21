"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpRight,
} from "lucide-react";

// ── Dummy Data ─────────────────────────────────────────────
const stats = [
  { label: "Monthly Revenue", value: "KES 248,500", change: "+18.4%", trend: "up", sub: "vs last month" },
  { label: "Active Subscriptions", value: "98", change: "+7", trend: "up", sub: "vs last month" },
  { label: "Expired / Lapsed", value: "12", change: "+3", trend: "down", sub: "vs last month" },
  { label: "Avg. Plan Value", value: "KES 2,536", change: "+4.2%", trend: "up", sub: "vs last month" },
];

const subscriptions = [
  { id: "1", chama: "Umoja Investment Group", admin: "Grace Wanjiku", plan: "Pro", amount: "KES 1,500", status: "active", startDate: "Feb 14, 2026", nextBilling: "Mar 14, 2026", method: "MPESA" },
  { id: "2", chama: "Pamoja Savings Circle", admin: "James Otieno", plan: "Basic", amount: "KES 500", status: "active", startDate: "Feb 11, 2026", nextBilling: "Mar 11, 2026", method: "MPESA" },
  { id: "3", chama: "Tumaini Welfare Fund", admin: "Mary Achieng", plan: "Pro", amount: "KES 1,500", status: "active", startDate: "Feb 9, 2026", nextBilling: "Mar 9, 2026", method: "Card" },
  { id: "4", chama: "Nguvu Women's Group", admin: "Esther Kamau", plan: "Basic", amount: "KES 500", status: "expired", startDate: "Jan 30, 2026", nextBilling: "Feb 30, 2026", method: "MPESA" },
  { id: "5", chama: "Imani Youth Invest", admin: "Brian Mutua", plan: "Pro", amount: "KES 1,500", status: "active", startDate: "Jan 27, 2026", nextBilling: "Feb 27, 2026", method: "MPESA" },
  { id: "6", chama: "Jua Kali Savings", admin: "Peter Njoroge", plan: "Basic", amount: "KES 500", status: "pending", startDate: "Jan 20, 2026", nextBilling: "Feb 20, 2026", method: "MPESA" },
  { id: "7", chama: "Fahari Investment Club", admin: "Lillian Odhiambo", plan: "Pro", amount: "KES 1,500", status: "active", startDate: "Jan 15, 2026", nextBilling: "Feb 15, 2026", method: "Card" },
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  active: { label: "Active", icon: CheckCircle2, class: "text-emerald-400 bg-emerald-500/10" },
  expired: { label: "Expired", icon: XCircle, class: "text-red-400 bg-red-500/10" },
  pending: { label: "Pending", icon: Clock, class: "text-amber-400 bg-amber-500/10" },
};

const filterOptions = ["All", "Pro", "Basic", "Active", "Expired", "Pending"];

// ── Revenue chart bars (dummy monthly data) ────────────────
const monthlyRevenue = [
  { month: "Sep", value: 140000 },
  { month: "Oct", value: 162000 },
  { month: "Nov", value: 185000 },
  { month: "Dec", value: 198000 },
  { month: "Jan", value: 220000 },
  { month: "Feb", value: 248500 },
];
const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

// ── Component ──────────────────────────────────────────────
export  function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = subscriptions.filter((s) => {
    const matchSearch =
      s.chama.toLowerCase().includes(search.toLowerCase()) ||
      s.admin.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      s.plan === activeFilter ||
      s.status === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="mb-8">
        <p className="text-white/40 text-sm tracking-widest uppercase mb-1">Finance</p>
        <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
        <p className="text-white/40 text-sm mt-1">Platform revenue and plan management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === "up" && stat.label !== "Expired / Lapsed"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : stat.trend === "down" || stat.label === "Expired / Lapsed"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}>
                {stat.trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
            <p className="text-white/40 text-xs">{stat.label}</p>
            <p className="text-white/25 text-xs mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Plan Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">

        {/* Revenue Bar Chart */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-white">Monthly Revenue</h2>
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <ArrowUpRight size={13} />
              +18.4% this month
            </span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {monthlyRevenue.map((m) => {
              const heightPct = (m.value / maxRevenue) * 100;
              const isLatest = m.month === "Feb";
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-white/30 text-xs">
                    {isLatest ? `KES ${(m.value / 1000).toFixed(0)}k` : ""}
                  </span>
                  <div className="w-full rounded-lg overflow-hidden" style={{ height: "80px" }}>
                    <div
                      className={`w-full rounded-lg transition-all ${
                        isLatest
                          ? "bg-emerald-500"
                          : "bg-white/[0.06] hover:bg-white/10"
                      }`}
                      style={{ height: `${heightPct}%`, marginTop: `${100 - heightPct}%` }}
                    />
                  </div>
                  <span className="text-white/30 text-xs">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Split */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <h2 className="text-sm font-medium text-white mb-6">Plan Distribution</h2>
          <div className="space-y-4">
            {[
              { plan: "Pro", count: 62, pct: 63, color: "bg-violet-500" },
              { plan: "Basic", count: 36, pct: 37, color: "bg-sky-500" },
            ].map((p) => (
              <div key={p.plan}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.color}`} />
                    <span className="text-white/60 text-sm">{p.plan}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white text-sm font-medium">{p.count}</span>
                    <span className="text-white/30 text-xs ml-1">({p.pct}%)</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color}`}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-3">
            {[
              { label: "Pro Revenue", value: "KES 93,000/mo" },
              { label: "Basic Revenue", value: "KES 18,000/mo" },
              { label: "Total MRR", value: "KES 248,500/mo" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-white/40 text-xs">{row.label}</span>
                <span className="text-white/70 text-xs font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        {/* Table header with search */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-white/[0.07]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search chama or admin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
            <Filter size={13} className="text-white/30 ml-2 mr-1" />
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  activeFilter === f
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Chama", "Admin", "Plan", "Amount", "Method", "Start Date", "Next Billing", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs font-medium tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-white/30 text-sm">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filtered.map((sub, i) => {
                  const s = statusConfig[sub.status];
                  return (
                    <tr
                      key={sub.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group ${
                        i === filtered.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <span className="text-emerald-400 text-xs font-bold">{sub.chama.charAt(0)}</span>
                          </div>
                          <span className="text-white text-sm font-medium truncate max-w-[140px]">{sub.chama}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white/50 text-sm">{sub.admin}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          sub.plan === "Pro"
                            ? "bg-violet-500/10 text-violet-400"
                            : "bg-white/5 text-white/40"
                        }`}>
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/70 text-sm font-medium">{sub.amount}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                          <CreditCard size={12} />
                          {sub.method}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white/40 text-xs">{sub.startDate}</td>
                      <td className="px-5 py-4 text-white/40 text-xs">{sub.nextBilling}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium ${s.class}`}>
                          <s.icon size={10} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
          <p className="text-white/30 text-xs">Showing {filtered.length} of {subscriptions.length} subscriptions</p>
          <div className="flex items-center gap-2">
            <button className="text-xs text-white/30 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Previous</button>
            <button className="text-xs text-white/30 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsPage