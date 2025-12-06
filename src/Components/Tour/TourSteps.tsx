/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import { StepType } from '@reactour/tour';

export const tourSteps: StepType[] = [
  {
    selector: '#tour-start-point',
    content: ({ setIsOpen, setCurrentStep }: any) => (
      <div className='text-center p-2'>
        <h3 className='text-2xl font-bold text-[#2B6AE0] mb-3'>¡Hola! Bienvenido a Servineo</h3>
        <p className='text-gray-700 leading-relaxed text-base mb-5'>
          ¿Te gustaría realizar un breve recorrido para conocer las funciones principales de la
          plataforma?
        </p>
        <div className='flex justify-center gap-3'>
          <button
            onClick={() => {
              setIsOpen(false);
              localStorage.setItem('servineoTourVisto', 'true');
            }}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm'
          >
            No, gracias
          </button>
          <button
            onClick={() => setCurrentStep(1)}
            className='px-4 py-2 bg-[#2B6AE0] text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md text-sm'
          >
            Iniciar Recorrido
          </button>
        </div>
      </div>
    ),
    position: 'center',
  },
  {
    selector: '#tour-search-bar',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>1. Búsqueda Inteligente</h4>
        <p className='text-gray-600 text-sm'>
          Escribe aquí el servicio que necesitas (ej. "Plomero") para encontrar ayuda rápidamente.
        </p>
      </div>
    ),
    position: 'bottom',
  },
  {
    selector: '#titulo-seccion-mapa',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>2. Mapa de Fixers</h4>
        <p className='text-gray-600 text-sm'>
          Visualiza a los profesionales disponibles en tu zona en tiempo real.
        </p>
      </div>
    ),
    position: 'top',
    // ✅ Función que se ejecuta ANTES de mostrar este paso
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        // Verificar que el elemento existe
        const element = document.querySelector('#titulo-seccion-mapa');

        if (element) {
          // Hacer scroll suave hacia el elemento
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });

          // Esperar 1 segundo para que termine el scroll y el mapa se cargue
          setTimeout(() => {
            resolve();
          }, 1000);
        } else {
          console.warn('Elemento #titulo-seccion-mapa no encontrado');
          resolve();
        }
      });
    },
  },
  {
    selector: '#tour-inspiration-section',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>3. Inspírate</h4>
        <p className='text-gray-600 text-sm'>
          Mira proyectos realizados por nuestros profesionales para tomar ideas.
        </p>
      </div>
    ),
    position: 'top',
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        const element = document.querySelector('#tour-inspiration-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => resolve(), 700);
        } else {
          resolve();
        }
      });
    },
  },
  {
    selector: '#tour-recent-offers',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>4. Ofertas Recientes</h4>
        <p className='text-gray-600 text-sm'>
          Revisa las últimas solicitudes publicadas en la plataforma.
        </p>
      </div>
    ),
    position: 'top',
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        const element = document.querySelector('#tour-recent-offers');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => resolve(), 700);
        } else {
          resolve();
        }
      });
    },
  },
  {
    selector: '#tour-services-section',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>5. Catálogo de Servicios</h4>
        <p className='text-gray-600 text-sm'>
          Explora todas las categorías disponibles: Plomería, Electricidad, etc.
        </p>
      </div>
    ),
    position: 'top',
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        const element = document.querySelector('#tour-services-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => resolve(), 700);
        } else {
          resolve();
        }
      });
    },
  },
  {
    selector: '#tour-how-it-works',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>6. ¿Cómo funciona?</h4>
        <p className='text-gray-600 text-sm'>Entiende el proceso de contratación paso a paso.</p>
      </div>
    ),
    position: 'top',
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        const element = document.querySelector('#tour-how-it-works');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => resolve(), 700);
        } else {
          resolve();
        }
      });
    },
  },
  {
    selector: '#tour-cta-section',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>7. ¡Empieza Ahora!</h4>
        <p className='text-gray-600 text-sm'>
          Si no encuentras lo que buscas, contáctanos directamente aquí.
        </p>
      </div>
    ),
    position: 'top',
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        const element = document.querySelector('#tour-cta-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => resolve(), 700);
        } else {
          resolve();
        }
      });
    },
  },
  {
    selector: '#footer-principal',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>8. Información y Ayuda</h4>
        <p className='text-gray-600 text-sm'>
          Encuentra soporte, enlaces legales y la opción para{' '}
          <strong>ver esta guía nuevamente</strong>.
        </p>
      </div>
    ),
    position: 'top',
    actionAfter: async (node: any) => {
      return new Promise<void>((resolve) => {
        const element = document.querySelector('#footer-principal');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => resolve(), 700);
        } else {
          resolve();
        }
      });
    },
  },
  {
    selector: '#tour-auth-buttons-desktop',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>9. Tu Cuenta</h4>
        <p className='text-gray-600 text-sm'>
          Finalmente, inicia sesión o regístrate para comenzar.
        </p>
      </div>
    ),
    position: 'bottom',
    actionAfter: async () => {
      return new Promise<void>((resolve) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => resolve(), 700);
      });
    },
  },
  {
    selector: '#tour-auth-buttons-mobile',
    content: (
      <div>
        <h4 className='font-bold text-lg mb-2 text-gray-800'>9. Tu Cuenta</h4>
        <p className='text-gray-600 text-sm'>
          Finalmente, inicia sesión o regístrate para comenzar.
        </p>
      </div>
    ),
    position: 'bottom',
    actionAfter: async () => {
      return new Promise<void>((resolve) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => resolve(), 700);
      });
    },
  },
];
