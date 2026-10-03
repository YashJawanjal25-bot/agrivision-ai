import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TechPreviewSection from "../components/landing/TechPreviewSection";
import CTASection from "../components/landing/CTASection";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TechPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
