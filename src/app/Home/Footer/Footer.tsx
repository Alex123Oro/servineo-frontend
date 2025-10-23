
'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const empresaLinks = [
    { name: 'Sobre nosotros', path: '/info/about' },
    { name: 'Trabaja con nosotros', path: '/info/join' },
    { name: 'Testimonios', path: '/info/testimonials' },
    { name: 'Apoyo', path: '/info/support' },
  ];

  const legalLinks = [
    { name: 'Política de privacidad', path: '/info/privacy' },
    { name: 'Acuerdos de usuario', path: '/info/terms' }, /* fue Terminos y condiciones */
    { name: 'Política de cookies', path: '/info/cookies' },
  ];

  return (
    <footer className="bg-[#0D1B3E] text-white font-['Roboto']">
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Servineo logo + descripción */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Servineo</h2>
          <p className="text-white max-w-3xl mx-auto leading-relaxed text-lg">
            La plataforma líder para conectar hogares con profesionales calificados en Cochabamba.
            Calidad garantizada y servicio confiable.
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base">
          {/* Empresa */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Empresa</h3>
            <ul className="space-y-3">
              {empresaLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="group inline-block">
                    <span className="relative inline-block px-2 py-1 rounded-md text-white transition-colors duration-200 group-hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transform transition-transform duration-200 group-hover:scale-[1.06]">
                      {link.name}
                      <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-blue-400 transform origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className="group inline-block">
                    <span className="relative inline-block px-2 py-1 rounded-md text-white transition-colors duration-200 group-hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transform transition-transform duration-200 group-hover:scale-[1.06]">
                      {link.name}
                      <span className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-full bg-blue-400 transform origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Contáctanos</h3>
            <div className="space-y-4 text-white">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-400 mr-4" />
                <span>Cochabamba, Bolivia</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-4" />
                <span>+591 4 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-4" />
                <span>contacto@servineo.bo</span>
              </div>
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
            <div className="flex flex-row md:flex-col mt-2 md:space-y-3 space-x-4 md:space-x-0">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-[#1AA7ED] transition-colors">
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Línea divisora */}
        <div className="border-t border-gray-700" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm pt-8">
          <div>© 2024 Servineo. Todos los derechos reservados.</div>
          <div className="flex items-center space-x-4">
            <span>Hecho con ❤️ en Cochabamba</span>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
              <span>Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
