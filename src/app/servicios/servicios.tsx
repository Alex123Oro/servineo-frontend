export const metadata = { title: "Servicios | Servineo" };

export default function ServiciosPage({ 
  showHero = true, 
  showAllServices = true, 
  showCTA = true,
  title,
  subtitle
}: { 
  showHero?: boolean, 
  showAllServices?: boolean, 
  showCTA?: boolean,
  title?: string,
  subtitle?: string
}) {
  const services = [
    { 
      name: 'Plomería', 
      icon: '🔧', 
      description: 'Instalaciones, reparaciones y mantenimiento',
      demand: 95
    },
    { 
      name: 'Electricidad', 
      icon: '⚡', 
      description: 'Instalaciones eléctricas y reparaciones',
      demand: 90
    },
    { 
      name: 'Carpintería', 
      icon: '🔨', 
      description: 'Muebles, puertas y trabajos en madera',
      demand: 85
    },
    { 
      name: 'Pintura', 
      icon: '🎨', 
      description: 'Pintura interior y exterior',
      demand: 80
    },
    { 
      name: 'Limpieza', 
      icon: '🧽', 
      description: 'Limpieza residencial y comercial',
      demand: 88
    },
    { 
      name: 'Jardinería', 
      icon: '🌱', 
      description: 'Mantenimiento y diseño de jardines',
      demand: 75
    },
    { 
      name: 'Albañilería', 
      icon: '🧱', 
      description: 'Construcción y reparaciones de albañilería',
      demand: 82
    },
    { 
      name: 'Cerrajería', 
      icon: '🔑', 
      description: 'Apertura de puertas y cambio de cerraduras',
      demand: 78
    },
    { 
      name: 'Gasfitería', 
      icon: '💧', 
      description: 'Instalación y reparación de tuberías de gas',
      demand: 70
    }
  ];

  const servicesToShow = showAllServices ? services : services.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {showHero && (
        <section className="w-full py-16 px-4 bg-gradient-to-b from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {title || 'Servicios disponibles'}
            </h1>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90">
              {subtitle || 'Encuentra el profesional perfecto para cualquier trabajo en tu hogar'}
            </p>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {!showHero && title && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {title}
              </h2>
              {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesToShow.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl">{service.icon}</div>
                  <div className="text-gray-400 text-xl">→</div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{service.demand}% de demanda</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${service.demand}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Ver más →
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Botón Ver más servicios */}
          {!showAllServices && (
            <div className="flex justify-center mt-12">
              <a href="/servicios" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                Ver más
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      {showCTA && (
        <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Contáctanos y te ayudamos a encontrar el profesional perfecto para tu proyecto
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Solicitar servicio personalizado
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Hablar con un asesor
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
