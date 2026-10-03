import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getUserHistory, deleteScanRecord } from "../services/history";
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Sprout,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Loader2,
  X,
  Activity,
  Stethoscope,
  ShieldCheck,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

const HistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const records = await getUserHistory(user?.uid);
      setHistory(records);
    } catch (err) {
      setError("Failed to load prediction history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this scan record?")) return;

    try {
      await deleteScanRecord(recordId, user?.uid);
      setHistory((prev) => prev.filter((item) => item.id !== recordId && item.docId !== recordId));
      if (selectedScan && (selectedScan.id === recordId || selectedScan.docId === recordId)) {
        setSelectedScan(null);
      }
    } catch (err) {
      alert("Failed to delete scan record.");
    }
  };

  const handleAskAI = (record, e) => {
    if (e) e.stopPropagation();
    const params = new URLSearchParams({
      plant: record.plant || "",
      disease: record.disease || "",
    });
    navigate(`/assistant?${params.toString()}`);
  };

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.plant || "").toLowerCase().includes(term) ||
      (item.disease || "").toLowerCase().includes(term) ||
      (item.class_name || "").toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left">
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Link to="/dashboard" className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span>Diagnostic Archive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Prediction History</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                {history.length} Records
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Review saved foliar scan diagnoses and agronomic treatment logs.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              to="/detect"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Sprout className="w-4 h-4" />
              <span>New Scan</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history by crop or disease..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-medium">Fetching saved diagnostic records...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty History State */}
        {!loading && !error && filteredHistory.length === 0 && (
          <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <History className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white">No Saved Scans Found</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                {searchTerm
                  ? "No diagnostic records matched your search query."
                  : "You haven't saved any disease scan results yet. Perform a scan and click 'Save Result' to archive it here."}
              </p>
            </div>
            <Link
              to="/detect"
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              Start Diagnostic Scan
            </Link>
          </div>
        )}

        {/* Records Grid */}
        {!loading && filteredHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id || item.docId}
                onClick={() => setSelectedScan(item)}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 space-y-4 group cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                      {item.plant || "Crop"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {item.disease}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Confidence: <strong className="text-emerald-400">{item.confidence}</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={(e) => handleAskAI(item, e)}
                    className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id || item.docId, e)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        {selectedScan && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left shadow-2xl relative">
              <button
                type="button"
                onClick={() => setSelectedScan(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  {selectedScan.plant}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  {selectedScan.disease}
                </h2>
                <div className="text-xs text-slate-400 font-mono">
                  Confidence: <strong className="text-emerald-400">{selectedScan.confidence}</strong> • Analyzed on {new Date(selectedScan.timestamp).toLocaleString()}
                </div>
              </div>

              {/* Grid Fields */}
              <div className="space-y-4 text-xs">
                {selectedScan.symptoms && selectedScan.symptoms.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Activity className="w-4 h-4" />
                      <span>Symptoms</span>
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {selectedScan.symptoms.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScan.treatment && selectedScan.treatment.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Stethoscope className="w-4 h-4" />
                      <span>Treatment & Solutions</span>
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {selectedScan.treatment.map((t, i) => (
                        <li key={i}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScan.prevention && selectedScan.prevention.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="font-bold text-blue-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Prevention</span>
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {selectedScan.prevention.map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScan.agricultural_advice && (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4" />
                      <span>Agronomist Guidance</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {Array.isArray(selectedScan.agricultural_advice)
                        ? selectedScan.agricultural_advice.join(" ")
                        : selectedScan.agricultural_advice}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleAskAI(selectedScan)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask AI Assistant About This</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScan(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
