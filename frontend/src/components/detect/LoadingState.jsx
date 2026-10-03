import React from "react";

const LoadingState = () => {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated Scan Beam */}
      <div className="relative w-40 h-40 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/30 via-transparent to-transparent animate-bounce" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 animate-ping" />
        <svg
          className="w-16 h-16 text-emerald-400/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-extrabold text-white">
          Neural Inference in Progress
        </h3>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Analyzing leaf morphology, identifying pathological markers, and querying agricultural knowledge base...
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>

      <p className="text-[11px] text-slate-500 font-mono">
        FastAPI → PyTorch/MobileNetV2 → Disease Knowledge Base
      </p>
    </div>
  );
};

export default LoadingState;
