'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from 'next/navigation';

interface Props {   
    idJob: number,
    destacado: boolean,
    imgPath: string,
    titulo: string,
    descripcion: string,
    categoria: string,
    nombre: string,
    apellido: string,
    ubicacion: string,
    tiempo: any,
    calificacion: number,
    telefono: number,
    precio: {
        min: number,
        max: number
    }
}


export const JobCard = ({idJob, destacado, imgPath, titulo, descripcion, categoria, nombre,apellido, ubicacion, tiempo, calificacion, telefono, precio}:Props) => {
    
    const route = useRouter()

    const {min, max} = precio

    const handleClick = () => {
        const phoneNumber = `${591}${telefono}`
        const message = "Hola, quisiera mas informacion acerca del servicio"
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

        window.open(url, "_blank")
    }
    
    const redireccion = () => {
        route.push(`/Home/jobPage?idJob=${idJob}`)
    }

    const categoriaColors: {[key: string]: string} = {
        "Plomería": "text-blue-700 bg-blue-100",
        "Electricidad": "text-yellow-700 bg-yellow-100",
        "Carpintería": "text-amber-800 bg-amber-100",
        "Limpieza": "text-green-700 bg-green-100",
        "Pintura": "text-red-700 bg-red-100",
        "Jardinería": "text-lime-700 bg-lime-100",
        "Default": "text-gray-700 bg-gray-100"
    }

    const categoriaClass = categoriaColors[categoria] || categoriaColors["Default"]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image 
          onClick={redireccion}
          className="object-cover cursor-pointer"
          src={imgPath}
          layout="fill"
          alt={`Imagen de ${titulo}`}
          priority={true}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${categoriaClass}`}>
          {categoria}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{titulo}</h3>
        <p className="text-sm text-gray-600 mb-3 h-8 overflow-hidden">{descripcion}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
            <span>{calificacion}</span>
          </div>
          <span className="font-semibold text-gray-700">Bs. {max}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <span className="font-semibold mr-1">Fixer:</span>
          <span>{nombre} {apellido}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <FiPhone className="w-4 h-4 mr-1" />
          <span>+591 {telefono}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span>{ubicacion}</span>
          <svg className="w-4 h-4 ml-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Hace {tiempo}</span>
        </div>

        <button 
          onClick={handleClick}
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
        >
          <FaWhatsapp className="mr-2" />
          WhatsApp
        </button>
      </div>
    </div>
  )
}
