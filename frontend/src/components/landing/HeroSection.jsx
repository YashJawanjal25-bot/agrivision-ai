import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Scan,
  ShieldCheck,
  Sparkles,
  Leaf,
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Tagline, CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Tech badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Next-Gen Agricultural Computer Vision</span>
              <span className="text-slate-500">|</span>
              <span className="text-amber-300">AI Agronomy</span>
            </div>

            {/* Main Headline & Tagline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Empowering Agriculture With Intelligent{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300">
                  Crop Diagnostics
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-emerald-300/90 tracking-wide">
                “See the Disease. Understand the Cause. Protect the Crop.”
              </p>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                AgriVision AI transforms plant health management. Instantly recognize crop pathogens,
                uncover environmental causality before epidemics spread, and receive targeted,
                science-backed intervention strategies to safeguard your yield.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Start Crop Protection Free</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200"
              >
                <span>Agronomist Sign In</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-bold text-white">45+</div>
                <div className="text-xs text-slate-400 font-medium">Crop Varieties</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">98.4%</div>
                <div className="text-xs text-slate-400 font-medium">Target Diagnostic Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-teal-300">&lt; 150ms</div>
                <div className="text-xs text-slate-400 font-medium">Model Inference Speed</div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Scanner Telemetry Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl p-4 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-slate-400 ml-1">agrivision-vision-v1.0</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>LIVE SENSOR</span>
                </div>
              </div>

              {/* Viewport simulation */}
              <div className="relative mt-3 rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 to-emerald-950/40 border border-emerald-900/60 aspect-[4/3] flex items-center justify-center p-6">
                {/* Background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b15_1px,transparent_1px),linear-gradient(to_bottom,#064e3b15_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Animated scanning bar */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan z-20 pointer-events-none" />

                {/* Simulated Leaf Subject */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative p-6 rounded-full bg-emerald-950/40 border border-emerald-500/30">
                    <Leaf className="w-24 h-24 text-emerald-400/90 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                    
                    {/* Bounding box detection overlay */}
                    <div className="absolute inset-3 border-2 border-dashed border-amber-400/80 rounded-lg animate-pulse" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-[10px] font-mono font-bold text-amber-300">
                      Early Blight [97.8%]
                    </div>
                  </div>
                </div>

                {/* Crosshair corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                {/* Live telemetry tags */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                  <span>SPECIES: Solanum lycopersicum</span>
                  <span className="text-emerald-400 font-semibold">STAGE: Flowering</span>
                </div>
              </div>

              {/* Real-time telemetry diagnosis preview */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-950/90 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-white font-medium">Pathogen: Alternaria solani</div>
                      <div className="text-[11px] text-slate-400">Trigger: High microclimate humidity (88%)</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Action Required
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    PyTorch Vision Backbone Ready
                  </span>
                  <span className="text-emerald-400 font-mono">Status: Armed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
