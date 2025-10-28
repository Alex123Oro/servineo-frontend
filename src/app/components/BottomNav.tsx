'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBriefcase, FiHelpCircle, FiShoppingBag } from 'react-icons/fi';

const BottomNav = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Inicio', icon: <FiHome size={24} /> },
    { href: '/servicios', label: 'Servicios', icon: <FiBriefcase size={24} /> },
    { href: '/ofertas', label: 'Ofertas', icon: <FiShoppingBag size={24} /> },
    { href: '/ayuda', label: 'Ayuda', icon: <FiHelpCircle size={24} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around max-w-7xl mx-auto">
        {navLinks.map(({ href, label, icon }) => (
          <Link key={href} href={href} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm font-medium transition-colors ${
            pathname === href
              ? 'text-blue-600'
              : 'text-gray-500 hover:text-blue-600'
          }`}>
            {icon}
            <span className="mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;