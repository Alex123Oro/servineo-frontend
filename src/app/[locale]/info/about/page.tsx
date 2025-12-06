'use client';
import Image from 'next/image';

export default function SobreNosotros() {
  return (
    <main className='bg-[var(--background)] text-[var(--foreground)] min-h-screen font-sans'>
      {/* HERO */}
      <section className='relative bg-[var(--primary)] text-white py-16 px-6 md:px-12 overflow-hidden'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-2xl' />

        <div className='max-w-5xl mx-auto text-center relative z-10'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 leading-tight'>
            Conectamos personas con soluciones confiables
          </h1>
          <p className='text-lg md:text-xl opacity-90 max-w-3xl mx-auto'>
            En <span className='font-bold'>Servineo</span> combinamos tecnología, confianza y
            talento profesional para transformar la manera en que las personas contratan servicios
            en su hogar o negocio.
          </p>
        </div>
      </section>

      {/* QUE ES SERVINEO */}
      <section className='max-w-6xl mx-auto py-14 px-6 md:px-10'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold text-[var(--primary)] mb-2'>¿Qué es Servineo?</h2>
          <div className='w-20 h-1 bg-[var(--primary)] mx-auto' />
        </div>

        <div className='grid md:grid-cols-2 gap-10 items-center'>
          <div>
            <p className='text-base text-gray-700 leading-relaxed mb-4'>
              Servineo es una plataforma digital creada para simplificar la búsqueda de servicios
              técnicos confiables. Conectamos a usuarios con
              <span className='font-semibold text-[var(--primary)]'>
                {' '}
                electricistas, plomeros, cerrajeros, carpinteros, pintores y más
              </span>
              , todos previamente evaluados para garantizar seguridad, puntualidad y calidad.
            </p>

            <p className='text-base text-gray-700 leading-relaxed mb-4'>
              Nuestra misión es eliminar la incertidumbre al contratar servicios. Ya no necesitas
              depender de recomendaciones informales ni asumir riesgos: con Servineo encuentras
              profesionales calificados en pocos minutos, con información clara, valoraciones reales
              y precios transparentes.
            </p>

            <p className='text-base text-gray-700 leading-relaxed'>
              Cada proveedor pasa por un proceso de verificación que valida identidad, experiencia y
              antecedentes, asegurando que cada servicio contratado cumpla nuestros estándares de
              excelencia.
            </p>
          </div>

          <div className='relative h-[340px]'>
            <Image
              src='/imagen1.jpg'
              alt='Red de profesionales Servineo'
              fill
              className='rounded-xl shadow-xl object-cover'
            />
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className='bg-gray-50 py-14 px-6 md:px-10 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute top-10 left-10 w-40 h-40 border-4 border-[var(--primary)] rounded-full' />
          <div className='absolute bottom-20 right-20 w-32 h-32 border-4 border-[var(--primary)] rounded-lg rotate-45' />
          <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-[var(--primary)] rounded-full' />
        </div>

        <div className='max-w-6xl mx-auto relative z-10'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-[var(--primary)] mb-2'>
              Lo que nos hace diferentes
            </h2>
            <div className='w-20 h-1 bg-[var(--primary)] mx-auto' />
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            {/* CARD 1 */}
            <div className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[var(--primary)]'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white text-xl'>
                  📅
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[var(--primary)] mb-2'>
                    Agenda inteligente
                  </h3>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    Visualiza disponibilidad en tiempo real, agenda visitas sin llamadas
                    innecesarias y recibe confirmaciones automáticas para evitar retrasos o
                    cancelaciones inesperadas.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className='bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-[var(--primary)]'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white text-xl'>
                  🎥
                </div>

                <div>
                  <h3 className='text-xl font-bold text-[var(--primary)] mb-2'>
                    Cotización por video
                  </h3>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    Envía un video breve mostrando el problema y recibe presupuestos personalizados
                    de profesionales interesados, ahorrando tiempo en visitas innecesarias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISION */}
      <section className='max-w-6xl mx-auto py-14 px-6 md:px-10'>
        <div className='grid md:grid-cols-2 gap-10 items-center'>
          <div>
            <h2 className='text-2xl font-bold text-[var(--primary)] mb-3'>Nuestra Misión</h2>

            <p className='text-base text-gray-700 leading-relaxed mb-4'>
              Facilitar el acceso a servicios profesionales confiables mediante una plataforma
              segura, intuitiva y accesible para todos.
            </p>

            <p className='text-base text-gray-700 leading-relaxed'>
              Trabajamos continuamente para mejorar la experiencia tanto del cliente como del
              proveedor, impulsando una comunidad basada en respeto, responsabilidad y
              transparencia.
            </p>
          </div>

          <div className='relative h-[300px]'>
            <Image
              src='/imagen2.jpg'
              alt='Misión Servineo'
              fill
              className='rounded-xl shadow-xl object-cover'
            />
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className='bg-[var(--primary)] text-white py-14 px-6 md:px-10'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl font-bold mb-2'>Nuestros Valores</h2>
            <div className='w-20 h-1 bg-white mx-auto' />
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center bg-white/10 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Confianza</h3>
              <p className='text-white/90 text-sm leading-relaxed'>
                Seguridad y transparencia en cada interacción entre clientes y profesionales.
              </p>
            </div>

            <div className='text-center bg-white/10 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Calidad</h3>
              <p className='text-white/90 text-sm leading-relaxed'>
                Seleccionamos expertos comprometidos con la excelencia en cada servicio realizado.
              </p>
            </div>

            <div className='text-center bg-white/10 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Innovación</h3>
              <p className='text-white/90 text-sm leading-relaxed'>
                Utilizamos tecnología para simplificar, agilizar y optimizar la contratación de
                servicios.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
