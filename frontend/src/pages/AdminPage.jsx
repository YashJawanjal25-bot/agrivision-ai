import React, { useState, useEffect } from "react";
import { useAuth, getDemoUsers } from "../context/AuthContext";
import { getUserHistory } from "../services/history";
import {
  Users,
  User,
  ShieldCheck,
  Clock,
  Leaf,
  BarChart2,
  Mail,
  RefreshCw,
  Lock,
} from "lucide-react";

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Badge({ children, color = "emerald" }) {
  const map = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    slate: "bg-slate-700/50 text-slate-400 border-slate-600/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[color]}`}
    >
      {children}
    </span>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user, isFirebaseConfigured } = useAuth();
  const [users, setUsers] = useState([]);
  const [scanCounts, setScanCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const isAdmin = user?.email === "admin@agrivision.ai" || user?.isDemo;

  const loadData = async () => {
    setRefreshing(true);
    try {
      const demoUsers = getDemoUsers();
      setUsers(demoUsers);

      // Load scan count for each user
      const counts = {};
      await Promise.all(
        demoUsers.map(async (u) => {
          const hist = await getUserHistory(u.uid);
          counts[u.uid] = hist.length;
        })
      );
      setScanCounts(counts);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openUserDetail = async (u) => {
    setSelectedUser(u);
    setHistoryLoading(true);
    try {
      const hist = await getUserHistory(u.uid);
      setSelectedHistory(hist);
    } catch {
      setSelectedHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const totalScans = Object.values(scanCounts).reduce((a, b) => a + b, 0);

  // ── Currently logged-in user card (always shown) ──
  const LoggedInCard = () => (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
        {user?.displayName?.charAt(0)?.toUpperCase() || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {user?.displayName || "Unknown User"}
        </p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
          UID: {user?.uid}
        </p>
      </div>
      <Badge color="emerald">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
        Online
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
            </div>
            <p className="text-sm text-slate-400 ml-11">
              Registered accounts &amp; scan history overview
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Currently Logged In ── */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Currently Logged In
          </h2>
          <LoggedInCard />
        </section>

        {/* ── Stats Row ── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Registered Users",
              value: users.length,
              icon: Users,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Total Scans",
              value: totalScans,
              icon: Leaf,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Mode",
              value: isFirebaseConfigured ? "Firebase" : "Demo",
              icon: BarChart2,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Firebase notice if unconfigured ── */}
        {!isFirebaseConfigured && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-relaxed">
              <span className="font-semibold">Demo Mode active.</span> User
              accounts are stored in localStorage on this device only. Configure
              Firebase in <code className="font-mono">frontend/.env</code> to
              enable real cloud accounts.
            </p>
          </div>
        )}

        {/* ── All Users Table ── */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            All Registered Users ({users.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading accounts…</span>
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-16 flex flex-col items-center gap-3 text-slate-500">
              <Users className="w-10 h-10 opacity-30" />
              <p className="text-sm">No registered users yet.</p>
              <p className="text-xs text-slate-600">
                Users will appear here after they sign up.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-4">User</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Scans</div>
                <div className="col-span-2">Registered</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-800/60">
                {users.map((u, idx) => {
                  const isCurrentUser = u.uid === user?.uid;
                  return (
                    <button
                      key={u.uid}
                      onClick={() => openUserDetail(u)}
                      className={`w-full grid grid-cols-12 gap-4 px-5 py-4 text-left transition hover:bg-slate-800/40 ${
                        isCurrentUser ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      <div className="col-span-1 text-slate-500 text-sm font-mono">
                        {idx + 1}
                      </div>
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                          {u.displayName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {u.displayName}
                          </p>
                          {isCurrentUser && (
                            <Badge color="emerald">You</Badge>
                          )}
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-3 flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-xs text-slate-400 truncate">{u.email}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-2 flex items-center">
                        <span className="text-sm font-bold text-emerald-400">
                          {scanCounts[u.uid] ?? 0}
                        </span>
                      </div>
                      <div className="hidden sm:flex col-span-2 items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3 shrink-0" />
                        {formatDate(u.registeredAt)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── User Detail Modal ── */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {selectedUser.displayName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <h3 className="font-bold text-white">{selectedUser.displayName}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  UID: {selectedUser.uid}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Registered", value: formatDate(selectedUser.registeredAt) },
                { label: "Last Login", value: formatDate(selectedUser.lastLogin) },
                {
                  label: "Total Scans",
                  value: `${scanCounts[selectedUser.uid] ?? 0} scans`,
                },
                {
                  label: "Account Type",
                  value: selectedUser.isDemo ? "Demo Mode" : "Firebase",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-3"
                >
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Scan History */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Scan History ({selectedHistory.length})
              </h4>
              {historyLoading ? (
                <div className="py-6 flex items-center justify-center text-slate-500 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Loading scans…</span>
                </div>
              ) : selectedHistory.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-6">
                  No scans recorded yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedHistory.map((scan) => (
                    <div
                      key={scan.id}
                      className="rounded-xl bg-slate-800/50 border border-slate-700/40 px-4 py-3 flex items-center gap-3"
                    >
                      <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {scan.plant} — {scan.disease}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(scan.timestamp)} · {scan.confidence}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
