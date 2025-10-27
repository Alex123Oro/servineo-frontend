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
        'relative mx-auto flex items-center rounded-full border',
        'w-[92vw] max-w-[1000px]',
        'border-gray-300 bg-white shadow-lg',
        'px-4 py-3',
        'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200',
        className,
      ].join(' ')}
    >
      <span className="ml-2 mr-2 inline-flex shrink-0 items-center opacity-70">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
          className="fill-gray-600"
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
          'flex-1 bg-transparent outline-none',
          'h-12 sm:h-14 px-2 sm:px-4',
          'text-lg text-gray-900 placeholder:text-gray-500',
          'disabled:opacity-60',
        ].join(' ')}
      />

      <div className="border-l border-gray-300 h-6 mx-2"></div>

      <span className="ml-2 mr-2 inline-flex shrink-0 items-center opacity-70">
        <svg 
          viewBox="0 0 24 24" 
          width="18" 
          height="18" 
          aria-hidden="true" 
          className="fill-gray-600">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </span>

      <input
        type="text"
        placeholder="Ubicación"
        aria-label="Ubicación"
        className={[
          'flex-1 bg-transparent outline-none',
          'h-12 sm:h-14 px-2 sm:px-4',
          'text-lg text-gray-900 placeholder:text-gray-500',
          'disabled:opacity-60',
        ].join(' ')}
      />

      <button
        type="submit"
        disabled={disabled}
        className={[
          'mr-1 h-11 sm:h-12 rounded-full px-6 font-semibold',
          'bg-blue-600 text-white hover:bg-blue-700 active:translate-y-[1px]',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          'transition-colors duration-150',
        ].join(' ')}
      >
        {buttonText}
      </button>
    </form>
  );
}
