'use client';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Tag, Wrench, Briefcase, User, HelpCircle } from 'lucide-react';
import styles from '@/styles/userProfile.module.css';

export default function TopMenu() {
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const userPhoto =
    userData?.photo?.trim() ||
    userData?.picture?.trim() ||
    userData?.url_photo?.trim() ||
    '/no-photo.png';

  /* -------- SCROLL -------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* -------- CARGAR USUARIO -------- */
  useEffect(() => {
    const token = localStorage.getItem('servineo_token');
    const user = localStorage.getItem('servineo_user');

    setIsLogged(!!token);
    try {
      if (user && user !== 'undefined') {
        setUserData(JSON.parse(user));
      } else {
        setUserData(null);
      }
    } catch {
      console.error('Usuario inválido en localStorage');
      localStorage.removeItem('servineo_user');
      setUserData(null);
    }

    const syncUserState = () => {
      const tok = localStorage.getItem('servineo_token');
      const usr = localStorage.getItem('servineo_user');
      setIsLogged(!!tok);
      setUserData(usr ? JSON.parse(usr) : null);
    };

    window.addEventListener('storage', syncUserState);
    setAuthReady(true);
    return () => window.removeEventListener('storage', syncUserState);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const usr = localStorage.getItem('servineo_user');
      setUserData(usr ? JSON.parse(usr) : null);
    };
    window.addEventListener('servineo_user_updated', syncUser);
    return () => window.removeEventListener('servineo_user_updated', syncUser);
  }, []);

  /* -------- AUTO LOGOUT POR INACTIVIDAD -------- */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () => {
          localStorage.removeItem('servineo_token');
          localStorage.removeItem('servineo_user');
          window.dispatchEvent(new Event('servineo_user_updated'));
          router.push('/');
        },
        15 * 60 * 1000,
      );
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();
    return () => events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, []);

  /* -------- CLOSE DROPDOWN OUTSIDE -------- */
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        profileMenuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !profileButtonRef.current?.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [profileMenuOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const logout = () => {
    localStorage.removeItem('servineo_token');
    localStorage.removeItem('servineo_user');
    setIsLogged(false);
    setUserData(null);
    router.push('/');
  };

  /* -------- NAV ITEMS -------- */
  const navItemsDesktop = [
    { name: 'Inicio', href: '/' },
    { name: 'Ofertas de trabajo', href: '/job-offer-list' },
    { name: 'Convertirse en fixer', href: '/become-fixer' },
    { name: 'Mis ofertas', href: '/fixer/my-offers' },
    { name: 'Perfil', href: '/fixer/profile' },
    { name: 'Ayuda', href: '/ayuda' },
  ];

  const navItemsMobile = [
    { icon: <Home size={20} />, href: '/', label: 'Inicio' },
    { icon: <Tag size={20} />, href: '/job-offer-list', label: 'Ofertas' },
    { icon: <Wrench size={20} />, href: '/become-fixer', label: 'Fixer' },
    { icon: <Briefcase size={20} />, href: '/fixer/my-offers', label: 'Mis trabajos' },
    { icon: <User size={20} />, href: '/fixer/profile', label: 'Perfil' },
    { icon: <HelpCircle size={20} />, href: '/ayuda', label: 'Ayuda' },
  ];

  /* -------- TECLAS EN MENU DESKTOP -------- */
  const handleDesktopNavKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const logoItems = Array.from(document.querySelectorAll<HTMLElement>('#desktop-logo-button'));
    const navItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        'nav[aria-label="Menú principal"] a, nav[aria-label="Menú principal"] [href]',
      ),
    );
    const buttonItems = Array.from(
      document.querySelectorAll<HTMLElement>(
        '#tour-auth-buttons-desktop a, #tour-auth-buttons-desktop button',
      ),
    );

    const allItems: HTMLElement[] = [...logoItems, ...navItems, ...buttonItems];
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

  if (!authReady) return null;

  return (
    <>
      {/* HEADER DESKTOP */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white'
        } border-b border-gray-100`}
        role="banner"
      >
        <div
          className="w-full max-w-8xl mx-auto px-4 flex justify-between items-center h-20"
          onKeyDown={handleDesktopNavKeyDown}
        >
          <button
            id="desktop-logo-button"
            onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
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

          <nav className="flex gap-6" role="navigation" aria-label="Menú principal">
            {navItemsDesktop.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-primary)] after:transition-all
                  ${
                    pathname === item.href
                      ? 'text-[var(--color-primary)] after:w-full'
                      : 'text-gray-900 hover:text-[var(--color-primary)] after:w-0 hover:after:w-full'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4" id="tour-auth-buttons-desktop">
            {!isLogged ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium transition-opacity duration-300 hover:opacity-90"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/signUp"
                  className="px-4 py-2 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] font-medium transition-opacity duration-300 hover:opacity-80"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <button
                ref={profileButtonRef}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 cursor-pointer ml-[-20px] px-3 py-1 border border-gray-300 bg-white rounded-xl transition"
              >
                <img
                  src={userPhoto}
                  alt="Foto"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-medium text-gray-700 hover:text-primary">
                  {userData?.name}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MENU DE PERFIL */}
      {isLogged && (
        <div
          ref={dropdownRef}
          className={`${styles.profileMenu} ${profileMenuOpen ? styles.show : ''}`}
        >
          <div className={styles.menuHeader}>
            <strong>Mi cuenta</strong>
            <span className={styles.closeBtn} onClick={() => setProfileMenuOpen(false)}>
              ✕
            </span>
          </div>

          <img className={styles.profilePreview} src={userPhoto} alt="Foto" />

          <div className={styles.menuLabel}>{userData?.name}</div>
          <div className={styles.menuLabel}>{userData?.email}</div>
          <div className={styles.menuLabel}>{userData?.phone}</div>

          <hr style={{ margin: '8px 0', opacity: 0.3 }} />

          <button onClick={() => router.push('/mi-perfil')} className={styles.menuItem}>
            Editar perfil
          </button>

          <button onClick={() => router.push('/become-fixer')} className={styles.menuItem}>
            Convertirse en Fixer
          </button>

          <button onClick={logout} className={`${styles.menuItem} ${styles.logoutBtn}`}>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* HEADER + NAV MOBILE */}
      <div className="lg:hidden">
        {/* Barra superior mobile */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm z-50 fixed top-0 left-0 right-0">
          <button
            onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
            className="flex items-center gap-2 min-w-0"
          >
            <div className="relative overflow-hidden rounded-full shadow-md shrink-0">
              <Image src="/icon.png" alt="Servineo" width={32} height={32} />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] truncate max-w-[130px]">
              Servineo
            </span>
          </button>

          {!isLogged ? (
            <div className="flex items-center gap-2 flex-nowrap" id="tour-auth-buttons-mobile">
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-[var(--color-primary)] font-medium text-[11px] sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signUp"
                className="px-3 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium text-[11px] sm:text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Registrarse
              </Link>
            </div>
          ) : (
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              ref={profileButtonRef}
              className="flex items-center gap-2 cursor-pointer ml-[-20px] px-3 py-1 border border-gray-300 bg-white rounded-xl transition"
            >
              <img
                src={userPhoto}
                alt="Foto"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="text-gray-700 font-medium">{userData?.name}</span>
            </button>
          )}
        </div>
        {/* Barra inferior mobile */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white/95 backdrop-blur-sm flex justify-around items-center z-50">
          {navItemsMobile.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center text-[11px] px-1 py-1 ${
                pathname === item.href
                  ? 'text-[var(--color-primary)]'
                  : 'text-gray-900 hover:text-[var(--color-primary)]'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="h-16" /> {/* espacio para la barra superior */}
        <div className="h-16" /> {/* espacio para la barra inferior */}
      </div>

      {/* Espaciador para desktop (header fijo) */}
      <div className="hidden lg:block h-20" />
    </>
  );
}
