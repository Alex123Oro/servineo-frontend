'use client'

import React, { useState, useRef } from 'react'
import jobs from '@/jsons/jobs.json'
import { JobCard } from './JobCard'
import { JobListEmpty } from './JobListEmpty'

export const TrabajosRecientes = () => {

    // cambiar la paginación 8 items por página
    const [visible, setVisible] = useState(8)
    const [initial, setInitial] = useState(0)
    const [handleOption, setHandleOption] = useState("todo")

    const trabajosRecientes = useRef<HTMLDivElement | null>(null)
    
    const categorias = ["todo", ...new Set(jobs.map(item => item.categoria))]

    const updateList = () => {
      setInitial( initial + 8 )
      setVisible( visible + 8 )
      trabajosRecientes.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const updateListPrevius = () => {
      // Proteger límites para no bajar de 0
      setInitial(prev => Math.max(0, prev - 8))
      setVisible(prev => Math.max(8, prev - 8))
      trabajosRecientes.current?.scrollIntoView({ behavior: 'smooth' });
    }
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHandleOption(e.target.value)
    }

  return (
    <section ref={trabajosRecientes}>
      <h1 className='text-[38px] text-center text-2xl font-bold text-gray-900 mb-[20px] mt-[10px]'> Trabajos recientes </h1>
      
      <div className='flex flex-row ml-[10px] '>
        <span className='text-[20px] font-bold text-gray-900 mb-[20px] mr-[5px]'> Buscar por categoria: </span>
        <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[20px] focus:ring-blue-700 focus:border-blue-600 block h-[40px] w-[100px] p-2.5 dark:bg-blue-500 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                value={handleOption} 
                onChange={handleSelect} id="categorias">
          {
            categorias.map( (item, index) => 
              <option value={item} key={index}>{item}</option>
            )
          }
        </select>
      </div>
      
      {
        jobs.length === 0 && 
          <JobListEmpty /> 
      }

      {
        jobs.length > 0 && 
          // grid: 1 col en móvil, 2 en sm, 4 en md+; con gap y padding. Mostrará hasta 8 items por página -> 2 filas x 4 columnas.
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mb-[10px] sm:justify-center justify-items-center">
            {
              jobs
                .slice()
                .reverse()
                .filter(item => handleOption === "todo" || item.categoria === handleOption)
                .slice(initial, visible)
                .map((item, index) => (
                  item.activo === true &&
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
                      fechaDePublicacion={item.fechaDePublicacion} 
                      calificacion={item.calificacion}
                      telefono={item.telefono}
                      precio={{
                          min: item.precio.min,
                          max: item.precio.max
                        }
                      } 
                    /> 
                ))
            } 
          </div>
      }
      
      <div className='flex flex-row justify-center gap-[5px]'>
        {
          // mostrar "Ver anteriores" si ya avanzamos al menos una página (initial >= 8)
          initial >= 8 &&
            <button
              className='cursor-pointer bg-[#2B31E0] hover:bg-[#1AA7ED] duration-150 text-white h-9 w-40 rounded-[8px]'
              onClick={updateListPrevius}
            >
              Ver anteriores
            </button>
        }
        {
          // el boton de ver mas solo se muestra cuando hay 8 o más jobs en la vista filtrada
          jobs
            .slice()
            .reverse()
            .filter(item => handleOption === "todo" || item.categoria === handleOption)
            .filter(item => item.activo === true)
            .slice(initial, visible)
            .length >= 8 &&
          visible < jobs.length &&
            <button 
              className='cursor-pointer bg-[#2B31E0] hover:bg-[#1AA7ED] duration-150 text-white h-9 w-40 rounded-[8px]'
              onClick={updateList}
            > 
              Ver mas 
            </button> 
        }
      </div>
    </section>
  )
}