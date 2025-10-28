'use client'

import React, { useState } from 'react'
import jobs from '../jsons/jobs.json'
import { JobCard } from './JobCard'
import { JobListEmpty } from './JobListEmpty'

export const TrabajosRecientes = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Trabajos recientes realizados
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre los proyectos que nuestros profesionales han completado recientemente
          </p>
        </div>

        {jobs.length === 0 ? (
          <JobListEmpty />
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {jobs
              .slice()
              .reverse()
              .filter(item => item.activo === true)
              .slice(0, 8)
              .map((item, index) => (
                <JobCard
                  key={index}
                  idJob={jobs.indexOf(item)}
                  destacado={item.destacado}
                  imgPath={item.imagen}
                  titulo={item.titulo}
                  descripcion={item.descripcion}
                  categoria={item.categoria}
                  nombre={item.nombreFixer}
                  apellido={item.apellidoFixer}
                  ubicacion={item.ubicacion}
                  tiempo={item.tiempoPublicado}
                  calificacion={item.calificacion}
                  telefono={item.telefono}
                  precio={{
                    min: item.precio.min,
                    max: item.precio.max,
                  }}
                />
              ))}
          </div>
        )}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Ver más
          </button>
        </div>
      </div>
    </section>
  );
};
