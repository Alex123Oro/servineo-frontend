
'use client';

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const empresaLinks = [
    'Sobre nosotros', 'Unirte como Flyer', 'Testimonios',
    'Apoyo'
  ];

  const legalLinks = [
    'Términos y condiciones', 'Política de privacidad',
    'Política de cookies'
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

          {/* Información legal */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Información legal</h3>
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
            <h3 className="text-xl font-semibold text-white mb-6">Síguenos</h3>
            <div className="flex space-x-4 mt-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white hover:text-gray-200 transition-colors">
                  <Icon className="h-7 w-7" />
                </a>
              ))}
            </div>
          </div>
        </div>

       
        {/* Descarga nuestra app */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-700 pt-12">
          <div className="flex items-center space-x-6">
            <h3 className="text-xl font-semibold text-white mb-0">Descarga nuestra app</h3>
            <p className="text-white text-base mb-0">Gestiona tus servicios desde tu móvil.</p>
          </div>

          <div className="flex space-x-4">
            <div className="bg-black rounded-lg p-3 px-6 cursor-pointer hover:bg-gray-800 transition flex items-center space-x-3">
              <img src="/path-to-apple-logo.svg" alt="App Store" className="h-8 w-8" />
              <div>
                <div className="text-xs text-gray-400">Disponible en</div>
                <div className="font-semibold text-white text-lg">App Store</div>
              </div>
            </div>
            <div className="bg-black rounded-lg p-3 px-6 cursor-pointer hover:bg-gray-800 transition flex items-center space-x-3">
              <img src="/path-to-google-play-logo.svg" alt="Google Play" className="h-8 w-8" />
              <div>
                <div className="text-xs text-gray-400">Consíguelo en</div>
                <div className="font-semibold text-white text-lg">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <h3 className="text-xl font-semibold text-white whitespace-nowrap">
              Suscríbete a nuestras noticias
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-5 py-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors w-full sm:w-auto">
                Suscribirse
              </button>
            </div>

          </div>
        </div>
       
        {/* Línea divisora */}
        <div className="border-t border-gray-700" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-sm text-center pt-8">
          <div>© 2025 Servineo. Todos los derechos reservados.</div>
          <div className="flex items-center space-x-4">
            <span>Hecho con ❤️ en Cochabamba</span>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span>Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
