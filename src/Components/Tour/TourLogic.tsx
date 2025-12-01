'use client';
import { useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { tourSteps } from './TourSteps';
import { usePathname } from 'next/navigation';

export function TourLogic() {
  const { setSteps, setIsOpen, setCurrentStep, isOpen } = useTour() as {
    setSteps: (steps: import("@reactour/tour").StepType[]) => void;
    setIsOpen: (open: boolean) => void;
    setCurrentStep: (index: number) => void;
    isOpen: boolean;
  };
  const pathname = usePathname();

  const startTour = () => {
    // 1. Configurar pasos según dispositivo
    const isMobile = window.innerWidth < 1024;
    const filteredSteps = tourSteps.filter(step => {
      if (isMobile) {
        return step.selector !== '#tour-auth-buttons-desktop';
      }
      return step.selector !== '#tour-auth-buttons-mobile';
    });
    setSteps(filteredSteps);
    
    // 2. Reiniciar estado del tour
    setIsOpen(false);
    setCurrentStep(0);

    // 3. Forzar scroll al inicio
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // 4. Abrir tour con pequeño delay para asegurar renderizado
    setTimeout(() => {
      setIsOpen(true);
    }, 500);
  };

  // Escuchar cambios de ruta para detectar regreso al home o reinicio forzado
  useEffect(() => {
    const checkAndStartTour = () => {
      // Verificamos si estamos en el home buscando el elemento ancla
      // Esto es más seguro que checkear el pathname por temas de internacionalización (/es, /en)
      const isHomePage = document.getElementById('tour-start-point');
      
      if (!isHomePage) return;

      const forceRestart = localStorage.getItem('servineo_force_restart');
      const tourVisto = localStorage.getItem('servineoTourVisto');

      // Caso 1: Reinicio forzado desde el footer (viniendo de otra página)
      if (forceRestart === 'true') {
        localStorage.removeItem('servineo_force_restart');
        localStorage.removeItem('servineoTourVisto');
        setTimeout(() => startTour(), 500);
      } 
      // Caso 2: Primera visita natural
      else if (!tourVisto) {
        setTimeout(() => startTour(), 1500);
      }
    };

    checkAndStartTour();
  }, [pathname]);

  // Listener para reinicio manual dentro de la misma página
  useEffect(() => {
    const handleRestartEvent = () => {
      localStorage.removeItem('servineoTourVisto');
      startTour();
    };
    window.addEventListener('restart-tour', handleRestartEvent);
    return () => {
      window.removeEventListener('restart-tour', handleRestartEvent);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marcar como visto cuando se cierra
  useEffect(() => {
    if (!isOpen && localStorage.getItem('servineoTourVisto') !== 'true') {
       // Solo marcamos como visto si el tour se abrió alguna vez en esta sesión
       // Esto evita marcarlo prematuramente
       const hasStarted = document.querySelector('.reactour__popover'); 
       if(hasStarted) {
         localStorage.setItem('servineoTourVisto', 'true');
       }
    }
  }, [isOpen]);

  return null;
}