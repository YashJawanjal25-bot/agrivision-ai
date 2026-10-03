import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sprout,
  Scan,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setSubmitting(true);
      await login("agronomist@agrivision.ai", "demo12345");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Demo sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-900 border border-emerald-400/30 shadow-lg shadow-emerald-950/60 group-hover:border-emerald-400/60 transition-all">
            <Sprout className="w-7 h-7 text-emerald-300" />
            <Scan className="w-4 h-4 text-amber-300 absolute -bottom-1 -right-1" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome to AgriVision AI
        </h2>
        <p className="mt-1 text-sm text-emerald-400/90 font-medium italic">
          "See the Disease. Understand the Cause. Protect the Crop."
        </p>
      </div>

      {/* Main Login Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 relative">
          
          {/* Header text */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Agronomist Sign In</h3>
            <p className="text-xs text-slate-400">
              Access your field telemetry, scan history, and disease alerts.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 flex items-start gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@farmorresearch.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Test Agronomist Access (1-Click)</span>
            </button>
          </div>

          {/* Link to Sign Up */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an agronomist account?{" "}
            <Link
              to="/signup"
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
            >
              Register your farm
            </Link>
          </div>
        </div>

        {/* Security badge notice */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
          <span>Secured via Firebase Identity Management</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
