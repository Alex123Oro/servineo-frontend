import React from 'react';
import Link from 'next/link';
import { Home, Search, User, Menu } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      <Link 
        href="/" 
        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-500"
        aria-label="Ir a la página de inicio"
      >
        <Home size={24} />
        <span className="text-xs mt-1">Inicio</span>
      </Link>
      <Link 
        href="/busqueda" 
        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-500"
        aria-label="Ir a la página de búsqueda"
      >
        <Search size={24} />
        <span className="text-xs mt-1">Buscar</span>
      </Link>
      <Link 
        href="/servicios" 
        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-500"
        aria-label="Ver todos los servicios disponibles"
      >
        <Menu size={24} />
        <span className="text-xs mt-1">Servicios</span>
      </Link>
      <Link 
        href="/info" 
        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-500"
        aria-label="Ver información de perfil"
      >
        <User size={24} />
        <span className="text-xs mt-1">Perfil</span>
      </Link>
    </div>
  );
};

export default BottomNav;