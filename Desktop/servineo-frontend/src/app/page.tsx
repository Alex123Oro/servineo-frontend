"use client";
import HeroSection from "@/Components/Home/Hero-section";
import ServicesSection from "@/Components/Home/Services-section";
import HowItWorksSection from "@/Components/Home/HowItWorks-section";
import CTASection from "@/Components/Home/CTA-section";
import MapSection from "@/Components/Home/Map-section";
import InspirationSection from "@/Components/Home/Inspiration-section";
import RecentOffersSection from "@/Components/Home/RecentOffer-secction";
import { Fixer } from "@/Components/interface/Fixer_Interface";
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/app/Mapa/Map'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div id="tour-map-section">
            {/* Mapa Section */}
      <section id="mapa" className="w-full py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Encuentra Servicios Cerca de Ti
          </h2>
          <Map />
        </div>
      </section>
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