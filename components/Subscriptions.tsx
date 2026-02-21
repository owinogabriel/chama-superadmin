"use client";

import { useState, useMemo } from "react";
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
import { useChamas } from "@/hooks/useChama";

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  active: { label: "Active", icon: CheckCircle2, class: "text-emerald-400 bg-emerald-500/10" },
  suspended: { label: "Expired", icon: XCircle, class: "text-red-400 bg-red-500/10" },
  pending: { label: "Pending", icon: Clock, class: "text-amber-400 bg-amber-500/10" },
};

const filterOptions = ["All", "Pro", "Basic", "Active", "Expired"];

const SkeletonRow = () => (
  <tr className="border-b border-white/[0.04]">
    {[1,2,3,4,5,6,7,8].map((i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 rounded bg-white/[0.05] animate-pulse" style={{ width: `${40 + i * 8}%` }} />
      </td>
    ))}
  </tr>
);

const StatSkeleton = () => (
  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 animate-pulse">
    <div className="w-16 h-5 rounded-full bg-white/[0.06] mb-3" />
    <div className="w-28 h-7 rounded bg-white/[0.06] mb-2" />
    <div className="w-20 h-3 rounded bg-white/[0.04]" />
  </div>
);

export  function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: chamas, isLoading, isError } = useChamas();

  // derive subscription rows from chamas
  const subscriptions = useMemo(() => {
    if (!chamas) return [];
    return chamas.map((c) => {
      const createdAt = new Date(c.created_at);
      const nextBilling = new Date(createdAt);
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      return {
        id: c.id,
        chama: c.name,
        admin: c.profiles?.full_name ?? "—",
        plan: c.plan === "pro" ? "Pro" : "Basic",
        amount: c.plan === "pro" ? "KES 10,000" : "KES 5,000",
        status: c.status === "active" ? "active" : "suspended",
        startDate: createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
        nextBilling: nextBilling.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }),
        method: "MPESA",
      };
    });
  }, [chamas]);

  // derived stats
  const totalRevenue = subscriptions.filter(s => s.status === "active").reduce((sum, s) => {
    return sum + (s.plan === "Pro" ? 10000 : 5000);
  }, 0);
  const activeCount = subscriptions.filter(s => s.status === "active").length;
  const expiredCount = subscriptions.filter(s => s.status === "suspended").length;
  const proCount = subscriptions.filter(s => s.plan === "Pro").length;
  const basicCount = subscriptions.filter(s => s.plan === "Basic").length;
  const proRevenue = proCount * 10000;
  const basicRevenue = basicCount * 5000;
  const totalPct = proCount + basicCount || 1;

  const filtered = subscriptions.filter((s) => {
    const matchSearch =
      s.chama.toLowerCase().includes(search.toLowerCase()) ||
      s.admin.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      s.plan === activeFilter ||
      (activeFilter === "Active" && s.status === "active") ||
      (activeFilter === "Expired" && s.status === "suspended");
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

      {isError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-400 text-sm">Failed to load data. Please refresh.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          [1,2,3,4].map((i) => <StatSkeleton key={i} />)
        ) : (
          [
            {
              label: "Monthly Revenue",
              value: `KES ${totalRevenue.toLocaleString()}`,
              change: `${activeCount} active plans`,
              trend: "up",
              isNegative: false,
            },
            {
              label: "Active Subscriptions",
              value: activeCount.toString(),
              change: `${proCount} Pro · ${basicCount} Basic`,
              trend: "up",
              isNegative: false,
            },
            {
              label: "Expired / Lapsed",
              value: expiredCount.toString(),
              change: expiredCount > 0 ? "needs attention" : "all good",
              trend: expiredCount > 0 ? "down" : "up",
              isNegative: expiredCount > 0,
            },
            {
              label: "Avg. Plan Value",
              value: activeCount > 0 ? `KES ${Math.round(totalRevenue / activeCount).toLocaleString()}` : "KES 0",
              change: "per chama/month",
              trend: "up",
              isNegative: false,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.isNegative
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  {stat.trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
              <p className="text-white/40 text-xs">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Revenue Chart + Plan Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">

        {/* Plan Distribution — real data */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-white">Revenue Breakdown</h2>
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <ArrowUpRight size={13} />
              KES {totalRevenue.toLocaleString()} this month
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-white/[0.06] rounded w-1/3" />
                  <div className="h-2 bg-white/[0.04] rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {[
                { plan: "Pro", count: proCount, revenue: proRevenue, color: "bg-violet-500", textColor: "text-violet-400" },
                { plan: "Basic", count: basicCount, revenue: basicRevenue, color: "bg-sky-500", textColor: "text-sky-400" },
              ].map((p) => {
                const pct = Math.round((p.count / totalPct) * 100);
                return (
                  <div key={p.plan}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.color}`} />
                        <span className="text-white/60 text-sm">{p.plan} Plan</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${p.textColor}`}>
                          KES {p.revenue.toLocaleString()}/mo
                        </span>
                        <span className="text-white/30 text-xs ml-2">
                          {p.count} chamas ({pct}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${p.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-4">
                {[
                  { label: "Pro Revenue", value: `KES ${proRevenue.toLocaleString()}` },
                  { label: "Basic Revenue", value: `KES ${basicRevenue.toLocaleString()}` },
                  { label: "Total MRR", value: `KES ${totalRevenue.toLocaleString()}` },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-white/30 text-xs mb-1">{row.label}</p>
                    <p className="text-white text-sm font-medium">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick summary */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <h2 className="text-sm font-medium text-white mb-6">Plan Summary</h2>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-10 bg-white/[0.04] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: "Total Chamas", value: subscriptions.length, color: "text-white" },
                { label: "Pro Subscribers", value: proCount, color: "text-violet-400" },
                { label: "Basic Subscribers", value: basicCount, color: "text-sky-400" },
                { label: "Suspended", value: expiredCount, color: "text-red-400" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                  <span className="text-white/40 text-sm">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
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
                  activeFilter === f ? "bg-emerald-500/20 text-emerald-400" : "text-white/40 hover:text-white"
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
                  <th key={h} className="text-left px-5 py-3 text-white/30 text-xs font-medium tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5].map((i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
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
                          sub.plan === "Pro" ? "bg-violet-500/10 text-violet-400" : "bg-white/5 text-white/40"
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
          <p className="text-white/30 text-xs">
            Showing {filtered.length} of {subscriptions.length} subscriptions
          </p>
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