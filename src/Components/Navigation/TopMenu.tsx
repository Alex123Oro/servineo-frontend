'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Tag, Wrench, Briefcase, User, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/app/redux/slice/userSlice';
import { UserData } from '@/types/user'; 

interface RootState {
  user: {
    user: UserData | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
}

export default function TopMenu() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, loading } = useSelector((state: RootState) => state.user);

  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLButtonElement | null>(null);

  const navItems = [
    { name: 'Servicios', href: '/servicios', icon: Wrench },
    { name: 'Ofertas', href: '/job-offer-list', icon: Tag },
    { name: 'Ayuda', href: '/ayuda', icon: HelpCircle },
  ];

  useEffect(() => {
    const token = localStorage.getItem('servineo_user');
    if (token) {
      const userData = JSON.parse(token);
      setUserId(userData._id);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem('servineo_token');
    setIsLogged(!!token);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
       setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('servineo_token');
    localStorage.removeItem('servineo_user');
    window.location.reload();
  };

  const getRoleButton = () => {
    if (loading || !user) return null;
    if (!user.role) return null;

    if (user.role === 'requester') {
      return (
        <Link
          href="/become-fixer"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
        >
          <Wrench className="h-4 w-4" />
          Convertir a Fixer
        </Link>
      );
    }

    if (user.role === 'fixer') {
      return (
        <Link
          href="/fixer/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
        >
          <User className="h-4 w-4" />
          Perfil de Fixer
        </Link>
      );
    }
    return null;
  };

  const getRoleButtonMobile = () => {
    if (loading || !user) return null;
    if (!user.role) return null;

    if (user.role === 'requester') {
      return (
        <Link
          href="/become-fixer"
          className="flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] text-white px-3 py-1 rounded-md text-[10px] sm:text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Wrench className="h-4 w-4" />
          Convertir a Fixer
        </Link>
      );
    }

    if (user.role === 'fixer') {
      return (
        <Link
          href="/fixer/dashboard"
          className="flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] text-white px-3 py-1 rounded-md text-[10px] sm:text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <User className="h-4 w-4" />
          Perfil de Fixer
        </Link>
      );
    }
    return null;
  };

  const handleDesktopNavKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const logoItems = logoRef.current ? [logoRef.current] : [];
    const navItemsEls = Array.from(document.querySelectorAll<HTMLElement>('nav a'));
    const buttonItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        '#desktop-auth-buttons a, #desktop-auth-buttons button',
      ),
    );
    const allItems = [...logoItems, ...navItemsEls, ...buttonItems];
    if (allItems.length === 0) return;

    const index = allItems.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = index === -1 ? 0 : (index + 1) % allItems.length;
      allItems[next].focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev =
        index === -1 ? allItems.length - 1 : (index - 1 + allItems.length) % allItems.length;
      allItems[prev].focus();
    }
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
        } border-b border-gray-100`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex justify-between h-20 items-center"
            onKeyDown={handleDesktopNavKeyDown}
          >
            {/* Logo */}
            <button
              ref={logoRef}
              onClick={handleLogoClick}
              className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Ir al inicio"
            >
              <div className="relative overflow-hidden rounded-full shadow-md">
                <Image
                  src="/icon.png"
                  alt="Logo de Servineo"
                  width={40}
                  height={40}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span
                className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Servineo
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6" role="navigation" aria-label="Menú principal">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-primary)] after:transition-all
                    ${
                      currentPath === item.href
                        ? 'text-[var(--color-primary)] after:w-full'
                        : 'text-gray-900 hover:text-[var(--color-primary)] after:w-0 hover:after:w-full'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Botones / perfil (DESKTOP) - ID AGREGADO */}
            <div className="hidden md:flex items-center gap-4" id="tour-auth-buttons-desktop">
              {!isLogged ? (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-1 text-[10px] sm:text-xs md:text-sm lg:text-base rounded-md bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signUp"
                    className="px-3 py-1 text-[10px] sm:text-xs md:text-sm lg:text-base rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] font-medium hover:opacity-80 transition"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
                  {getRoleButton()}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setAccountOpen(!accountOpen)}
                      className="flex items-center gap-2 cursor-pointer ml-[-10px] px-3 py-1 border border-gray-300 bg-white rounded-xl transition"
                    >
                      <span className="font-medium text-gray-700 hover:text-primary">
                        {user?.name}
                      </span>
                    </button>
                    {accountOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-md py-2 z-50">
                        <Link
                          href="/requesterEdit"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          Editar perfil
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.removeItem('servineo_token');
                            localStorage.removeItem('servineo_user');
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden flex items-center">
              {/* ID AGREGADO AQUI PARA EL TOUR MOBILE */}
              <div id="tour-auth-buttons-mobile" className="mr-2">
                 {!isLogged ? (
                    <Link
                    href="/login"
                    className="px-2 py-1 rounded-md bg-[var(--color-primary)] text-white text-xs font-medium"
                  >
                    Login
                  </Link>
                 ) : (
                   <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom nav móvil */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white shadow-t border-t border-gray-200">
          <nav className="flex justify-around items-center py-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center text-xs ${
                  currentPath === item.href ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-20 md:h-20" />
    </>
  );
}