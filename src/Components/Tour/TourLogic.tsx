'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTour } from '@reactour/tour';
import { tourSteps } from './TourSteps';

export function TourLogic() {
  const pathname = usePathname();
  const { setSteps, setIsOpen, setCurrentStep, isOpen } = useTour();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Asegurar que las funciones del contexto estén disponibles
    if (!setSteps || !setIsOpen || !setCurrentStep) return;

    // Filtrar pasos según dispositivo
    const isMobile = window.innerWidth < 1024;
    const filteredSteps = tourSteps.filter((step) => {
      if (isMobile) return step.selector !== '#tour-auth-buttons-desktop';
      return step.selector !== '#tour-auth-buttons-mobile';
    });

    setSteps(filteredSteps);

    // IMPORTANTE: Solo iniciar el tour si estamos en la página principal
    const isHomePage = pathname === '/' || pathname === '/es' || pathname === '/en';

    if (!isHomePage) {
      // Si no estamos en el home, no iniciar el tour
      return;
    }

    // Lógica de inicio
    const tourVisto =
      typeof window !== 'undefined' ? localStorage.getItem('servineoTourVisto') : null;
    const urlParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

    // Mostrar el tour solo si estamos en home y NO se ha visto antes, a menos que
    // se solicite explícitamente via ?tour=1 (para volver a verlo).
    const shouldForce = urlParams.get('tour') === '1';

    if (!tourVisto || shouldForce) {
      setCurrentStep(0);

      // Esperar a que la UI termine de montarse
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasStarted(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [setSteps, setIsOpen, setCurrentStep, pathname]);

  // Guardar que se vio SOLO al cerrar el tour voluntariamente
  useEffect(() => {
    if (!isOpen && hasStarted) {
      // Guardar que el usuario vio el tour para que no se vuelva a mostrar automáticamente
      try {
        localStorage.setItem('servineoTourVisto', 'true');
      } catch (e) {
        // si localStorage no está disponible, no hacemos nada
      }
      setHasStarted(false);
    }
  }, [isOpen, hasStarted]);

  return null;
}
