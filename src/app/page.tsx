



"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Fixer } from "@/app/busqueda/interface/Fixer_Interface";

import UserProfile from "./Home/UserProfile/userProfile";

import Carrusel from "./Home/Carrusel/Carrusel";
import { TrabajosRecientes } from '../components/TrabajosRecientes';
import Footer from './Home/Footer/Footer';
import Buscador from './Home/Buscador/Buscador';
import ServiciosPage from "./servicios/servicios";
// Importa otros componentes según sea necesario
// Dynamic import para Leaflet Map (evita errores SSR)
const Map = dynamic(() => import("@/app/busqueda/components/map/Map"), { ssr: false });

export default function Home() {
  const [fixers, setFixers] = useState<Fixer[]>([]);
  // Nuevo: estado controlado para el buscador
  const [searchText, setSearchText] = useState("");

  


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

          {/* Buscador Component */}
          <div className="mb-10 shadow-xl rounded-xl bg-white p-2">
            {/* Controlamos el valor desde Home */}
            <Buscador value={searchText} onChange={setSearchText} />
          </div>

          {/* Popular Searches */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <span className="font-semibold text-gray-700 text-lg">Búsquedas populares:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {["Plomero", "Electricista", "Pintor", "Carpintero", "Limpieza", "Jardineria", "Soldador", "Albañil"].map((tag) => (
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

          {/* Statistics */}
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
              <p className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">4.8★</p>
              <p className="text-gray-700 text-lg font-medium">Calificación promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel Section */}
      <section className="w-full py-16 px-4 bg-white">
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
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Encuentra Servicios Cerca de Ti
          </h2>
          {/* Pasamos fixers al mapa */}
        
          <Map  /> 
        </div>
      </section>
      
      {/* Trabajos Recientes Section */}
      <section className="w-full max-w-7xl mx-auto">
        <TrabajosRecientes />
      </section>

      {/* servicios Component */}
      <ServiciosPage 
        showHero={false} 
        showAllServices={false}
        title="Servicios Disponibles" 
        subtitle="Encuentra el profesional perfecto para cualquier trabajo en tu hogar" 
      />
      
      {/* Footer Component */}
      <Footer />
     
    </div>
  );
}

