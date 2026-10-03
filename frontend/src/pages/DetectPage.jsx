import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ImageUploader from "../components/detect/ImageUploader";
import ImagePreview from "../components/detect/ImagePreview";
import LoadingState from "../components/detect/LoadingState";
import AnalysisResult from "../components/detect/AnalysisResult";
import { analyzePlantImage, checkBackendHealth } from "../services/api";
import {
  Scan,
  Sprout,
  AlertCircle,
  ArrowLeft,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";

const DetectPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [modelNotTrainedNotice, setModelNotTrainedNotice] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "selected" | "analyzing" | "result"
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ online: false, modelReady: false });

  const fileInputRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus({
        online: res.status === "ok",
        modelReady: Boolean(res.model_available),
      });
    });
  }, []);

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError("");
    setModelNotTrainedNotice("");
    setStatus("selected");
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    setModelNotTrainedNotice("");
    setResult(null);
    setStatus("idle");
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleHiddenFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleImageSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setStatus("analyzing");
    setError("");
    setModelNotTrainedNotice("");

    try {
      const data = await analyzePlantImage(selectedFile);
      setResult(data);
      setStatus("result");
    } catch (err) {
      if (err.isModelNotTrained) {
        setModelNotTrainedNotice(err.message);
      } else {
        setError(err.message || "Failed to analyze plant specimen.");
      }
      setStatus("selected");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hidden File Input for "Change Image" triggers */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          onChange={handleHiddenFileInput}
          className="hidden"
        />

        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Link to="/dashboard" className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span>Plant Diagnostic Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Plant Disease Detection
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Submit a leaf photograph for real PyTorch ResNet-18 neural inference and agronomic diagnosis.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {backendStatus.online ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-xs font-medium text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>FastAPI Backend Online</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-xs font-medium text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>FastAPI Port 8000</span>
              </span>
            )}
          </div>
        </div>

        {/* Training Requirement Notice (when model is awaiting training) */}
        {modelNotTrainedNotice && (
          <div className="p-6 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-left space-y-4 shadow-xl animate-fadeIn">
            <div className="flex items-start gap-3">
              <Cpu className="w-6 h-6 text-amber-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-amber-300">
                  Model Awaiting PlantVillage Training
                </h3>
                <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                  {modelNotTrainedNotice}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Steps to Train and Run Prediction:</span>
              </div>
              <p className="text-emerald-400">1. Place PlantVillage class folders into <span className="text-white">data/PlantVillage/</span></p>
              <p className="text-emerald-400">2. Run training script: <span className="text-white">python ml/train.py</span></p>
              <p className="text-emerald-400">3. Restart FastAPI: <span className="text-white">python -m uvicorn backend.app.main:app --port 8000</span></p>
            </div>
          </div>
        )}

        {/* Dynamic Workflow States */}
        {status === "idle" && (
          <ImageUploader
            onImageSelect={handleImageSelect}
            error={error}
            setError={setError}
          />
        )}

        {status === "selected" && (
          <ImagePreview
            imageFile={selectedFile}
            previewUrl={previewUrl}
            onReset={handleReset}
            onAnalyze={handleAnalyze}
            onChangeImage={handleChangeImage}
          />
        )}

        {status === "analyzing" && (
          <LoadingState previewUrl={previewUrl} />
        )}

        {status === "result" && result && (
          <AnalysisResult
            result={result}
            previewUrl={previewUrl}
            onReset={handleReset}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DetectPage;
