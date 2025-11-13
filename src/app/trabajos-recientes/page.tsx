'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import jobs from '@/jsons/jobs.json'
import { JobCard } from '@/components/JobCard'
import { JobListEmpty } from '@/components/JobListEmpty'

function TrabajosRecientesContent() {
  const [visible, setVisible] = useState(10)
  const [initial, setInitial] = useState(0)
  const [handleOption, setHandleOption] = useState("todo")
  const searchParams = useSearchParams()
  const router = useRouter()

  // Obtener categoría de la URL si existe
  useEffect(() => {
    const categoria = searchParams?.get('categoria')
    if (categoria) {
      setHandleOption(categoria)
    }
  }, [searchParams])
 
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
    const newCategoria = e.target.value
    setHandleOption(newCategoria)
    setInitial(0)
    setVisible(10)
    
    // Actualizar URL con la nueva categoría
    if (newCategoria === 'todo') {
      router.push('/trabajos-recientes')
    } else {
      router.push(`/trabajos-recientes?categoria=${newCategoria}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Espaciador para el header fijo */}
      <div className="h-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón de regresar */}
        <button 
          onClick={() => router.push('/')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <span className="mr-2">←</span> Volver al inicio
        </button>

        <h1 className='text-[25px] text-center text-2xl font-bold text-gray-900 mb-[20px] mt-[10px]'> 
          Trabajos recientes 
        </h1>
       
        <div className='flex flex-row ml-[10px] mb-[20px] items-center justify-center'>
          <span className='text-[20px] font-bold text-gray-900 mr-[5px]'> Buscar por categoría: </span>
          <select 
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[20px] focus:ring-blue-700 focus:border-blue-600 block h-[40px] w-[120px] p-2.5 cursor-pointer' 
            value={handleOption} 
            onChange={handleSelect} 
            id="categorias"
          >
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
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 p-4">
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
       
        <div className='flex flex-row justify-center gap-[5px] mt-[20px]'>
          {
            initial >= 10 &&
              <button
                className='bg-[#d39625] hover:bg-[#b8801f] duration-150 text-white h-9 w-40 rounded-[8px] font-semibold'
                onClick={updateListPrevius}
              >
                Ver anteriores
              </button>
          }
          {
            jobs
              .slice()
              .reverse()
              .filter(item => handleOption === "todo" || item.categoria === handleOption)
              .filter(item => item.activo === true)
              .slice(initial, visible)
              .length >= 10 &&
            visible < jobs.filter(item => handleOption === "todo" || item.categoria === handleOption).length &&
              <button
                className='bg-[#2585d3] hover:bg-[#1c6ba8] duration-150 text-white h-9 w-40 rounded-[8px] font-semibold'
                onClick={updateList}
              >
                Ver más
              </button>
          }
        </div>
      </div>
    </div>
  )
}

export default function TrabajosRecientesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando trabajos...</p>
        </div>
      </div>
    }>
      <TrabajosRecientesContent />
    </Suspense>
  )
}