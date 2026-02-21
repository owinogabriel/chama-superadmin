"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ChevronRight,
  Filter,
} from "lucide-react";

// ── Dummy Data ─────────────────────────────────────────────
const chamas = [
  {
    id: "1",
    name: "Umoja Investment Group",
    admin: "Grace Wanjiku",
    email: "grace@umoja.co.ke",
    members: 24,
    status: "active",
    plan: "Pro",
    contribution: "KES 5,000",
    frequency: "Monthly",
    created: "Feb 14, 2026",
    totalSaved: "KES 840,000",
  },
  {
    id: "2",
    name: "Pamoja Savings Circle",
    admin: "James Otieno",
    email: "james@pamoja.co.ke",
    members: 18,
    status: "active",
    plan: "Basic",
    contribution: "KES 2,000",
    frequency: "Monthly",
    created: "Feb 11, 2026",
    totalSaved: "KES 216,000",
  },
  {
    id: "3",
    name: "Tumaini Welfare Fund",
    admin: "Mary Achieng",
    email: "mary@tumaini.co.ke",
    members: 31,
    status: "active",
    plan: "Pro",
    contribution: "KES 3,500",
    frequency: "Weekly",
    created: "Feb 9, 2026",
    totalSaved: "KES 1,085,000",
  },
  {
    id: "4",
    name: "Nguvu Women's Group",
    admin: "Esther Kamau",
    email: "esther@nguvu.co.ke",
    members: 15,
    status: "suspended",
    plan: "Basic",
    contribution: "KES 1,500",
    frequency: "Monthly",
    created: "Jan 30, 2026",
    totalSaved: "KES 135,000",
  },
  {
    id: "5",
    name: "Imani Youth Invest",
    admin: "Brian Mutua",
    email: "brian@imani.co.ke",
    members: 22,
    status: "active",
    plan: "Pro",
    contribution: "KES 4,000",
    frequency: "Monthly",
    created: "Jan 27, 2026",
    totalSaved: "KES 528,000",
  },
  {
    id: "6",
    name: "Jua Kali Savings",
    admin: "Peter Njoroge",
    email: "peter@juakali.co.ke",
    members: 10,
    status: "pending",
    plan: "Basic",
    contribution: "KES 1,000",
    frequency: "Weekly",
    created: "Jan 20, 2026",
    totalSaved: "KES 40,000",
  },
  {
    id: "7",
    name: "Fahari Investment Club",
    admin: "Lillian Odhiambo",
    email: "lillian@fahari.co.ke",
    members: 28,
    status: "active",
    plan: "Pro",
    contribution: "KES 10,000",
    frequency: "Monthly",
    created: "Jan 15, 2026",
    totalSaved: "KES 1,680,000",
  },
];

// ── Helpers ────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; class: string }
> = {
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

const filters = ["All", "Active", "Suspended", "Pending"];

// ── Component ──────────────────────────────────────────────
export default function ChamasPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = chamas.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.admin.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      c.status === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-white/40 text-sm tracking-widest uppercase mb-1">
            Management
          </p>
          <h1 className="text-2xl font-semibold text-white">Chamas</h1>
          <p className="text-white/40 text-sm mt-1">
            {chamas.length} total groups on the platform
          </p>
        </div>
        <Link
          href="/dashboard/chamas/create"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          New Chama
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search chamas or admin name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          <Filter size={14} className="text-white/30 ml-2 mr-1" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
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

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  "Chama",
                  "Admin",
                  "Members",
                  "Contribution",
                  "Total Saved",
                  "Plan",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-white/30 text-xs font-medium tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-16 text-white/30 text-sm"
                  >
                    No chamas found
                  </td>
                </tr>
              ) : (
                filtered.map((chama, i) => {
                  const s = statusConfig[chama.status];
                  return (
                    <tr
                      key={chama.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group ${
                        i === filtered.length - 1 ? "border-0" : ""
                      }`}
                    >
                      {/* Chama name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <span className="text-emerald-400 text-xs font-bold uppercase">
                              {chama.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {chama.name}
                            </p>
                            <p className="text-white/30 text-xs mt-0.5">
                              {chama.created}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Admin */}
                      <td className="px-5 py-4">
                        <p className="text-white/70 text-sm">{chama.admin}</p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {chama.email}
                        </p>
                      </td>

                      {/* Members */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-white/60 text-sm">
                          <Users size={13} className="text-white/30" />
                          {chama.members}
                        </div>
                      </td>

                      {/* Contribution */}
                      <td className="px-5 py-4">
                        <p className="text-white/70 text-sm">
                          {chama.contribution}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {chama.frequency}
                        </p>
                      </td>

                      {/* Total Saved */}
                      <td className="px-5 py-4 text-white/70 text-sm">
                        {chama.totalSaved}
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            chama.plan === "Pro"
                              ? "bg-violet-500/10 text-violet-400"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {chama.plan}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium ${s.class}`}
                        >
                          <s.icon size={11} />
                          {s.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/dashboard/chamas/${chama.id}`}
                            className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                          >
                            View
                            <ChevronRight size={12} />
                          </Link>
                          <button className="text-white/30 hover:text-white transition-colors">
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
          <p className="text-white/30 text-xs">
            Showing {filtered.length} of {chamas.length} chamas
          </p>
          <div className="flex items-center gap-2">
            <button className="text-xs text-white/30 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              Previous
            </button>
            <button className="text-xs text-white/30 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}