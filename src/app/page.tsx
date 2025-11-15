"use client";
import HeroSection from "@/Components/Home/Hero-section";
import ServicesSection from "@/Components/Home/Services-section";
import HowItWorksSection from "@/Components/Home/HowItWorks-section";
import CTASection from "@/Components/Home/CTA-section";
import MapSection from "@/Components/Home/Map-section";
import InspirationSection from "@/Components/Home/Inspiration-section";
import RecentOffersSection from "@/Components/Home/RecentOffer-secction";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div id="tour-map-section">
            <MapSection />
          </div>
          <div id="tour-inspiration-section">
            <InspirationSection />
          </div>
          <div id="tour-recent-offers">
            <RecentOffersSection />
          </div>
        </div>
      </section>
      <div id="tour-services-section">
        <ServicesSection 
          showHero={false}
          showAllServices={false}
          showCTA={false}
          title="Servicios Disponibles"
          subtitle="Encuentra el profesional perfecto para cualquier trabajo en tu hogar"
        />
      </div>
      <div id="tour-how-it-works">
        <HowItWorksSection />
      </div>
      <div id="tour-cta-section">
        <CTASection />
      </div>
    </div>
  );
}