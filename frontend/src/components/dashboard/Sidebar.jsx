import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sprout,
  Scan,
  LayoutDashboard,
  Clock,
  User,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  Bot,
} from "lucide-react";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Detect Disease",
      path: "/detect",
      icon: Scan,
      badge: "AI Tool",
    },
    {
      label: "AI Assistant",
      path: "/assistant",
      icon: Bot,
      badge: "RAG AI",
    },
    {
      label: "History",
      path: "/history",
      icon: Clock,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      label: "Admin Panel",
      path: "/admin",
      icon: ShieldCheck,
      badge: "Admin",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-18 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-900 border border-emerald-400/30 shadow-md shadow-emerald-950/50">
                <Sprout className="w-5 h-5 text-emerald-300 group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-base font-bold text-white tracking-tight">
                    AgriVision
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-medium">Precision Agronomy</p>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Agronomy Suite
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="truncate flex-grow text-left">
              <div className="text-xs font-semibold text-white truncate">
                {user?.displayName || "Agronomist"}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.email}
              </div>
            </div>
            {user?.isDemo && (
              <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Demo
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 transition-all duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
