'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { initUserProfileLogic } from '@/app/Home/UserProfile/userProfileLogic';
import '@/app/Home/UserProfile/userProfile.css';
import { mockUser } from '@/app/Home/UserProfile/UI/mockUser';

declare global {
  interface Window {
    login?: () => void;
    logout?: () => void;
    toggleMenu?: (e?: any) => void;
    closeMenu?: () => void;
    goToProfile?: () => void;
    openEdit?: () => void;
    convertFixer?: () => void;
    closeProfileModal?: () => void;
    saveProfile?: () => void;
    savePasswordChange?: () => void;
    togglePasswordVisibility?: (inputId: string, btn?: any) => void;
    cancelPasswordChange?: () => void;
    togglePasswordChange?: () => void;
    isAuthenticated?: boolean;
    userProfile?: any;
  }
}

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(mockUser);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof initUserProfileLogic === 'function') {
        initUserProfileLogic();
    }

    const win = window as any;

    win.login = () => {
      
      win.userProfile = mockUser;
      win.isAuthenticated = true;
      setUser(mockUser);
      setIsAuthenticated(true);
    };
  
    win.logout = () => {
      win.userProfile = null;
      win.isAuthenticated = false;
      setUser(mockUser);
      setIsAuthenticated(false);
    };
  

    win.toggleMenu = (e?: any) => {
      e?.stopPropagation?.();
      setIsMenuOpen((prev) => !prev);
    };
    win.closeMenu = () => setIsMenuOpen(false);

const handleLogoutEvent = () => {
      setIsAuthenticated(false);
      setUser(mockUser);
      setIsMenuOpen(false);
    };

    window.addEventListener('booka-logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('booka-logout', handleLogoutEvent);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        iconRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isMenuOpen]);

   
   const onLogout = () => {
    console.log('👋 Clic en cerrar sesión');
    window.closeMenu?.();
    setIsAuthenticated(false); 
    setTimeout(() => window.logout?.(), 150);
  };


  const onGoToProfile = () => {
    window.closeMenu?.();
    setTimeout(() => window.goToProfile?.(), 150);
  };

  const onOpenEdit = () => {
    window.closeMenu?.();
    setTimeout(() => window.openEdit?.(), 150);
  };

  const onConvertFixer = () => {
    window.closeMenu?.();
    setTimeout(() => window.convertFixer?.(), 150);
  };

  

console.log('Render Header, isAuthenticated =', isAuthenticated);


  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-lg backdrop-blur-md transition-all duration-300 border-b border-gray-100">
      <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center">
          <button onClick={scrollToTop} className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105">
            <div className="relative overflow-hidden rounded-full shadow-md">
              <Image src="/icon.png" alt="Servineo Logo" width={45} height={45} className="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Servineo
            </span>
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
          {!isAuthenticated ? (
            <>
              <button
                id="loginBtn"
                onClick={() => window.login?.()}
                className="px-5 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:shadow-sm font-medium"
              >
                Iniciar sesión
              </button>
              <button
                id="registerBtn"
                onClick={() => window.login?.()}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5"
              >
                Registrarse
              </button>
            </>
          ) : (
            <img
              ref={iconRef}
              id="profileIcon"
              src={user.photo}
              alt="Foto de perfil"
              className="profile-icon cursor-pointer"
              onClick={(e) => window.toggleMenu?.(e)}
            />
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4">
        <button onClick={scrollToTop} className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-full shadow-md">
            <Image src="/icon.png" alt="Servineo Logo" width={36} height={36} className="transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Servineo</span>
        </button>

        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.login?.()}
              className="px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 font-medium"
            >
              Iniciar
            </button>
            <button
              onClick={() => window.login?.()}
              className="px-3 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md font-medium whitespace-nowrap"
            >
              Registrarse
            </button>
          </div>
        ) : (
          <img
            ref={iconRef}
            id="profileIcon"
            src={user.photo}
            alt="Foto de perfil"
            className="profile-icon cursor-pointer"
            onClick={(e) => window.toggleMenu?.(e)}
          />
        )}
      </div>

      <div id="authButtons" style={{ display: 'none' }}></div>

      {/* Menú de perfil */}
      <div
        id="profileMenu"
        ref={menuRef}
        className={`profile-menu ${isMenuOpen ? 'show' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="menu-header">
          <span>Perfil</span>
          <span className="close-btn" onClick={() => window.closeMenu?.()}>×</span>
        </div>
        <img id="menuPhoto" className="profile-preview" src={user.photo} alt="Foto" />
        <p id="menuName" className="font-medium">{user.name}</p>
        <p id="menuEmail" className="text-gray-500 text-sm mb-2">{user.email}</p>

        <div className="menu-item" onClick={onGoToProfile}>Ver perfil</div>
        <div className="menu-item" onClick={onOpenEdit}>Editar perfil</div>
        <div id="convertFixer" className="menu-item" onClick={onConvertFixer}>Convertirse en Fixer</div>
        <div id="logoutBtn" className="menu-item" onClick={onLogout}>Cerrar sesión</div>
      </div>
    </header>
  );
};

export default Header;
