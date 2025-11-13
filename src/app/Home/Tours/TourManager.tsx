'use client';

import React, { useEffect, useState } from 'react';
import Tour from 'reactour';

interface TourManagerProps {
  restartTrigger?: boolean;
}

const steps = [
  {
    selector: '#buscador-principal',
    content: 'Aquí puedes buscar profesionales por nombre o especialidad.',
  },
  {
    selector: '#carrusel-inspiracion',
    content: 'Aquí verás ideas e inspiración de proyectos realizados.',
  },
  {
    selector: '#mapa',
    content: 'Este mapa te muestra los servicios más cercanos a tu ubicación.',
  },
  {
    selector: '#trabajos-recientes',
    content: 'Aquí puedes explorar los trabajos más recientes hechos por profesionales.',
  },
  {
    selector: '#servicios-disponibles',
    content: 'Finalmente, aquí tienes la lista de servicios disponibles.',
  },
];

export default function TourManager({ restartTrigger }: TourManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Abrir tour automáticamente si no se ha visto
  useEffect(() => {
    const visto = localStorage.getItem('servineoTourVisto');
    if (!visto) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  // Reiniciar tour
  useEffect(() => {
    if (restartTrigger) {
      localStorage.removeItem('servineoTourVisto');
      setIsOpen(true);
    }
  }, [restartTrigger]);

  return (
    <Tour
      steps={steps}
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        localStorage.setItem('servineoTourVisto', 'true');
      }}
      rounded={8}
      showNumber={true}
      showNavigation={true}
    />
  );
}
