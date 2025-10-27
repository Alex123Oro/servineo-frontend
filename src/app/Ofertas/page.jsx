import React from 'react';

const OfertasPage = () => {
  const serviceOffers = [
    {
      id: 1,
      title: 'Electricista Profesional',
      company: 'ServiHogar',
      location: 'Ciudad de La Paz',
      price: '$50 - $80 por hora',
      type: 'Presencial',
      experience: '3-5 años',
      description:
        'Electricista certificado para instalaciones y reparaciones en domicilios y oficinas.',
      requirements: [
        'Certificación eléctrica',
        'Experiencia en instalaciones residenciales',
        'Herramientas propias',
      ],
      posted: 'Hace 1 día',
      icon: '⚡',
    },
    {
      id: 2,
      title: 'Plomero Experto',
      company: 'ServiHogar',
      location: 'Ciudad de La Paz',
      price: '$40 - $70 por hora',
      type: 'Presencial',
      experience: '2-4 años',
      description: 'Servicio de plomería para reparaciones, fugas y mantenimiento general.',
      requirements: ['Experiencia comprobable', 'Herramientas propias', 'Atención a emergencias'],
      posted: 'Hace 2 días',
      icon: '🚰',
    },
    {
      id: 3,
      title: 'Pintor Profesional',
      company: 'ServiHogar',
      location: 'Remoto / A domicilio',
      price: '$30 - $60 por hora',
      type: 'Presencial',
      experience: '1-3 años',
      description: 'Pintura de interiores y exteriores, acabados profesionales y decoración.',
      requirements: ['Experiencia en pintura', 'Acabados precisos', 'Herramientas propias'],
      posted: 'Hace 3 días',
      icon: '🎨',
    },
    {
      id: 4,
      title: 'Albañil Certificado',
      company: 'ServiHogar',
      location: 'Ciudad de La Paz',
      price: '$45 - $75 por hora',
      type: 'Presencial',
      experience: '4-6 años',
      description: 'Trabajos de construcción, remodelación y reparaciones en estructuras.',
      requirements: ['Experiencia en obra', 'Conocimiento de materiales', 'Trabajo seguro'],
      posted: 'Hace 5 días',
      icon: '🏗️',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Spacer */}
      <div className="h-20"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Servicios Disponibles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra profesionales para electricidad, plomería, pintura y albañilería
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow">
            Todos
          </button>
          <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Electricista
          </button>
          <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Plomería
          </button>
          <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Pintura
          </button>
          <button className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Albañilería
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {serviceOffers.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{service.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                    <p className="text-gray-600">{service.company}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {service.posted}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">📍</span>
                  {service.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">💰</span>
                  {service.price}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">⏰</span>
                  {service.type}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">👷‍♂️</span>
                  {service.experience}
                </div>
              </div>

              <p className="text-gray-600 mb-4">{service.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Requisitos:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.requirements.map((req, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold">
                Solicitar Servicio
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¿No encuentras el servicio que necesitas?
          </h2>
          <p className="text-gray-600 mb-6">
            Envíanos tu solicitud y te contactaremos con el profesional adecuado
          </p>
          <button className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-semibold">
            Enviar Solicitud
          </button>
        </div>
      </div>

      {/* Mobile Bottom Spacer */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default OfertasPage;
