'use client';

import React from 'react';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

const OfertasPage = () => {
  const jobs = [
    {
      id: 1,
      destacado: true,
      imagen: '/images/tuberias.jpg',
      titulo: 'Reparación de tuberías',
      descripcion: 'Fuga de tuberías en cocina, baño, etc.',
      categoria: 'Plomería',
      nombreFixer: 'Carlos',
      apellidoFixer: 'Mamani',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '2 horas',
      calificacion: 4.8,
      telefono: 75986518,
      precio: { min: 50, max: 80 },
    },

    {
      id: 2,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construcción de estanterías',
      categoria: 'Carpintería',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.2,
      telefono: 75986518,
      precio: { min: 200, max: 300 },
    },
    {
      id: 3,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construcción de estanterías',
      categoria: 'Carpintería',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.2,
      telefono: 75986518,
      precio: { min: 200, max: 300 },
    },
    {
      id: 4,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construcción de estanterías',
      categoria: 'Carpintería',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.2,
      telefono: 75986518,
      precio: { min: 200, max: 300 },
    },
    {
      id: 5,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construcción de estanterías',
      categoria: 'Carpintería',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.2,
      telefono: 75986518,
      precio: { min: 200, max: 300 },
    },
    {
      id: 6,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construcción de estanterías',
      categoria: 'Carpintería',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.2,
      telefono: 75986518,
      precio: { min: 200, max: 300 },
    },
    {
      id: 7,
      destacado: true,
      imagen: '/images/carpinteria2.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de muebles variados',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.5,
      telefono: 75986518,
      precio: { min: 200, max: 300 },
    },
    {
      id: 8,
      destacado: false,
      imagen: '/images/pintura.jpg',
      titulo: 'Pintura para casas',
      descripcion: 'Servicio de pintura para hogares o cualquier superficie',
      categoria: 'Pintura',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.8,
      telefono: 75986518,
      precio: { min: 200, max: 250 },
    },
    {
      id: 9,
      destacado: true,
      imagen: '/images/limpieza.jpg',
      titulo: 'Limpieza y aseo',
      descripcion: 'Servicio de limpieza a hogares y lugares diversos',
      categoria: 'Limpieza',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '1 día',
      calificacion: 4.8,
      telefono: 75986518,
      precio: { min: 100, max: 180 },
    },

    {
      id: 10,
      destacado: false,
      imagen: '/images/electricista.jpg',
      titulo: 'Instalación eléctrica',
      descripcion: 'Instalación de puntos de luz eléctricos',
      categoria: 'Electricidad',
      nombreFixer: 'Ana',
      apellidoFixer: 'Quispe',
      ubicacion: 'Cochabamba',
      tiempoPublicado: '5 horas',
      calificacion: 4.0,
      telefono: 75986518,
      precio: { min: 120, max: 150 },
    },

    // Puedes agregar más trabajos aquí
  ];

  const categoriaColors: { [key: string]: string } = {
    Plomería: 'text-blue-700 bg-blue-100',
    Electricidad: 'text-yellow-700 bg-yellow-100',
    Carpintería: 'text-amber-800 bg-amber-100',
    Limpieza: 'text-green-700 bg-green-100',
    Pintura: 'text-red-700 bg-red-100',
    Default: 'text-gray-700 bg-gray-100',
  };

  const handleWhatsApp = (telefono: number) => {
    const url = `https://wa.me/591${telefono}?text=${encodeURIComponent('Hola, quisiera más información acerca del servicio')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Ofertas de Trabajo Disponibles
        </h1>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {jobs.map((job) => {
            const categoriaClass = categoriaColors[job.categoria] || categoriaColors['Default'];
            return (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={job.imagen}
                    alt={job.titulo}
                    fill
                    className="object-cover cursor-pointer"
                  />
                  <div
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${categoriaClass}`}
                  >
                    {job.categoria}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{job.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-3 h-8 overflow-hidden">
                    {job.descripcion}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="mr-1">⭐</span>
                      <span>{job.calificacion}</span>
                    </div>
                    <span className="font-semibold text-gray-700">Bs. {job.precio.max}</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span className="font-semibold mr-1">Fixer:</span>
                    <span>
                      {job.nombreFixer} {job.apellidoFixer}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span>📞 +591 {job.telefono}</span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span>📍 {job.ubicacion}</span>
                    <span className="ml-3">⏰ {job.tiempoPublicado}</span>
                  </div>

                  <button
                    onClick={() => handleWhatsApp(job.telefono)}
                    className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2" /> WhatsApp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OfertasPage;
