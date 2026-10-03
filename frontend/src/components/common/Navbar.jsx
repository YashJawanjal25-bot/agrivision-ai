import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sprout,
  Scan,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-900 border border-emerald-400/30 shadow-lg shadow-emerald-950/50 group-hover:border-emerald-400/60 transition-all duration-300">
              <Sprout className="w-6 h-6 text-emerald-300 group-hover:scale-110 transition-transform duration-300" />
              <Scan className="w-4 h-4 text-amber-300/90 absolute -bottom-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  AgriVision
                </span>
                <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Precision Crop Health Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-emerald-400 ${
                isActive("/") ? "text-emerald-400 font-semibold" : "text-slate-300"
              }`}
            >
              Home
            </Link>
            <a
              href="#pillars"
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              The 3 Pillars
            </a>
            <a
              href="#technology"
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              AI Architecture
            </a>
            <a
              href="#crops"
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              Protected Crops
            </a>
            {user && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isActive("/dashboard")
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-slate-300 hover:text-emerald-300 hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth CTA Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-emerald-500/30 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="max-w-[120px] truncate font-medium">
                    {user.displayName || user.email}
                  </span>
                  {user.isDemo && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Demo
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 hover:text-white rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 transition-all duration-200"
                  title="Sign out of AgriVision AI"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/70 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/35 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-950" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link
                to="/dashboard"
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-emerald-400"
          >
            Home
          </Link>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-emerald-400"
          >
            The 3 Pillars
          </a>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-emerald-400"
          >
            AI Architecture
          </a>
          <a
            href="#crops"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-emerald-400"
          >
            Protected Crops
          </a>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Signed in as: </span>
                  <span className="font-semibold text-slate-200">{user.email}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors"
                >
                  Open Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-950/50 text-red-300 border border-red-900/50 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
