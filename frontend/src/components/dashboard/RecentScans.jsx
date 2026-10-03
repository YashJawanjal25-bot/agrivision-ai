import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";

const RecentScans = ({ onOpenScanModal }) => {
  const scans = [
    {
      id: "SCN-8841",
      plot: "North Acre Plot 3",
      crop: "Solanum lycopersicum (Tomato)",
      diagnosis: "Early Blight (Alternaria solani)",
      severity: "High",
      confidence: "98.2%",
      humidity: "86% RH",
      date: "Today, 09:24 AM",
      action: "Apply copper octanoate & prune lower canopy leaves",
    },
    {
      id: "SCN-8839",
      plot: "Valley Field Beta",
      crop: "Zea mays (Maize / Corn)",
      diagnosis: "Common Rust (Puccinia sorghi)",
      severity: "Moderate",
      confidence: "94.6%",
      humidity: "74% RH",
      date: "Yesterday, 04:12 PM",
      action: "Monitor spore progression; prepare pyraclostrobin",
    },
    {
      id: "SCN-8835",
      plot: "Highland Orchard 1",
      crop: "Malus domestica (Apple)",
      diagnosis: "Apple Scab (Venturia inaequalis)",
      severity: "Moderate",
      confidence: "91.8%",
      humidity: "79% RH",
      date: "Sep 14, 11:05 AM",
      action: "Rake fallen infected foliage; sulfur dusting",
    },
    {
      id: "SCN-8830",
      plot: "Greenhouse C-4",
      crop: "Capsicum annuum (Bell Pepper)",
      diagnosis: "Healthy Foliage (No Pathogen)",
      severity: "Optimal",
      confidence: "99.4%",
      humidity: "62% RH",
      date: "Sep 13, 02:45 PM",
      action: "Maintain current drip schedule & airflow",
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Recent Field Diagnostic Telemetry</h3>
          <p className="text-xs text-slate-400">
            Automated inspection records logged across your managed acreage.
          </p>
        </div>
        <button
          onClick={onOpenScanModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <span>Live Vision Scanner</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Plot & Crop</th>
              <th className="py-3 px-4">Detected Diagnosis</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Microclimate</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Agronomic Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {scans.map((scan) => {
              const isCritical = scan.severity === "High";
              const isWarning = scan.severity === "Moderate";
              const isHealthy = scan.severity === "Optimal";

              return (
                <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{scan.plot}</div>
                    <div className="text-[11px] text-slate-400">{scan.crop}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <span className={isCritical ? "text-amber-300" : isWarning ? "text-amber-200" : "text-emerald-400"}>
                      {scan.diagnosis}
                    </span>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {scan.date}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {scan.confidence}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {scan.humidity}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        isCritical
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : isWarning
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isCritical ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {scan.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-300 max-w-xs">
                    {scan.action}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScans;
