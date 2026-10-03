import React from "react";
import {
  Eye,
  Brain,
  ShieldCheck,
  Scan,
  Compass,
  Sprout,
  CheckCircle2,
  Droplets,
  Zap,
} from "lucide-react";

const FeaturesSection = () => {
  const pillars = [
    {
      id: "see",
      icon: Eye,
      badge: "Pillar 01",
      title: "See the Disease",
      tagline: "Instant Computer Vision Identification",
      description:
        "Upload or capture leaf images directly in the field. Our neural architecture segments visual lesions, necrotic rings, and discoloration patterns across 45+ crop varieties within milliseconds.",
      bullets: [
        "Sub-millimeter lesion edge segmentation",
        "Multi-pathogen coexistence detection",
        "Works in varied field lighting conditions",
      ],
      color: "from-emerald-500/20 to-teal-500/5",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      accentBg: "bg-emerald-500/10",
    },
    {
      id: "understand",
      icon: Brain,
      badge: "Pillar 02",
      title: "Understand the Cause",
      tagline: "Unravel Environmental & Biological Triggers",
      description:
        "Knowing what is wrong isn't enough. AgriVision AI correlates visual symptoms with microclimate data, spore incubation windows, soil moisture levels, and historical regional outbreaks.",
      bullets: [
        "Fungal vs. bacterial vs. viral etiology",
        "Microclimate & leaf wetness duration correlation",
        "Root cause disease cycle mapping",
      ],
      color: "from-amber-500/20 to-yellow-500/5",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
      accentBg: "bg-amber-500/10",
    },
    {
      id: "protect",
      icon: ShieldCheck,
      badge: "Pillar 03",
      title: "Protect the Crop",
      tagline: "Precision Action Plans to Save Your Harvest",
      description:
        "Receive prioritized, science-backed treatment plans. Minimize chemical fungicide over-application through targeted organic bio-fungicides, canopy pruning, and harvest timing safeguards.",
      bullets: [
        "Organic bio-control & curative pesticide guidance",
        "Dosage schedules to prevent resistance build-up",
        "Yield loss prevention & economic threshold calculation",
      ],
      color: "from-blue-500/20 to-cyan-500/5",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
      accentBg: "bg-blue-500/10",
    },
  ];

  return (
    <section id="pillars" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <Sprout className="w-3.5 h-3.5" />
            <span>The Diagnostic Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on Three Indispensable Pillars
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Every inspection on AgriVision AI follows a comprehensive agronomic reasoning loop
            engineered to keep farmlands fertile, disease-free, and profitable.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`relative rounded-2xl p-8 bg-gradient-to-b ${pillar.color} bg-slate-900/80 border ${pillar.borderColor} glass-card-hover flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-xl ${pillar.accentBg} border border-slate-800`}>
                      <Icon className={`w-7 h-7 ${pillar.iconColor}`} />
                    </div>
                    <span className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{pillar.title}</h3>
                  <div className="text-xs font-semibold text-emerald-400/90 mb-4 tracking-wide">
                    {pillar.tagline}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  {pillar.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${pillar.iconColor}`} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
