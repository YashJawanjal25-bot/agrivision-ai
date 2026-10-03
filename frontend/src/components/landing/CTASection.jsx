import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout, ShieldCheck, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 border border-emerald-500/30 shadow-2xl overflow-hidden text-center">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Next-Gen Agricultural Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Protect Your Harvest With Precision AI?
            </h2>

            <p className="text-emerald-200/90 text-base sm:text-lg font-medium italic">
              "See the Disease. Understand the Cause. Protect the Crop."
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Create your agronomist account today to start monitoring field health, logging
              diagnostics, and staying ahead of invasive plant pathogens.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700/80 transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
