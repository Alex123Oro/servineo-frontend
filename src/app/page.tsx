"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTour, StepType } from '@reactour/tour';
import Carrusel from './Home/Carrusel/Carrusel';
import { TrabajosRecientes } from '../components/TrabajosRecientes';
import Footer from './Home/Footer/Footer';
import Buscador from './Home/Buscador/Buscador';
import ServiciosPage from './servicios/servicios';

const Map = dynamic(() => import('@/app/busqueda/components/map/Map'), { ssr: false });

// --- LÓGICA DE LA GUÍA ---
const tourSteps: StepType[] = [
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
    selector: '#buscador-principal',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Búsqueda inteligente</h4>
        <p className="text-gray-600 leading-relaxed">
          Encuentra el profesional ideal escribiendo el servicio que necesitas y tu ubicación.
          Nuestro sistema te mostrará los mejores resultados cercanos a ti.
        </p>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '#carrusel-inspiracion',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Inspírate con proyectos reales</h4>
        <p className="text-gray-600 leading-relaxed">
          Explora una galería de trabajos completados por nuestros profesionales. Cada proyecto incluye detalles y calificaciones de clientes satisfechos.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#mapa',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Mapa interactivo</h4>
        <p className="text-gray-600 leading-relaxed">
          Visualiza en tiempo real la ubicación de los profesionales disponibles.
          Haz zoom y explora tu zona para encontrar el más cercano.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#trabajos-recientes',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Trabajos recientes verificados</h4>
        <p className="text-gray-600 leading-relaxed">
          Revisa los servicios más recientes con calificaciones auténticas de clientes. La transparencia es nuestra prioridad.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#servicios-disponibles',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Catálogo completo de servicios</h4>
        <p className="text-gray-600 leading-relaxed">
          Desde plomería hasta carpintería, explora todas las categorías disponibles. Cada servicio cuenta con profesionales capacitados y verificados.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#cta-final',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">¿No encuentras lo que buscas?</h4>
        <p className="text-gray-600 leading-relaxed">
          Si no encuentras un servicio específico, puedes solicitar uno personalizado o hablar con un asesor.
          Estamos aquí para ayudarte con cualquier proyecto.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#footer-principal',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Información y soporte</h4>
        <p className="text-gray-600 leading-relaxed">
          Encuentra enlaces útiles, información de contacto, políticas de privacidad y la opción de reiniciar este tour cuando lo necesites.
        </p>
      </div>
    ),
    position: 'top',
  },
  {
    selector: '#header-auth',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Tu cuenta personal</h4>
        <p className="text-gray-600 leading-relaxed">
          Regístrate o inicia sesión para contratar servicios, gestionar tus pedidos, guardar favoritos y mucho más.
        </p>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '#header-auth-mobile',
    content: (
      <div>
        <h4 className="font-bold text-lg mb-3 text-gray-800">Tu cuenta personal</h4>
        <p className="text-gray-600 leading-relaxed">
          Regístrate o inicia sesión para contratar servicios, gestionar tus pedidos, guardar favoritos y mucho más.
        </p>
      </div>
    ),
    position: 'bottom',
  },
];
// --- FIN LÓGICA DE LA GUÍA ---

export default function Home() {
  const [searchText, setSearchText] = useState('');
  
  // --- HOOKS DE LA GUÍA ---
  const { setSteps, setIsOpen, setCurrentStep, isOpen } = useTour();

  const startTour = () => {
    setIsOpen(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        const isMobile = window.innerWidth < 1024;
        const filteredSteps = tourSteps.filter(step => {
          if (isMobile) return step.selector !== '#header-auth';
          return step.selector !== '#header-auth-mobile';
        });
        setSteps(filteredSteps);
        setCurrentStep(0);
        setTimeout(() => {
          setIsOpen(true);
        }, 200);
      }, 400);
    }, 100);
  };

  useEffect(() => {
    const tourVisto = localStorage.getItem('servineoTourVisto');
    if (!tourVisto) {
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []); // Dependencias vacías para que solo se ejecute al montar

  useEffect(() => {
    if (!isOpen && localStorage.getItem('servineoTourVisto') !== 'true') {
      localStorage.setItem('servineoTourVisto', 'true');
    }
  }, [isOpen]);
  // --- FIN HOOKS DE LA GUÍA ---


  // --- LÓGICA DE TU COLABORADOR (SCROLL AL #) ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          const interval = setInterval(() => {
            const el = document.querySelector(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              clearInterval(interval);
            }
          }, 100);
        }
      }
    }
  }, []);
  // --- FIN LÓGICA DE TU COLABORADOR ---

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full pt-28 pb-16 px-4 md:px-12 text-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">
            Encuentra el profesional perfecto
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto font-medium">
            Conectamos tu hogar con expertos verificados en Cochabamba
          </p>

          <div id="buscador-principal" className="mb-10 shadow-xl rounded-xl bg-white p-2">
            <Buscador value={searchText} onChange={setSearchText} />
          </div>

          <div className="mb-16">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <span className="font-semibold text-gray-700 text-lg">Búsquedas populares:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Plomero', 'Electricista', 'Pintor', 'Carpintero',
                  'Limpieza', 'Jardineria', 'Soldador', 'Albañil'
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchText(tag)}
                    aria-label={`Escribir ${tag} en el buscador`}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-800 rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="text-center bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
              <p className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">1,000+</p>
              <p className="text-gray-700 text-lg font-medium">Profesionales</p>
            </div>
            <div className="text-center bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
              <p className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">5,000+</p>
              <p className="text-gray-700 text-lg font-medium">Trabajos realizados</p>
            </div>
            <div className="text-center bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
              <p className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">4.8 ★ </p>
              <p className="text-gray-700 text-lg font-medium">Calificación promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel Section */}
      <section id="carrusel-inspiracion" className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Inspiración para tu hogar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre ideas y proyectos realizados por nuestros profesionales expertos
            </p>
          </div>
          <Carrusel />
        </div>
      </section>

      {/* Mapa Section */}
      <section id="mapa" className="w-full py-16 px-4 bg-gray-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Encuentra Servicios Cerca de Ti
          </h2>
          <Map />
        </div>
      </section>

      {/* Trabajos Recientes Section */}
      <section id="trabajos-recientes" className="w-full max-w-7xl mx-auto scroll-mt-24">
        <TrabajosRecientes />
      </section>

      {/* Servicios Disponibles Section (Ocultando el CTA interno) */}
      <div id="servicios-disponibles">
        <ServiciosPage
          showHero={false}
          showAllServices={false}
          title="Servicios Disponibles"
          subtitle="Encuentra el profesional perfecto para cualquier trabajo en tu hogar"
          showCTA={false} 
        />
      </div>

      {/* SOLUCIÓN: Sección CTA movida aquí para que la guía la encuentre */}
      <section id="cta-final" className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 scroll-mt-24">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿No encuentras lo que buscas?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Contáctanos y te ayudamos a encontrar el profesional perfecto para tu proyecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Solicitar servicio personalizado
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Hablar con un asesor
            </button>
          </div>
        </div>
      </section>

      {/* Footer con el botón de reinicio */}
      <div id="footer-principal">
        <Footer onRestartTour={() => {
          localStorage.removeItem('servineoTourVisto');
          startTour();
        }} />
      </div>
    </div>
  );
}