'use client';

import React, { useEffect } from 'react';
import { useTour } from '@reactour/tour';

interface TourManagerProps {
  restartTrigger?: boolean;
}

export default function TourManager({ restartTrigger }: TourManagerProps) {
  const { setIsOpen } = useTour();

  // Abrir el tour automáticamente si no se ha visto
  useEffect(() => {
    const visto = typeof window !== 'undefined' && localStorage.getItem('servineoTourVisto');
    if (!visto) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [setIsOpen]);

  // Reiniciar tour cuando se solicita desde el footer u otros lugares
  useEffect(() => {
    if (restartTrigger) {
      localStorage.removeItem('servineoTourVisto');
      setIsOpen(true);
    }
  }, [restartTrigger, setIsOpen]);

  return null;
}
