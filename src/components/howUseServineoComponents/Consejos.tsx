import React from 'react'
import { ConsejosCard } from './ConsejosCard'

const subtitle = "Perfecciona tu uso sobre la plataforma,\naqui tenemos algunos consejos"

const consejos = [
    {
        title:"Filtros",
        imageUrl:"/images/comoUsarSImages/consejoFiltros.png",
        descripcion:"Aplica los filtros de busqueda, palabras claves o consulta nuestro mapa si hay fixers cercanos a tu ubucacion."
    },
    { 
        title:"Calificaciones y reseñas",
        imageUrl:"/images/comoUsarSImages/reseñas.png",
        descripcion:"Consulta las calificaciones y opiniones de otras personas para saber mas sobre el desempeño de cierto fixer."     
    },
    {
        title:"Comunicación",
        imageUrl:"/images/comoUsarSImages/comunicacion.png",
        descripcion:"Comunicate con el fixer para tener mas a detalle el servicio y aclarar las dudas que tengas."
    }
]

export const Consejos = () => {
  return (
    <div className='flex flex-col items-center gap-[40px] ml-[30px] mr-[30px] my-8 p-8 bg-white rounded-2xl shadow-2xl'>
        <div className='flex flex-col items-center gap-[25px]'>
            <h1 className='text-center text-[35px]'> Consejos para un mejor uso </h1>
            <h1 className='text-center opacity-[60%] whitespace-pre-line' > {subtitle} </h1>
        </div>

        <div className='grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
            {
                consejos.map( (item,index) =>
                    <ConsejosCard 
                        key={index}
                        title={item.title}
                        imageUrl={item.imageUrl}
                        descripcion={item.descripcion}
                    />
                )
            }
        </div>
    </div>
  )
}
