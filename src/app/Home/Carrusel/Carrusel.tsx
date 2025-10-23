"use client";
import { useState, useEffect, TouchEvent } from "react";
import Image from "next/image";
import styles from "./Carrusel.module.css";

interface Slide {
  image: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    "image": "/Carpinteria.webp",
    "category": "Carpintería",
    "title": "Trabajos en madera de calidad",
    "subtitle": "Carpintería y muebles a medida",
    "description": "Profesionales especializados en trabajos de carpintería y muebles personalizados"
  },
  {
    "image": "/Electricistas.webp",
    "category": "Electricidad",
    "title": "Soluciones eléctricas seguras",
    "subtitle": "Instalaciones y reparaciones eléctricas",
    "description": "Expertos en instalaciones eléctricas residenciales e industriales"
  },
  {
    "image": "/Limpieza.webp",
    "category": "Limpieza",
    "title": "Espacios impecables, vida saludable",
    "subtitle": "Servicios de limpieza profesional",
    "description": "Limpieza completa para hogares y oficinas con productos eco-amigables"
  },
  {
    "image": "/Pintura.webp",
    "category": "Pintura",
    "title": "Renueva tus espacios con color",
    "subtitle": "Pintura de interiores y exteriores",
    "description": "Transforma tu hogar con colores que reflejan tu personalidad"
  },
  {
    "image": "/Plomeria.webp",
    "category": "Plomería",
    "title": "Soluciones expertas para tus tuberías",
    "subtitle": "Reparación e instalación de plomería",
    "description": "Soluciones rápidas y efectivas para todos tus problemas de plomería"
  }
];

const PREFETCH_TIMEOUT_MS = 3000; // Si no carga en 3s, activar fallback
const fallbackSrc = "/fallback-image.svg";
// Blur genérico (tiny SVG) para placeholder
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9J2cnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz48c3RvcCBvZmZzZXQ9JzAnIHN0b3AtY29sb3I9JyMwZWF1ZWknLz48c3RvcCBvZmZzZXQ9JzEnIHN0b3AtY29sb3I9JyMxZTNhOGEnLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCcgZmlsbD0ndXJsKCNnKScvPjwvc3ZnPiI7";

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Fallback por slide
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({});
  // Loading por slide (para skeleton/blur)
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>(
    () => Object.fromEntries(slides.map((_, i) => [i, true]))
  );

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Prefetch con verificación por timeout
  useEffect(() => {
    if (typeof window === "undefined") return;
    slides.forEach((slide, index) => {
      try {
        const img = new window.Image();
        let settled = false;
        const timer = window.setTimeout(() => {
          if (!settled) {
            // Si no se resolvió en X ms, marcamos fallback
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
        img.src = slide.image;
      } catch (e) {
        setFailedMap(prev => ({ ...prev, [index]: true }));
      }
    });
  }, []);

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
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000); // Change slide every 8 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div 
      className={styles.carruselContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}>
          <Image
            src={failedMap[index] ? fallbackSrc : slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: 'cover' }}
            className={styles.image}
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
            <div className={styles.skeleton} />
          )}

          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <span className={styles.category}>{slide.category}</span>
            <h2 className={styles.title}>{slide.title}</h2>
            <p className={styles.subtitle}>{slide.subtitle}</p>
          </div>
        </div>
      ))}

      <button onClick={prevSlide} className={`${styles.arrow} ${styles.leftArrow}`}>
        &#10094;
      </button>
      <button onClick={nextSlide} className={`${styles.arrow} ${styles.rightArrow}`}>
        &#10095;
      </button>

      <div className={styles.dots}>
        {slides.map((slide, index) => (
          <span
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;