"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { useCreateChama } from "@/hooks/useCreateChama";

interface FormData {
  chamaName: string;
  description: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  contributionAmount: string;
  contributionFrequency: string;
  meetingDay: string;
  plan: string;
}

interface FormErrors {
  chamaName?: string;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  contributionAmount?: string;
}

const frequencies = ["Weekly", "Monthly"];
const meetingDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const plans = [
  {
    id: "basic",
    label: "Basic",
    price: "KES 5000/mo",
    features: ["Up to 20 members", "Contributions tracking", "Basic reports"],
  },
  {
    id: "pro",
    label: "Pro",
    price: "KES 10000/mo",
    features: [
      "Unlimited members",
      "Loan management",
      "Advanced reports",
      "SMS notifications",
    ],
  },
];

export default function CreateChamaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { mutateAsync: createChama, isPending } = useCreateChama();
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    chamaName: "",
    description: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    contributionAmount: "",
    contributionFrequency: "Monthly",
    meetingDay: "Saturday",
    plan: "basic",
  });

  const update = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.chamaName.trim()) newErrors.chamaName = "Chama name is required";
    if (!form.adminName.trim()) newErrors.adminName = "Admin name is required";
    if (!form.adminEmail.trim())
      newErrors.adminEmail = "Admin email is required";
    else if (!/\S+@\S+\.\S+/.test(form.adminEmail))
      newErrors.adminEmail = "Enter a valid email";
    if (!form.adminPhone.trim())
      newErrors.adminPhone = "Phone number is required";
    if (!form.contributionAmount.trim())
      newErrors.contributionAmount = "Contribution amount is required";
    else if (isNaN(Number(form.contributionAmount)))
      newErrors.contributionAmount = "Enter a valid amount";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setServerError(null);

    try {
      await createChama(form);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/chamas"), 2000);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Chama Created!
          </h2>
          <p className="text-white/40 text-sm">
            Login credentials sent to admin via SMS & email
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/chamas"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-4 w-fit"
        >
          <ArrowLeft size={15} />
          Back to Chamas
        </Link>
        <p className="text-white/40 text-sm tracking-widest uppercase mb-1">
          Management
        </p>
        <h1 className="text-2xl font-semibold text-white">Create New Chama</h1>
        <p className="text-white/40 text-sm mt-1">
          Fill in the details below. The admin will receive login credentials
          automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left — main form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Chama Details */}
            <section className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Building2 size={16} className="text-emerald-400" />
                </div>
                <h2 className="text-sm font-medium text-white">
                  Chama Details
                </h2>
              </div>

              <div className="space-y-4">
                {/* Chama Name */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    Chama Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Umoja Investment Group"
                    value={form.chamaName}
                    onChange={(e) => update("chamaName", e.target.value)}
                    className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                      errors.chamaName
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/[0.08] focus:border-emerald-500/50"
                    }`}
                  />
                  {errors.chamaName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.chamaName}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    Description{" "}
                    <span className="text-white/25">(optional)</span>
                  </label>
                  <textarea
                    placeholder="Brief description of the chama..."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Contribution + Frequency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Contribution Amount (KES){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      />
                      <input
                        type="number"
                        placeholder="500"
                        value={form.contributionAmount}
                        onChange={(e) =>
                          update("contributionAmount", e.target.value)
                        }
                        className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                          errors.contributionAmount
                            ? "border-red-500/50"
                            : "border-white/[0.08] focus:border-emerald-500/50"
                        }`}
                      />
                    </div>
                    {errors.contributionAmount && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.contributionAmount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Frequency
                    </label>
                    <div className="relative">
                      <select
                        value={form.contributionFrequency}
                        onChange={(e) =>
                          update("contributionFrequency", e.target.value)
                        }
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                      >
                        {frequencies.map((f) => (
                          <option key={f} value={f} className="bg-[#0f1117]">
                            {f}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Meeting Day */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    <Calendar size={12} className="inline mr-1" />
                    Default Meeting Day
                  </label>
                  <div className="relative">
                    <select
                      value={form.meetingDay}
                      onChange={(e) => update("meetingDay", e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
                    >
                      {meetingDays.map((d) => (
                        <option key={d} value={d} className="bg-[#0f1117]">
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Admin Details */}
            <section className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <User size={16} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white">
                    Chama Admin
                  </h2>
                  <p className="text-white/30 text-xs mt-0.5">
                    Login credentials will be sent to this person
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Admin Name */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      type="text"
                      placeholder="Grace Wanjiku"
                      value={form.adminName}
                      onChange={(e) => update("adminName", e.target.value)}
                      className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                        errors.adminName
                          ? "border-red-500/50"
                          : "border-white/[0.08] focus:border-emerald-500/50"
                      }`}
                    />
                  </div>
                  {errors.adminName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.adminName}
                    </p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      />
                      <input
                        type="email"
                        placeholder="grace@email.com"
                        value={form.adminEmail}
                        onChange={(e) => update("adminEmail", e.target.value)}
                        className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                          errors.adminEmail
                            ? "border-red-500/50"
                            : "border-white/[0.08] focus:border-emerald-500/50"
                        }`}
                      />
                    </div>
                    {errors.adminEmail && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.adminEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                      />
                      <input
                        type="tel"
                        placeholder="0712 345 678"
                        value={form.adminPhone}
                        onChange={(e) => update("adminPhone", e.target.value)}
                        className={`w-full bg-white/[0.04] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                          errors.adminPhone
                            ? "border-red-500/50"
                            : "border-white/[0.08] focus:border-emerald-500/50"
                        }`}
                      />
                    </div>
                    {errors.adminPhone && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.adminPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right — Plan Selection + Summary */}
          <div className="space-y-6">
            {/* Plan */}
            <section className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <h2 className="text-sm font-medium text-white mb-4">
                Select Plan
              </h2>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => update("plan", plan.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      form.plan === plan.id
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${
                          form.plan === plan.id
                            ? "text-emerald-400"
                            : "text-white"
                        }`}
                      >
                        {plan.label}
                      </span>
                      <span className="text-white/40 text-xs">
                        {plan.price}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="text-white/40 text-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={10} className="text-white/20" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <h2 className="text-sm font-medium text-white mb-4">Summary</h2>
              <div className="space-y-3">
                {[
                  { label: "Chama Name", value: form.chamaName || "—" },
                  { label: "Admin", value: form.adminName || "—" },
                  {
                    label: "Contribution",
                    value: form.contributionAmount
                      ? `KES ${Number(form.contributionAmount).toLocaleString()} / ${form.contributionFrequency}`
                      : "—",
                  },
                  { label: "Meeting Day", value: form.meetingDay },
                  {
                    label: "Plan",
                    value: plans.find((p) => p.id === form.plan)?.label || "—",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-2"
                  >
                    <span className="text-white/30 text-xs">{row.label}</span>
                    <span className="text-white/70 text-xs text-right">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.07]">
                <p className="text-white/30 text-xs mb-4">
                  A temporary password will be auto-generated and sent to the
                  admin via SMS and email.
                </p>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creating Chama...
                    </span>
                  ) : (
                    "Create Chama"
                  )}
                </button>
                <Link
                  href="/dashboard/chamas"
                  className="block text-center text-white/30 hover:text-white text-xs mt-3 transition-colors"
                >
                  Cancel
                </Link>
                {serverError && (
                  <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-xs">{serverError}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}
