"use client";
import { JobOffer } from "@/app/lib/mock-data";
import { JobOfferCard } from "../Job-offers/Job-offer-card";
import Link from "next/link";
import { useGetAllJobOffersQuery } from "@/app/redux/services/jobOfferApi";

export default function RecentOffersSection() {
  // 1. Obtener datos (con valor por defecto [])
  const { data: jobOffers = [], isLoading } = useGetAllJobOffersQuery();

  // 2. Lógica de limitación: Mostrar solo las primeras 8
  const displayOffers = jobOffers.slice(0, 8);

  return (
    <section className="py-16 px-4 bg-white w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* Encabezado Centrado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ofertas Recientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las últimas ofertas publicadas por nuestros usuarios
          </p>
        </div>

        {/* Grid de Ofertas */}
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Cargando ofertas...</div>
        ) : (
          // CORRECCIÓN RESPONSIVE:
          // grid-cols-1: Móvil (1 columna)
          // md:grid-cols-2: Tablet (2 columnas) -> Antes estaba en 'sm' y aplastaba el diseño
          // lg:grid-cols-4: Desktop (4 columnas)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {displayOffers.map((offer: any) => (
              <JobOfferCard 
                // Usamos offer.id o offer._id para compatibilidad con backend
                key={offer.id || offer._id} 
                offer={offer as JobOffer} 
                showFixerInfo={true}
              />
            ))}
          </div>
        )}

        {/* Botón "Ver más" al final (Centrado) */}
        <div className="flex justify-center mt-12">
          <Link 
            href="/job-offer-list" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Ver más ofertas
          </Link>
        </div>
      </div>
    </section>
  );
}