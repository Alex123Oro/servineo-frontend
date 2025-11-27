'use client';

import { useState } from 'react';
import { MapPin, CalendarDays, Clock, Banknote, Eye } from 'lucide-react';

type JobRequestStatus = 'request' | 'completed' | 'payed';

type JobRequest = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  fee: string;
  serviceType: 'Plomería' | 'Electricidad' | 'Carpintería' | 'Pintura' | 'Limpieza' | 'Otro';
  status: JobRequestStatus;
};

const MOCK_REQUESTS: JobRequest[] = [
  {
    id: '1',
    title: 'Reparación de fuga en baño',
    description:
      'Tengo una fuga constante en el lavamanos del baño principal. Necesito que revisen la tubería y cambien lo necesario.',
    location: 'Zona Cala Cala, Cochabamba',
    date: '2025-11-30',
    time: '09:30',
    fee: '120 Bs',
    serviceType: 'Plomería',
    status: 'request',
  },
  {
    id: '2',
    title: 'Instalación de tomacorriente adicional',
    description:
      'Requiero un nuevo punto de energía en la sala para conectar TV y consola. La instalación debe quedar empotrada.',
    location: 'Av. América, Cochabamba',
    date: '2025-12-02',
    time: '15:00',
    fee: '150 Bs',
    serviceType: 'Electricidad',
    status: 'request',
  },
  {
    id: '3',
    title: 'Pintado de dormitorio',
    description:
      'Pintar un dormitorio de 3x4m, paredes y techo, color blanco. Ya tengo la pintura, solo necesito mano de obra.',
    location: 'Zona Queru Queru, Cochabamba',
    date: '2025-12-05',
    time: '10:00',
    fee: '200 Bs',
    serviceType: 'Pintura',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Armado de mueble de madera',
    description:
      'Compré un mueble para TV y viene desarmado. Necesito que lo armen y lo fijen correctamente.',
    location: 'Centro, Cochabamba',
    date: '2025-12-01',
    time: '18:00',
    fee: '100 Bs',
    serviceType: 'Carpintería',
    status: 'payed',
  },
  {
    id: '5',
    title: 'Limpieza profunda de departamento',
    description:
      'Departamento de 2 habitaciones, necesito limpieza profunda de pisos, ventanas y baño.',
    location: 'Zona Recoleta, Cochabamba',
    date: '2025-12-03',
    time: '08:30',
    fee: '180 Bs',
    serviceType: 'Limpieza',
    status: 'request',
  },
  {
    id: '6',
    title: 'Cambio de llave de paso principal',
    description: 'Llave de paso antigua con fuga, necesito reemplazo completo por una nueva.',
    location: 'Villa Galindo, Cochabamba',
    date: '2025-12-04',
    time: '11:00',
    fee: '130 Bs',
    serviceType: 'Plomería',
    status: 'completed',
  },
  {
    id: '7',
    title: 'Revisión de cortocircuito en cocina',
    description:
      'Salta el automático cada vez que conectamos la licuadora. Posible cortocircuito en un tomacorriente.',
    location: 'Tiquipaya, Cochabamba',
    date: '2025-12-06',
    time: '14:30',
    fee: '160 Bs',
    serviceType: 'Electricidad',
    status: 'request',
  },
  {
    id: '8',
    title: 'Lijado y barnizado de puerta',
    description:
      'Puerta principal de madera, requiere lijado y barnizado completo. La puerta ya está instalada.',
    location: 'Zona Sarcobamba, Cochabamba',
    date: '2025-12-07',
    time: '09:00',
    fee: '190 Bs',
    serviceType: 'Carpintería',
    status: 'payed',
  },
  {
    id: '9',
    title: 'Pintado de fachada exterior',
    description: 'Fachada de casa de 2 pisos, solo frente, color blanco y detalles en gris.',
    location: 'Zona Muyurina, Cochabamba',
    date: '2025-12-08',
    time: '16:00',
    fee: '350 Bs',
    serviceType: 'Pintura',
    status: 'request',
  },
];

function getStatusLabel(status: JobRequestStatus) {
  switch (status) {
    case 'request':
      return 'Solicitud';
    case 'completed':
      return 'Completado';
    case 'payed':
      return 'Pagado';
    default:
      return status;
  }
}

function getStatusClasses(status: JobRequestStatus) {
  switch (status) {
    case 'request':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'payed':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export default function JobRequestsPage() {
  const [requests] = useState<JobRequest[]>(MOCK_REQUESTS);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Solo leyenda de estados, sin título ni descripción */}
        <div className="mb-8 flex flex-wrap gap-2 text-sm text-slate-500 justify-end">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Solicitud
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completado
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Pagado
          </span>
        </div>

        {/* Grid de tarjetas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <article
              key={req.id}
              className="relative group rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Borde superior con degradado */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400 opacity-70 group-hover:opacity-100" />

              <div className="p-5 flex flex-col h-full">
                {/* Encabezado: tipo de servicio + estado */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    {req.serviceType}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClasses(
                      req.status,
                    )}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {getStatusLabel(req.status)}
                  </span>
                </div>

                {/* Título */}
                <h2 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {req.title}
                </h2>

                {/* Descripción */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">{req.description}</p>

                {/* Datos principales con íconos */}
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-[2px] text-slate-400" />
                    <span className="leading-snug">{req.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    <span>
                      {new Date(req.date).toLocaleDateString('es-BO', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="mx-1 text-slate-400">·</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{req.time} hrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900">{req.fee}</span>
                  </div>
                </div>

                {/* Footer de la tarjeta */}
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-4"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalle
                  </button>
                  <button
                    type="button"
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-600 text-white shadow-sm group-hover:shadow-md group-hover:bg-blue-700 transition-all"
                  >
                    Ver solicitud
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
