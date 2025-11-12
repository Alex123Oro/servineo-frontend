"use client";
import { services } from './data';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function ServiciosPage({
  showHero = true,
  showAllServices = true,
  showCTA = true,
  title,
  subtitle,
}: {
  showHero?: boolean;
  showAllServices?: boolean;
  showCTA?: boolean;
  title?: string;
  subtitle?: string;
}) {
  // Dataset de servicios importado arriba
  const servicesToShow = showAllServices ? services : services.slice(0, 6);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // Navegación por teclado entre tarjetas: flechas y Home/End + Enter/Espacio para abrir
  const handleCardKey = (e: React.KeyboardEvent<HTMLDivElement>, idx: number, slug: string) => {
    const cards = document.querySelectorAll('[data-service-card="true"]');
    const last = cards.length - 1;
    let target = idx;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = Math.min(idx + 1, last);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = Math.max(idx - 1, 0);
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      case 'Enter':
      case ' ': // Space
        router.push(`/servicios/${slug}`);
        e.preventDefault();
        return;
      default:
        return; // no interceptar otras teclas
    }

    setActiveIndex(target);
    (cards[target] as HTMLElement)?.focus();
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      {showHero && (
        <section className="w-full py-16 px-4 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {title || 'Servicios disponibles'}
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90">
              {subtitle || 'Encuentra el profesional perfecto para cualquier trabajo en tu hogar'}
            </p>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {!showHero && title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
              {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="grid">
            {servicesToShow.map((service, index) => (
              <div
                key={index}
                tabIndex={activeIndex === index ? 0 : -1}
                role="button"
                aria-label={`Abrir detalles del servicio ${service.name}`}
                data-service-card="true"
                onKeyDown={(e) => handleCardKey(e, index, service.slug)}
                onClick={() => router.push(`/servicios/${service.slug}`)}
                onFocus={() => setActiveIndex(index)}
                className="select-none bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl">{service.icon}</div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {service.demand}% de demanda
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${service.demand}%` }}
                    ></div>
                  </div>
                </div>

                {/* Acciones dentro de la tarjeta removidas para diseño más limpio */}
              </div>
            ))}
          </div>

          {/* Botón Ver más servicios */}
          {!showAllServices && (
            <div className="flex justify-center mt-12">
              <Link
                href="/servicios"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Ver más
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      {showCTA && (
        <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
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
      )}
    </div>
  );
}
