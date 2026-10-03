import React from "react";
import { Sprout, Scan, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-400">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AgriVision AI</span>
            </div>
            <p className="text-emerald-400 font-medium text-sm italic">
              "See the Disease. Understand the Cause. Protect the Crop."
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Next-generation precision agronomy platform leveraging deep learning computer vision
              and environmental microclimate correlations to secure agricultural yields worldwide.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-[11px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              FastAPI & PyTorch Inference Pipeline Ready
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Agronomist Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-emerald-400 transition-colors">
                  Farmer Registration
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Field Diagnostic Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* 3 Pillars Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Core Principles
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>See:</strong> Computer Vision Scanning</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span><strong>Understand:</strong> Pathogen Causality</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span><strong>Protect:</strong> Targeted Interventions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgriVision AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered for sustainable agriculture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
