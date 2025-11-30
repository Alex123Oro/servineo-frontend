'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/Components/Home/Hero-section';
import ServicesSection from '@/Components/Home/Services-section';
import HowItWorksSection from '@/Components/Home/HowItWorks-section';
import CTASection from '@/Components/Home/CTA-section';
import InspirationSection from '@/Components/Home/Inspiration-section';
import RecentOffersSection from '@/Components/Home/RecentOffer-secction';
import RequestsSection from '@/Components/Home/Requests-section';
import dynamic from 'next/dynamic';
import { UserData } from '@/types/user';

const MyOffer = dynamic(() => import('@/Components/Home/MyOffer-section'), {
  ssr: false,
});
const Map = dynamic(() => import('@/app/Mapa/Map'), { ssr: false });

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem('servineo_user');
      if (user && user !== 'undefined') {
        setUserData(JSON.parse(user));
      } else {
        setUserData(null);
      }
    } catch {
      console.error('Usuario inválido en localStorage');
      setUserData(null);
    } finally {
      setAuthReady(true);
    }
  }, []);

  if (!authReady) return null;

  const isFixer = userData?.role === 'fixer';

  return (
    <div className="min-h-screen bg-white relative">
      {/* ANCLA INVISIBLE */}
      <div
        id="tour-start-point"
        className="absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none"
      />

      {/* Hero cambia según el rol */}
      <HeroSection/>

      {/* Sección intermedia: mapa + ofertas / MyOffer */}
      <section className={isFixer ? 'bg-white' : 'py-16 px-4 bg-white'}>
        <div className="max-w-7xl mx-auto">
          {/* Mapa e inspiración solo para usuarios normales */}
          {!isFixer && (
            <>
              <div id="tour-map-section">
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
            </>
          )}

          {/* Ofertas recientes o MyOffer según rol */}
          <div id="tour-recent-offers">{isFixer ? <MyOffer /> : <RecentOffersSection />}</div>
        </div>
      </section>

      {/* Para usuarios normales: Servicios.
          Para fixers: Solicitudes de trabajo */}
      <div id="tour-services-section">
        {isFixer ? (
          <RequestsSection />
        ) : (
          <ServicesSection
          />
        )}
      </div>

      {/* Solo se muestran estas secciones para usuarios normales */}
      {!isFixer && (
        <>
          <div id="tour-how-it-works">
            <HowItWorksSection />
          </div>

          <div id="tour-cta-section">
            <CTASection />
          </div>
        </>
      )}
    </div>
  );
}
