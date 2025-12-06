'use client';
import React from 'react';
// Importa íconos de Lucide React para un estilo más moderno
import { Phone, Mail, Zap, Clock, Calendar, Users, Cpu } from 'lucide-react';

export default function JoinPage() {
  // ===================================
  // CONFIGURACIÓN Y CONSTANTES
  // ===================================
  const CONTACT = {
    WHATSAPP_NUMBER: '59175139742',
    EMAIL: 'servineo.serviciostecnicos@gmail.com',
  };

  const WHATSAPP_MESSAGE = encodeURIComponent(
    'Hola Servineo, quisiera postularme para trabajar en soporte técnico.',
  );

  // ===================================
  // DATOS DE SECCIÓN
  // ===================================
  const benefits = [
    {
      title: 'Crecimiento Profesional',
      description:
        'Accede a una red de clientes en expansión y aumenta tus ingresos sin pagar publicidad.',
      icon: Users,
    },
    {
      title: 'Eficiencia Digital',
      description:
        'Usa herramientas inteligentes para cotizar y gestionar servicios desde tu móvil, sin papeleo.',
      icon: Zap,
    },
    {
      title: 'Control Total',
      description:
        'Agenda citas, organiza pedidos y controla tus pagos desde un panel de administración intuitivo.',
      icon: Calendar,
    },
    {
      title: 'Comunidad y Soporte',
      description:
        'Forma parte de una red de profesionales y recibe ayuda constante cuando la necesites.',
      icon: Clock,
    },
  ];

  // ===================================
  // COMPONENTES REUTILIZABLES
  // ===================================
  const CTAButtonWhatsapp = () => (
    <button
      onClick={() =>
        window.open(`wa.me{CONTACT.WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank')
      }
      className='bg-primary text-primary-foreground hover:bg-primary/90 transition duration-300 text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:scale-105 flex items-center justify-center gap-3 w-full sm:w-auto'
    >
      <Phone className='w-5 h-5' />
      Postular por WhatsApp
    </button>
  );

  const CTAButtonEmail = () => (
    <a
      href={`mailto:${CONTACT.EMAIL}?subject=Postulacion a soporte tecnico&body=Hola Servineo,%0A%0AQuisiera postularme para formar parte del equipo de soporte tecnico.`}
      className='bg-background text-primary border-2 border-input text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:bg-muted hover:scale-105 transition duration-300 flex items-center justify-center gap-3 w-full sm:w-auto'
    >
      <Mail className='w-5 h-5' />
      Postular por Email
    </a>
  );

  // ===================================
  // RENDERIZADO PRINCIPAL
  // ===================================
  return (
    <main className='min-h-screen bg-background text-foreground'>
      {/* HERO SECTION - Enfocado en atraer al profesional */}
      <section className='bg-primary text-primary-foreground text-center py-16 px-6'>
        <h1 className='text-5xl md:text-6xl font-extrabold mb-4'>
          Impulsa tu carrera técnica con <span className='text-background/50'>Servineo</span>
        </h1>

        <p className='text-lg max-w-3xl mx-auto opacity-90'>
          Estamos buscando técnicos comprometidos que quieran crecer y modernizar su forma de
          trabajar con nuestra plataforma líder en servicios.
        </p>

        <div className='mt-8 flex justify-center gap-6 flex-wrap'>
          <CTAButtonWhatsapp />
          <CTAButtonEmail />
        </div>
      </section>

      {/* BENEFICIOS SECTION - Más compacto */}
      <section className='py-12 px-6'>
        <h2 className='text-4xl font-bold text-center mb-10 text-primary'>Beneficios Clave</h2>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto'>
          {benefits.map((item) => (
            <div
              key={item.title}
              className='bg-card text-card-foreground rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1'
            >
              <div className='w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-xl mb-4 text-xl'>
                <item.icon className='w-6 h-6' />
              </div>
              <h3 className='text-xl font-bold mb-2 text-primary'>{item.title}</h3>
              <p className='text-sm text-muted-foreground'>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NUEVA SECCIÓN - Tecnología y Modernidad */}
      <section className='bg-muted py-12 px-6'>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8'>
          <div className='md:w-1/2'>
            <Cpu className='w-24 h-24 text-primary mx-auto md:mx-0 mb-4' />
            <h2 className='text-3xl font-bold mb-4 text-primary'>Tecnología a tu Servicio</h2>
            <p className='text-foreground mb-4'>
              Olvídate de los métodos anticuados. Servineo utiliza tecnología de vanguardia para
              conectar a los técnicos con los clientes de manera eficiente y segura.
            </p>
            <ul className='list-disc list-inside text-muted-foreground space-y-2'>
              <li>Gestión de rutas optimizada.</li>
              <li>Notificaciones instantáneas de nuevos trabajos.</li>
              <li>Pagos seguros y transparentes.</li>
            </ul>
          </div>
          <div className='md:w-1/2'>
            {/* Aquí es donde pones la imagen */}
            <img
              src='/reparadores.jpg'
              alt='Técnicos de Servineo usando la plataforma'
              className='rounded-xl shadow-lg w-full object-cover h-64'
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL SECTION - Compacto */}
      <section className='bg-primary text-primary-foreground py-16 text-center px-6'>
        <h2 className='text-4xl font-extrabold mb-4'>¿Listo para formar parte del equipo?</h2>

        <p className='text-lg opacity-90 max-w-2xl mx-auto mb-8'>
          Escríbenos ahora y comienza tu camino profesional en Servineo.
        </p>

        <div className='flex justify-center gap-6 flex-wrap'>
          <CTAButtonWhatsapp />
          <CTAButtonEmail />
        </div>
      </section>
    </main>
  );
}
