
'use client';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const serviciosLinks = [
    'Plomeria', 'Electricidad', 'Carpinteria', 'Pintura', 
    'Limpieza', 'Jardinería', 'Soldadura', 'Albañileria'
  ];

  const empresaLinks = [
    'Sobre nosotros', 'Cómo funciona', 'Testimonios', 'Blog', 
    'Prensa', 'Trabaja con nosotros'
  ];

  const legalLinks = [
    'Términos y condiciones', 'Política de privacidad',
    'Política de cookies', 'Resolución de disputas'
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
          
          {/* Servicios */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Servicios</h3>
            <ul className="space-y-3">
              {serviciosLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Empresa</h3>
            <ul className="space-y-3">
              {empresaLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {link}
                  </a>
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

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

       
        {/* App Download & Social Media */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-t border-gray-700 pt-12">
          {/* App Download */}
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-semibold text-white mb-2">Descarga nuestra app</h3>
            <p className="text-white text-base mb-6">Gestiona tus servicios desde tu móvil.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="bg-black rounded-lg p-3 px-6 cursor-pointer hover:bg-gray-800 transition flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🍎</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Disponible en</div>
                  <div className="font-semibold text-white text-lg">App Store</div>
                </div>
              </div>
              <div className="bg-black rounded-lg p-3 px-6 cursor-pointer hover:bg-gray-800 transition flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">▶</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Consíguelo en</div>
                  <div className="font-semibold text-white text-lg">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="text-center lg:text-right">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Síguenos:</h3>
              <div className="flex justify-center lg:justify-end space-x-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="text-white hover:text-gray-200 transition-colors">
                    <Icon className="h-8 w-8" />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="email"
                placeholder="Tu email para noticias"
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors w-full sm:w-64"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Suscribirse
              </button>
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
