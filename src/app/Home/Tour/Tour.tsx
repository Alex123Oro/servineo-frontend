"use client";
import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface TourProps {
  run: boolean;
  onTourEnd: (data: CallBackProps) => void;
}

const TOUR_STEPS: Step[] = [
  {
    target: 'body',
    content: '¡Bienvenido a Servineo! Te mostraremos rápidamente cómo funciona la plataforma.',
    placement: 'center',
    title: '¡Hola!',
  },
  {
    target: '#buscador-principal',
    content: 'Aquí puedes encontrar el servicio que necesitas. Escribe lo que buscas y tu ubicación.',
    title: 'Encuentra un Profesional',
    placement: 'bottom',
  },
  {
    target: '#servicios-disponibles',
    content: 'Explora todas las categorías de servicios que ofrecemos, desde plomería hasta carpintería.',
    title: 'Nuestros Servicios',
    placement: 'top',
  },
  {
    target: '#mapa-interactivo',
    content: 'Mira en tiempo real dónde se encuentran los Fixers (profesionales) disponibles cerca de ti.',
    title: 'Fixers Cerca de Ti',
    placement: 'top',
  },
  {
    target: '#trabajos-recientes',
    content: 'Inspírate viendo los trabajos más recientes que han completado nuestros profesionales.',
    title: 'Trabajos Recientes',
    placement: 'top',
  },
  {
    target: '#header-auth',
    content: 'Finalmente, desde aquí puedes Iniciar Sesión o Registrarte para contratar servicios y gestionar tu perfil.',
    title: '¡Únete a Servineo!',
    placement: 'bottom',
  },
];

export const Tour: React.FC<TourProps> = ({ run, onTourEnd }) => {
  const [steps, setSteps] = useState(TOUR_STEPS);

  useEffect(() => {
    const updateStepsForResponsiveness = () => {
      const isMobile = window.innerWidth < 1024;
      const newSteps = [...TOUR_STEPS];
      
      const authStep = newSteps.find(step => step.target === '#header-auth');
      if (authStep) {
        if (isMobile) {
          authStep.target = '#header-auth-mobile';
          authStep.placement = 'bottom-end';
        } else {
          authStep.target = '#header-auth';
          authStep.placement = 'bottom-end';
        }
      }
      setSteps(newSteps);
    };

    updateStepsForResponsiveness();
    window.addEventListener('resize', updateStepsForResponsiveness);
    
    return () => window.removeEventListener('resize', updateStepsForResponsiveness);
  }, []);

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={onTourEnd}
      continuous
      showProgress
      showSkipButton
      locale={{
        back: 'Anterior',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar Tour',
      }}
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          primaryColor: '#2B6AE0',
          textColor: '#171717',
          zIndex: 1000,
          borderRadius: '12px',
        },
        tooltip: {
          fontFamily: 'var(--font-roboto), sans-serif',
          borderRadius: '12px',
          padding: '16px 20px',
        },
        tooltipContent: {
          padding: '12px 0 0 0',
        },
        tooltipTitle: {
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: '700',
          fontSize: '20px',
        },
        buttonNext: {
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: '700',
          borderRadius: '8px',
          fontSize: '14px',
          padding: '10px 15px',
        },
        buttonBack: {
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: '700',
          fontSize: '14px',
          color: '#555',
        },
        buttonSkip: {
          fontFamily: 'var(--font-roboto), sans-serif',
          fontSize: '14px',
          color: '#555',
        },
      }}
    />
  );
};

export default Tour;