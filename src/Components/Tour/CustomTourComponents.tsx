'use client';
import React from 'react';

interface NextBtnProps {
  currentStep: number;
  stepsLength: number;
  setCurrentStep?: (updater: (step: number) => number) => void;
  setIsOpen?: (isOpen: boolean) => void;
  steps?: unknown[];
}

export const NextBtn = ({ ...props }: NextBtnProps) => {
  const isLastStep = props.currentStep === props.stepsLength - 1;

  // NUEVO: Si es el paso 0 (Bienvenida), ocultamos el botón "Siguiente" estándar
  if (props.currentStep === 0) return null; 

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // ... (resto de tu lógica igual que antes)
    e.preventDefault();
    e.stopPropagation();
    if (props.setCurrentStep && props.steps) {
        if (isLastStep) {
            if (props.setIsOpen) {
              props.setIsOpen(false);
            }
            localStorage.setItem('servineoTourVisto', 'true');
        } else {
            props.setCurrentStep((s: number) => s + 1);
        }
    }
  };

  return (
    <button 
        onClick={handleClick}
        type="button"
        // ... (mismos estilos que tenías)
        style={{
            backgroundColor: '#2B6AE0',
            color: 'white',
            fontWeight: '700',
            padding: '12px 28px',
            borderRadius: '10px',
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000001,
            boxShadow: '0 4px 12px rgba(43, 106, 224, 0.3)',
        }}
        // ... (resto de estilos hover)
    >
      {isLastStep ? 'Finalizar' : 'Siguiente'}
    </button>
  );
};

interface PrevBtnProps {
  currentStep: number;
  setCurrentStep?: (updater: (step: number) => number) => void;
}

export const PrevBtn = ({ ...props }: PrevBtnProps) => {
  // YA TENÍAS ESTO: Si es paso 0, no mostrar "Anterior"
  if (props.currentStep === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // ... (resto de tu lógica igual)
      e.preventDefault();
      e.stopPropagation();
      if (props.setCurrentStep) {
          props.setCurrentStep((s: number) => s - 1);
      }
  };

  return (
    <button
      onClick={handleClick}
        // ... (mismos estilos y lógica)
        style={{
            color: '#666',
            fontWeight: '600',
            fontSize: '15px',
            padding: '12px 20px',
            border: '2px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: '10px',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 1000001,
        }}
        // ...
    >
      Anterior
    </button>
  );
};