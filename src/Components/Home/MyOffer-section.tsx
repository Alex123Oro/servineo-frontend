'use client';

import { useEffect, useState } from 'react';
import { mockJobOfferService, currentFixer, type JobOffer } from '@/app/lib/mock-data';
import { ImageCarousel } from '@/Components/Shared/ImageCarousel';
import Link from 'next/link';

export default function MyOffer() {
  const [myOffers, setMyOffers] = useState<JobOffer[]>([]);

  useEffect(() => {
    // Obtener las ofertas del fixer actual
    const offers = mockJobOfferService.getMyOffers(currentFixer.id);

    // Ordenar por fecha de creación (más recientes primero) y tomar solo 3
    const sortedOffers = offers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    setMyOffers(sortedOffers);
  }, []);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Mis Ofertas</h2>
            <p className="text-lg text-gray-600">Aquí se muestran tus últimas ofertas</p>
          </div>
          <Link href="/fixer/my-offers" className="text-primary hover:underline font-medium">
            Ver todas →
          </Link>
        </div>

        {myOffers.length === 0 ? (
          <p className="text-gray-500">No tienes ofertas publicadas aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myOffers.map((offer, index) => (
              <div
                key={offer.id}
                className="animate-fade-in relative group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative w-full overflow-hidden rounded-xl border border-primary bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <ImageCarousel
                    images={
                      offer.photos.length > 0
                        ? offer.photos
                        : ['/placeholder.svg?height=180&width=320&text=Oferta']
                    }
                    alt={`Trabajo de ${offer.fixerName}`}
                  />

                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 border border-gray-200 shadow-sm">
                    <span className="font-medium text-blue-600">{offer.city}</span>
                  </div>

                  <div className="absolute right-3 top-3 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-primary shadow-lg border border-primary/20">
                    {offer.price} Bs
                  </div>

                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-black/0 p-4">
                    <div className="flex items-end justify-between">
                      <div className="text-white">
                        <div className="text-sm opacity-90">{offer.fixerName}</div>
                        <div className="text-xs opacity-80">{offer.whatsapp}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-primary to-blue-600 px-3 py-1 rounded-full text-white font-medium">
                        {offer.services[0]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
