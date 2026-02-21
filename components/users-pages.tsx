"use client";

import { useState } from "react";

import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Filter,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useUsers } from "@/hooks/useUser";

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
};

const roleConfig: Record<string, string> = {
  admin: "bg-sky-500/10 text-sky-400",
  member: "bg-white/5 text-white/40",
  super_admin: "bg-violet-500/10 text-violet-400",
};

const filterOptions = ["All", "Admin", "Active", "Suspended"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function UsersPage() {
  const { data: users = [], isLoading, error } = useUsers();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = users.filter((u) => {
    const chamaName = u.chamas?.name ?? "";
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      chamaName.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      u.role === activeFilter.toLowerCase() ||
      u.status === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-emerald-400 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <p className="text-red-400 text-sm">{error.message}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-white/40 text-sm tracking-widest uppercase mb-1">
            Management
          </p>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-white/40 text-sm mt-1">
            {users.length} total users on the platform
          </p>
        </div>
       
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search by name, email or chama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          <Filter size={14} className="text-white/30 ml-2 mr-1" />
          {filterOptions.map((f) => (
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
                  "User",
                  "Contact",
                  "Chama",
                  "Role",
                  "Status",
                  "Joined",
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
                    colSpan={7}
                    className="text-center py-16 text-white/30 text-sm"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const s = statusConfig[user.status];
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group ${
                        i === filtered.length - 1 ? "border-0" : ""
                      }`}
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-white/50 text-xs font-bold uppercase">
                              {user.full_name.charAt(0)}
                            </span>
                          </div>
                          <p className="text-white text-sm font-medium">
                            {user.full_name}
                          </p>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1">
                          <Mail size={11} className="text-white/25" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                          <Phone size={11} className="text-white/25" />
                          {user.phone_number}
                        </div>
                      </td>

                      {/* Chama */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-white/50 text-sm">
                          <Building2
                            size={12}
                            className="text-white/25 shrink-0"
                          />
                          <span className="truncate max-w-[160px]">
                            {user.chamas?.name ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium capitalize ${roleConfig[user.role]}`}
                        >
                          {user.role === "member" ? (
                            <User size={11} />
                          ) : (
                            <ShieldCheck size={11} />
                          )}
                          {user.role.replace("_", " ")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {s && (
                          <span
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium ${s.class}`}
                          >
                            <s.icon size={11} />
                            {s.label}
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-white/30 text-xs">
                        {formatDate(user.created_at)}
                      </td>

                      {/* Actions */}
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
        <div className="px-5 py-3 border-t border-white/[0.05]">
          <p className="text-white/30 text-xs">
            Showing {filtered.length} of {users.length} users
          </p>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
