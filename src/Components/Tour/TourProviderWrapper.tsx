/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { TourProvider } from '@reactour/tour';
import { TourLogic } from './TourLogic';
import { tourSteps } from './TourSteps';
import { PrevBtn, NextBtn } from './CustomTourComponents';

const tourStyles = {
  popover: (base: any, state: any) => ({
    ...base,
    borderRadius: '16px',
    padding: state.current === 0 ? '20px' : '18px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    maxWidth: state.current === 0 ? '480px' : '420px',
    minWidth: '320px',
    zIndex: 100000,
    backgroundColor: '#ffffff',
    color: '#333',
    fontSize: '15px',
    textAlign: 'center', // CENTRAR TODO EL TEXTO
  }),
  maskArea: (base: any) => ({
    ...base,
    rx: 12,
    fill: 'rgba(0, 0, 0, 0.3)',
  }),
  maskWrapper: (base: any) => ({
    ...base,
    color: 'rgba(0, 0, 0, 0.3)',
  }),
  badge: (base: any) => ({
    ...base,
    display: 'none',
  }),
  controls: (base: any, state: any) => ({
    ...base,
    marginTop: state.current === 0 ? '0px' : '20px',
    display: 'flex',
    justifyContent: state.current === 0 ? 'center' : 'space-between', // Centrar en paso 0
    alignItems: 'center',
    gap: '12px',
  }),
  navigation: (base: any, state: any) => ({
    ...base,
    display: state.current === 0 ? 'none' : 'flex', // OCULTAR NAVEGACIÓN EN PASO 0
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: '0 12px',
  }),
  dot: (base: any, state: any) => ({
    ...base,
    display: 'block', // Ya se oculta con navigation
    width: '7px',
    height: '7px',
    margin: '0 3px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: state.current ? '#2B6AE0' : '#e2e8f0',
    transform: state.current ? 'scale(1.2)' : 'scale(1)',
    transition: 'all 0.3s ease',
    boxShadow: 'none',
    cursor: 'pointer',
    padding: 0,
  }),
  close: (base: any) => ({
    ...base,
    right: 12,
    top: 12,
    color: '#999',
    width: '14px',
    height: '14px',
  }),
};

export function TourProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider
      steps={tourSteps}
      styles={tourStyles}
      prevButton={PrevBtn}
      nextButton={NextBtn}
      showBadge={false}
      showDots={true}
      scrollSmooth={true}
      padding={{ mask: 10, popover: [5, 10] }}
      disableInteraction={true}
    >
      <TourLogic />
      {children}
    </TourProvider>
  );
}
