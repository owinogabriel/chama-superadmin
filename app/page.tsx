"use client";

import { Button } from "@/components/ui/Button";
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();

  const features = [
    {
      icon: Building2,
      title: "Chama Management",
      description: "Create and manage multiple chamas with ease",
      color: "emerald",
    },
    {
      icon: Users,
      title: "Member Tracking",
      description: "Keep track of all members and their contributions",
      color: "sky",
    },
    {
      icon: Wallet,
      title: "M-Pesa Integration",
      description: "Seamless mobile money payments and tracking",
      color: "emerald",
    },
    {
      icon: TrendingUp,
      title: "Investment Tracking",
      description: "Monitor your group investments and returns",
      color: "violet",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your financial data is safe and encrypted",
      color: "sky",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Get instant notifications on all transactions",
      color: "amber",
    },
  ];

  const benefits = [
    "Automated contribution tracking",
    "Loan management system",
    "Comprehensive financial reports",
    "Role-based access control",
    "Mobile-friendly interface",
    "Transaction history",
  ];

  const iconColors: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden">

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-sm">C</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">ChamaAdmin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/login")}
            className="text-white/50 hover:text-white text-sm transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-medium mb-8">
          <Building2 size={13} />
          Digital Chama Management Platform
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight mb-6">
          Manage Your Chama{" "}
          <span className="text-emerald-400">with Confidence</span>
        </h1>

        <p className="text-white/40 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          The complete solution for investment groups to track contributions,
          manage loans, and monitor investments — all in one powerful platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-8 py-3 rounded-xl transition-colors text-sm"
          >
            Get Started
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] text-white/70 hover:text-white font-medium px-8 py-3 rounded-xl transition-colors text-sm"
          >
            Sign In
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-white/[0.06]">
          {[
            { value: "500+", label: "Chamas" },
            { value: "12,000+", label: "Members" },
            { value: "KES 2B+", label: "Tracked" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-white/35 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-emerald-400 text-xs tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl font-semibold text-white mb-3">
            Everything You Need to Run Your Chama
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Powerful tools designed specifically for Kenyan investment groups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${iconColors[feature.color]}`}>
                <feature.icon size={18} />
              </div>
              <h3 className="text-white font-medium text-sm mb-2">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-10 md:p-14 relative overflow-hidden">
          {/* inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <p className="text-emerald-400 text-xs tracking-widest uppercase mb-3">Why Us</p>
              <h2 className="text-3xl font-semibold text-white mb-3">
                Why Choose Our Platform?
              </h2>
              <p className="text-white/40 text-sm">
                Join hundreds of chamas already using our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-white/60 text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-8 py-3 rounded-xl transition-colors text-sm"
              >
                Start Managing Your Chama Today
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-xs">C</span>
          </div>
          <span className="text-white/40 text-xs">ChamaAdmin</span>
        </div>
        <p className="text-white/25 text-xs">
          © 2026 Chama Management Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}