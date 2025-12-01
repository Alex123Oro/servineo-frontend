'use client';
import { useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { tourSteps } from './TourSteps';

export function TourLogic() {
  const { setSteps, setIsOpen, setCurrentStep, isOpen, currentStep } = useTour() as {
    setSteps: (steps: import("@reactour/tour").StepType[]) => void;
    setIsOpen: (open: boolean) => void;
    setCurrentStep: (index: number) => void;
    isOpen: boolean;
    currentStep?: number;
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

  // Scroll automático al carrusel en el paso "Inspírate"
  useEffect(() => {
    if (!isOpen) return;
    if (typeof currentStep !== 'number') return;

    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    const filteredSteps = tourSteps.filter(step => {
      if (isMobile) return step.selector !== '#tour-auth-buttons-desktop';
      return step.selector !== '#tour-auth-buttons-mobile';
    });

    const inspirationIndex = filteredSteps.findIndex(s => s.selector === '#tour-inspiration-section');
    if (inspirationIndex === -1) return;

    if (currentStep === inspirationIndex) {
      const el = document.getElementById('tour-inspiration-section');
      if (el) {
        const isSmall = typeof window !== 'undefined' ? window.innerWidth <= 480 : false;
        // En pantallas pequeñas, alineamos el elemento al final (bottom) para dejar espacio arriba
        const block: ScrollLogicalPosition = isSmall ? 'end' : 'center';
        el.scrollIntoView({ behavior: 'smooth', block });
      }
    }
  }, [isOpen, currentStep]);

  return null;
}