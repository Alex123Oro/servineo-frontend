'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

const OfertasPage = () => {
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const jobs = [
    {
      id: 1,
      destacado: false,
      imagen: '/images/imagenNoDisponible.jpg',
      titulo: 'Pintura de paredes',
      descripcion: 'Pintado y mantenimiento de paredes en interiores y exteriores.',
      categoria: 'pintura',
      nombreFixer: 'Mario',
      apellidoFixer: 'Perez',
      ubicacion: 'cochabamba',
      tiempoPublicado: '4 dias',
      telefono: 75986518,
      activo: true,
      precio: { min: 210, max: 260 },
    },
    {
      id: 2,
      destacado: false,
      imagen: '/images/pintura.jpg',
      titulo: 'Pintura de techos',
      descripcion: 'Pintado y mantenimiento de techos interiores.',
      categoria: 'pintura',
      nombreFixer: 'Fernando',
      apellidoFixer: 'Aguilar',
      ubicacion: 'cochabamba',
      tiempoPublicado: '7 horas',
      calificacion: 4.4,
      telefono: 75986518,
      activo: true,
      precio: { min: 210, max: 260 },
    },
    {
      id: 3,
      destacado: true,
      imagen: '/images/limpieza.jpg',
      titulo: 'Limpieza de alfombras',
      descripcion: 'Servicio especializado en limpieza de alfombras.',
      categoria: 'aseo',
      nombreFixer: 'Lucia',
      apellidoFixer: 'Fernandez',
      ubicacion: 'cochabamba',
      tiempoPublicado: '5 horas',
      calificacion: 4.7,
      telefono: 75986518,
      activo: true,
      precio: { min: 130, max: 210 },
    },
    {
      id: 4,
      destacado: false,
      imagen: '/images/carpintero.jpg',
      titulo: 'Reparación de sillas',
      descripcion: 'Arreglo de sillas y muebles dañados.',
      categoria: 'carpinteria',
      nombreFixer: 'Pedro',
      apellidoFixer: 'Salazar',
      ubicacion: 'cochabamba',
      tiempoPublicado: '2 días',
      calificacion: 4.2,
      telefono: 75986518,
      activo: true,
      precio: { min: 180, max: 250 },
    },
    {
      id: 5,
      destacado: true,
      imagen: '/images/electricista.jpg',
      titulo: 'Instalación de lámparas',
      descripcion: 'Montaje y conexión de lámparas y focos.',
      categoria: 'electricidad',
      nombreFixer: 'Andrea',
      apellidoFixer: 'Vargas',
      ubicacion: 'cochabamba',
      tiempoPublicado: '8 horas',
      calificacion: 4.8,
      telefono: 75986518,
      activo: true,
      precio: { min: 100, max: 160 },
    },
    {
      id: 6,
      destacado: false,
      imagen: '/images/tuberias.jpg',
      titulo: 'Instalación de grifos',
      descripcion: 'Colocación y reparación de grifos en baños y cocinas.',
      categoria: 'plomeria',
      nombreFixer: 'Carlos',
      apellidoFixer: 'Rojas',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 hora',
      calificacion: 4.5,
      telefono: 75986518,
      activo: true,
      precio: { min: 60, max: 90 },
    },
    {
      id: 7,
      destacado: true,
      imagen: '/images/pintura.jpg',
      titulo: 'Pintura decorativa',
      descripcion: 'Diseños y acabados decorativos en paredes.',
      categoria: 'pintura',
      nombreFixer: 'Sofia',
      apellidoFixer: 'Torrez',
      ubicacion: 'cochabamba',
      tiempoPublicado: '4 horas',
      calificacion: 4.9,
      telefono: 75986518,
      activo: true,
      precio: { min: 220, max: 270 },
    },
    {
      id: 8,
      destacado: false,
      imagen: '/images/limpieza.jpg',
      titulo: 'Limpieza profunda',
      descripcion: 'Limpieza detallada de oficinas y departamentos.',
      categoria: 'aseo',
      nombreFixer: 'Maria',
      apellidoFixer: 'Lopez',
      ubicacion: 'cochabamba',
      tiempoPublicado: '6 horas',
      calificacion: 4.6,
      telefono: 75986518,
      activo: true,
      precio: { min: 120, max: 200 },
    },
    {
      id: 9,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Puertas personalizadas',
      descripcion: 'Fabricación e instalación de puertas de madera.',
      categoria: 'carpinteria',
      nombreFixer: 'Juan',
      apellidoFixer: 'Perez',
      ubicacion: 'cochabamba',
      tiempoPublicado: '3 horas',
      calificacion: 4.7,
      telefono: 75986518,
      activo: true,
      precio: { min: 250, max: 350 },
    },
    {
      id: 10,
      destacado: false,
      imagen: '/images/electricista.jpg',
      titulo: 'Reparación de enchufes',
      descripcion: 'Solución de problemas en enchufes y tomacorrientes.',
      categoria: 'electricidad',
      nombreFixer: 'Luis',
      apellidoFixer: 'Gómez',
      ubicacion: 'cochabamba',
      tiempoPublicado: '2 horas',
      calificacion: 4.3,
      telefono: 75986518,
      activo: true,
      precio: { min: 80, max: 120 },
    },
    {
      id: 11,
      destacado: true,
      imagen: '/images/tuberias.jpg',
      titulo: 'Reparacion de tuberias',
      descripcion: 'Fuga de tuberias en cocina, baño, etc.',
      categoria: 'plomeria',
      nombreFixer: 'Carlos',
      apellidoFixer: 'Mamani',
      ubicacion: 'cochabamba',
      tiempoPublicado: '2 horas',
      calificacion: 4.8,
      telefono: 75986518,
      activo: true,
      precio: { min: 50, max: 80 },
    },
    {
      id: 12,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de estanterias',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.1,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 300 },
    },
    {
      id: 13,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de estanterias',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.9,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 300 },
    },
    {
      id: 14,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de estanterias',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 5.0,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 300 },
    },
    {
      id: 15,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de estanterias',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 3.9,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 300 },
    },
    {
      id: 16,
      destacado: true,
      imagen: '/images/carpinteria2.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de muebles variados',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.5,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 300 },
    },
    {
      id: 17,
      destacado: false,
      imagen: '/images/pintura.jpg',
      titulo: 'Pintura para casas',
      descripcion: 'Servicio de pintura para hogares o cualquier superficie',
      categoria: 'pintura',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.8,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 250 },
    },
    {
      id: 18,
      destacado: true,
      imagen: '/images/limpieza.jpg',
      titulo: 'Limpieza y aseo',
      descripcion: 'Servicio de limpieza a hogares y lugares diversos',
      categoria: 'aseo',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.8,
      telefono: 75986518,
      activo: true,
      precio: { min: 100, max: 180 },
    },
    {
      id: 19,
      destacado: true,
      imagen: '/images/carpintero.jpg',
      titulo: 'Muebles a medida',
      descripcion: 'Construccion de estanterias',
      categoria: 'carpinteria',
      nombreFixer: 'Miguel',
      apellidoFixer: 'Condori',
      ubicacion: 'cochabamba',
      tiempoPublicado: '1 dia',
      calificacion: 4.2,
      telefono: 75986518,
      activo: true,
      precio: { min: 200, max: 300 },
    },
    {
      id: 20,
      destacado: false,
      imagen: '/images/electricista.jpg',
      titulo: 'Instalacion electrica',
      descripcion: 'Instalacion de puntos de luz electricos',
      categoria: 'electricidad',
      nombreFixer: 'Ana',
      apellidoFixer: 'Quispe',
      ubicacion: 'cochabamba',
      tiempoPublicado: '5 horas',
      calificacion: 4.0,
      telefono: 75986518,
      activo: true,
      precio: { min: 120, max: 150 },
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (!selectedCategoria) return true; // mostrar todos si no hay filtro
    return job.categoria === selectedCategoria;
  });
  const categoriaColors: { [key: string]: string } = {
    plomeria: 'text-[#1AA7ED] bg-[#E6F7FB]',
    electricidad: 'text-[#2B31E0] bg-[#E6E7FB]',
    carpinteria: 'text-[#2B6AE0] bg-[#E6F0FB]',
    limpieza: 'text-[#2BDDE0] bg-[#E6FBFA]',
    pintura: 'text-[#5E2BE0] bg-[#ECE6FB]',
    jardinería: 'text-[#759AE0] bg-[#EEF3FB]',
    default: 'text-[#2B31E0] bg-[#E6E7FB]',
  };

  const handleWhatsApp = (telefono: number) => {
    const url = `https://wa.me/591${telefono}?text=${encodeURIComponent(
      'Hola, quisiera más información acerca del servicio.',
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16 py-8">
      <section className="w-full pt-16 py-16 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Ofertas de Trabajo</h1>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Explora las oportunidades disponibles y encuentra el profesional que necesitas
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto mt-12">
        {/* BUSCADOR CENTRADO */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Buscar ofertas de trabajo..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* FILTRO DE CATEGORIAS ALINEADO CON EL GRID */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todo</option>
            <option value="plomeria">Plomería</option>
            <option value="electricidad">Electricidad</option>
            <option value="carpinteria">Carpintería</option>
            <option value="pintura">Pintura</option>
            <option value="aseo">Aseo</option>
          </select>
        </div>
        <div className="mb-4 text-sm opacity-80 px-4">
          {filteredJobs.length} resultados encontrados
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
          {jobs
            .filter((job) => !selectedCategoria || job.categoria === selectedCategoria) // <-- FILTRADO
            .map((job) => {
              const categoriaClass =
                categoriaColors[job.categoria.toLowerCase()] || categoriaColors['default'];
              return (
                <div
                  key={job.id}
                  className="flex flex-col rounded-[10px] justify-around border border-solid border-black/15 shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-black/30 bg-white p-3 min-h-[370px] max-w-[260px] min-w-[260px]"
                >
                  <div className="flex flex-row justify-between mb-[5px]">
                    {job.destacado ? (
                      <span className="border border-solid pr-[5px] pl-[5px] text-[#5E2BE0] rounded-[8px] text-[12px] font-semibold">
                        Destacado
                      </span>
                    ) : (
                      <span className="opacity-0">-</span>
                    )}
                    <span
                      className={`border border-solid border-white/0 rounded-[10px] p-[1px] pr-[5px] pl-[5px] text-[13px] font-semibold ${categoriaClass}`}
                    >
                      {job.categoria}
                    </span>
                  </div>

                  <Image
                    className="object-cover rounded-lg cursor-pointer"
                    src={job.imagen}
                    alt={job.titulo}
                    width={300}
                    height={200}
                  />

                  <div className="flex flex-row justify-between items-center mt-2">
                    <strong className="text-[95%]">{job.titulo}</strong>
                    <span className="text-[11px] opacity-70">hace {job.tiempoPublicado}</span>
                  </div>

                  <hr className="opacity-20 my-1" />

                  <strong
                    className="opacity-80 text-sm truncate whitespace-nowrap overflow-hidden"
                    title={job.descripcion}
                  >
                    {job.descripcion}
                  </strong>

                  <div className="flex flex-row gap-[5px] mt-1 text-sm">
                    <strong className="opacity-70">Fixer:</strong>
                    <span className="opacity-70">
                      {job.nombreFixer} {job.apellidoFixer}
                    </span>
                  </div>

                  <div className="flex flex-row justify-between items-center gap-[5px] opacity-70 text-sm mt-1">
                    <div className="flex flex-row items-center">
                      <span>📞 +591 {job.telefono}</span>
                    </div>
                    <div>
                      <span>
                        Bs. {job.precio.min}-{job.precio.max}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center mt-2">
                    <button
                      onClick={() => handleWhatsApp(job.telefono)}
                      className="flex flex-row items-center justify-center cursor-pointer gap-[3px] bg-[#759AE0] hover:bg-[#1AA7ED] duration-150 text-white h-9 w-40 rounded-[8px]"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </button>
                    <span>⭐{job.calificacion}</span>
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
