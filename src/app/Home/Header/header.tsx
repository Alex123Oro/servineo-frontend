'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiTool, FiBriefcase, FiHelpCircle } from 'react-icons/fi';
import Registro from './registro';
import { initUserProfileLogic } from '@/app/Home/UserProfile/userProfileLogic';
import '@/app/Home/UserProfile/userProfile.css';
import { mockUser } from '@/app/Home/UserProfile/UI/mockUser';

declare global {
  interface Window {
    isAuthenticated?: boolean;
    login?: () => void;
    logout?: () => void;
    openEdit?: () => void;
    convertFixer?: () => void;
    toggleMenu?: (e?: any) => void;
    closeMenu?: () => void;
  }
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  //logica modal registro
  useEffect(() => {
    const checkAuth = () => {
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = (window as any).deviceId || 'dev-default';
      const session = usersStore.sessions?.[deviceId];
      setIsAuthenticated(!!session?.loggedIn);
    };

    window.addEventListener('storage', checkAuth);
    checkAuth();

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // ========= LÓGICA DE PERFIL =========
  useEffect(() => {
  if (typeof window === 'undefined') return;
  const win = window as any;
  if (!win.__booka_userProfileInitialized) {
    if (typeof initUserProfileLogic === 'function') {
      initUserProfileLogic();
    }
    win.__booka_userProfileInitialized = true;
  }

    // Carga estado inicial: primero intentar leer desde localStorage usando el deviceId
  const deviceId = localStorage.getItem('booka_device_id') || (window as any)?.deviceId || 'dev-default';
  let currentUser: any = mockUser;
  try {
    const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}') || {};
    if (usersStore.sessions && usersStore.sessions[deviceId]) {
      currentUser = usersStore.sessions[deviceId];
    } else if ((window as any).userProfile) {
      currentUser = (window as any).userProfile;
    } else {
      currentUser = mockUser;
    }
  } catch (e) {
    currentUser = (window as any).userProfile || mockUser;
  }
  const loggedIn = !!currentUser?.loggedIn;
  setUser(currentUser);
  setIsAuthenticated(loggedIn);

  const handleProfileUpdated = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) {
      setUser(detail);
      setIsAuthenticated(!!detail.loggedIn);
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  window.addEventListener('booka-profile-updated', handleProfileUpdated);
  window.addEventListener('booka-logout', handleLogout);
  return () => {
    window.removeEventListener('booka-profile-updated', handleProfileUpdated);
    window.removeEventListener('booka-logout', handleLogout);
  };
}, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as any;

    win.toggleMenu = (e?: any) => {
      e?.stopPropagation?.();
      setIsMenuOpen((prev) => !prev);
    };
    win.closeMenu = () => setIsMenuOpen(false);

    return () => {
      try {
        delete window.toggleMenu;
        delete window.closeMenu;
      } catch {}
    };
  }, [pathname]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isMenuOpen]);

  useEffect(() => {
  const handleScroll = () => {
    const icon = iconRef.current;
    const menu = menuRef.current;
    if (icon && menu && isMenuOpen) {
      const rect = icon.getBoundingClientRect();
      menu.style.top = rect.bottom + 10 + "px";
      menu.style.right = window.innerWidth - rect.right + "px";
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [isMenuOpen]);


  // ========= Funciones de perfil =========
  const onLogout = () => {
  console.log('👋 Clic en cerrar sesión');
  window.closeMenu?.();
  setTimeout(() => {
    window.logout?.(); // ya actualizará localStorage + emitirá eventos
    router.push('/');
  }, 150);
};

  const onOpenEdit = () => {
    window.closeMenu?.();
    setTimeout(() => window.openEdit?.(), 150);
  };

  const onConvertFixer = () => {
    window.closeMenu?.();
    setTimeout(() => window.convertFixer?.(), 150);
  };

  const handleAyudaClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      router.push('/ayuda');
    }
  };
  // Escucha actualizaciones de login/logout globales
  useEffect(() => {
  const handleAuthUpdate = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) {
      setUser(detail);
      setIsAuthenticated(!!detail.loggedIn);
      window.userProfile = detail;
      window.isAuthenticated = !!detail.loggedIn;
    } else {
      const stored = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = (window as any).deviceId || localStorage.getItem('booka_device_id');
      const session = stored.sessions?.[deviceId || ''] || null;
      setUser(session || mockUser);
      setIsAuthenticated(!!session?.loggedIn);
      window.userProfile = session;
      window.isAuthenticated = !!session?.loggedIn;
    }
  }

  window.addEventListener('booka-auth-updated', handleAuthUpdate);
  return () => window.removeEventListener('booka-auth-updated', handleAuthUpdate);
}, []);


  if (!isClient) return null;
  //logica modal registro

  // ========= Render =========
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-lg backdrop-blur-md transition-all duration-300 border-b border-gray-100"
        role="banner"
      >
        {/* Header Desktop */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
              className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 nav-focus-item"
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

          <nav
            className="hidden lg:flex gap-6"
            role="navigation"
            aria-label="Menú principal"
            onKeyDown={(e) => {
              // Obtenemos enlaces y botones
              const navItems = Array.from(
                document.querySelectorAll<HTMLElement>(
                  'nav[aria-label="Menú principal"] a, nav[aria-label="Menú principal"] [href]',
                ),
              );
              const buttonItems = Array.from(
                document.querySelectorAll<HTMLElement>('.flex.items-center.gap-4 button'),
              );

              const allItems: HTMLElement[] = [...navItems, ...buttonItems];

              const index = allItems.indexOf(document.activeElement as HTMLElement);

              if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = (index + 1) % allItems.length;
                allItems[next].focus();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = (index - 1 + allItems.length) % allItems.length;
                allItems[prev].focus();
              }
            }}
          >
            <Link
              href="/servicios"
              className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all 
                ${
                  pathname === '/servicios'
                    ? 'text-blue-600 after:w-full after:bg-blue-600'
                    : 'text-gray-700 hover:text-blue-600 after:w-0 after:bg-blue-600 hover:after:w-full'
                }`}
            >
              Servicios
            </Link>

            <Link
              href="/ofertas"
              className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all 
                ${
                  pathname === '/ofertas'
                    ? 'text-blue-600 after:w-full after:bg-blue-600'
                    : 'text-gray-700 hover:text-blue-600 after:w-0 after:bg-blue-600 hover:after:w-full'
                }`}
            >
              Ofertas de trabajo
            </Link>

            <a
              href="/ayuda"
              onClick={handleAyudaClick}
              className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all 
                ${
                  pathname === '/ayuda'
                    ? 'text-blue-600 after:w-full after:bg-blue-600'
                    : 'text-gray-700 hover:text-blue-600 after:w-0 after:bg-blue-600 hover:after:w-full'
                }`}
              aria-label="Abrir ayuda"
            >
              Ayuda
            </a>
          </nav>

          <div
            className="flex items-center gap-4"
            onKeyDown={(e) => {
              const navItems = Array.from(
                document.querySelectorAll<HTMLElement>(
                  'nav[aria-label="Menú principal"] a, nav[aria-label="Menú principal"] [href]',
                ),
              );
              const buttonItems = Array.from(
                document.querySelectorAll<HTMLElement>('.flex.items-center.gap-4 button'),
              );
              const allItems: HTMLElement[] = [...navItems, ...buttonItems];
              const index = allItems.indexOf(document.activeElement as HTMLElement);

              if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = (index + 1) % allItems.length;
                allItems[next].focus();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prev = (index - 1 + allItems.length) % allItems.length;
                allItems[prev].focus();
              }
            }}
          >
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5"
                  aria-label="Registrarse"
                >
                  Acceder
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={(e) => (window as any).toggleMenu?.(e)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
                  aria-label="Abrir menú de perfil"
                >
                 {user.photo?.startsWith('data:') ? (
  <img src={user.photo} alt="Avatar" width={32} height={32} className="rounded-full" />
) : (
  <Image src={user.photo && user.photo.trim() !== "" ? user.photo : "/avatar.png"} alt="Avatar" width={32} height={32} className="rounded-full" />
)}

                  <span className="font-medium text-gray-800">{user.name.split(' ')[0]}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header Mobile */}
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
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-sm font-medium"
                    aria-label="Registrarse"
                  >
                    Acceder
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={(e) => (window as any).toggleMenu?.(e)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm font-medium"
                    aria-label="Abrir menú de perfil"
                  >
                    <Image
                      src={user.photo && user.photo.trim() !== "" ? user.photo : "/avatar.png"}
                      alt="Avatar"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>
                  {/* Eliminado menú desplegable pequeño duplicado en móvil */}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Barra inferior de iconos */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-gray-200 bg-white flex justify-around items-center z-50"
        role="navigation"
        aria-label="Barra inferior de navegación"
      >
        {/* INICIO */}
        <button
          onClick={() => router.push('/')}
          className={`flex flex-col items-center ${
            pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`}
          aria-label="Ir a inicio"
        >
          <FiHome className="text-2xl" />
          <span className="text-xs mt-1">Inicio</span>
        </button>

        {/* SERVICIOS */}
        <button
          onClick={() => router.push('/servicios')}
          className={`flex flex-col items-center ${
            pathname === '/servicios' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`}
          aria-label="Ir a servicios"
        >
          <FiTool className="text-2xl" />
          <span className="text-xs mt-1">Servicios</span>
        </button>

        {/* OFERTAS */}
        <button
          onClick={() => router.push('/ofertas')}
          className={`flex flex-col items-center ${
            pathname === '/ofertas' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`}
          aria-label="Ir a ofertas"
        >
          <FiBriefcase className="text-2xl" />
          <span className="text-xs mt-1">Ofertas</span>
        </button>

        {/* AYUDA */}
        <button
          onClick={handleAyudaClick}
          className={`flex flex-col items-center ${
            pathname === '/ayuda' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`}
          aria-label="Abrir ayuda"
        >
          <FiHelpCircle className="text-2xl" />
          <span className="text-xs mt-1">Ayuda</span>
        </button>
      </div>

      {/* Menú de perfil */}
      <div
        id="profileMenu"
        ref={menuRef}
        className={`profile-menu ${isMenuOpen ? 'show' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="menu-header">
          <span>Perfil</span>
          <span className="close-btn" onClick={() => window.closeMenu?.()}>
            ×
          </span>
        </div>
        <img
  className="profile-preview"
  src={user.photo && user.photo.trim() !== "" ? user.photo : "/avatar.png"}
  alt="Foto"
/>
        <p className="font-medium">{user.name}</p>
        <p className="text-gray-500 text-sm mb-2">{user.email}</p>
        <p className="text-gray-500 text-sm mb-2">{user.phone || 'Sin número registrado'}</p>

        <div className="menu-item" onClick={onOpenEdit}>
          Editar perfil
        </div>
        <div className="menu-item" onClick={onConvertFixer}>
          Convertirse en Fixer
        </div>
        <div className="menu-item" onClick={onLogout}>
          Cerrar sesión
        </div>
      </div>

      <Registro isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;

