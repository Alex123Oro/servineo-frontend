"use client";

import FooterSection from "@/Components/Home/Footer-section";

export function ClientFooter() {
  const handleRestartTour = () => {
    localStorage.removeItem('servineoTourVisto');
    window.location.reload();
  };

  return (
    <div id="footer-principal">
      <FooterSection onRestartTour={handleRestartTour} />
    </div>
  );
}