'use client'

import { useSearchParams } from 'next/navigation'
import jobs from '@/jsons/jobs.json'
import React from 'react'
import Image from 'next/image'


export default function jobPage() {

  const params = useSearchParams()
  const idJob:any = params.get("idJob")

  const job = jobs[idJob]

  return (
    <div className='p-[10px]'>
      <h1 className='text-[25px] text-2xl font-bold text-gray-900 mb-[20px]'> {job.titulo} </h1>

      <div className='flex gap-[9px]'>
        <Image className='object-cover rounded-lg' src={job.imagen} alt='Imagen del trabajo' width={300} height={400}/>
        <div className='flex flex-col gap-[5px]'>
          <span className='opacity-80 text-[20px]'> {job.descripcion} </span>

          <span className=''> Fixer: {job.nombreFixer} {job.apellidoFixer}</span>
          <span> Numero: {job.telefono} </span>
          <span> Calificacion: {job.calificacion} ⭐</span>

          <span> Precio: {job.precio.min} - {job.precio.max} </span>

          <span> Ubicacion: {job.ubicacion} </span>
        </div>
      </div>
    </div>
  )
}
