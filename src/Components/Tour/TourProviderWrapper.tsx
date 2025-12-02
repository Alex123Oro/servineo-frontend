"use client";

import { TourProvider } from '@reactour/tour';
import { TourLogic } from './TourLogic';
import { tourSteps } from './TourSteps';
import { PrevBtn, NextBtn } from './CustomTourComponents';

const tourStyles = {
  popover: (base: any) => ({
    ...base,
    borderRadius: 10,
    color: 'black',
  }),
};

export function TourProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider 
      steps={tourSteps} 
      styles={tourStyles}
      prevButton={PrevBtn} 
      nextButton={NextBtn}
    >
      <TourLogic />
      {children}
    </TourProvider>
  );
}