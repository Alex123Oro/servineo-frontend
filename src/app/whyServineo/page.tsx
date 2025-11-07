'use client';

import Image from 'next/image';
import { MapPin, User, Calendar, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (options?.threshold === undefined) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.25, ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);

  return { ref, inView };
}

export default function WhyServineoPage() {
  const banners = [
    {
      id: 1,
      title: 'Descubre quiénes están cerca de ti',
      description:
        'Explora tu ciudad desde el mapa interactivo de Servineo y descubre a los fixers disponibles cerca de ti. Podrás ver fácilmente su ubicación y acceder a su información con un solo clic. Así, Servineo te conecta de forma rápida y sencilla con los profesionales que realmente están a tu alcance.',
      image: '/images/banner1.jpg',
      icon: <MapPin className="inline-block w-6 h-6 mr-2 text-[var(--primary)]" />,
      button: { text: 'Explorar mapa', link: '#mapa' },
    },
    {
      id: 2,
      title: 'Conócelos en detalle',
      description:
        'En Servineo, cada fixer cuenta con un perfil completo que muestra su experiencia, especialidades y disponibilidad. Explora sus trayectorias, conoce sus habilidades y elige con confianza al profesional que mejor se adapte a tus necesidades. Todo lo que necesitas saber para encontrar al fixer ideal, en un solo lugar.',
      image: '/images/banner2.jpg',
      icon: <User className="inline-block w-6 h-6 mr-2 text-[var(--primary)]" />,
    },
    {
      id: 3,
      title: 'Agenda tu cita con facilidad',
      description:
        'Con Servineo, agendar un servicio es rápido y sin complicaciones. Elige al profesional que necesites, coordina los detalles por WhatsApp y confirma tu cita en el horario que prefieras. Todo desde una plataforma práctica que conecta fácilmente a quienes ofrecen y quienes buscan un servicio.',
      image: '/images/banner3.jpg',
      icon: <Calendar className="inline-block w-6 h-6 mr-2 text-[var(--primary)]" />,
      button: { text: 'Agendar ahora', link: '#trabajos-recientes' },
    },
    {
      id: 4,
      title: 'Confía en la calidad y seguridad del servicio',
      description:
        'En Servineo, la confianza es lo primero. Por eso, cada fixer pasa por un proceso de registro que valida su compromiso, responsabilidad y cumplimiento de nuestras políticas. Así, garantizamos que cada servicio dentro de la plataforma sea seguro, transparente y de calidad, brindándote la tranquilidad de contratar a profesionales en los que realmente puedes confiar.',
      image: '/images/banner4.jpg',
      icon: <ShieldCheck className="inline-block w-6 h-6 mr-2 text-[var(--primary)]" />,
    },
  ];

  // Función para hacer scroll smooth
  const handleScroll = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero / Introducción */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--primary)] mb-8 leading-tight">
          ¿Por qué Servineo?
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto">
          En Servineo, creemos que encontrar ayuda profesional no debería ser complicado. Por eso,
          creamos una plataforma que te conecta con expertos de confianza, especializados en
          carpintería, plomería, electricidad y mucho más. Servineo transforma la manera de
          contratar servicios: rápida, clara y hecha para simplificar tu día a día.
        </p>
      </section>

      {/* Banners separados */}
      {banners.map((banner, index) => {
        const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

        return (
          <section
            key={banner.id}
            ref={ref}
            className={`py-16 lg:py-32 relative flex flex-col-reverse md:flex-row items-start max-w-6xl mx-auto px-4 sm:px-6 md:px-8 gap-12 sm:gap-8 transition-all duration-700 ease-out
              ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}
              ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 sm:translate-y-8'}
            `}
          >
            {/* Texto */}
            <div className="md:w-1/2 text-center md:text-left z-20">
              <h2 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-black mb-4 flex items-center justify-center md:justify-start">
                {banner.icon}
                {banner.title}
              </h2>
              <p className="text-base sm:text-lg md:text-lg leading-relaxed mb-4">
                {banner.description}
              </p>
              {banner.button && (
                <button
                  onClick={() => handleScroll(banner.button!.link)}
                  className="inline-block bg-[var(--primary)] hover:bg-[var(--secondary)] text-white rounded-full px-6 py-3 shadow-md transition-all duration-300 transform hover:scale-105 mt-4"
                >
                  {banner.button.text}
                </button>
              )}
            </div>

            {/* Imagen con recuadro */}
            <div className="md:w-1/2 relative z-10 flex justify-center md:justify-end">
              <div
                className={`hidden xl:block absolute rounded-3xl shadow-lg
                  ${
                    index % 2 === 0
                      ? 'top-0 right-0 w-5/6 sm:w-4/5 h-5/6 sm:h-4/5 translate-x-6 sm:translate-x-14 -translate-y-4 sm:-translate-y-6'
                      : 'top-0 left-0 w-5/6 sm:w-4/5 h-5/6 sm:h-4/5 -translate-x-6 sm:-translate-x-1 -translate-y-4 sm:-translate-y-6'
                  }
                  ${index % 2 === 0 ? 'bg-[var(--secondary)]' : 'bg-[var(--light-blue)]'} z-0
                `}
                aria-hidden="true"
              />
              <div className="relative rounded-3xl shadow-lg overflow-hidden w-full md:w-[90%] z-10">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  width={800}
                  height={520}
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}
