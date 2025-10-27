'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/servicios', label: 'Servicios' },
    { href: '/ofertas', label: 'Ofertas de trabajo' },
    { href: '/ayuda', label: 'Ayuda' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/vercel.svg" alt="Servineo Logo" width={100} height={24} />
          </Link>
        </div>

        <nav className="hidden md:flex flex-grow justify-center">
          <ul className="flex items-center space-x-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={`text-white hover:text-secondary transition-colors ${pathname === href ? 'text-secondary' : ''}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-white hover:text-secondary transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/register" className="px-6 py-2 rounded-md bg-secondary text-white hover:bg-opacity-90 transition-colors">
            Registrarse
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primary px-4 pb-4 shadow-lg">
          <nav>
            <ul className="space-y-4">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={`block py-2 text-center ${pathname === href ? 'text-secondary font-bold' : ''}`} onClick={() => setIsOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 flex flex-col space-y-4">
            <Link href="/login" className="px-4 py-2 text-center rounded-md border border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              Iniciar sesión
            </Link>
            <Link href="/register" className="px-4 py-2 text-center rounded-md bg-secondary text-white hover:bg-opacity-90 transition-colors" onClick={() => setIsOpen(false)}>
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;