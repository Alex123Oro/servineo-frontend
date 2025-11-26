'use client';
import { useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { tourSteps } from './TourSteps';

export function TourLogic() {
  const { setSteps, setIsOpen, setCurrentStep, isOpen } = useTour() as {
    setSteps: (steps: import("@reactour/tour").StepType[]) => void;
    setIsOpen: (open: boolean) => void;
    setCurrentStep: (index: number) => void;
    isOpen: boolean;
  };

  const startTour = () => {
    // 1. Configurar pasos
    const isMobile = window.innerWidth < 1024;
    const filteredSteps = tourSteps.filter(step => {
      if (isMobile) {
        return step.selector !== '#tour-auth-buttons-desktop';
      }
      return step.selector !== '#tour-auth-buttons-mobile';
    });
    setSteps(filteredSteps);
    
    // 2. Cerrar tour (por si acaso estaba abierto) y reiniciar paso
    setIsOpen(false);
    setCurrentStep(0);

    // 3. Forzar scroll al inicio INMEDIATO
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // 4. Esperar medio segundo para asegurar que el navegador terminó de renderizar arriba
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  useEffect(() => {
    // Lógica inicial (al cargar la página)
    const tourVisto = localStorage.getItem('servineoTourVisto');
    if (!tourVisto) {
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Lógica para reiniciar desde el footer
    const handleRestart = () => {
      localStorage.removeItem('servineoTourVisto');
      startTour();
    };

    window.addEventListener('restart-tour', handleRestart);
    return () => {
      window.removeEventListener('restart-tour', handleRestart);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOpen && localStorage.getItem('servineoTourVisto') !== 'true') {
      localStorage.setItem('servineoTourVisto', 'true');
    }
  }, [isOpen]);

  return null;
}