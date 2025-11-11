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
    disableBeacon: false, 
  },
  {
    target: '#buscador-principal',
    content: 'Aquí puedes encontrar el servicio que necesitas. Escribe lo que buscas y tu ubicación.',
    title: 'Encuentra un Profesional',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '#carrusel-inspiracion',
    content: 'Inspírate con ideas y proyectos reales realizados por nuestros profesionales expertos.',
    title: 'Inspiración para tu Hogar',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#mapa-interactivo',
    content: 'Mira en tiempo real dónde se encuentran los Fixers (profesionales) disponibles cerca de ti.',
    title: 'Fixers Cerca de Ti',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#trabajos-recientes',
    content: 'Explora los trabajos más recientes que han completado nuestros profesionales.',
    title: 'Trabajos Recientes',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#servicios-disponibles',
    content: 'Navega por todas las categorías de servicios que ofrecemos, desde plomería hasta carpintería.',
    title: 'Nuestros Servicios',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#cta-final',
    content: 'Si no encuentras un servicio específico, puedes solicitar uno personalizado o hablar con un asesor.',
    title: '¿No encuentras lo que buscas?',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#footer-principal',
    content: 'Aquí abajo encontrarás enlaces útiles, información de la empresa y nuestras políticas.',
    title: 'Información Adicional',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '#header-auth',
    content: '¡Listo! Ahora puedes Iniciar Sesión o Registrarte para contratar servicios y gestionar tu perfil.',
    title: '¡Únete a Servineo!',
    placement: 'bottom',
    disableBeacon: true,
  },
];

export const Tour: React.FC<TourProps> = ({ run, onTourEnd }) => {
  const [steps, setSteps] = useState(TOUR_STEPS);

  useEffect(() => {
    const updateStepsForResponsiveness = () => {
      const isMobile = window.innerWidth < 1024;
      const newSteps = [...TOUR_STEPS];
      
      const authStep = newSteps.find(step => step.target === '#header-auth' || step.target === '#header-auth-mobile');
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
      showProgress={false}
      showSkipButton={false}
      scrollOffset={100}
      floaterProps={{
        disableAnimation: false,
      }}
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
        beacon: {
          outer: {
            backgroundColor: 'rgba(43, 106, 224, 0.5)',
          },
          inner: {
            backgroundColor: '#2B6AE0',
          },
        },
      }}
    />
  );
};

export default Tour;