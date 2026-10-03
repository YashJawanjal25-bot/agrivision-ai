import React from "react";

const StatCard = ({ title, value, change, changeType = "positive", icon: Icon, color = "emerald" }) => {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
    },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.border} border`}>
          <Icon className={`w-5 h-5 ${scheme.text}`} />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-white">{value}</span>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              changeType === "positive"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : changeType === "warning"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
