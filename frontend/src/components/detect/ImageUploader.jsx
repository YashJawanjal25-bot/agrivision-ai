import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, AlertCircle, FileCheck, Sprout } from "lucide-react";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"];

const ImageUploader = ({ onImageSelect, error, setError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    if (!file) return;

    setError("");

    // 1. File Type Validation
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!ALLOWED_MIME_TYPES.includes(fileType) && !hasValidExt) {
      setError(
        `Invalid file type "${file.name}". Please upload a JPG, JPEG, or PNG image file.`
      );
      return;
    }

    // 2. File Size Validation (Max 10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(
        `File is too large (${fileSizeMB} MB). Maximum permitted file size is 10 MB.`
      );
      return;
    }

    // Passed validation
    onImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndProcessFile(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/80 flex items-start gap-3 text-red-200 text-xs sm:text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold text-red-300">Upload Validation Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[340px] group ${
          isDragging
            ? "border-emerald-400 bg-emerald-950/30 scale-[1.01] shadow-2xl shadow-emerald-500/20"
            : "border-slate-800 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Animated icon container */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-400/60 transition-all duration-300 shadow-lg shadow-emerald-950/40">
            <UploadCloud className="w-10 h-10 group-hover:text-emerald-300 transition-colors" />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-amber-300">
            <Sprout className="w-4 h-4" />
          </div>
        </div>

        {/* Text Prompt specified in requirements */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight group-hover:text-emerald-300 transition-colors">
          Upload a clear image of a plant leaf
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Drag and drop your leaf photograph here, or click to browse from your device.
        </p>

        {/* Choose Image Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all"
        >
          Choose Image
        </button>

        {/* Supported formats & size guidelines */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-800 text-slate-400">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            JPG, JPEG, PNG
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-800 text-slate-400">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            Max 10 MB file size
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
