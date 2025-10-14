'use client'

import React, { useState } from 'react'
import jobs from '@/jsons/jobs.json'
import { JobCard } from './JobCard'
import { JobListEmpty } from '@/componets/JobListEmpty'

export const TrabajosRecientes = () => {

    const [visible, setVisible] = useState(10)
    const [initial, setInitial] = useState(0)
    const [handleOption, setHandleOption] = useState("todo")
    
    const categorias = ["todo", ...new Set(jobs.map(item => item.categoria))]

    const updateList = () => {
      setInitial( initial + 10 )
      setVisible( visible + 10 )
    }

    const updateListPrevius = () => {
      setInitial(initial - 10)
      setVisible(visible - 10)
    }
    const handleSelect = (e:any) => {
      setHandleOption(e.target.value)
    }

  return (
    <>
      <h1 className='text-[25px] text-center text-2xl font-bold text-gray-900 mb-[20px] mt-[10px]'> Trabajos recientes </h1>
      
      <div className='flex flex-row ml-[10px] '>
        <span className='text-[20px] font-bold text-gray-900 mb-[20px] mr-[5px]'> Buscar por categoria: </span>
        <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[20px] focus:ring-blue-700 focus:border-blue-600 block h-[40px] w-[100px] p-2.5 dark:bg-blue-500 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={handleOption} onChange={handleSelect} id="categorias">
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
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
                      tiempo={item.tiempoPublicado} 
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
          // el boton de ver siguiente solo se muestra si el usuario ya avanzo una pagina
          initial === 10 &&
            <button
              className='bg-[#d39625] hover:bg-[#1834c2] duration-150 text-white h-9 w-40 rounded-[8px]'
              onClick={updateListPrevius}
            >
              Ver anteriores
            </button>
        }
        {
          // el boton de ver mas solo se muestra cuando hay 10 o mas jobs en pantalla
          jobs
            .slice()
            .reverse()
            .filter(item => handleOption === "todo" || item.categoria === handleOption)
            .filter(item => item.activo === true)
            .slice(initial, visible)
            .length >= 10 &&
          visible < jobs.length &&
            <button 
              className='bg-[#2585d3] hover:bg-[#1834c2] duration-150 text-white h-9 w-40 rounded-[8px]'
              onClick={updateList}
            > 
              Ver mas 
            </button> 
        }
      </div>
    </>
  )
}
