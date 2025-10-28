'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-lg backdrop-blur-md transition-all duration-300 border-b border-gray-100">
      {/* Desktop Header (solo desde lg en adelante) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center">
          <button onClick={scrollToTop} className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105">
            <div className="relative overflow-hidden rounded-full shadow-md">
              <Image src="/icon.png" alt="Servineo Logo" width={45} height={45} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Servineo</span>
          </button>
        </div>
        <nav className="hidden lg:flex gap-6">
          <Link href="/servicios" className="text-gray-700 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            Servicios
          </Link>
          <Link href="/ofertas" className="text-gray-700 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            Ofertas de trabajo
          </Link>
          <Link href="/ayuda" className="text-gray-700 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full">
            Ayuda
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:shadow-sm font-medium">
            Iniciar sesión
          </button>
          <button className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5">
            Registrarse
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Header (hasta lg) */}
      <div className="lg:hidden flex items-center justify-between p-4">
        <button onClick={scrollToTop} className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-full shadow-md">
            <Image src="/icon.png" alt="Servineo Logo" width={36} height={36} className="transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Servineo</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 font-medium">
            Iniciar
          </button>
          <button className="px-3 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md font-medium whitespace-nowrap">
            Registrarse
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;