'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
//acordeon :3
export const Accordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSections = [
    {
      title: "Primeros pasos",
      questions: [
        {
          question: "¿Cómo me registro en Servineo?",
          answer: "Descarga la app o visita nuestra web, haz clic en 'Registrarse' e ingresa tu correo, nombre y crea una contraseña. Verifica tu email y listo, ya puedes buscar profesionales."
        },
        {
          question: "¿Es gratuito usar Servineo?",
          answer: "Sí, registrarte y buscar profesionales es completamente gratuito. Solo pagas por los servicios que contrates directamente con los profesionales."
        }
      ]
    },
    {
      title: "Agendamiento", 
      questions: [
        {
          question: "¿Cómo funciona el calendario en tiempo real?",
          answer: "Cada profesional actualiza su disponibilidad en tiempo real. Tú ves las fechas y horas libres y eliges la que mejor te convenga. Es instantáneo y sin necesidad de llamadas."
        },
        {
          question: "¿Puedo cancelar o reprogramar una cita?",
          answer: "Sí, puedes hacerlo desde la app. Te recomendamos hacerlo con al menos 24 horas de anticipación para evitar cargos. Revisa la <Link href='/politica-cancelacion' className='text-blue-600 underline hover:text-blue-800'>política de cancelación</Link> de cada profesional."
        },
        {
          question: "¿Qué pasa si el profesional no llega?",
          answer: "Contacta inmediatamente a nuestro <Link href='/soporte' className='text-blue-600 underline hover:text-blue-800'>equipo de soporte</Link>. Tomaremos medidas y te ayudaremos a encontrar un reemplazo o te reembolsaremos según corresponda."
        }
      ]
    },
    {
      title: "Video Inspección",
      questions: [
        {
          question: "¿Cómo funciona la video inspección?",
          answer: "Graba un video corto (30-60 segundos) mostrando el problema o área de trabajo. Súbelo a la app y en minutos recibirás cotizaciones de profesionales interesados."
        },
        {
          question: "¿Qué debo incluir en el video?",
          answer: "Muestra claramente el área afectada, el problema específico y cualquier detalle relevante. Buena iluminación y estabilidad ayudan a obtener cotizaciones más precisas."
        },
        {
          question: "¿Cuánto tiempo toma recibir cotizaciones?",
          answer: "Normalmente recibes las primeras cotizaciones en 15-30 minutos. En horarios pico puede tomar hasta 2 horas. Te notificaremos cuando lleguen."
        }
      ]
    },
    {
      title: "Pagos y Seguridad",
      questions: [
        {
          question: "¿Cómo pago por los servicios?",
          answer: "Puedes pagar con tarjeta de crédito/débito, transferencia bancaria o en efectivo al profesional. El pago a través de la app está protegido y solo se libera cuando confirmas que el servicio fue completado."
        },
        {
          question: "¿Mis datos están seguros?",
          answer: "Absolutamente. Usamos encriptación de nivel bancario para proteger tu información. Nunca compartimos tus datos sin tu consentimiento. Visita nuestra <Link href='/seguridad' className='text-blue-600 underline hover:text-blue-800'>sección de Seguridad</Link> para más información."
        },
        {
          question: "¿Qué pasa si no estoy satisfecho con el servicio?",
          answer: "Contáctanos dentro de las 48 horas. Evaluaremos tu caso y, si corresponde, mediaremos con el profesional o procesaremos un reembolso según nuestra <Link href='/politica-garantia' className='text-blue-600 underline hover:text-blue-800'>política de garantía</Link>."
        }
      ]
    },
    {
      title: "Profesionales",
      questions: [
        {
          question: "¿Cómo se verifican los profesionales?",
          answer: "Verificamos identidad, antecedentes, certificaciones profesionales y realizamos entrevistas. Solo aceptamos profesionales con experiencia comprobada y buenas referencias."
        },
        {
          question: "¿Puedo calificar al profesional?",
          answer: "Sí, después de cada servicio puedes dejar una calificación de 1-5 estrellas y un comentario. Esto ayuda a otros usuarios y mantiene la calidad de nuestra red."
        },
        {
          question: "¿Qué hago si tengo un problema con un profesional?",
          answer: "Repórtalo inmediatamente a través de la app o contacta a <Link href='/soporte' className='text-blue-600 underline hover:text-blue-800'>soporte</Link>. Investigaremos y tomaremos las medidas necesarias para resolver la situación."
        }
      ]
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Componente para renderizar texto con enlaces
  const renderAnswerWithLinks = (text: string) => {
    const parts = text.split(/(<Link[^>]*>.*?<\/Link>)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('<Link')) {
        // Extraer href y texto del Link
        const hrefMatch = part.match(/href='([^']*)'/);
        const textMatch = part.match(/<Link[^>]*>(.*?)<\/Link>/);
        
        if (hrefMatch && textMatch) {
          return (
            <Link 
              key={index}
              href={hrefMatch[1]}
              className="text-blue-600 underline hover:text-blue-800 transition-colors"
            >
              {textMatch[1]}
            </Link>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  let currentIndex = 0;

  return (
    <section 
      className="max-w-4xl mx-auto px-4 py-8"
      aria-label="Preguntas frecuentes"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Preguntas Frecuentes
      </h2>
      
      <div className="space-y-8">
        {faqSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
              {section.title}
            </h3>
            
            <div className="space-y-2">
              {section.questions.map((faq, questionIndex) => {
                const globalIndex = currentIndex++;
                return (
                  <div
                    key={globalIndex}
                    className="border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleAccordion(globalIndex)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                      aria-expanded={openIndex === globalIndex}
                      aria-controls={`answer-${globalIndex}`}
                    >
                      <span className="text-lg font-medium text-gray-800 pr-4">
                        {faq.question}
                      </span>
                      <span className="flex-shrink-0 transition-transform duration-300">
                        {openIndex === globalIndex ? (
                          <ChevronUp className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                    
                    <div
                      id={`answer-${globalIndex}`}
                      className={`px-6 pb-4 transition-all duration-300 ${
                        openIndex === globalIndex 
                          ? 'block opacity-100 max-h-96' 
                          : 'hidden opacity-0 max-h-0'
                      }`}
                      role="region"
                    >
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {renderAnswerWithLinks(faq.answer)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accordion;  