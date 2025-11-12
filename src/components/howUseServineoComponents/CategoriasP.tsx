"use client";
import { services } from '@/app/servicios/data';  
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// CAMBIA "CategoriasPopulares" por "CategoriasP"
export const CategoriasP = () => {
  const router = useRouter();
  
  // Tomar las 8 categorías más populares (ordenadas por demanda)
  const categoriasPopulares = services
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 8);

  return (
    <div className='flex flex-col items-center gap-[40px] ml-[30px] mr-[30px] my-8 p-8 bg-white rounded-2xl shadow-2xl'>
        <div className='flex flex-col items-center gap-[25px]'>
            <h1 className='text-center text-[35px]'> Categorías Populares </h1>
            <h2 className='text-center opacity-[60%]'> ¿No sabes por donde comenzar? </h2>
            <h3 className='text-center opacity-[60%]'> Explora nuestras categorías más populares</h3>
        </div>

        {/* Grid de categorías - usando el mismo diseño de servicios.tsx */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {categoriasPopulares.map((service, index) => (
            <div
              key={index}
              onClick={() => router.push(`/servicios/${service.slug}`)}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{service.icon}</div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {service.demand}% de demanda
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${service.demand}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                Ver profesionales
              </button>
            </div>
          ))}
        </div>

        {/* Botón para ver todas las categorías */}
        <Link 
          href="/servicios"
          className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver Todas las Categorías
        </Link>
    </div>
  );
};