'use client';

import { useState } from 'react';
import TourManager from './Home/Tours/TourManager';
import Footer from './Home/Footer/Footer';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [restartTour, setRestartTour] = useState(false);

  const handleRestartTour = () => {
    localStorage.removeItem('servineoTourVisto');
    setRestartTour(true);
    setTimeout(() => setRestartTour(false), 100);
  };

  return (
    <>
      <TourManager restartTrigger={restartTour} />
      {children}
      <Footer onRestartTour={handleRestartTour} />
    </>
  );
}
