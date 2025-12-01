'use client';

import React, { useEffect, useState } from 'react';
import { FixerProfile } from '@/Components/Fixer-profile';
import { useGetFixerByIdQuery, useGetJobsByFixerQuery } from '@/app/redux/services/fixerApi';
// import { useParams } from 'next/navigation'; // descomenta si vas a usar params dinámicos
import { useAppSelector } from '@/app/redux/hooks';
import type { Fixer } from '@/types/fixer-component';
import type { JobOffer, Location } from '@/types/job-offer';

// -- Mock fallback (se usa si la API falla o para desarrollo)
// Puedes mover esto a un archivo separado si lo prefieres.
const mockFixer: Fixer = {
  id: '68e87a9cdae3b73d8040102f',
  name: 'Carlos Méndez',
  email: 'carlos.mendez@ejemplo.com',
  phone: '+591 71234567',
  photo: '',
  city: 'Cochabamba',
  rating: 4.7,
  completedJobs: 128,
  services: ['Fontanería', 'Electricidad', 'Pintura', 'Albañilería'],
  bio:
    'Soy un técnico profesional con más de 8 años de experiencia en reparaciones del hogar. Me especializo en soluciones rápidas y efectivas, con un enfoque en la satisfacción del cliente.',
  joinDate: new Date('2018-05-15').toISOString().split('T')[0],
  jobOffers: [
    {
      id: 'offer-1',
      title: 'Reparación de tubería',
      description: 'Necesito reparar una fuga en la tubería principal del baño',
      services: ['Fontanería'],
      price: 350,
      createdAt: new Date('2025-10-28'),
      city: 'Cochabamba',
      rating: 4.8,
      completedJobs: 5,
      location: {
        lat: -17.3895,
        lng: -66.1568,
        address: 'Av. América #123, Cochabamba',
      },
      fixerId: '68e87a9cdae3b73d8040102f',
      fixerName: 'Carlos Méndez',
      tags: ['Urgente', 'Casa', 'Baño'],
      whatsapp: '59171234567',
      photos: ['/placeholder-job.jpg'],
    },
  ],
  paymentMethods: ['Efectivo', 'Transferencia', 'QR'],
  whatsapp: '59171234567',
};

export default function FixerProfilePage() {
  // Si usas rutas dinámicas: const params = useParams(); const fixerId = params.id;
  // Por ahora dejamos un id por defecto (cámbialo según tu routing)
  const fixerId = '691646c477c99dee64b21689';

  const {
    data: fixerProfile,
    isLoading: loadingFixer,
    error: errorFixer,
  } = useGetFixerByIdQuery(fixerId);

  const { data: jobOffers = [], isLoading: loadingJobs } = useGetJobsByFixerQuery(fixerId);

  const userFromStore = useAppSelector((state) => state.user.user);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (userFromStore?.id === fixerId) setIsOwner(true);
    else setIsOwner(false);
  }, [userFromStore, fixerId]);

  // Skeleton mientras cargan los datos
  if (loadingFixer || loadingJobs) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-white/20" />
              <div className="space-y-3">
                <div className="h-8 bg-white/30 rounded w-48" />
                <div className="h-5 bg-white/20 rounded w-32" />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  // Si hay error o fixerProfile es falsy, usamos mockFixer como fallback
  if (errorFixer || !fixerProfile) {
    // No rompemos la página: mostramos mock + notificación básica
    console.warn('Error loading fixer profile — using mock data', errorFixer);
    return <FixerProfile fixer={mockFixer} isOwner={false} />;
  }

  // Map helpers
  const formatService = (svc: { id: string; name: string }) => svc.name;

  const formatPayment = (pay: { type: string }) => {
    const map: Record<string, string> = {
      cash: 'Efectivo',
      transfer: 'Transferencia',
      qr: 'Código QR',
    };
    return map[pay.type] ?? pay.type.charAt(0).toUpperCase() + pay.type.slice(1);
  };

  const getAddress = (location?: Location): string => location?.address ?? 'Dirección no disponible';

  // Formateamos el fixer recibido de la API al tipo Fixer utilizado por el componente
  const formattedFixer: Fixer = {
    id: fixerProfile.user.id,
    name: fixerProfile.user.name,
    email: fixerProfile.user.email,
    phone: fixerProfile.user.phone,
    photo: fixerProfile.profile.photoUrl ?? '/placeholder-user.jpg',
    city: fixerProfile.profile.city ?? 'Cochabamba',
    rating: fixerProfile.profile.rating ?? 4.7,
    completedJobs: fixerProfile.profile.completedJobs ?? 0,
    services: (fixerProfile.profile.services ?? []).map(formatService),
    bio: fixerProfile.profile.additionalInfo?.bio ?? 'Técnico con experiencia en reparaciones del hogar.',
    joinDate: fixerProfile.profile.createdAt
      ? new Date(fixerProfile.profile.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    location: fixerProfile.profile.location
      ? {
          lat: fixerProfile.profile.location.lat,
          lng: fixerProfile.profile.location.lng,
          address: getAddress(fixerProfile.profile.location as Location),
        }
      : null,
    jobOffers: (jobOffers as JobOffer[]).map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      services: job.services ?? [],
      price: job.price ?? 0,
      createdAt: new Date(job.createdAt),
      city: job.city ?? fixerProfile.profile.city ?? '—',
      rating: job.rating ?? 4.8,
      completedJobs: job.completedJobs ?? 0,
      location: {
        lat: job.location?.lat ?? fixerProfile.profile.location?.lat ?? -17.3935,
        lng: job.location?.lng ?? fixerProfile.profile.location?.lng ?? -66.1468,
        address: getAddress(job.location),
      },
      fixerId: job.fixerId,
      fixerName: job.fixerName ?? fixerProfile.user.name,
      tags: job.tags ?? [],
      whatsapp: job.whatsapp ?? job.phone ?? fixerProfile.user.phone.replace(/\D/g, '').slice(3),
      photos: job.photos ?? [],
    })),
    paymentMethods: (fixerProfile.profile.paymentMethods ?? []).map(formatPayment),
    whatsapp: fixerProfile.user.phone.replace(/\D/g, '').slice(3),
  };

  return <FixerProfile fixer={formattedFixer} isOwner={isOwner} />;
}
