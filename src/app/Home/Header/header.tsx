'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiBriefcase, FiClipboard, FiHelpCircle } from 'react-icons/fi';
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
    deviceId?: string;
    userProfile?: any;
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
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => setIsClient(true), []);

  // === Manejo de autenticación ===
  useEffect(() => {
    const checkAuth = () => {
      try {
        const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
        const deviceId = window.deviceId || 'dev-default';
        const session = usersStore.sessions?.[deviceId];
        setIsAuthenticated(!!session?.loggedIn);
        setIsLoggedIn(!!session?.loggedIn);
      } catch {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', checkAuth);
    checkAuth();
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // === Inicialización del perfil ===
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as any;
    if (!win.__booka_userProfileInitialized) {
      if (typeof initUserProfileLogic === 'function') initUserProfileLogic();
      win.__booka_userProfileInitialized = true;
    }

    const deviceId = localStorage.getItem('booka_device_id') || win.deviceId || 'dev-default';
    let currentUser: any = mockUser;
    try {
      const usersStore = JSON.parse(localStorage.getItem('booka_users') || '{}');
      if (usersStore.sessions && usersStore.sessions[deviceId]) {
        currentUser = usersStore.sessions[deviceId];
      } else if (win.userProfile) {
        currentUser = win.userProfile;
      }
    } catch {
      currentUser = win.userProfile || mockUser;
    }

    setUser(currentUser);
    setIsAuthenticated(!!currentUser?.loggedIn);
    setIsLoggedIn(!!currentUser?.loggedIn);

    const handleProfileUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setUser(detail);
        setIsAuthenticated(!!detail.loggedIn);
        setIsLoggedIn(!!detail.loggedIn);
      }
    };

    const handleLogout = () => {
      setIsAuthenticated(false);
      setIsLoggedIn(false);
      setUser(mockUser);
    };

    window.addEventListener('booka-profile-updated', handleProfileUpdated);
    window.addEventListener('booka-logout', handleLogout);

    return () => {
      window.removeEventListener('booka-profile-updated', handleProfileUpdated);
      window.removeEventListener('booka-logout', handleLogout);
    };
  }, []);

  // === Funciones globales de menú ===
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as any;

    win.toggleMenu = (e?: any) => {
      e?.stopPropagation?.();
      setIsMenuOpen((prev) => !prev);
    };
    win.closeMenu = () => setIsMenuOpen(false);

    return () => {
      delete window.toggleMenu;
      delete window.closeMenu;
    };
  }, [pathname]);

  // === Cerrar menú si se hace clic fuera ===
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isMenuOpen]);

  // === Funciones de usuario ===
  const onLogout = () => {
    console.log('👋 Clic en cerrar sesión');
    window.closeMenu?.();
    setTimeout(() => {
      window.logout?.();
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
    if (!isAuthenticated) setIsModalOpen(true);
    else router.push('/ayuda');
  };

  // === Navegación con teclado ===
  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      if (!active) return;
      const isNavElement = Boolean(active.closest('nav[aria-label="Menú principal"], header'));
      if (!isNavElement) return;
      const navItems = Array.from(
        document.querySelectorAll<HTMLElement>(
          'nav[aria-label="Menú principal"] a, nav[aria-label="Menú principal"] [href], header button'
        )
      );
      const index = navItems.indexOf(active);
      if (index === -1) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        navItems[(index + 1) % navItems.length]?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navItems[(index - 1 + navItems.length) % navItems.length]?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, []);

  if (!isClient) return null;

  const safeName = user?.name ? user.name.split(' ')[0] : 'Invitado';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-md backdrop-blur-md border-b border-gray-100"
      >
        {/* === Desktop Header === */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <button
            onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
            className="flex items-center gap-2 group"
          >
            <Image src="/icon.png" alt="Logo" width={45} height={45} className="rounded-full" />
            <span className="text-2xl font-bold text-blue-700">Servineo</span>
          </button>

          {/* Nav */}
          <nav className="hidden lg:flex gap-6" aria-label="Menú principal">
            <Link href="/servicios" className="text-gray-700 hover:text-blue-600 font-medium">
              Servicios
            </Link>
            <Link href="/ofertas" className="text-gray-700 hover:text-blue-600 font-medium">
              Ofertas
            </Link>
            <a
              href="/ayuda"
              onClick={handleAyudaClick}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Ayuda
            </a>
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Acceder
              </button>
            ) : (
              <button
                onClick={(e) => window.toggleMenu?.(e)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100"
              >
                <Image
                  src={user?.photo && user.photo.trim() !== '' ? user.photo : '/avatar.png'}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{safeName}</span>
              </button>
            )}
          </div>
        </div>

        {/* === Mobile Header === */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2">
          <button onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))} className="flex items-center gap-2">
            <Image src="/icon.png" alt="Logo" width={36} height={36} />
            <span className="text-xl font-bold text-blue-700">Servineo</span>
          </button>

          {!isAuthenticated ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm"
            >
              Acceder
            </button>
          ) : (
            <button
              onClick={(e) => window.toggleMenu?.(e)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600 text-white text-sm"
            >
              <Image
                src={user?.photo && user.photo.trim() !== '' ? user.photo : '/avatar.png'}
                alt="Avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{safeName}</span>
            </button>
          )}
        </div>
      </header>

      {/* === Barra inferior móvil === */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-white flex justify-around items-center z-50">
        <button onClick={() => router.push('/')} className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <FiHome className="text-xl" /> <span className="text-xs">Inicio</span>
        </button>
        <button onClick={() => router.push('/servicios')} className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <FiBriefcase className="text-xl" /> <span className="text-xs">Servicios</span>
        </button>
        <button onClick={() => router.push('/ofertas')} className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <FiClipboard className="text-xl" /> <span className="text-xs">Ofertas</span>
        </button>
        <button onClick={handleAyudaClick} className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <FiHelpCircle className="text-xl" /> <span className="text-xs">Ayuda</span>
        </button>
      </div>

      {/* === Menú de perfil === */}
      <div id="profileMenu" ref={menuRef} className={`profile-menu ${isMenuOpen ? 'show' : ''}`}>
        <div className="menu-header">
          <span>Perfil</span>
          <span className="close-btn" onClick={() => window.closeMenu?.()}>×</span>
        </div>
        <img
          className="profile-preview"
          src={user?.photo && user.photo.trim() !== '' ? user.photo : '/avatar.png'}
          alt="Foto"
        />
        <p className="font-medium">{user?.name || 'Invitado'}</p>
        <p className="text-gray-500 text-sm mb-1">{user?.email || 'Sin correo'}</p>
        <p className="text-gray-500 text-sm mb-2">{user?.phone || 'Sin número registrado'}</p>

        <div className="menu-item" onClick={onOpenEdit}>Editar perfil</div>
        <div className="menu-item" onClick={onConvertFixer}>Convertirse en Fixer</div>
        <div className="menu-item" onClick={onLogout}>Cerrar sesión</div>
      </div>

      <Registro isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;


