import React from "react";
import {
  Cpu,
  Layers,
  Zap,
  Server,
  Code2,
  CheckCircle2,
  Wheat,
  Apple,
  Carrot,
  Trees,
} from "lucide-react";

const TechPreviewSection = () => {
  const cropFamilies = [
    {
      icon: Wheat,
      name: "Cereals & Grains",
      examples: "Wheat, Corn, Rice, Barley",
      diseases: "Rusts, Smuts, Leaf Blight",
    },
    {
      icon: Apple,
      name: "Orchard & Fruits",
      examples: "Apple, Grape, Citrus, Peach",
      diseases: "Black Rot, Scab, Downy Mildew",
    },
    {
      icon: Carrot,
      name: "Nightshades & Veggies",
      examples: "Tomato, Potato, Pepper",
      diseases: "Early/Late Blight, Bacterial Spot",
    },
    {
      icon: Trees,
      name: "Cash & Industrial",
      examples: "Cotton, Coffee, Soybean, Tea",
      diseases: "Rust, Leaf Curl, Anthracnose",
    },
  ];

  return (
    <section id="technology" className="py-20 bg-slate-950/60 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modular Enterprise Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Performance AI Stack Staged for Scale
          </h2>
          <p className="text-slate-400 text-base">
            Engineered with a clean decoupling of client, cloud identity, and high-throughput machine learning inference.
          </p>
        </div>

        {/* Architecture Pipeline Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Vite + React UI</h4>
                <p className="text-xs text-slate-400">Current Stage</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ultra-responsive clientside interface crafted with Tailwind CSS. Delivers field agronomists
              instant responsive feedback across handheld smartphones, tablets, and field workstations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Implemented & Fully Operational</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Firebase Identity</h4>
                <p className="text-xs text-slate-400">Current Stage</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cloud-grade Email/Password authentication with JWT token lifecycle management.
              Isolates farmer accounts, inspection records, and diagnostic history with strict privacy.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Integrated via Web Modular SDK</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">FastAPI & PyTorch</h4>
                <p className="text-xs text-teal-400">Upcoming Stage 2</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pre-configured modular Python backend with dedicated folder structure. Ready for
              PyTorch deep vision models, Grad-CAM symptom heatmaps, and batch inference.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Staged in <code className="text-[11px] bg-slate-800 px-1 py-0.5 rounded text-slate-300">/backend</code></span>
            </div>
          </div>
        </div>

        {/* Protected Crops Section */}
        <div id="crops" className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">
              Comprehensive Crop Defense Coverage
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Trained across thousands of labeled foliar pathologies spanning crucial staple and cash crops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cropFamilies.map((fam, idx) => {
              const CropIcon = fam.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                      <CropIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{fam.name}</h4>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="text-slate-400">
                      <span className="text-slate-500 font-medium">Crops: </span>
                      {fam.examples}
                    </div>
                    <div className="text-emerald-300/80">
                      <span className="text-slate-500 font-medium">Targets: </span>
                      {fam.diseases}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TechPreviewSection;
