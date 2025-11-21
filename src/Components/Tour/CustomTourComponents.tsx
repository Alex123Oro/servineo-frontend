'use client';
import React from 'react';

interface TourBtnProps {
  currentStep: number;
  stepsLength?: number;
  steps?: unknown[];
  setCurrentStep?: (cb: (s: number) => number) => void;
  setIsOpen?: (value: boolean) => void;
}

export const NextBtn = (props: TourBtnProps) => {
  const isLastStep = props.currentStep === (props.stepsLength ?? 0) - 1;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.setCurrentStep && props.steps) {
      if (isLastStep) {
        props.setIsOpen?.(false);
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
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1e4bbd';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(43, 106, 224, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#2B6AE0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 106, 224, 0.3)';
      }}
    >
      {isLastStep ? 'Finalizar' : 'Siguiente'}
    </button>
  );
};

export const PrevBtn = (props: TourBtnProps) => {
  if (props.currentStep === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    props.setCurrentStep?.((s: number) => s - 1);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
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
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5f5f5';
        e.currentTarget.style.color = '#2B6AE0';
        e.currentTarget.style.borderColor = '#e0e0e0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#666';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      Anterior
    </button>
  );
};
