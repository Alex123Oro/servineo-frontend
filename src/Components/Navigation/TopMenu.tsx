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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navItemsDesktop = [
    { name: 'Inicio', href: '/' },
    { name: 'Ofertas de trabajo', href: '/job-offer-list' },
    { name: 'Convertir-fixer', href: '/become-fixer' },
    { name: 'Mis ofertas', href: '/fixer/my-offers' },
    { name: 'Perfil', href: '/fixer/profile' },
    { name: 'Ayuda', href: '/ayuda' },
  ];

  const navItemsMobile = [
    { icon: <Home size={22} />, href: '/', label: 'Inicio' },
    { icon: <Tag size={22} />, href: '/job-offer-list', label: 'Ofertas' },
    { icon: <Wrench size={22} />, href: '/become-fixer', label: 'Fixer' },
    { icon: <Briefcase size={22} />, href: '/fixer/my-offers', label: 'Mis trabajos' },
    { icon: <User size={22} />, href: '/fixer/profile', label: 'Perfil' },
    { icon: <HelpCircle size={22} />, href: '/ayuda', label: 'Ayuda' },
  ];

  return (
    <>
      {/* ---------------- DESKTOP ---------------- */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-white/90 backdrop-blur-sm'
        } border-b border-gray-100`}
        role="banner"
      >
        <div className="w-[95%] mx-auto px-6 flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Menu */}
          <nav className="flex gap-6" role="navigation" aria-label="Menú principal">
            {navItemsDesktop.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--color-primary)] after:transition-all
                  ${
                    pathname === item.href
                      ? `text-[var(--color-primary)] after:w-full`
                      : 'text-gray-700 hover:text-[var(--color-primary)] after:w-0 hover:after:w-full'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
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

      {/* ---------------- MOBILE + TABLET ---------------- */}
      <div className="lg:hidden">
        {/* Arriba: Logo + Auth */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm z-50 fixed top-0 left-0 right-0">
          <button
            onClick={() => (pathname === '/' ? scrollToTop() : router.push('/'))}
            className="flex items-center gap-2"
          >
            <div className="relative overflow-hidden rounded-full shadow-md">
              <Image src="/icon.png" alt="Servineo" width={36} height={36} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]">
              Servineo
            </span>
          </button>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md text-[var(--color-primary)] font-medium hover:opacity-90 transition-opacity"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/signUp"
              className="px-3 py-1.5 rounded-md bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Registrarse
            </Link>
          </div>
        </div>
        {/* Barra inferior de iconos */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 bg-white/95 backdrop-blur-sm flex justify-around items-center z-50">
          {navItemsMobile.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center text-gray-700 hover:text-[var(--color-primary)] px-2 py-1"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Spacers para que el contenido no quede debajo del top o bottom */}
        <div className="h-16"></div> {/* altura top */}
        <div className="h-16"></div> {/* altura bottom */}
      </div>

      {/* Spacer general para Desktop */}
      <div className="h-16 lg:hidden"></div>
    </>
  );
}
