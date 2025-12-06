'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import HeroSection from '@/Components/Home/Hero-section';
import ServicesSection from '@/Components/Home/Services-section';
import HowItWorksSection from '@/Components/Home/HowItWorks-section';
import CTASection from '@/Components/Home/CTA-section';
import InspirationSection from '@/Components/Home/Inspiration-section';
import RecentOffersSection from '@/Components/Home/RecentOffer-secction';
import MapSection from '@/Components/Home/MapSection';
import { IUser } from '@/types/user';

interface RootState {
  user: {
    user: IUser | null;
    loading: boolean;
    isAuthenticated: boolean;
  };
}

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [authReady, setAuthReady] = useState(false);
  const t = useTranslations('home');

  useEffect(() => {
    if (!loading) setAuthReady(true);
  }, [loading]);

  if (!authReady) return null;

  const isFixer = user?.role === 'fixer';

  return (
    <div className='min-h-screen bg-white relative'>
      <div
        id='tour-start-point'
        className='absolute top-0 left-0 w-1 h-1 opacity-0 pointer-events-none'
      />

      {/* Hero cambia según el rol */}
      <HeroSection isFixer={isFixer} />

      <section className={isFixer ? 'bg-white' : 'py-16 px-4 bg-white'}>
        <div className='max-w-7xl mx-auto'>
          {/* Mapa e inspiración solo para requesters */}
          {!isFixer && (
            <>
              {/* ✅ USAR MapSection en lugar del código anterior */}
              <MapSection />

              <InspirationSection />
            </>
          )}
          <RecentOffersSection />
        </div>
      </section>

      <ServicesSection
        showHero={false}
        showAllServices={false}
        showCTA={false}
        title='Servicios Disponibles'
        subtitle='Encuentra el profesional perfecto para cualquier trabajo en tu hogar'
      />

      {!isFixer && (
        <>
          <HowItWorksSection />
          <CTASection />
        </>
      )}
    </div>
  );
}
