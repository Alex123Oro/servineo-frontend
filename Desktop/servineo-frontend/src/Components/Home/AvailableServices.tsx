import React from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  demand: number;
  icon: string;
}

const servicesData: Service[] = [
  {
    id: 'plumbing',
    name: 'Plomería',
    description: 'Instalaciones, reparaciones y mantenimiento',
    demand: 95,
    icon: 'fa-solid fa-wrench',
  },
  {
    id: 'electricity',
    name: 'Electricidad',
    description: 'Instalaciones eléctricas y reparaciones',
    demand: 90,
    icon: 'fa-solid fa-bolt',
  },
  {
    id: 'carpentry',
    name: 'Carpintería',
    description: 'Muebles, puertas y trabajos en madera',
    demand: 85,
    icon: 'fa-solid fa-hammer',
  },
  {
    id: 'painting',
    name: 'Pintura',
    description: 'Pintura interior y exterior',
    demand: 80,
    icon: 'fa-solid fa-paint-roller',
  },
  {
    id: 'cleaning',
    name: 'Limpieza',
    description: 'Limpieza residencial y comercial',
    demand: 88,
    icon: 'fa-solid fa-broom',
  },
  {
    id: 'gardening',
    name: 'Jardinería',
    description: 'Mantenimiento y diseño de jardines',
    demand: 75,
    icon: 'fa-solid fa-leaf',
  },
];

const AvailableServices: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Servicios Disponibles</h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          Encuentra el profesional perfecto para cualquier trabajo en tu hogar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <i className={`${service.icon} text-blue-500 text-4xl mr-4`}></i>
                <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">{service.demand}% de demanda</span>
                <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${service.demand}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/job-offer-list">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
              Ver más
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AvailableServices;