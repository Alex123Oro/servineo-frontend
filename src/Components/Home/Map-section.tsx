'use client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/Mapa/Map'), {
  loading: () => (
    <div className='h-full w-full flex items-center justify-center bg-gray-100 text-gray-500'>
      Cargando mapa...
    </div>
  ),
  ssr: false,
});

export default function MapSection() {
  const t = useTranslations('Map');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className='mb-16 scroll-mt-32'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{t('mapTitle')}</h2>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>{t('mapDescription')}</p>
      </div>

      {/* ✅ ID en el contenedor del mapa */}
      <div
        id='titulo-seccion-mapa'
        className='h-[60vh] w-full bg-gray-100 rounded-xl overflow-hidden relative shadow-sm border border-gray-200'
      >
        {isMounted && <MapComponent />}
      </div>
    </div>
  );
}
