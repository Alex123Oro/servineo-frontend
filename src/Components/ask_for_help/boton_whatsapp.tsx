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
      {/* Botón Flotante - MÁS ARRIBA Y TRANSPARENTE */}
      <button
        type="button"
        onClick={handleInitialClick}
        className="fixed z-40 flex items-center justify-center
                   w-14 h-14 md:w-16 md:h-16
                   /* FONDO TRANSPARENTE con borde blanco */
                   bg-white/10 backdrop-blur-md
                   border-2 border-white/30
                   rounded-full 
                   shadow-2xl shadow-black/30
                   transition-all duration-300 
                   hover:scale-110 hover:bg-white/20 hover:border-white/50
                   active:scale-95
                   cursor-pointer
                   /* Desktop: más arriba */
                   bottom-20 right-6
                   /* Tablet: aún más arriba */
                   md:bottom-24 md:right-8
                   /* Mobile: MUCHO MÁS ARRIBA (encima del header bottom) */
                   sm:bottom-36 sm:right-5
                   /* Mobile pequeño: aún más arriba */
                   xs:bottom-40 xs:right-4
                   /* Para teléfonos muy pequeños - AUMENTADO */
                   max-sm:bottom-[10rem] max-sm:right-4"
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
        {/* Glow effect transparente */}
        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
      </button>

      {/* Modal / Overlay del Captcha */}
      {showCaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl relative flex flex-col items-center gap-4 max-w-xs mx-4 border border-white/30">
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