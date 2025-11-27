'use client';

import { JobOffer } from '@/app/lib/mock-data';
import { useEffect, useState } from 'react';
import { mockJobOfferService, currentFixer } from '@/app/lib/mock-data';

export default function MyOfferCalendar() {
  const [offers, setOffers] = useState<JobOffer[]>([]);

  useEffect(() => {
    const myOffers = mockJobOfferService.getMyOffers(currentFixer.id);
    setOffers(myOffers);
  }, []);

  const daysInMonth = 30; // Noviembre
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const offersByDay = monthDays.map((day) =>
    offers.filter((_, idx) => (idx % daysInMonth) + 1 === day),
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 rounded-xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        Calendario de Reservas - Noviembre
      </h2>

      {/* Encabezado días de la semana */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-semibold text-gray-700 mb-2 sm:mb-4 text-xs sm:text-sm">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
          <div key={d} className="p-1 sm:p-2 bg-blue-600 text-white rounded-lg shadow">
            {d}
          </div>
        ))}
      </div>

      {/* Contenedor scrollable en móvil */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-[700px] sm:min-w-full">
          {monthDays.map((day, idx) => (
            <div
              key={day}
              className="border border-gray-300 p-2 sm:p-3 min-h-[120px] sm:min-h-[160px] flex flex-col rounded-lg bg-white shadow hover:shadow-xl transition-all duration-300 overflow-hidden text-xs sm:text-sm"
            >
              {/* Número del día */}
              <span className="font-bold mb-1 sm:mb-2 text-gray-800">{day}</span>

              {/* Ofertas del día */}
              <div className="flex flex-col gap-1 w-full overflow-y-auto max-h-[100px] sm:max-h-[120px] pr-1">
                {offersByDay[idx].length === 0 && (
                  <span className="text-gray-400 text-xs sm:text-sm">No hay reservas</span>
                )}
                {offersByDay[idx].map((offer) => (
                  <div
                    key={offer.id}
                    className="border-b border-gray-200 pb-1 last:border-b-0 text-black hover:text-blue-600 cursor-pointer transition-colors duration-300 text-[10px] sm:text-sm"
                    title={`${offer.title} - ${offer.city} - ${offer.price} Bs`}
                  >
                    <div className="font-semibold truncate">{offer.title}</div>
                    <div className="truncate">{offer.city}</div>
                    <div className="font-medium">{offer.price} Bs</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
