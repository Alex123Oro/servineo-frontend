import type { StepType } from '@reactour/tour';

export const tourSteps: StepType[] = [
  {
    selector: 'body',
    content: (
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#2B6AE0] mb-4">¡Bienvenido a Servineo!</h3>
        <p className="text-gray-700 leading-relaxed text-base">
          Te guiaremos por las principales funciones de la plataforma para que aproveches al máximo nuestra red de profesionales verificados.
        </p>
      </div>
    ),
    position: 'center',
  },
  {
    selector: '#tour-search-bar',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Búsqueda inteligente</h4>
        <p className="text-gray-600 leading-relaxed">
          Encuentra el profesional ideal escribiendo el servicio que necesitas.
        </p>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '#tour-map-section',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Mapa interactivo</h4>
        <p className="text-gray-600 leading-relaxed">
          Visualiza en tiempo real la ubicación de los profesionales disponibles en tu zona.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#tour-inspiration-section',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Inspírate con proyectos reales</h4>
        <p className="text-gray-600 leading-relaxed">
          Explora una galería de trabajos completados por nuestros profesionales.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#tour-recent-offers',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Ofertas Recientes</h4>
        <p className="text-gray-600 leading-relaxed">
          Revisa las últimas ofertas de servicios publicadas por los Fixers.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#tour-services-section',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Catálogo de Servicios</h4>
        <p className="text-gray-600 leading-relaxed">
          Desde plomería hasta carpintería, explora todas las categorías disponibles.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#tour-how-it-works',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">¿Cómo funciona?</h4>
        <p className="text-gray-600 leading-relaxed">
          Encuentra y contrata al profesional ideal en simples pasos.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#tour-cta-section',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">¿Listo para empezar?</h4>
        <p className="text-gray-600 leading-relaxed">
          Únete a miles de personas que ya encontraron al profesional perfecto.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#footer-principal',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Información y Soporte</h4>
        <p className="text-gray-600 leading-relaxed">
          Aquí encuentras enlaces útiles, contacto y la opción de reiniciar este tour.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#tour-auth-buttons-desktop',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Tu Cuenta Personal</h4>
        <p className="text-gray-600 leading-relaxed">
          Regístrate o inicia sesión para contratar servicios, gestionar tus pedidos y mucho más.
        </p>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '#tour-auth-buttons-mobile',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Tu Cuenta Personal</h4>
        <p className="text-gray-600 leading-relaxed">
          Regístrate o inicia sesión para contratar servicios, gestionar tus pedidos y mucho más.
        </p>
      </div>
    ),
    position: 'bottom',
  },
];