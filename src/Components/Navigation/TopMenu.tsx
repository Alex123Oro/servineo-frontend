'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Tag, Wrench, Briefcase, User, HelpCircle } from 'lucide-react';

export default function TopMenu() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

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

  return (
    <>
      {/* HEADER DESKTOP */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white'
        } border-b border-gray-100`}
        role="banner"
      >
        <div className="w-full max-w-8xl mx-auto px-4 flex justify-between items-center h-20">
          <button
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
                      : 'text-gray-700 hover:text-[var(--color-primary)] after:w-0 hover:after:w-full'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4" id="tour-auth-buttons-desktop">
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
          </div>
        </div>
      </header>

      {/* HEADER + NAV MOBILE */}
      <div className="lg:hidden">
        {/* Barra superior mobile */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 bg-white/95 backdrop-blur-sm z-50 fixed top-0 left-0 right-0">
          <button
            onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
            className="flex items-center gap-2 min-w-0"
          >
            <div className="relative overflow-hidden rounded-full shadow-md shrink-0">
              <Image src="/icon.png" alt="Servineo" width={30} height={30} />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] truncate max-w-[110px]">
              Servineo
            </span>
          </button>

          <div className="flex items-center gap-1 flex-nowrap" id="tour-auth-buttons-mobile">
            <Link
              href="/login"
              className="px-2.5 py-1.5 rounded-md text-[var(--color-primary)] font-medium text-[11px] sm:text-xs hover:opacity-90 transition-opacity"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/signUp"
              className="px-2.5 py-1.5 rounded-md bg-[var(--color-primary)] text-white font-medium text-[11px] sm:text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Registrarse
            </Link>
          </div>
        </div>
        {/* Barra inferior mobile */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white/95 backdrop-blur-sm flex justify-around items-center z-50">
          {navItemsMobile.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center text-[10px] px-1 py-1 ${
                pathname === item.href
                  ? 'text-[var(--color-primary)]'
                  : 'text-gray-700 hover:text-[var(--color-primary)]'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Espaciadores para que el contenido no quede debajo de las barras */}
        <div className="h-14" /> {/* espacio para la barra superior */}
        <div className="h-16" /> {/* espacio para la barra inferior */}
      </div>

      {/* Espaciador para desktop (header fijo) */}
      <div className="hidden lg:block h-20" />
    </>
  );
}
