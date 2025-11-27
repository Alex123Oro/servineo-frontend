'use client';
import { JobOffer } from '@/app/lib/mock-data';
import { JobOfferCard } from '../Job-offers/Job-offer-card';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { mockJobOffers } from '@/app/lib/mock-data';

export default function MyOffer() {
  const [myOffers, setMyOffers] = useState([
    { id: 1, title: 'Oferta de prueba', createdAt: new Date().toISOString() },
  ]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Mis Ofertas</h2>
        <div>
          {myOffers.map((offer) => (
            <div key={offer.id}>{offer.title}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
