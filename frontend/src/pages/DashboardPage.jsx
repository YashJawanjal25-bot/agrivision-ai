import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getUserHistory } from "../services/history";
import { checkBackendHealth } from "../services/api";
import {
  Sprout,
  Scan,
  History,
  Bot,
  ArrowRight,
  Activity,
  ShieldCheck,
  Stethoscope,
  Calendar,
  AlertTriangle,
  Cpu,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    if (user) {
      getUserHistory(user.uid).then((records) => setHistory(records));
    }
    checkBackendHealth().then((res) => {
      setBackendReady(res.status === "ok");
    });
  }, [user]);

  const totalScans = history.length;
  const recentScan = history[0] || null;

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        {/* HERO BANNER */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 border border-emerald-500/30 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AgriVision AI Precision Suite</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Detect Plant Diseases with AI
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload a clear leaf photograph to run computer vision diagnostic screening, query RAG extension databases, and protect crop yield.
            </p>

            {/* QUICK ACTIONS BAR (PART 12) */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/detect"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Detect Disease</span>
              </Link>

              <Link
                to="/history"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <History className="w-4 h-4 text-emerald-400" />
                <span>Prediction History</span>
              </Link>

              <Link
                to="/assistant"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-teal-400" />
                <span>Ask Agricultural AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* DASHBOARD STATISTICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Total Predictions */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans Performed</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <History className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">{totalScans}</div>
            <p className="text-[11px] text-slate-500">Archived in diagnostic history</p>
          </div>

          {/* Recent Prediction Date */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Most Recent Activity</span>
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-lg font-bold text-white truncate">
              {recentScan ? new Date(recentScan.timestamp).toLocaleDateString() : "No Scans Yet"}
            </div>
            <p className="text-[11px] text-slate-500">
              {recentScan ? `${recentScan.plant} specimen` : "Run your first diagnostic scan"}
            </p>
          </div>

          {/* Most Recent Disease Identified */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Pathology</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-base font-extrabold text-emerald-300 truncate">
              {recentScan ? recentScan.disease : "None Logged"}
            </div>
            <p className="text-[11px] text-slate-500">
              {recentScan ? `Confidence: ${recentScan.confidence}` : "Awaiting leaf photograph"}
            </p>
          </div>
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Plant Disease Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload leaf images for neural classification across 38 PlantVillage pathology classes with instant confidence scoring.
            </p>
            <Link
              to="/detect"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-2"
            >
              <span>Launch Detector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-left">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-white">RAG Agricultural AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Query our grounded retrieval engine for University Extension guidelines, organic remedies, and prevention schedules.
            </p>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors pt-2"
            >
              <span>Open AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
