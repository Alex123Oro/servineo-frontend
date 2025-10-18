'use client';
import React from 'react';

interface RegistroProps {
  isOpen: boolean;
  onClose: () => void;
}

const Registro: React.FC<RegistroProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4" // contenedor centrado
    >
      <div className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg p-6 md:p-8 rounded-2xl shadow-lg relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition text-lg font-bold"
          aria-label="Cerrar"
        >
          X
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-3">Bienvenido a Servineo</h2>
        <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
          Para acceder a la opción <span className="font-semibold text-blue-700">"Ayuda"</span>,
          inicia sesión o crea una cuenta.
        </p>

        <input
          type="email"
          placeholder="Tu correo electrónico"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        />

        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-colors duration-300 text-sm md:text-base font-medium">
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Registro;
