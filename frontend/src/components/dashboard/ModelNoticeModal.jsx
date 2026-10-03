import React from "react";
import { X, Sparkles, Cpu, Layers, CheckCircle2, ArrowRight } from "lucide-react";

const ModelNoticeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Stage 2: Vision Model Pipeline</h3>
            <p className="text-xs text-emerald-400 font-medium">
              Backend Architecture Staged in <code className="bg-slate-800 px-1 py-0.5 rounded">/backend</code>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            You are currently running <strong>AgriVision AI Stage 1</strong> (Authentication,
            Protected Dashboard, Landing Experience, and Modular Directory Setup).
          </p>
          
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Staged for Stage 2 Release:
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>FastAPI Prediction Server:</strong> High-throughput asynchronous endpoints</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>PyTorch CNN / ViT Backbone:</strong> Multiclass foliar pathogen classifier</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Grad-CAM Anomaly Heatmaps:</strong> Visual lesion localization</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            The project structure has been cleanly organized so the model weights, inference scripts,
            and API endpoints can seamlessly hook into this frontend.
          </p>
        </div>

        {/* Footer Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
          >
            Got It, Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelNoticeModal;
