"use client";

import { useState } from "react";
import Link from "next/link";
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
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

// ── Dummy Data ─────────────────────────────────────────────
const users = [
  { id: "1", name: "Grace Wanjiku", email: "grace@umoja.co.ke", phone: "0712 345 678", role: "admin", chama: "Umoja Investment Group", status: "active", joined: "Feb 14, 2026" },
  { id: "2", name: "James Otieno", email: "james@pamoja.co.ke", phone: "0723 456 789", role: "admin", chama: "Pamoja Savings Circle", status: "active", joined: "Feb 11, 2026" },
  { id: "3", name: "Mary Achieng", email: "mary@tumaini.co.ke", phone: "0734 567 890", role: "admin", chama: "Tumaini Welfare Fund", status: "active", joined: "Feb 9, 2026" },
  { id: "4", name: "Esther Kamau", email: "esther@nguvu.co.ke", phone: "0745 678 901", role: "admin", chama: "Nguvu Women's Group", status: "suspended", joined: "Jan 30, 2026" },
  { id: "5", name: "Brian Mutua", email: "brian@imani.co.ke", phone: "0756 789 012", role: "admin", chama: "Imani Youth Invest", status: "active", joined: "Jan 27, 2026" },
  { id: "6", name: "John Kamau", email: "john@umoja.co.ke", phone: "0767 890 123", role: "member", chama: "Umoja Investment Group", status: "active", joined: "Feb 14, 2026" },
  { id: "7", name: "Fatuma Ali", email: "fatuma@pamoja.co.ke", phone: "0778 901 234", role: "member", chama: "Pamoja Savings Circle", status: "suspended", joined: "Feb 11, 2026" },
  { id: "8", name: "Peter Njoroge", email: "peter@tumaini.co.ke", phone: "0789 012 345", role: "member", chama: "Tumaini Welfare Fund", status: "active", joined: "Feb 9, 2026" },
];

const chamas = [
  "Umoja Investment Group",
  "Pamoja Savings Circle",
  "Tumaini Welfare Fund",
  "Nguvu Women's Group",
  "Imani Youth Invest",
];

const statusConfig: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  active: { label: "Active", icon: CheckCircle2, class: "text-emerald-400 bg-emerald-500/10" },
  suspended: { label: "Suspended", icon: XCircle, class: "text-red-400 bg-red-500/10" },
  pending: { label: "Pending", icon: Clock, class: "text-amber-400 bg-amber-500/10" },
};

const roleConfig: Record<string, string> = {
  admin: "bg-sky-500/10 text-sky-400",
  member: "bg-white/5 text-white/40",
};

const filterOptions = ["All", "Admin", "Member", "Active", "Suspended"];

// ── Users List Page ────────────────────────────────────────
export function UsersPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.chama.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "All" ||
      u.role === activeFilter.toLowerCase() ||
      u.status === activeFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-white/40 text-sm tracking-widest uppercase mb-1">Management</p>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-white/40 text-sm mt-1">{users.length} total users on the platform</p>
        </div>
        <Link
          href="/dashboard/users/create"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          New Admin
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
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
                {["User", "Contact", "Chama", "Role", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-white/30 text-xs font-medium tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-white/30 text-sm">
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
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <p className="text-white text-sm font-medium">{user.name}</p>
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
                          {user.phone}
                        </div>
                      </td>

                      {/* Chama */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-white/50 text-sm">
                          <Building2 size={12} className="text-white/25 shrink-0" />
                          <span className="truncate max-w-[160px]">{user.chama}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium capitalize ${roleConfig[user.role]}`}>
                          {user.role === "admin" ? <ShieldCheck size={11} /> : <User size={11} />}
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit font-medium ${s.class}`}>
                          <s.icon size={11} />
                          {s.label}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-white/30 text-xs">{user.joined}</td>

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

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between">
          <p className="text-white/30 text-xs">
            Showing {filtered.length} of {users.length} users
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

// ── Create Admin Page ──────────────────────────────────────
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  chama: string;
}
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  chama?: string;
}

export function CreateUserPage() {
  const [form, setForm] = useState<FormData>({ fullName: "", email: "", phone: "", chama: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.chama) newErrors.chama = "Please select a chama";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    const pwd = generatePassword();
    setGeneratedPassword(pwd);
    setLoading(false);
    setSuccess(true);
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)] flex items-center justify-center">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <CheckCircle2 size={24} className="text-emerald-400" />
          </div>
          <h2 className="text-white text-lg font-semibold mb-1">Admin Created!</h2>
          <p className="text-white/40 text-sm mb-6">
            Credentials have been sent to <span className="text-white/60">{form.email}</span> and <span className="text-white/60">{form.phone}</span> via SMS.
          </p>

          {/* Generated Password */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 mb-6">
            <p className="text-white/30 text-xs mb-2">Generated Temporary Password</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-emerald-400 text-sm font-mono tracking-wider">
                {showPassword ? generatedPassword : "••••••••••••"}
              </code>
              <button
                onClick={() => setShowPassword((p) => !p)}
                className="text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-white/25 text-xs mt-2">
              Admin must change this on first login.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/users"
              className="flex-1 text-center bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              Back to Users
            </Link>
            <button
              onClick={() => { setSuccess(false); setForm({ fullName: "", email: "", phone: "", chama: "" }); setGeneratedPassword(""); }}
              className="flex-1 text-center border border-white/[0.08] text-white/50 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">
      <Link
        href="/dashboard/users"
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6 w-fit"
      >
        <ArrowLeft size={15} />
        Back to Users
      </Link>

      <div className="mb-8">
        <p className="text-white/40 text-sm tracking-widest uppercase mb-1">Management</p>
        <h1 className="text-2xl font-semibold text-white">Create Chama Admin</h1>
        <p className="text-white/40 text-sm mt-1">
          A temporary password will be generated and sent via SMS and email.
        </p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Grace Wanjiku"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                    errors.fullName ? "border-red-500/50" : "border-white/[0.08] focus:border-emerald-500/50"
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="grace@email.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                    errors.email ? "border-red-500/50" : "border-white/[0.08] focus:border-emerald-500/50"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="tel"
                  placeholder="0712 345 678"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                    errors.phone ? "border-red-500/50" : "border-white/[0.08] focus:border-emerald-500/50"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Assign Chama */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Assign to Chama <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <select
                  value={form.chama}
                  onChange={(e) => update("chama", e.target.value)}
                  className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none transition-colors appearance-none ${
                    form.chama ? "text-white" : "text-white/30"
                  } ${errors.chama ? "border-red-500/50" : "border-white/[0.08] focus:border-emerald-500/50"}`}
                >
                  <option value="" className="bg-[#0f1117] text-white/40">Select a chama...</option>
                  {chamas.map((c) => (
                    <option key={c} value={c} className="bg-[#0f1117] text-white">{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
              {errors.chama && <p className="text-red-400 text-xs mt-1">{errors.chama}</p>}
            </div>

            {/* Info note */}
            <div className="bg-sky-500/5 border border-sky-500/15 rounded-xl p-4">
              <p className="text-sky-400/70 text-xs leading-relaxed">
                A temporary password will be auto-generated and sent to the admin via SMS to <strong className="text-sky-400">{form.phone || "their phone"}</strong> and email to <strong className="text-sky-400">{form.email || "their email"}</strong>. They will be prompted to change it on first login.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              {loading ? "Creating Admin..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsersPage;