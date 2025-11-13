'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Footer.module.css';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const empresaLinks = [
    { name: 'Sobre nosotros', path: '/info/about' },
    { name: 'Trabaja con nosotros', path: '/info/join' },
    { name: 'Testimonios', path: '/info/testimonials' },
    { name: 'Apoyo', path: '/info/support' },
    { name: '¿Por qué Servineo?', path: '/whyServineo' },
    { name: 'Cómo funciona Servineo', path: '/Home/comoUsarServineo' },
  ];

  const legalLinks = [
    { name: 'Política de privacidad', path: '/info/privacy' },
    { name: 'Acuerdos de usuario', path: '/info/terms' } /* fue Terminos y condiciones */,
    { name: 'Política de cookies', path: '/info/cookies' },
  ];

  const exploreLinks = [
    { name: 'Servicios', path: '/servicios' },
    { name: 'Ofrece tus servicios', path: '/info/reparador' },
    { name: 'Ofertas de trabajo', path: 'ofertas' }, // o la ruta donde se publiquen los empleos
  ];  

  return (
    <footer
      className="bg-[#0D1B3E] text-white font-['Roboto']"
      role="contentinfo"
      aria-label="Pie de página de Servineo"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Saltar al contenido principal
        </a>

        {/* Servineo logo + descripción */}
        <div className="text-center" aria-labelledby="footer-servineo-heading">
          <h2
            id="footer-servineo-heading"
            className="text-4xl font-bold mb-4 text-[var(--secondary)]"
          >
            Servineo
          </h2>
          <p className="text-white max-w-3xl mx-auto leading-relaxed text-lg">
            La plataforma líder para conectar hogares con profesionales calificados en Cochabamba.
            Calidad garantizada y servicio confiable.
          </p>
        </div>

        <div className="h-4"></div>

        {/* Contenido principal */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base"
          role="navigation"
          aria-label="Enlaces del pie de página"
        >

          {/* Exploremos SERVINEO */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--secondary)] mb-2">
              Exploremos SERVINEO
            </h3>
            <ul className="space-y-3 mt-2">
              {exploreLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div aria-labelledby="empresa-heading">
            <h3 id="empresa-heading" className="text-xl font-semibold text-[var(--secondary)] mb-2">
              Empresa
            </h3>
            <ul className="space-y-3 mt-2" role="list">
              {empresaLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div aria-labelledby="legal-heading">
            <h3 id="legal-heading" className="text-xl font-semibold text-[var(--secondary)] mb-2">
              Legal
            </h3>
            <ul className="space-y-3 mt-2" role="list">
              {legalLinks.map((link, i) => (
                <li key={i} role="listitem">
                  <Link href={link.path} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div aria-labelledby="contacto-heading">
            <h3
              id="contacto-heading"
              className="text-xl font-semibold text-[var(--secondary)] mb-2"
            >
              Contáctanos
            </h3>
            <div className="space-y-4 mt-2 text-white">
              <div className="flex items-center" aria-label="Ubicación: Cochabamba, Bolivia">
                <MapPin
                  className="h-5 w-5 text-blue-400 mr-4 transition-all duration-300 group-hover:text-[var(--secondary)] group-hover:drop-shadow-[0_0_8px_var(--secondary)]"
                  aria-hidden="true"
                />
                <a
                  href="https://maps.app.goo.gl/n7LWKTiuy92PBoAx8?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors"
                  aria-label="Ver ubicación en Google Maps: Cochabamba, Bolivia"
                >
                  Cochabamba, Bolivia
                </a>
              </div>

              {/* WhatsApp (reemplaza el teléfono) */}
              <div className="flex items-center" aria-label="Número de WhatsApp">
                <Phone className="h-5 w-5 text-blue-400 mr-4" aria-hidden="true" />
                <a
                  href="https://wa.me/59163765632"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors"
                  aria-label="Enviar mensaje por WhatsApp al +591 63765632"
                >
                  +591 637-65632
                </a>
              </div>

              {/* 
              {/* Teléfono con enlace 
             <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-4" aria-hidden="true"/>
                <a href="tel:+59163765632" className="hover:text-gray-200 transition-colors" aria-label="Enviar mensaje por WhatsApp al +591 63765632">
                  +591 637-65632
                </a>
              </div> */}

              {/* Correo */}
              <div className="flex items-center" aria-label="Correo electrónico de contacto">
                <Mail className="h-5 w-5 text-blue-400 mr-4" aria-hidden="true" />
                <a
                  href="mailto:espinozapacaflora@gmail.com?subject=Consulta de servicios&body=Hola, me gustaría saber más sobre sus servicios."
                  className="hover:text-[var(--secondary)] transition-colors"
                  aria-label="Enviar correo electrónico a espinozapacaflora@gmail.com"
                >
                  contacto@servineo.bo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Redes sociales + selector de idioma */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-gray-700 pt-6"
        >
          {/* Izquierda: Síguenos + íconos */}
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <h3 className="text-xl font-semibold text-[var(--secondary)]">
              Síguenos
            </h3>

            <div
              className="flex flex-row gap-6"
              role="list"
              aria-label="Redes sociales de Servineo"
            >
              <a
                href="https://facebook.com/DptoInformaticaSistemas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1AA7ED] transition-colors"
                aria-label="Visitar Facebook de Servineo"
              >
                <Facebook className="h-6 w-6" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com/dpto_informatica.sistemas.umss/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1AA7ED] transition-colors"
                aria-label="Visitar Instagram de Servineo"
              >
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
              <a
                href="https://x.com/umssboloficial?lang=es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1AA7ED] transition-colors"
                aria-label="Visitar X (antes Twitter) de Servineo"
              >
                <Twitter className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Derecha: Selector de idioma */}
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="text-gray-200 font-medium">Idiomas</span>
            <select
              className="bg-[#0D1B3E] text-white border border-gray-600 rounded px-2 py-1 focus:outline-none focus:border-[var(--secondary)]"
              aria-label="Seleccionar idioma"
              defaultValue="es"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
        </div>
        
        {/* Línea divisora */}
        <div className="border-t border-gray-700" role="separator" aria-hidden="true" />

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm pt-8"
          aria-label="Créditos y derechos de autor"
        >
          <div>© 2024 Servineo. Todos los derechos reservados.</div>
          <div className="flex items-center space-x-4">
            <span>Hecho con ❤️ en Cochabamba</span>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full" aria-hidden="true" />
              <span>Sistema operativo</span>
            </div>
          </div>
        </div>
        </div>
  
    </footer>
  );
}
