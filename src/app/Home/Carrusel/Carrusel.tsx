"use client";
import { useState, useEffect, TouchEvent } from "react";
import Image from "next/image";
import styles from "./Carrusel.module.css";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    "image": "/Carpinteria.webp",
    "title": "Carpintería",
    "subtitle": "Trabajos en madera de calidad",
    "description": "Carpintería y muebles a medida"
  },
  {
    "image": "/Electricistas.webp",
    "title": "Electricistas",
    "subtitle": "Soluciones eléctricas seguras",
    "description": "Instalaciones y reparaciones eléctricas"
  },
  {
    "image": "/Limpieza.webp",
    "title": "Limpieza",
    "subtitle": "Espacios impecables, vida saludable",
    "description": "Servicios de limpieza para hogares y oficinas"
  },
  {
    "image": "/Pintura.webp",
    "title": "Pintura",
    "subtitle": "Renueva tus espacios con color",
    "description": "Pintura de interiores y exteriores"
  },
  {
    "image": "/Plomeria.webp",
    "title": "Plomería",
    "subtitle": "Soluciones expertas para tus tuberías",
    "description": "Reparación e instalación de plomería"
  }
];

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

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
    }, 8000); // Change slide every 5 seconds
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
            src={slide.image}
            alt={slide.title}
            layout="fill"
            objectFit="cover"
            className={styles.image}
            priority={index === 0} // Carga la primera imagen con prioridad
          />
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <span className={styles.title}>{slide.title}</span>
            <h2 className={styles.subtitle}>{slide.subtitle}</h2>
            <p className={styles.description}>{slide.description}</p>
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