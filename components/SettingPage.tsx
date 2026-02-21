"use client";

import { useState, useEffect } from "react";
import {
  Settings, Bell, Shield, CreditCard,
  Save, Eye, EyeOff, CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { usePlatformSettings, useSaveSettings } from "@/hooks/usePlatformSettings";

const tabs = ["General", "Notifications", "Security", "Billing"];

export  function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [saved, setSaved] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  const { data: settingsData, isLoading: settingsLoading } = usePlatformSettings();
  const { mutateAsync: saveSettings, isPending: saving } = useSaveSettings();

  const [general, setGeneral] = useState({
    platformName: "ChamaAdmin",
    supportEmail: "support@chamaadmin.co.ke",
    supportPhone: "0800 123 456",
    defaultPlan: "Basic",
    trialDays: "14",
  });

  const [notifications, setNotifications] = useState({
    newChama: true,
    newSubscription: true,
    expiredSubscription: true,
    suspendedUser: false,
    weeklyReport: true,
    monthlyReport: true,
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [billing, setBilling] = useState({
    basicPrice: "5000",
    proPrice: "10000",
    currency: "KES",
    mpesaShortcode: "",
    mpesaPasskey: "",
  });

  // sync state from Supabase once loaded
  useEffect(() => {
    if (!settingsData) return;
    setGeneral({
      platformName: settingsData.platform_name ?? "ChamaAdmin",
      supportEmail: settingsData.support_email ?? "",
      supportPhone: settingsData.support_phone ?? "",
      defaultPlan: settingsData.default_plan === "pro" ? "Pro" : "Basic",
      trialDays: settingsData.trial_days ?? "14",
    });
    setBilling({
      basicPrice: settingsData.basic_price ?? "5000",
      proPrice: settingsData.pro_price ?? "10000",
      currency: settingsData.currency ?? "KES",
      mpesaShortcode: settingsData.mpesa_shortcode ?? "",
      mpesaPasskey: settingsData.mpesa_passkey ?? "",
    });
    setNotifications({
      newChama: settingsData.notif_new_chama !== "false",
      newSubscription: settingsData.notif_new_subscription !== "false",
      expiredSubscription: settingsData.notif_expired_subscription !== "false",
      suspendedUser: settingsData.notif_suspended_user === "true",
      weeklyReport: settingsData.notif_weekly_report !== "false",
      monthlyReport: settingsData.notif_monthly_report !== "false",
    });
  }, [settingsData]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleGeneralSave = async () => {
    try {
      await saveSettings({
        platform_name: general.platformName,
        support_email: general.supportEmail,
        support_phone: general.supportPhone,
        default_plan: general.defaultPlan.toLowerCase(),
        trial_days: general.trialDays,
      });
      showSaved();
    } catch (err) {
      // Show error toast or set error state
      console.error("Failed to save settings:", err);
    }
  };

  const handleNotificationsSave = async () => {
    await saveSettings({
      notif_new_chama: String(notifications.newChama),
      notif_new_subscription: String(notifications.newSubscription),
      notif_expired_subscription: String(notifications.expiredSubscription),
      notif_suspended_user: String(notifications.suspendedUser),
      notif_weekly_report: String(notifications.weeklyReport),
      notif_monthly_report: String(notifications.monthlyReport),
    });
    showSaved();
  };

  const handlePasswordChange = async () => {
    setPwdError("");

    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      setPwdError("All password fields are required.");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      setPwdError("New passwords do not match.");
      return;
    }
    if (security.newPassword.length < 8) {
      setPwdError("Password must be at least 8 characters.");
      return;
    }

    setPwdSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setPwdError("Could not verify current user.");
      setPwdSaving(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: security.currentPassword,
    });

    if (signInError) {
      setPwdError("Current password is incorrect.");
      setPwdSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: security.newPassword,
    });

    setPwdSaving(false);

    if (updateError) {
      setPwdError(updateError.message);
      return;
    }

    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showSaved();
  };

  const handleBillingSave = async () => {
    await saveSettings({
      basic_price: billing.basicPrice,
      pro_price: billing.proPrice,
      currency: billing.currency,
      mpesa_shortcode: billing.mpesaShortcode,
      mpesa_passkey: billing.mpesaPasskey,
    });
    showSaved();
  };

  const SaveButton = ({
    onClick,
    label = "Save Changes",
    loading = false,
  }: {
    onClick: () => void;
    label?: string;
    loading?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={loading || saving}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
    >
      {loading || saving ? (
        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : (
        <Save size={15} />
      )}
      {loading || saving ? "Saving..." : label}
    </button>
  );

  // loading skeleton
  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] px-6 py-8">
        <div className="mb-8 space-y-2 animate-pulse">
          <div className="w-20 h-3 bg-white/[0.06] rounded" />
          <div className="w-32 h-7 bg-white/[0.06] rounded" />
          <div className="w-64 h-3 bg-white/[0.04] rounded" />
        </div>
        <div className="w-80 h-10 bg-white/[0.04] rounded-xl mb-8 animate-pulse" />
        <div className="max-w-2xl space-y-4 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-14 bg-white/[0.03] border border-white/[0.07] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white px-6 py-8 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-white/40 text-sm tracking-widest uppercase mb-1">Admin</p>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-white/40 text-sm mt-1">Manage platform preferences and configuration</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-2 rounded-xl">
            <CheckCircle2 size={15} />
            Saved successfully
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab ? "bg-emerald-500/15 text-emerald-400" : "text-white/40 hover:text-white"
            }`}
          >
            {tab === "General" && <Settings size={13} />}
            {tab === "Notifications" && <Bell size={13} />}
            {tab === "Security" && <Shield size={13} />}
            {tab === "Billing" && <CreditCard size={13} />}
            {tab}
          </button>
        ))}
      </div>

      {/* ── General Tab ── */}
      {activeTab === "General" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white mb-5">Platform Settings</h2>
            <div className="space-y-5">
              {[
                { label: "Platform Name", key: "platformName", placeholder: "ChamaAdmin" },
                { label: "Support Email", key: "supportEmail", placeholder: "support@chamaadmin.co.ke" },
                { label: "Support Phone", key: "supportPhone", placeholder: "0800 123 456" },
                { label: "Trial Period (days)", key: "trialDays", placeholder: "14" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    value={general[field.key as keyof typeof general]}
                    onChange={(e) => setGeneral(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Default Plan for New Chamas</label>
                <div className="flex gap-3">
                  {["Basic", "Pro"].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setGeneral(prev => ({ ...prev, defaultPlan: plan }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        general.defaultPlan === plan
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <SaveButton onClick={handleGeneralSave} />
        </div>
      )}

      {/* ── Notifications Tab ── */}
      {activeTab === "Notifications" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white mb-5">Email Notifications</h2>
            <div className="space-y-1">
              {[
                { key: "newChama", label: "New chama created", sub: "Get notified when a new chama is added" },
                { key: "newSubscription", label: "New subscription", sub: "When a chama subscribes to a plan" },
                { key: "expiredSubscription", label: "Subscription expired", sub: "When a subscription lapses or expires" },
                { key: "suspendedUser", label: "User suspended", sub: "When an admin suspends a member" },
                { key: "weeklyReport", label: "Weekly summary report", sub: "Revenue and activity digest every Monday" },
                { key: "monthlyReport", label: "Monthly report", sub: "Full platform report on the 1st of each month" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-white text-sm">{item.label}</p>
                    <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof notifications],
                    }))}
                    className={`relative rounded-full transition-colors shrink-0 ${
                      notifications[item.key as keyof typeof notifications] ? "bg-emerald-500" : "bg-white/10"
                    }`}
                    style={{ height: "22px", width: "40px" }}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <SaveButton onClick={handleNotificationsSave} label="Save Preferences" />
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === "Security" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white mb-5">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? "text" : "password"}
                    value={security.currentPassword}
                    onChange={(e) => setSecurity(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowCurrentPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                    {showCurrentPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    value={security.newPassword}
                    onChange={(e) => setSecurity(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowNewPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                    {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className={`w-full bg-white/[0.04] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors ${
                    security.confirmPassword && security.confirmPassword !== security.newPassword
                      ? "border-red-500/50 focus:border-red-500/50"
                      : "border-white/[0.08] focus:border-emerald-500/50"
                  }`}
                />
                {security.confirmPassword && security.confirmPassword !== security.newPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {pwdError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-xs">{pwdError}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-sm font-medium text-red-400 mb-2">Danger Zone</h2>
            <p className="text-white/40 text-xs mb-4">
              These actions are irreversible. Please be absolutely sure before proceeding.
            </p>
            <button className="text-red-400 border border-red-500/30 hover:bg-red-500/10 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              Delete Platform Data
            </button>
          </div>

          <SaveButton onClick={handlePasswordChange} label="Update Password" loading={pwdSaving} />
        </div>
      )}

      {/* ── Billing Tab ── */}
      {activeTab === "Billing" && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white mb-5">Plan Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Basic Plan (KES/month)", key: "basicPrice" },
                { label: "Pro Plan (KES/month)", key: "proPrice" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1.5">{field.label}</label>
                  <input
                    type="number"
                    value={billing[field.key as keyof typeof billing]}
                    onChange={(e) => setBilling(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white mb-1">MPESA Configuration</h2>
            <p className="text-white/35 text-xs mb-5">Daraja API credentials for payment processing</p>
            <div className="space-y-4">
              {[
                { label: "Business Shortcode", key: "mpesaShortcode", type: "text", placeholder: "123456" },
                { label: "Passkey", key: "mpesaPasskey", type: "password", placeholder: "Your Daraja passkey" },
                { label: "Currency", key: "currency", type: "text", placeholder: "KES" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={billing[field.key as keyof typeof billing]}
                    onChange={(e) => setBilling(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
              <p className="text-amber-400/70 text-xs">
                Changes to MPESA credentials will affect all payment processing immediately.
                Test in sandbox before updating production keys.
              </p>
            </div>
          </div>

          <SaveButton onClick={handleBillingSave} label="Save Billing Settings" />
        </div>
      )}
    </div>
  );
}

export default SettingsPage;