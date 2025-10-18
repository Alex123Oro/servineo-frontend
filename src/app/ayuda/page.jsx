import React from 'react';

const HelpPage = () => {
  const faqs = [
    {
      id: 1,
      question: '¿Cómo puedo solicitar un servicio?',
      answer:
        'Puedes contactarnos directamente a través de nuestro formulario o llamarnos al número que aparece en la página. Te asignaremos un técnico según el tipo de servicio que necesites: electricidad, plomería, pintura o albañilería.',
      icon: '🔧',
    },
    {
      id: 2,
      question: '¿En cuánto tiempo pueden acudir a mi domicilio?',
      answer:
        'Depende de la zona y la disponibilidad del técnico. Generalmente ofrecemos atención el mismo día o dentro de las 24 horas siguientes a la solicitud.',
      icon: '⏰',
    },
    {
      id: 3,
      question: '¿Ofrecen garantía por los trabajos realizados?',
      answer:
        'Sí, todos nuestros servicios cuentan con garantía. Si surge algún inconveniente después del trabajo, enviamos nuevamente a un técnico sin costo adicional dentro del periodo de garantía.',
      icon: '🛠️',
    },
    {
      id: 4,
      question: '¿Puedo solicitar varios servicios a la vez?',
      answer:
        'Claro, puedes solicitar más de un servicio en la misma visita. Por ejemplo, revisar una instalación eléctrica y reparar una fuga de agua. Nuestro equipo coordinará los especialistas necesarios.',
      icon: '👷‍♂️',
    },
    {
      id: 5,
      question: '¿Trabajan fines de semana o feriados?',
      answer:
        'Sí, contamos con técnicos disponibles los fines de semana y días feriados para emergencias o trabajos programados con anticipación.',
      icon: '📅',
    },
    {
      id: 6,
      question: '¿Cómo es el proceso de trabajo?',
      answer:
        'Primero tomamos tus datos y el tipo de problema. Luego enviamos a un técnico especializado para evaluar y cotizar el trabajo. Si apruebas la cotización, el servicio se realiza de inmediato o se agenda según tu disponibilidad.',
      icon: '📋',
    },
  ];

  const contactMethods = [
    {
      method: 'Email',
      value: 'contacto@servihogar.com',
      icon: '📧',
      description: 'Respondemos en menos de 24 horas',
    },
    {
      method: 'Teléfono',
      value: '+591 700 12345',
      icon: '📞',
      description: 'Lunes a Domingo 8:00 - 20:00',
    },
    {
      method: 'WhatsApp',
      value: '+591 700 98765',
      icon: '💬',
      description: 'Atención inmediata para emergencias',
    },
    {
      method: 'Chat en vivo',
      value: 'Disponible en el sitio',
      icon: '💭',
      description: 'Soporte en tiempo real',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-20"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra respuestas a tus preguntas o contacta con nuestro equipo de atención al
            cliente
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              🔍
            </button>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <span className="text-4xl mb-4 block">{contact.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{contact.method}</h3>
              <p className="text-gray-600 font-semibold mb-2">{contact.value}</p>
              <p className="text-sm text-gray-500">{contact.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <span className="text-2xl mr-4 mt-1">{faq.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600 mb-6">
            Nuestro equipo está disponible para atenderte y resolver cualquier duda sobre tu
            servicio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold">
              Contactar Soporte
            </button>
            <button className="border border-gray-600 text-gray-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-semibold">
              Enviar Solicitud
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Spacer */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default HelpPage;
