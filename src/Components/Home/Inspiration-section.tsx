"use client";
import { useState, useEffect, TouchEvent } from "react";
import Image from "next/image";

interface Slide {
  image: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/Carpinteria.webp",
    category: "CARPINTERÍA",
    title: "Muebles y carpintería a medida",
    subtitle: "Carpintería y muebles a medida",
    description: "Profesionales especializados en trabajos de carpintería y muebles personalizados"
  },
  {
    image: "/Electricistas.webp",
    category: "ELECTRICIDAD",
    title: "Soluciones eléctricas seguras",
    subtitle: "Instalaciones y reparaciones eléctricas",
    description: "Expertos en instalaciones eléctricas residenciales e industriales"
  },
  {
    image: "/Limpieza.webp",
    category: "LIMPIEZA",
    title: "Espacios impecables, vida saludable",
    subtitle: "Servicios de limpieza profesional",
    description: "Limpieza completa para hogares y oficinas con productos eco-amigables"
  },
  {
    image: "/Pintura.webp",
    category: "PINTURA",
    title: "Renueva tus espacios con color",
    subtitle: "Pintura de interiores y exteriores",
    description: "Transforma tu hogar con colores que reflejan tu personalidad"
  },
  {
    image: "/Plomeria.webp",
    category: "PLOMERÍA",
    title: "Soluciones expertas para tus tuberías",
    subtitle: "Reparación e instalación de plomería",
    description: "Soluciones rápidas y efectivas para todos tus problemas de plomería"
  }
];

const PREFETCH_TIMEOUT_MS = 3000;
const fallbackSrc = "/fallback-image.svg";
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz48c3RvcCBvZmZzZXQ9JzAnIHN0b3AtY29sb3I9JyMwZWF1ZWknLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyMxZTNhOGEnLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgZmlsbD0ndXJsKCNnKScvPjwvc3ZnPiI=";

export default function InspirationSection() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>(
    () => Object.fromEntries(slides.map((_, i) => [i, true]))
  );

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Prefetch con verificación por timeout
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const preloadIndexes = [
      currentIndex, 
      (currentIndex + 1) % slides.length,
      (currentIndex - 1 + slides.length) % slides.length
    ];
    
    preloadIndexes.forEach((index) => {
      try {
        const img = new window.Image();
        let settled = false;
        const timer = window.setTimeout(() => {
          if (!settled) {
            setFailedMap(prev => ({ ...prev, [index]: true }));
          }
        }, PREFETCH_TIMEOUT_MS);

        img.onload = () => {
          settled = true;
          window.clearTimeout(timer);
        };
        img.onerror = () => {
          settled = true;
          window.clearTimeout(timer);
          setFailedMap(prev => ({ ...prev, [index]: true }));
        };
        img.src = slides[index].image;
      } catch (e) {
        setFailedMap(prev => ({ ...prev, [index]: true }));
      }
    });
  }, [currentIndex]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      nextSlide();
    }
    if (touchStart - touchEnd < -150) {
      prevSlide();
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Auto-play cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  return (
    <section className="inspiration-section py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Inspiración para tu hogar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre ideas y proyectos realizados por nuestros profesionales expertos
          </p>
        </div>

        {/* Carrusel Container */}
        <div 
          className="carrusel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carrusel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <Image
                src={failedMap[index] ? fallbackSrc : slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'cover' }}
                className="carrusel-image"
                priority={index === 0}
                placeholder="blur"
                blurDataURL={blurDataURL}
                onError={() => {
                  setFailedMap(prev => ({ ...prev, [index]: true }));
                }}
                onLoad={() => {
                  setLoadingMap(prev => ({ ...prev, [index]: false }));
                }}
              />

              {loadingMap[index] && (
                <div className="carrusel-skeleton" />
              )}

              <div className="carrusel-overlay"></div>
              <div className="carrusel-content">
                <span className="carrusel-category">{slide.category}</span>
                <div className="carrusel-text-group">
                  <h2 className="carrusel-title">{slide.title}</h2>
                  <p className="carrusel-subtitle">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={prevSlide} 
            className="carrusel-arrow carrusel-arrow-left"
            aria-label="Diapositiva anterior"
          >
            &#10094;
          </button>
          <button 
            onClick={nextSlide} 
            className="carrusel-arrow carrusel-arrow-right"
            aria-label="Diapositiva siguiente"
          >
            &#10095;
          </button>

          <div className="carrusel-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`carrusel-dot ${currentIndex === index ? 'active' : ""}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}