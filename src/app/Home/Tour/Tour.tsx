"use client";
import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface TourProps {
  run: boolean;
  onTourEnd: (data: CallBackProps) => void;
}

export const Tour: React.FC<TourProps> = ({ run, onTourEnd }) => {

  const steps: Step[] = [
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
        },
        tooltip: {
          fontFamily: 'var(--font-roboto), sans-serif',
          borderRadius: '12px',
        },
        buttonNext: {
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: '700',
        },
        buttonBack: {
          fontFamily: 'var(--font-roboto), sans-serif',
          fontWeight: '700',
        },
      }}
    />
  );
};

export default Tour;