'use client';
import Image from 'next/image';

export default function SobreNosotros() {
  return (
    <main className="bg-[color:var(--background)] text-[color:var(--foreground)] min-h-screen font-sans">
      {/* Hero Section - Encabezado Principal */}
      <section className="relative bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--accent)] text-white py-16 px-6 md:px-12 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[color:var(--secondary)]/20 rounded-full blur-2xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Conectamos Personas, Soluciones y Confianza
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            En <span className="font-bold">Servineo</span> transformamos la manera en que encuentras 
            servicios profesionales. Tecnología, transparencia y calidad en cada conexión.
          </p>
        </div>
      </section>

      {/* Sección - ¿Qué es Servineo? */}
      <section className="max-w-6xl mx-auto py-12 px-6 md:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[color:var(--secondary)] mb-2">
            ¿Qué es Servineo?
          </h2>
          <div className="w-20 h-1 bg-[color:var(--primary)] mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Servineo es una plataforma innovadora que hace tu vida mucho más fácil. 
              Te conectamos con <span className="font-semibold text-[color:var(--secondary)]">carpinteros, fontaneros, 
              electricistas, pintores</span> y otros expertos verificados en tu comunidad 
              para que puedas agendar servicios de manera súper rápida y confiable.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Todos los profesionales afiliados han sido <span className="font-semibold text-[color:var(--accent)]">
              previamente evaluados y cuidadosamente seleccionados</span>, garantizando que siempre 
              tengas acceso a la más selecta red de expertos.
            </p>
          </div>
          <div className="relative h-[320px]">
            <Image
              src="/imagen1.jpg"
              alt="Profesionales de Servineo"
              fill
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección - Innovaciones Clave con diseño especial */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6 md:px-10 relative overflow-hidden">
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-[color:var(--primary)] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-[color:var(--accent)] rounded-lg rotate-45"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[color:var(--secondary)] rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[color:var(--secondary)] mb-2">
              Lo que nos hace diferentes
            </h2>
            <div className="w-20 h-1 bg-[color:var(--primary)] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1 - Calendario en Tiempo Real */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[color:var(--primary)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--secondary)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--secondary)] mb-2">
                    Calendario en Tiempo Real
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Visualiza la disponibilidad de cada proveedor en tiempo real y agenda 
                    una cita cuando mejor te convenga. Sin llamadas interminables, sin esperas.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Video Inspección */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[color:var(--accent)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--secondary)] mb-2">
                    Video Inspección Inteligente
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Sube un video mostrando lo que necesitas reparar o modificar y recibe 
                    cotizaciones de especialistas interesados. Ahorra tiempo y obtén presupuestos precisos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección - Misión y Visión compacta */}
      <section className="max-w-6xl mx-auto py-12 px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--secondary)] mb-3">
              Nuestra Misión
            </h2>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              Brindar una plataforma que inspire confianza y simplifique la vida de nuestros usuarios, 
              conectando necesidades reales con profesionales de calidad verificados.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Apostamos por la <span className="font-semibold text-[color:var(--accent)]">eficiencia, 
              la transparencia y la mejora continua</span> en cada servicio que facilitamos.
            </p>
          </div>
          <div className="relative h-[300px]">
            <Image
              src="/imagen2.jpg"
              alt="Misión Servineo"
              fill
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[300px] order-2 md:order-1">
            <Image
              src="/imagen3.jpg"
              alt="Visión de futuro"
              fill
              className="rounded-xl shadow-xl object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold text-[color:var(--secondary)] mb-3">
              Mirando hacia el Futuro
            </h2>
            <p className="text-base text-gray-700 leading-relaxed mb-3">
              Nos impulsa el deseo de seguir creciendo junto a nuestra comunidad. 
              Creemos en un futuro donde la tecnología empodere y las oportunidades se multipliquen.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Queremos ser <span className="font-semibold text-[color:var(--primary)]">el puente 
              que transforma la manera</span> en que las personas acceden a servicios profesionales.
            </p>
          </div>
        </div>
      </section>
      
      {/* Sección - Nuestros Valores compacta */}
      <section className="bg-gradient-to-br from-[color:var(--dark-purple)] to-[color:var(--accent)] text-white py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Nuestros Valores</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Valor 1 - Confianza */}
            <div className="text-center p-5 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Confianza</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Priorizamos la transparencia y seguridad en cada interacción para que nuestros usuarios se sientan seguros y respaldados.
              </p>
            </div>

            {/* Valor 2 - Calidad */}
            <div className="text-center p-5 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM7 20v-2a4 4 0 018 0v2m-4 0v-2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Solo trabajamos con profesionales verificados para asegurar un servicio excelente y resultados que superen expectativas.
              </p>
            </div>

            {/* Valor 3 - Innovación */}
            <div className="text-center p-5 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4-2v6m-7 4h8a2 2 0 002-2v-7a2 2 0 00-2-2h-8a2 2 0 00-2 2v7a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovación</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Incorporamos tecnología avanzada para facilitar conexiones rápidas y efectivas entre usuarios y profesionales.
              </p>
            </div>
          </div>
        </div>
      </section>

</main>

  );
}
