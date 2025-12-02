'use client';
import { useEffect, useState } from 'react';
import { useTour } from '@reactour/tour';
import { tourSteps } from './TourSteps';

export function TourLogic() {
  const { setSteps, setIsOpen, setCurrentStep, isOpen } = useTour();
  const [hasStarted, setHasStarted] = useState(false);

  // 1. Configuración inicial y arranque automático
  useEffect(() => {
    // CORRECCIÓN TS(2722): Verificamos que las funciones existan antes de usarlas
    if (!setSteps || !setIsOpen || !setCurrentStep) return;

    // Configurar pasos (Móvil vs Desktop)
    const isMobile = window.innerWidth < 1024;
    const filteredSteps = tourSteps.filter(step => {
      if (isMobile) return step.selector !== '#tour-auth-buttons-desktop';
      return step.selector !== '#tour-auth-buttons-mobile';
    });
    setSteps(filteredSteps);

    // Verificar si ya vio el tour
    const tourVisto = localStorage.getItem('servineoTourVisto');

    // Si NO lo ha visto (o se reinició desde el footer), iniciar automáticamente
    if (!tourVisto) {
      setCurrentStep(0);
      
      // Delay pequeño para asegurar que el sitio cargó visualmente
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasStarted(true); // <--- MOVÍ ESTO AQUÍ: Solo activamos la seguridad cuando REALMENTE abre
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [setSteps, setIsOpen, setCurrentStep]);

  // 2. Guardar "Visto" SOLO cuando se cierra intencionalmente
  useEffect(() => {
    // Solo guardamos si el tour estaba corriendo (hasStarted) y ahora se cerró (!isOpen)
    if (!isOpen && hasStarted) {
       localStorage.setItem('servineoTourVisto', 'true');
       setHasStarted(false);
    }
  }, [isOpen, hasStarted]);

  return null;
}