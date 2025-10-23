
'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Footer.module.css';

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
          <h2 className="text-4xl font-bold mb-4 text-[var(--secondary)]">Servineo</h2>
          <p className="text-white max-w-3xl mx-auto leading-relaxed text-lg">
            La plataforma líder para conectar hogares con profesionales calificados en Cochabamba. 
            Calidad garantizada y servicio confiable.
          </p>
        </div>

        <div className="h-4"></div>
        
        {/* Contenido principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-base">
            

          {/* Empresa */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--secondary)] mb-2">Empresa</h3>
            <ul className="space-y-3 mt-2">
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
          <div>
            <h3 className="text-xl font-semibold text-[var(--secondary)] mb-2">Legal</h3>
            <ul className="space-y-3 mt-2">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.path} className={styles.footerLink}>
                      {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--secondary)] mb-2">Contáctanos</h3>
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
                  aria-label="Ver ubicación en Google Maps"
                >
                  Cochabamba, Bolivia
                </a>
              </div>

              {/* WhatsApp (reemplaza el teléfono) */}
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-4" aria-hidden="true"/>
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
              <div className="flex items-center">
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

          {/* Redes sociales */}
         
          {/* Redes sociales */}
          <div>
            <h3 className="text-xl font-semibold text-[var(--secondary)] mb-2">Síguenos</h3>
            <div className="flex flex-row md:flex-col mt-3 md:space-y-3 space-x-4 md:space-x-0">
              {/* Facebook */}
              <a
                href="https://facebook.com/DptoInformaticaSistemas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1AA7ED] transition-colors"
                aria-label="Visitar Facebook de Servineo"
              >
                <Facebook className="h-6 w-6" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/dpto_informatica.sistemas.umss/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1AA7ED] transition-colors"
                aria-label="Visitar Instagram de Servineo"
              >
                <Instagram className="h-6 w-6" />
              </a>

              {/* TikTok (ícono SVG personalizado) 
              <a
                href="https://www.tiktok.com/@servineo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1AA7ED] transition-colors"
                aria-label="Visitar TikTok de Servineo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M12 2c.47 0 .93.06 1.38.18a4.9 4.9 0 003.2 3.17 5.42 5.42 0 002.09.41v2.39a7.82 7.82 0 01-2.52-.43 7.25 7.25 0 01-1.2-.57v6.8a6.81 6.81 0 11-6.81-6.8c.24 0 .48.01.72.04v2.47a3.89 3.89 0 00-.72-.07 3.86 3.86 0 103.86 3.86V2h1z" />
                </svg>
              </a>                    */}

              {/* Twitter (opcional) */}
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
