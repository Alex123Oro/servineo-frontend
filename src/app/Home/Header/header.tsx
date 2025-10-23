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
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('booka_user');
      return storedUser ? JSON.parse(storedUser) : mockUser;
    }
    return mockUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('booka_user');
      return !!storedUser;
    }
    return false;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    if (typeof initUserProfileLogic === 'function') {
      initUserProfileLogic();
    }

    try {
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = localStorage.getItem('booka_device_id');

      const userSession = deviceId ? usersStore?.sessions?.[deviceId] : null;

      if (userSession && userSession.loggedIn) {
        setUser(userSession);
        setIsAuthenticated(true);
        window.userProfile = userSession;
        window.isAuthenticated = true;
      }
    } catch (err) {
      console.warn('No se pudo restaurar sesión:', err);
    }

    const win = window as any;

    win.login = () => {
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = localStorage.getItem('booka_device_id');

      if (!deviceId) {
        console.warn('No se encontró deviceId en localStorage.');
        return;
      }
      if (!usersStore.sessions) usersStore.sessions = {};
      const existingSession = usersStore.sessions[deviceId] || {};

      const updatedSession = {
        ...existingSession,
        loggedIn: true,
      };
      if (Object.keys(existingSession).length === 0) {
        Object.assign(updatedSession, mockUser);
      }

      usersStore.sessions[deviceId] = updatedSession;
      usersStore.lastUpdated = Date.now();
      localStorage.setItem('booka_users', JSON.stringify(usersStore));

      win.userProfile = updatedSession;
      win.isAuthenticated = true;
      setUser(updatedSession);
      setIsAuthenticated(true);

      window.dispatchEvent(new CustomEvent('booka-auth-updated', { detail: updatedSession }));
    };

    win.logout = () => {
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = localStorage.getItem('booka_device_id');

      if (!deviceId) {
        console.warn('No se encontró deviceId en localStorage.');
        return;
      }

      if (usersStore.sessions && usersStore.sessions[deviceId]) {
        usersStore.sessions[deviceId].loggedIn = false;
        usersStore.lastUpdated = Date.now();
        localStorage.setItem('booka_users', JSON.stringify(usersStore));
      }

      win.userProfile = null;
      win.isAuthenticated = false;
      setIsAuthenticated(false);

      const savedSession = usersStore.sessions?.[deviceId] || mockUser;
      setUser(savedSession);

      // Redirigir a la página de inicio
      router.push('/');
    };
    win.closeMenu = () => setIsMenuOpen(false);

    // Sincronización global entre rutas y pestañas
    let broadcast: BroadcastChannel;
    if (!(window as any)._bookaBroadcast) {
      (window as any)._bookaBroadcast = new BroadcastChannel('booka_auth_channel');
    }
    broadcast = (window as any)._bookaBroadcast;

    const syncAuthState = (data: any) => {
      if (data?.type === 'LOGIN') {
        setIsAuthenticated(true);
        setUser(data.user || mockUser);
        window.userProfile = data.user;
        window.isAuthenticated = true;
      } else if (data?.type === 'LOGOUT') {
        setIsAuthenticated(false);
        setUser(mockUser);
        window.userProfile = null;
        window.isAuthenticated = false;
      }
    };

    broadcast.onmessage = (event) => syncAuthState(event.data);

    const originalLogin = win.login;
    win.login = () => {
      originalLogin?.();
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = localStorage.getItem('booka_device_id');

      const userSession = deviceId ? usersStore?.sessions?.[deviceId] : null;
      broadcast.postMessage({ type: 'LOGIN', user: userSession });
    };

    const originalLogout = win.logout;
    win.logout = () => {
      originalLogout?.();
      broadcast.postMessage({ type: 'LOGOUT' });
    };

    //  Escucha cambios locales de login sin refrescar
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'booka_users') {
        try {
          const usersStore = JSON.parse(event.newValue || '{}');
          const deviceId = localStorage.getItem('booka_device_id');

          const userSession = deviceId ? usersStore?.sessions?.[deviceId] : null;

          if (userSession && userSession.loggedIn) {
            setIsAuthenticated(true);
            setUser(userSession);
            window.userProfile = userSession;
            window.isAuthenticated = true;
          } else {
            setIsAuthenticated(false);
            setUser(mockUser);
            window.userProfile = null;
            window.isAuthenticated = false;
          }
        } catch (err) {
          console.warn('Error al procesar cambio de sesión:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // ========= EVENTOS INTERNOS =========
    const handleLogoutEvent = () => {
      setIsAuthenticated(false);
      setUser(mockUser);
      setIsMenuOpen(false);
    };

    const handleProfileUpdated = (e: Event) => {
      try {
        const updated = (e as CustomEvent).detail;
        if (updated) {
          setUser(updated);
          setIsAuthenticated(!!updated.loggedIn);
          setIsMenuOpen(false);
          setTimeout(() => setIsMenuOpen(true), 50);
        } else {
          const globalUser = (window as any).userProfile || mockUser;
          setUser(globalUser);
          setIsAuthenticated(!!globalUser?.loggedIn);
        }
      } catch (err) {
        console.warn('Error procesando booka-profile-updated', err);
      }
    };

    window.addEventListener('booka-logout', handleLogoutEvent);
    window.addEventListener('booka-profile-updated', handleProfileUpdated);

    // ========= LIMPIEZA =========
    return () => {
      window.removeEventListener('booka-logout', handleLogoutEvent);
      window.removeEventListener('booka-profile-updated', handleProfileUpdated);
      window.removeEventListener('storage', handleStorageChange);
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

  // ========= Funciones de perfil =========
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

  const handleAyudaClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsModalOpen(true);
    } else {
      router.push('/ayuda');
    }
  };

  const handleLogin = () => {
    window.login?.();
  };

  //  Reforzar sincronización de sesión al cambiar de página
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      const deviceId = localStorage.getItem('booka_device_id');

      const userSession = deviceId ? usersStore?.sessions?.[deviceId] : null;

      if (userSession && userSession.loggedIn) {
        setIsAuthenticated(true);
        setUser(userSession);
        window.userProfile = userSession;
        window.isAuthenticated = true;
      } else {
        setIsAuthenticated(false);
        setUser(mockUser);
        window.userProfile = null;
        window.isAuthenticated = false;
      }
    } catch (err) {
      console.warn('Error sincronizando sesión al cambiar de ruta:', err);
    }
  }, [pathname]);

  // Escucha actualizaciones de login/logout globales
  useEffect(() => {
    const handleAuthUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.loggedIn) {
        setUser(detail);
        setIsAuthenticated(true);
        window.userProfile = detail;
        window.isAuthenticated = true;
      } else {
        setUser(mockUser);
        setIsAuthenticated(false);
        window.userProfile = null;
        window.isAuthenticated = false;
      }
    };

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
                  <Image
                    src={user.photo}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium text-gray-800">{user.name.split(' ')[0]}</span>
                </button>
                {/* Eliminado menú desplegable pequeño duplicado */}
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
                      src={user.photo}
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
        <img className="profile-preview" src={user.photo} alt="Foto" />
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
