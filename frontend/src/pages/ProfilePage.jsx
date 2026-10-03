import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getUserHistory } from "../services/history";
import {
  User,
  Mail,
  ShieldCheck,
  KeyRound,
  LogOut,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Check,
  X,
  History,
  Cpu,
} from "lucide-react";

const ProfilePage = () => {
  const { user, logout, isFirebaseConfigured } = useAuth();
  const [predictionCount, setPredictionCount] = useState(0);
  const [resetSent, setResetSent] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "Precision Agronomist");

  useEffect(() => {
    if (user) {
      getUserHistory(user.uid).then((records) => {
        setPredictionCount(records.length);
      });
    }
  }, [user]);

  const handlePasswordReset = async () => {
    if (isFirebaseConfigured && user?.email) {
      try {
        const { getAuth, sendPasswordResetEmail } = await import("firebase/auth");
        const auth = getAuth();
        await sendPasswordResetEmail(auth, user.email);
        setResetSent(true);
        setTimeout(() => setResetSent(false), 5000);
      } catch (err) {
        alert("Failed to send password reset email: " + err.message);
      }
    } else {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    }
  };

  const handleSaveName = () => {
    setIsEditingName(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto text-left">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            User Profile & Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your account credentials, agricultural role, and security settings.
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl shadow-emerald-500/20 shrink-0">
              {user?.email ? user.email.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-500 text-white text-base font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    <span>{displayName}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Edit Display Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </h2>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  Verified Agronomist
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{user?.email || "demo.user@agrivision.ai"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isFirebaseConfigured ? "Firebase Cloud Authenticated" : "Local Demo Session"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Total Diagnostic Scans</span>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{predictionCount}</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>AI Engine Access</span>
            </div>
            <div className="text-base font-bold text-emerald-300 mt-1">PyTorch & RAG Enabled</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-amber-400" />
              <span>Crop Focus Scope</span>
            </div>
            <div className="text-base font-bold text-amber-300 mt-1">14 PlantVillage Crops</div>
          </div>
        </div>

        {/* Security & Actions */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Security & Authentication Actions
          </h3>

          {resetSent && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isFirebaseConfigured
                  ? `Password reset email sent to ${user?.email}. Please check your inbox.`
                  : "Password reset request simulated successfully in Demo Mode."}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-teal-400" />
              <span>Reset Account Password</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
