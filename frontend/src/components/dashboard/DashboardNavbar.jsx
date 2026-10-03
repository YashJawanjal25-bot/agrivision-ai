import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  Sprout,
  Scan,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const DashboardNavbar = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand for small screens */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 lg:hidden"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Screen Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-sm">AgriVision AI</span>
        </Link>

        {/* Desktop Welcome greeting */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <span className="text-slate-400">Welcome,</span>
          <span className="font-bold text-emerald-300">
            {user?.displayName || user?.email?.split("@")[0] || "Agronomist"}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-[11px]">
            Field Diagnostic Portal
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Detect Disease CTA */}
        <Link
          to="/detect"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all"
        >
          <Scan className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Detect Disease</span>
          <span className="sm:hidden">Detect</span>
        </Link>

        {/* User Account / Profile link */}
        <Link
          to="/profile"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs hover:border-emerald-500/40 transition-colors"
          title="Agronomist Profile"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <User className="w-3 h-3" />
          </div>
          <span className="text-slate-300 font-medium max-w-[120px] truncate">
            {user?.displayName || user?.email}
          </span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 hover:text-white rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 transition-all duration-200"
          title="Sign out of account"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
