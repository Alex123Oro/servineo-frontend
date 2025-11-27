'use client';

import Link from 'next/link';
import { Briefcase, MapPin, Calendar, Clock, DollarSign, Wrench } from 'lucide-react';

type JobRequest = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  rate: string;
  serviceType: string;
};

// 🔹 Mock de solicitudes (al menos 6)
const mockRequests: JobRequest[] = [
  {
    id: '1',
    title: 'Reparación de fuga en el baño',
    description: 'Necesito un plomero para reparar una fuga en la tubería del baño.',
    location: 'Cochabamba, Zona Norte',
    date: '2025-11-30',
    time: '09:00 - 11:00',
    rate: '120 Bs',
    serviceType: 'Plomería',
  },
  {
    id: '2',
    title: 'Instalación de tomacorrientes',
    description: 'Requiero instalar 3 tomacorrientes nuevos en sala y cocina.',
    location: 'La Paz, Sopocachi',
    date: '2025-12-01',
    time: '14:00 - 17:00',
    rate: '180 Bs',
    serviceType: 'Electricidad',
  },
  {
    id: '3',
    title: 'Pintado de dormitorio',
    description: 'Pintar un dormitorio de 3x4m, cuento con la pintura.',
    location: 'Santa Cruz, Equipetrol',
    date: '2025-12-02',
    time: '08:00 - 12:00',
    rate: '250 Bs',
    serviceType: 'Pintura',
  },
  {
    id: '4',
    title: 'Armado de mueble de madera',
    description: 'Armado de ropero de madera recién comprado.',
    location: 'El Alto, Río Seco',
    date: '2025-12-03',
    time: '10:00 - 13:00',
    rate: '150 Bs',
    serviceType: 'Carpintería',
  },
  {
    id: '5',
    title: 'Limpieza profunda de departamento',
    description: 'Departamento de 2 dormitorios, incluir limpieza de cocina y baño.',
    location: 'Cochabamba, Centro',
    date: '2025-12-04',
    time: '09:00 - 15:00',
    rate: '300 Bs',
    serviceType: 'Limpieza',
  },
  {
    id: '6',
    title: 'Revisión de instalación eléctrica',
    description: 'Se baja el térmico al encender varios artefactos, necesito revisión.',
    location: 'La Paz, Miraflores',
    date: '2025-12-05',
    time: '16:00 - 18:00',
    rate: '200 Bs',
    serviceType: 'Electricidad',
  },
  {
    id: '7',
    title: 'Cambio de grifería en cocina',
    description: 'Reemplazo de grifo antiguo por uno nuevo monocomando.',
    location: 'Santa Cruz, 4to anillo',
    date: '2025-12-06',
    time: '10:00 - 12:00',
    rate: '130 Bs',
    serviceType: 'Plomería',
  },
];

export default function RequestsSection() {
  // tomamos solo las primeras 6
  const firstSix = mockRequests.slice(0, 6);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Solicitudes de trabajo
            </h2>
            <p className="text-lg text-gray-600">
              Aquí puedes ver las solicitudes de trabajo disponibles
            </p>
          </div>

          <Link href="/fixer/requests" className="text-primary hover:underline font-medium">
            Ver todas →
          </Link>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstSix.map((req) => (
            <article
              key={req.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Badge tipo de servicio */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-primary border border-primary/20 shadow-sm">
                <Wrench className="w-3 h-3" />
                <span>{req.serviceType}</span>
              </div>

              {/* Contenido principal */}
              <div className="p-5 pt-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {req.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{req.description}</p>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{req.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{req.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{req.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{req.rate}</span>
                  </div>
                </div>
              </div>

              {/* Barra inferior con icono */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/80">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Briefcase className="w-4 h-4" />
                  <span>Solicitud pendiente</span>
                </div>
                <span className="text-xs text-primary font-medium group-hover:underline">
                  Ver detalle
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
