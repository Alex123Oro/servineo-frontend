'use client';

import React, { FormEvent, useEffect, useState } from 'react';

type BuscadorProps = {
  value?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
};

export default function Buscador({
  value = '',
  placeholder = '¿Qué servicio necesitas?',
  buttonText = 'Buscar',
  className = '',
  onChange,
  onSubmit,
  autoFocus = false,
  disabled = false,
}: BuscadorProps) {
  const [internal, setInternal] = useState(value);
  useEffect(() => setInternal(value), [value]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(internal.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscador de servicios"
      className={[
        'relative mx-auto flex items-center rounded-xl border',
        'w-full max-w-[680px] md:max-w-[720px] lg:max-w-[1000px]',
        'border-gray-200 bg-white shadow-xl',
        'px-4 py-3',
        'flex-nowrap', // Cambiado: evitar wrap para que el icono no baje en móvil
        'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200',
        'transition-shadow duration-300 hover:shadow-2xl',
        className,
      ].join(' ')}
    >
      <span className="ml-2 mr-2 flex shrink-0 items-center">
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          aria-hidden="true"
          className="fill-blue-600 flex-shrink-0"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
        </svg>
      </span>

      <input
        type="text"
        value={internal}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label={placeholder}
        className={[
          'flex-1 min-w-0 bg-transparent outline-none', // Añadido min-w-0 para que el input pueda encogerse sin forzar salto de línea
          'h-12 sm:h-14 px-2 sm:px-4',
          'text-[16px] sm:text-lg text-gray-900 placeholder:text-gray-700 font-medium',
          'disabled:opacity-60',
          'transition-colors duration-300',
        ].join(' ')}
      />

      <div className="hidden lg:block border-l border-gray-300 h-8 mx-3"></div>

      <span className="hidden lg:inline-flex ml-2 mr-2 shrink-0 items-center">
        <svg 
          viewBox="0 0 24 24" 
          width="22" 
          height="22" 
          aria-hidden="true" 
          className="fill-blue-600">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </span>

      <input
        type="text"
        placeholder="Ubicación"
        aria-label="Ubicación"
        className={[
          'hidden lg:flex flex-1 min-w-0 bg-transparent outline-none', // Añadido min-w-0 para evitar que este input obligue al wrapping en pantallas pequeñas
          'h-12 sm:h-14 px-2 sm:px-4',
          'text-lg text-gray-900 placeholder:text-gray-500 font-medium',
          'disabled:opacity-60',
        ].join(' ')}
      />

      <button
        type="submit"
        disabled={disabled}
        className={[
          'flex items-center justify-center h-11 w-11 sm:h-12 sm:w-auto sm:px-6 lg:px-8 rounded-full font-medium',
          'bg-blue-600 text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'shadow-md transition-all duration-300',
          'ml-2'
        ].join(' ')}
      >
        <span className="sm:hidden">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              className="fill-white"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
            </svg>
        </span>
        <span className="hidden sm:block">{buttonText}</span>
      </button>
    </form>
  );
}
