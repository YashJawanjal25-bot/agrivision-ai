import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveScanHistory } from "../../services/history";
import { useAuth } from "../../context/AuthContext";
import {
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  RefreshCw,
  Sprout,
  Activity,
  ShieldCheck,
  HelpCircle,
  Stethoscope,
  Lightbulb,
  FileCheck,
  Cpu,
  BarChart3,
  Info,
  MessageSquare,
} from "lucide-react";

const AnalysisResult = ({ result, previewUrl, onReset }) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true);
    setSaveError(null);
    try {
      await saveScanHistory(result, user?.uid);
      setSaved(true);
      setSaveError(null);
      setTimeout(() => setSaved(false), 4000);
    } catch (e) {
      console.error("Failed to save scan record:", e);
      setSaveError(e?.message || "Failed to save. Please try again.");
      setTimeout(() => setSaveError(null), 6000);
    } finally {
      setSaving(false);
    }
  };

  const handleAskAI = () => {
    const params = new URLSearchParams({
      plant: result.plant || "",
      disease: result.disease || "",
    });
    navigate(`/assistant?${params.toString()}`);
  };

  // Calculate numeric confidence score
  const numericConfidence = typeof result.confidence === "number"
    ? result.confidence
    : parseFloat(result.confidence || "0.95");

  const isLowConfidence = numericConfidence < 0.60;

  const confidenceDisplay = typeof result.confidence === "number"
    ? `${(result.confidence * 100).toFixed(1)}%`
    : result.confidence || "95.0%";

  return (
    <div className="space-y-6">
      {/* 1. STATUS BADGE & LOW CONFIDENCE INDICATOR */}
      {result.isRealPrediction ? (
        <div className="space-y-3 text-left">
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-emerald-300 flex items-center gap-2">
                  <span>REAL AI PREDICTION — FASTAPI & PYTORCH ENGINE</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Inference executed via PyTorch / MobileNetV2 architecture on FastAPI backend.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0">
              Live ML Pipeline
            </span>
          </div>

          {/* Low Confidence Warning (PART 11) */}
          {isLowConfidence && (
            <div className="p-4 rounded-xl bg-amber-950/70 border-2 border-amber-500/50 text-amber-200 text-xs flex items-start gap-3 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 animate-bounce" />
              <div className="space-y-1">
                <div className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">
                  Low Confidence Prediction (Below 60% Threshold)
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  The model confidence is below 60%. Consider uploading a clearer, well-lit photograph of the leaf foliage, or consult a local agricultural university extension specialist for confirmation.
                </p>
              </div>
            </div>
          )}

          {/* PlantVillage Supported Crops Notice */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200">PlantVillage Model Scope:</span>{" "}
              The core dataset supports 14 crops (Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato). Grassy or cereal leaves outside this set (such as Rice, Wheat, or Sugarcane) are mapped to the visually closest supported model class (Corn/Maize).
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-amber-300">
                DEMO RESULT — AI MODEL NOT CONNECTED
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                The details below illustrate the diagnostic data structure until training is executed.
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
            Preview Mode
          </span>
        </div>
      )}

      {/* 2. SPECIMEN OVERVIEW CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Specimen Thumbnail */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Analyzed plant leaf"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-400">
                  <Sprout className="w-16 h-16" />
                </div>
              )}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-emerald-400 border border-slate-800">
                Analyzed Specimen
              </div>
            </div>
          </div>

          {/* Primary Diagnosis Details */}
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                Plant: {result.plant || "Crop Specimen"}
              </span>
              {result.class_name && (
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
                  Class: {result.class_name}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {result.disease}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Computer vision assessment matching PlantVillage pathology markers.
              </p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Confidence</div>
                <div className={`text-xl font-extrabold font-mono ${isLowConfidence ? "text-amber-400" : "text-emerald-400"}`}>
                  {confidenceDisplay}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Diagnostic Status</div>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {result.disease?.toLowerCase().includes("healthy") ? "Healthy Plant" : "Pathology Flagged"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-semibold text-slate-400">Backbone Model</div>
                <div className="text-sm font-bold text-teal-300 mt-1 font-mono">
                  MobileNetV2 / ResNet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOP PREDICTIONS BREAKDOWN */}
      {result.top_predictions && result.top_predictions.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl text-left space-y-3">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Top Candidate Class Predictions (Softmax Probabilities)</span>
          </div>

          <div className="space-y-2 pt-1">
            {result.top_predictions.map((item, idx) => {
              const confPct = typeof item.confidence === "number"
                ? (item.confidence * 100).toFixed(1)
                : item.percentage || "0.0";
              const numVal = typeof item.confidence === "number"
                ? item.confidence * 100
                : parseFloat(confPct);

              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      {idx + 1}. {item.disease || item.class_name}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {confPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(2, numVal))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. STRUCTURED DIAGNOSTIC FIELDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Symptoms */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <span>Identified Symptoms</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.symptoms?.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Possible Causes */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-teal-400 font-bold text-sm">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span>Possible Causes</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.causes?.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment / Solution */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span>Treatment & Solutions</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.treatment?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prevention */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-blue-400 font-bold text-sm">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Prevention & Cultural Practices</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.prevention?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. AGRICULTURAL ADVICE CALLOUT */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-green-950/60 border border-emerald-500/30 text-left space-y-2">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-300" />
          <span>Agricultural Advice</span>
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {Array.isArray(result.agricultural_advice) ? (
            result.agricultural_advice.map((advice, idx) => (
              <p key={idx}>{advice}</p>
            ))
          ) : (
            <p>{result.agricultural_advice || result.agriculturalAdvice}</p>
          )}
        </div>
      </div>

      {/* 6. ACTION BUTTONS: Analyze Another, Ask AI About Disease, Save Result */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Analyze Another Image</span>
        </button>

        {/* ASK AI ABOUT THIS DISEASE BUTTON (PART 9) */}
        <button
          type="button"
          onClick={handleAskAI}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-lg shadow-teal-500/20"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI About This Disease</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saved || saving}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            saved
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 text-slate-950 shadow-lg shadow-emerald-500/20"
          }`}
        >
          {saved ? (
            <>
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Record Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Result"}</span>
            </>
          )}
        </button>
      </div>

      {/* Save Error Banner */}
      {saveError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-200 mb-0.5">Could not save to history</p>
            <p>{saveError}</p>
            <p className="text-red-400/80 mt-1">
              Make sure you are logged in with a Firebase account. If you were using Demo Mode before, please <strong>log out and sign in again</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
