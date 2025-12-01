"use client";
import { useState, useEffect, useCallback, TouchEvent } from "react";
// Usamos <img> nativo aquí porque el optimizador de Next puede fallar en dev
// con imágenes locales y provocar logs en la terminal. El elemento nativo
// evita esas solicitudes al optimizador y muestra las imágenes directamente.
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/img/Carpinteria.png",
    category: "CARPINTERÍA",
    title: "Muebles y carpintería a medida",
    subtitle: "Carpintería y muebles a medida",
    description: "Profesionales especializados en trabajos de carpintería y muebles personalizados"
  },
  {
    image: "/img/Electricistas.png",
    category: "ELECTRICIDAD",
    title: "Soluciones eléctricas seguras",
    subtitle: "Instalaciones y reparaciones eléctricas",
    description: "Expertos en instalaciones eléctricas residenciales e industriales"
  },
  {
    image: "/img/Limpieza.png",
    category: "LIMPIEZA",
    title: "Espacios impecables, vida saludable",
    subtitle: "Servicios de limpieza profesional",
    description: "Limpieza completa para hogares y oficinas con productos eco-amigables"
  },
    {
    image: "/img/Pintura.png",
    category: "PINTURA",
    title: "Renueva tus espacios con color",
    subtitle: "Pintores profesionales para interiores y exteriores",
    description: "Transforma tu hogar con acabados de alta calidad y atención al detalle"
  },
    {
    image: "/img/Plomeria.png",
    category: "PLOMERÍA",
    title: "Soluciones de plomería confiables",
    subtitle: "Reparasiones e instalaciones de plomería",
    description: "Soluciones rápidas y efectivas para todos tus problemas de plomería"
  },

];

const PREFETCH_TIMEOUT_MS = 3000;
//const fallbackSrc = "assets/fallback-image.svg";
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

  // PRELOAD IMAGES EFFECT
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
        console.error("Error preloading image:", e);
      }
    });
  }, [currentIndex]);

  // NAVIGATION FUNCTIONS (Wrapped in useCallback to fix lint warning)
  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex]);

  // TOUCH HANDLERS
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

  // AUTOPLAY EFFECT
  useEffect(() => {
    const interval = setInterval(() => {
      // Note: This loops back to start (circular), unlike nextSlide which stops at end.
      // Keeping original logic.
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []); // Empty dependency array is fine here as we use functional state update

  // KEYBOARD NAVIGATION EFFECT
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
  }, [prevSlide, nextSlide]); // Now safe to include these dependencies

   return (
    <section className="inspiration-section py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Inspiración para tu hogar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre ideas y proyectos realizados por nuestros profesionales expertos
          </p>
        </div>

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
              {/* Imagen: parent debe rellenar todo el slide para que la imagen y
                  el overlay mantengan la misma altura del contenedor */}
              <div className="relative w-full h-full rounded-md overflow-hidden">
                <img
                  src={failedMap[index] ? '/assets/fallback-image.svg' : slide.image}
                  alt={slide.title}
                  className="carrusel-image"
                  style={{ objectFit: 'cover' }}
                  decoding="async"
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                  onError={() => {
                    setFailedMap(prev => ({ ...prev, [index]: true }));
                    setLoadingMap(prev => ({ ...prev, [index]: false }));
                  }}
                  onLoad={() => {
                    setLoadingMap(prev => ({ ...prev, [index]: false }));
                  }}
                />
              </div>

              {loadingMap[index] && (
                <div className="carrusel-skeleton" />
              )}

              {/* Badge categoría en esquina superior izquierda */}
              <span className="carrusel-category carrusel-category-top">
                {slide.category}
              </span>

              <div className="carrusel-overlay"></div>
              <div className="carrusel-content">
                <div className="carrusel-text-group">
                  {/* 🔥 TÍTULO con sombra ULTRA GRUESA */}
                  <h2 className="carrusel-title text-white font-bold text-3xl md:text-5xl [text-shadow:_0_0_20px_black,_0_0_12px_black,_0_0_6px_black,_0_0_3px_black]">
                    {slide.title}
                  </h2>
                  
                  {/* 🔥 SUBTÍTULO con sombra gruesa */}
                  <p className="carrusel-subtitle text-white font-medium text-lg md:text-xl [text-shadow:_0_0_12px_black,_0_0_6px_black,_0_0_3px_black]">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={prevSlide} 
            disabled={currentIndex === 0}
            className={`carrusel-arrow carrusel-arrow-left ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide} 
            disabled={currentIndex === slides.length - 1}
            className={`carrusel-arrow carrusel-arrow-right ${currentIndex === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Diapositiva siguiente"
          >
            <ChevronRight className="w-6 h-6" />
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