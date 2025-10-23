'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from 'next/link';

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
    fechaDePublicacion: any,
    calificacion: number,
    telefono: number,
    precio: {
        min: number,
        max: number
    }
}


export const JobCard = ({idJob, destacado, imgPath, titulo, descripcion, categoria, nombre, apellido, ubicacion, fechaDePublicacion, calificacion, telefono, precio}:Props) => {
    
    const [expandido, setExpandido] = useState(false)
    const [fechaLocal, setFechaLocal] = useState("")
    const [tiempoPasado, setTiempoPasado] = useState("")
    // estado para controlar si hay algun error al cargar la imagen
    const [diasPasados, setDiasPasados] = useState(0)
    const [imageLink, setImageLink] = useState(imgPath)
    
    const {min, max} = precio

    useEffect(() => {
        setImageLink(imgPath)
    }, [idJob, imgPath])

    useEffect(() => {
        const date = new Date(fechaDePublicacion);
        const formatted = new Intl.DateTimeFormat("es-BO", {
        dateStyle: "medium"
        }).format(date)

        setFechaLocal(formatted)
    }, [fechaDePublicacion])

    useEffect(() => {
        const calcularTiempo = () => {
        const fechaPasada = new Date(fechaDePublicacion);
        const ahora = new Date();

        const diffMs = ahora.getTime() - fechaPasada.getTime()

        const segundos = Math.floor(diffMs / 1000)
        const minutos = Math.floor(segundos / 60)
        const horas = Math.floor(minutos / 60)
        const dias = Math.floor(horas / 24)
        setDiasPasados(dias)
        const meses = Math.floor(dias / 30)
        const años = Math.floor(dias / 365)

        let resultado = "";

        if (años > 0) resultado = `hace ${años} año${años > 1 ? "s" : ""}`
        else if (meses > 0) resultado = `hace ${meses} mes${meses > 1 ? "es" : ""}`
        else if (dias > 0) resultado = `hace ${dias} día${dias > 1 ? "s" : ""}`
        else if (horas > 0) resultado = `hace ${horas} hora${horas > 1 ? "s" : ""}`
        else if (minutos > 0) resultado = `hace ${minutos} minuto${minutos > 1 ? "s" : ""}`
        else resultado = "hace unos segundos"

        setTiempoPasado(resultado)
    }

    calcularTiempo();

        // para actualizar cada minuto
        const intervalo = setInterval(calcularTiempo, 60 * 1000);
        return () => clearInterval(intervalo);
    }, [fechaDePublicacion]);

    const handleClick = () => {
        const phoneNumber = `${591}${telefono}`
        const message = "Hola, quisiera mas informacion acerca del servicio"
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

        window.open(url, "_blank")
    }

    const categoriaColors: {[key: string]: string} = {
        "plomeria": "text-[#1AA7ED] bg-[#E6F7FB]",
        "electricidad": "text-[#2B31E0] bg-[#E6E7FB]",
        "carpinteria": "text-[#2B6AE0] bg-[#E6F0FB]",
        "limpieza": "text-[#2BDDE0] bg-[#E6FBFA]",
        "pintura": "text-[#5E2BE0] bg-[#ECE6FB]",
        "jardinería": "text-[#759AE0] bg-[#EEF3FB]",

        "default": "text-[#2B31E0] bg-[#E6E7FB]"
    }

    const categoriaClass = categoriaColors[categoria] || categoriaColors["default"]

  return (
    <>
        <div className={`flex flex-col rounded-[10px] gap-1 justify-around border border-solid border-black/15 shadow-md transition-shadow duration-300 hover:shadow-lg hover:shadow-black/30 mr-[5px] mb-[5px] p-3 min-h-auto max-w-[280px] min-w-0 w-full`}>
            <div className='flex flex-row justify-between mb-[5px]'>
                { 
                    <span className={(diasPasados < 10) ? `opacity-[100%] border border-solid pr-[5px] pl-[5px] text-[#5E2BE0] rounded-[8px]` : `opacity-[0%]`}
                    > 
                        Nuevo 
                    </span> 
                }
                <span
                    className={`border border-solid border-white/0 rounded-[10px] p-[1px] pr-[5px] pl-[5px] text-[13px] font-semibold ${categoriaClass}`}
                > 
                    {categoria} 
                </span>
            </div>

            <Link href={`/Home/jobPage?idJob=${idJob}`}>
                <Image className='object-cover rounded-lg cursor-pointer bg-[#2BDDE0]' src={imageLink} width={300} height={200} alt='' priority={true} onError={() => setImageLink('/images/imagenNoDisponible.jpg')}/>   
            </Link>

            <div className='flex flex-row justify-between items-center'>
                <strong className='text-[95%]'> {titulo} </strong>
                <span className='text-[11px]'>{tiempoPasado}</span>
            </div>
            
            <hr className='opacity-20'/>

            <strong  
                onClick={() => setExpandido(!expandido)}
                className={`opacity-80 cursor-pointer transition-all duration-300 ${expandido ? "whitespace-normal overflow-visible" : "truncate whitespace-nowrap overflow-hidden"}`}
                title="Haz clic para expandir"
            > 
                {descripcion} 
            </strong>

            <div className='opacity-70'>
                <span> Publicado el </span>
                <span> {fechaLocal} </span>
            </div>

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
                    className='flex flex-row items-center justify-center cursor-pointer gap-[3px] bg-[#759AE0] hover:bg-[#1AA7ED] duration-150 text-white h-9 w-40 rounded-[8px]'
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