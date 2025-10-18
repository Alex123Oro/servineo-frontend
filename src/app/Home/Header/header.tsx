'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Registro from './registro';
import { FiHome, FiBriefcase, FiHelpCircle, FiClipboard } from 'react-icons/fi';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAyudaClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsModalOpen(true);
    } else {
      router.push('/ayuda');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-lg backdrop-blur-md transition-all duration-300 border-b border-gray-100"
        role="banner"
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
              className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
              aria-label="Ir al inicio"
            >
              <div className="relative overflow-hidden rounded-full shadow-md">
                <Image
                  src="/icon.png"
                  alt="Logo de Servineo"
                  width={45}
                  height={45}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Servineo
              </span>
            </button>
          </div>

          <nav className="hidden lg:flex gap-6" role="navigation" aria-label="Menú principal">
            <Link
              href="/servicios"
              className="text-gray-700 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
            >
              Servicios
            </Link>
            <Link
              href="/ofertas"
              className="text-gray-700 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
            >
              Ofertas de trabajo
            </Link>
            <a
              href="/ayuda"
              onClick={handleAyudaClick}
              className="text-gray-700 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
              aria-label="Abrir ayuda"
            >
              Ayuda
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleLogin}
                  className="px-5 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:shadow-sm font-medium"
                  aria-label="Iniciar sesión"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={handleLogin}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5"
                  aria-label="Registrarse"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <button
                className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                aria-label="Ir al perfil"
              >
                Perfil
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Header */}
        <div className="lg:hidden flex flex-col justify-between h-[60px]">
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
              className="flex items-center gap-2 group"
              aria-label="Ir al inicio"
            >
              <div className="relative overflow-hidden rounded-full shadow-md">
                <Image
                  src="/icon.png"
                  alt="Logo de Servineo"
                  width={36}
                  height={36}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Servineo
              </span>
            </button>

            <div className="flex items-center gap-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 font-medium"
                    aria-label="Iniciar sesión"
                  >
                    Iniciar
                  </button>
                  <button
                    onClick={handleLogin}
                    className="px-3 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm font-medium"
                    aria-label="Registrarse"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                <button
                  className="px-3 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm font-medium"
                  aria-label="Ir al perfil"
                >
                  Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet: barra inferior de iconos */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-gray-200 bg-white flex justify-around items-center z-50"
        role="navigation"
        aria-label="Barra inferior de navegación"
      >
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          aria-label="Ir a inicio"
        >
          <FiHome className="text-2xl" />
          <span className="text-xs mt-1">Inicio</span>
        </button>
        <button
          onClick={() => router.push('/servicios')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          aria-label="Ir a servicios"
        >
          <FiBriefcase className="text-2xl" />
          <span className="text-xs mt-1">Servicios</span>
        </button>
        <button
          onClick={() => router.push('/ofertas')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          aria-label="Ir a ofertas"
        >
          <FiClipboard className="text-2xl" />
          <span className="text-xs mt-1">Ofertas</span>
        </button>
        <button
          onClick={handleAyudaClick}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          aria-label="Abrir ayuda"
        >
          <FiHelpCircle className="text-2xl" />
          <span className="text-xs mt-1">Ayuda</span>
        </button>
      </div>

      <Registro isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
