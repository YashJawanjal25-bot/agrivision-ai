import React from "react";
import {
  FileText,
  HardDrive,
  RefreshCw,
  Trash2,
  Sparkles,
  ArrowRight,
  Leaf,
  Scan,
} from "lucide-react";

const ImagePreview = ({
  imageFile,
  previewUrl,
  onReset,
  onAnalyze,
  onChangeImage,
}) => {
  // Format bytes into readable KB or MB
  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left: Image Preview Frame */}
        <div className="relative w-full md:w-1/2 aspect-square max-w-[360px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
          <img
            src={previewUrl}
            alt="Selected plant leaf preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Precision overlay corners */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

          {/* Plant species badge */}
          <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Leaf className="w-3.5 h-3.5" />
              <span>Image Loaded</span>
            </span>
            <span className="text-slate-400">Ready for Scan</span>
          </div>
        </div>

        {/* Right: File Details & Actions */}
        <div className="w-full md:w-1/2 space-y-6 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Scan className="w-3.5 h-3.5" />
              <span>Selected Specimen</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready for Health Analysis
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify your plant photograph before running the diagnostic pipeline.
            </p>
          </div>

          {/* Metadata Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                File Name:
              </span>
              <span className="font-mono font-semibold text-white max-w-[180px] sm:max-w-[220px] truncate" title={imageFile?.name}>
                {imageFile?.name}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-amber-400" />
                File Size:
              </span>
              <span className="font-mono font-semibold text-emerald-300">
                {formatFileSize(imageFile?.size)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Resolution Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Optimal
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-3 pt-2">
            {/* Analyze Plant Button */}
            <button
              type="button"
              onClick={onAnalyze}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analyze Plant</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {/* Remove / Change Image Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onChangeImage}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-900/50 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
