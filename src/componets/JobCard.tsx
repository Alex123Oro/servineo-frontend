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
    
    const [expandido, setExpandido] = useState(false)
    const route = useRouter()

    const {min, max} = precio

    const handleClick = () => {
        const phoneNumber = `${591}${telefono}`
        const message = "Hola, quisiera mas informacion acerca del servicio"
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

        window.open(url, "_blank")
    }
    
    const redireccion = () => {
        window.open(`/Home/jobPage?idJob=${idJob}`, "_blank")
    }

    const categoriaColors: {[key: string]: string} = {
        "plomeria": "text-blue-700 bg-blue-100",
        "electricidad": "text-yellow-700 bg-yellow-100",
        "carpinteria": "text-amber-800 bg-amber-100",
        "limpieza": "text-green-700 bg-green-100",
        "pintura": "text-red-700 bg-red-100",
        "jardinería": "text-lime-700 bg-lime-100",

        "default": "text-green-900 bg-[#a7f3a7]"
    }

    const categoriaClass = categoriaColors[categoria] || categoriaColors["default"]

  return (
    <>
        <div className={`flex flex-col rounded-[10px] justify-around border border-solid border-black/15 transition-shadow duration-300 hover:shadow-lg hover:shadow-black/30 mr-[5px] mb-[5px] p-3 min-h-[370] max-h-[auto] max-w-[260] min-w-[260]`}>
            <div className='flex flex-row justify-between mb-[5px]'>
                { 
                    <span className={destacado ? `opacity-[100%] border border-solid pr-[5px] pl-[5px] text-[gold] rounded-[8px]` : `opacity-[0%]`}
                    > 
                        Destacado 
                    </span> 
                }
                <span
                    className={`border border-solid border-white/0 rounded-[10px] p-[1px] pr-[5px] pl-[5px] text-[13px] font-semibold ${categoriaClass} bg-[${categoriaClass}]`}
                > 
                    {categoria} 
                </span>
            </div>

            <Image onClick={redireccion} className='object-cover rounded-lg cursor-pointer' src={imgPath} width={300} height={200} alt='imagen del trabajo' priority={true}/>

            <div className='flex flex-row justify-between items-center'>
                <strong className='text-[95%]'> {titulo} </strong>
                <span className='text-[11px]'>hace {tiempo}</span>
            </div>
            
            <hr className='opacity-20'/>

            <strong  
                onClick={() => setExpandido(!expandido)}
                className={`opacity-80 cursor-pointer transition-all duration-300 ${expandido ? "whitespace-normal overflow-visible" : "truncate whitespace-nowrap overflow-hidden"}`}
                title="Haz clic para expandir"
            > 
                {descripcion} 
            </strong>

            <div className='flex flex-row gap-[5px]'>
                <strong className='opacity-70'> Fixer: </strong>
                <span className='opacity-70'>{nombre}</span>
                <span className='opacity-70'>{apellido}</span>
            </div>

            <div className='flex flex-row justify-between items-center gap-[5px] opacity-70'>
                <div className='flex flex-row items-center'>
                    <FiPhone />
                    <span> +591 {telefono} </span>
                </div>
                <div>
                    <span> Bs.{min}-{max} </span>
                </div>
            </div>

            <div className='flex flex-row justify-between items-center'>
                <button 
                    className='flex flex-row items-center justify-center gap-[3px] bg-[#25D366] hover:bg-[#1ebe5d] duration-150 text-white h-9 w-40 rounded-[8px]'
                    onClick={handleClick}
                >
                    <FaWhatsapp />
                    WhatsApp 
                </button>
                <span>⭐{calificacion}</span>
            </div>
        </div>
    </>
  )
}
