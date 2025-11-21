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
    const isMobile = window.innerWidth < 1024;
    
    const filteredSteps = tourSteps.filter(step => {
      if (isMobile) {
        return step.selector !== '#tour-auth-buttons-desktop';
      }
      return step.selector !== '#tour-auth-buttons-mobile';
    });

    setSteps(filteredSteps);
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'auto' });
    setIsOpen(true);
  };

  useEffect(() => {
    const tourVisto = localStorage.getItem('servineoTourVisto');
    if (!tourVisto) {
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen && localStorage.getItem('servineoTourVisto') !== 'true') {
      localStorage.setItem('servineoTourVisto', 'true');
    }
  }, [isOpen]);

  return null;
}
