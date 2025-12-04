'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';
import ErrorMessage from './ErrorMessage';

const BotonWhatsapp = () => {
  const [showError, setShowError] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const numerowhapi = '59178194834';
  const mensaje = '';
  const encodedMessage = encodeURIComponent(mensaje);
  const whatsappUrl = `https://wa.me/${numerowhapi}?text=${encodedMessage}`;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const handleInitialClick = () => {
    if (navigator.onLine) {
      setShowCaptcha(true);
    } else {
      setShowError(true);
    }
  };

  const handleCaptchaChange = async (token: string | null) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/verify-captcha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          setShowCaptcha(false);
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 1000);
      } else {
        alert('Verificación fallida. Las claves no coinciden o el token expiró.');
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error('Error conectando con el backend:', error);
      setShowError(true);
      setShowCaptcha(false);
    }
  };

  return (
    <>
      {/* Botón Flotante - MÁS ABAJO y SIN TRANSPARENCIA */}
      <button
        type="button"
        onClick={handleInitialClick}
        className="fixed z-40 flex items-center justify-center
                   w-14 h-14 md:w-16 md:h-16
                   /* SIN TRANSPARENCIA - FONDO SÓLIDO WHATSAPP */
                   bg-[#25D366] hover:bg-[#1DA851]
                   rounded-full 
                   shadow-2xl shadow-[#25D366]/50
                   transition-all duration-300 
                   hover:scale-110 hover:shadow-[#25D366]/70
                   active:scale-95
                   cursor-pointer
                   /* Desktop: más abajo para no chocar */
                   bottom-12 right-6
                   /* Tablet: más abajo */
                   md:bottom-14 md:right-8
                   /* Mobile: AÚN MÁS ABAJO - ajustado */
                   sm:bottom-20 sm:right-5
                   /* Mobile pequeño: más abajo */
                   xs:bottom-24 xs:right-4
                   /* Para teléfonos muy pequeños */
                   max-sm:bottom-[5.5rem] max-sm:right-4"
        aria-label="Contactar por WhatsApp"
      >
        <Image
          src="https://drive.google.com/uc?export=view&id=1jmTcbSdFJdlMmUPZj3bUwahLGTZIdPI4"
          alt="Logo de WhatsApp"
          width={56}
          height={56}
          className="p-3 md:p-4"
          priority
        />
        {/* Glow effect color WhatsApp */}
        <div className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-pulse"></div>
        
        {/* Indicador de notificación (opcional) */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
      </button>

      {/* Modal / Overlay del Captcha */}
      {showCaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl relative flex flex-col items-center gap-4 max-w-xs mx-4">
            <h3 className="text-lg font-semibold text-gray-800">Verificación de seguridad</h3>
            <p className="text-sm text-gray-600 mb-2 text-center">
              Confirma que eres humano para continuar.
            </p>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
              onChange={handleCaptchaChange}
              size="normal"
            />

            {/* Botón para cerrar */}
            <button
              onClick={() => setShowCaptcha(false)}
              className="text-gray-500 hover:text-gray-700 text-sm mt-2 underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showError && (
        <ErrorMessage
          message="Hubo un problema de conexión. Intenta más tarde."
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
};

export default BotonWhatsapp;