"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Users, TrendingUp, CreditCard, CheckCircle2,
  XCircle, Clock, MoreHorizontal, Mail, Phone, Calendar,
  Building2, Ban, RefreshCw,
} from "lucide-react";
import { useChama, useToggleChamaStatus } from "@/hooks/useChama";

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  active: { label: "Active", icon: CheckCircle2, class: "text-emerald-400 bg-emerald-500/10" },
  suspended: { label: "Suspended", icon: XCircle, class: "text-red-400 bg-red-500/10" },
  pending: { label: "Pending", icon: Clock, class: "text-amber-400 bg-amber-500/10" },
};

const tabs = ["Overview", "Members"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

export default function ChamaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: chama, isLoading, error } = useChama(id);
  const { mutate: toggleStatus, isPending: isToggling } = useToggleChamaStatus();
  const [activeTab, setActiveTab] = useState("Overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error || !chama) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <p className="text-red-400 text-sm">{error?.message ?? "Chama not found"}</p>
      </div>
    );
  }

  const chamaStatus = (chama as any).status ?? "active";
  const s = statusConfig[chamaStatus] ?? statusConfig.active;
  const members = chama.chama_members ?? [];
  const activeMembers = members.filter((m) => m.status === "active").length;

  const handleToggle = () => {
    toggleStatus({
      id: chama.id,
      status: chamaStatus === "active" ? "suspended" : "active",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Back */}
      <Link
        href="/dashboard/chamas"
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6 w-fit"
      >
        <ArrowLeft size={15} />
        Back to Chamas
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 text-lg font-bold uppercase">
              {chama.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-white">{chama.name}</h1>
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${s.class}`}>
                <s.icon size={11} />
                {s.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                chama.plan === "pro"
                  ? "bg-violet-500/10 text-violet-400"
                  : "bg-white/5 text-white/40"
              }`}>
                {chama.plan}
              </span>
            </div>
            {chama.description && (
              <p className="text-white/40 text-sm mt-1 max-w-xl">{chama.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors disabled:opacity-50 ${
              chamaStatus === "active"
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            {chamaStatus === "active" ? (
              <><Ban size={14} /> Suspend</>
            ) : (
              <><RefreshCw size={14} /> Reactivate</>
            )}
          </button>
          <button className="text-white/30 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Members",
            value: members.length,
            sub: `${activeMembers} active`,
            icon: Users,
            color: "sky",
          },
          {
            label: "Contribution",
            value: `KES ${chama.contribution_amount.toLocaleString()}`,
            sub: chama.contribution_frequency,
            icon: TrendingUp,
            color: "emerald",
          },
          {
            label: "Meeting Day",
            value: chama.meeting_day ?? "—",
            sub: "Default day",
            icon: Calendar,
            color: "amber",
          },
          {
            label: "Plan",
            value: chama.plan.toUpperCase(),
            sub: `Since ${formatDate(chama.created_at)}`,
            icon: CreditCard,
            color: "violet",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
              stat.color === "sky" ? "bg-sky-500/10 text-sky-400"
              : stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-400"
              : stat.color === "violet" ? "bg-violet-500/10 text-violet-400"
              : "bg-amber-500/10 text-amber-400"
            }`}>
              <stat.icon size={15} />
            </div>
            <p className="text-white text-xl font-semibold capitalize">{stat.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
            <p className="text-white/25 text-xs mt-0.5 capitalize">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? "bg-emerald-500/15 text-emerald-400"
                : "text-white/40 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Chama Info */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 size={15} className="text-white/30" />
              <h2 className="text-sm font-medium text-white">Chama Info</h2>
            </div>
            <div className="space-y-1">
              {[
                { label: "Chama Name", value: chama.name },
                { label: "Plan", value: chama.plan.toUpperCase() },
                { label: "Contribution", value: `KES ${chama.contribution_amount.toLocaleString()} / ${chama.contribution_frequency}` },
                { label: "Meeting Day", value: chama.meeting_day ?? "—" },
                { label: "Created", value: formatDate(chama.created_at) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-white/40 text-sm">{row.label}</span>
                  <span className="text-white/80 text-sm font-medium capitalize">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users size={15} className="text-white/30" />
              <h2 className="text-sm font-medium text-white">Chama Vault</h2>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] mb-5">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                <span className="text-sky-400 text-sm font-bold uppercase">
                  {chama.profiles?.full_name?.charAt(0) ?? "?"}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{chama.profiles?.full_name ?? "—"}</p>
                <p className="text-white/40 text-xs mt-0.5">Chama Vault</p>
              </div>
              {chama.profiles?.status && (
                <span className={`ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[chama.profiles.status]?.class}`}>
                  <CheckCircle2 size={10} />
                  {statusConfig[chama.profiles.status]?.label}
                </span>
              )}
            </div>

            <div className="space-y-1">
              {[
                { icon: Mail, label: "Email", value: chama.profiles?.email ?? "—" },
                { icon: Phone, label: "Phone", value: chama.profiles?.phone_number ?? "—" },
                { icon: Calendar, label: "Joined", value: (chama.profiles as any)?.created_at ? formatDate((chama.profiles as any).created_at) : "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
                  <row.icon size={14} className="text-white/25 shrink-0" />
                  <span className="text-white/40 text-sm w-14">{row.label}</span>
                  <span className="text-white/70 text-sm">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "Members" && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <h2 className="text-sm font-medium text-white">Members ({members.length})</h2>
          </div>
          {members.length === 0 ? (
            <div className="py-16 text-center text-white/30 text-sm">No members yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {["Member", "Phone", "Role", "Status", "Joined"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-white/30 text-xs font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, i) => {
                    const ms = statusConfig[member.status] ?? statusConfig.active;
                    return (
                      <tr
                        key={member.id}
                        className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                          i === members.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <span className="text-white/50 text-xs font-bold uppercase">
                                {member.profiles?.full_name?.charAt(0) ?? "?"}
                              </span>
                            </div>
                            <span className="text-white text-sm">{member.profiles?.full_name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-white/50 text-sm">{member.profiles?.phone_number ?? "—"}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                            member.role === "admin" ? "bg-sky-500/10 text-sky-400" : "bg-white/5 text-white/40"
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium ${ms.class}`}>
                            <ms.icon size={10} />
                            {ms.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-white/40 text-sm">{formatDate(member.joined_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}