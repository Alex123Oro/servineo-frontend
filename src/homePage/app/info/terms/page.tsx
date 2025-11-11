'use client';

export default function TermsPage() {
    return (
      <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--light-blue)] text-white py-12 px-6 md:px-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--accent)]/20 rounded-full blur-2xl"></div>
  
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Términos y Condiciones
            </h1>
            <p className="text-base opacity-90 max-w-2xl mx-auto">
              Por favor, lee cuidadosamente estos términos antes de utilizar Servineo.
            </p>
            <p className="text-sm opacity-75 mt-2">
              Última actualización: Octubre 2025
            </p>
          </div>
        </section>
  
        {/* Contenido Principal */}
        <section className="max-w-4xl mx-auto py-10 px-6 md:px-10">
          {/* Introducción */}
          <div className="mb-8 p-5 bg-[var(--light-gray)] border-l-4 border-[var(--primary)] rounded-r-lg shadow-sm">
            <h2 className="text-xl font-bold text-[var(--secondary)] mb-2">Bienvenido a Servineo</h2>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">
              Al acceder y utilizar nuestra plataforma, aceptas estar sujeto a estos términos y condiciones.
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
            </p>
          </div>
  
          {/* Términos individuales */}
          <div className="space-y-6">
            {/* Término 1 */}
            <div className="border-l-4 border-[var(--primary)] pl-5">
              <h3 className="text-lg font-bold text-[var(--secondary)] mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--dark-purple)] rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                Uso de la Plataforma
              </h3>
              <p className="text-sm text-[var(--foreground)] leading-relaxed mb-2">
                Servineo es una plataforma que conecta usuarios con profesionales de servicios verificados.
                Al utilizar la plataforma, te comprometes a:
              </p>
              <ul className="text-sm text-[var(--foreground)] space-y-1 ml-4">
                <li>• Proporcionar información veraz y actualizada</li>
                <li>• Usar el servicio únicamente para fines legales</li>
                <li>• No suplantar identidades ni crear perfiles falsos</li>
                <li>• Respetar a todos los usuarios y profesionales de la comunidad</li>
              </ul>
            </div>
  
            {/* Término 2 */}
            <div className="border-l-4 border-[var(--accent)] pl-5">
              <h3 className="text-lg font-bold text-[var(--secondary)] mb-2 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-[var(--light-gray)] rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                Registro y Cuenta de Usuario
              </h3>
              <p className="text-sm text-[var(--foreground)] leading-relaxed mb-2">
                Para acceder a ciertas funcionalidades, deberás crear una cuenta. Eres responsable de:
              </p>
              <ul className="text-sm text-[var(--foreground)] space-y-1 ml-4">
                <li>• Mantener la confidencialidad de tus credenciales</li>
                <li>• Todas las actividades realizadas bajo tu cuenta</li>
                <li>• Notificarnos inmediatamente de cualquier uso no autorizado</li>
                <li>• Actualizar tu información de contacto cuando sea necesario</li>
              </ul>
            </div>
  
            {/* Términos 3 al 10 */}
            {/* ... (estructura igual, solo cambia el color de los gradientes y bordes según las variables globales) ... */}
  
          </div>
  
          {/* Sección de contacto */}
          <div className="mt-10 p-6 bg-gradient-to-br from-[var(--light-gray)] to-[var(--light-blue)] rounded-xl border border-[var(--accent)] shadow-sm">
            <h3 className="text-lg font-bold text-[var(--secondary)] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              ¿Tienes preguntas?
            </h3>
            <p className="text-sm text-[var(--foreground)] leading-relaxed mb-3">
              Si tienes dudas sobre estos términos y condiciones o necesitas más información,
              no dudes en contactarnos:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="mailto:legal@servineo.com" className="text-sm text-[var(--primary)] font-semibold hover:text-[var(--accent)] transition-colors">
                legal@servineo.com
              </a>
              <span className="hidden sm:block text-gray-400">|</span>
              <a href="mailto:soporte@servineo.com" className="text-sm text-[var(--primary)] font-semibold hover:text-[var(--accent)] transition-colors">
                soporte@servineo.com
              </a>
            </div>
          </div>
        </section>
  
        {/* Footer decorativo */}
        <section className="bg-gradient-to-r from-[var(--secondary)] to-[var(--light-blue)] text-white text-center py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm opacity-90">
              Al usar Servineo, confirmas que has leído, entendido y aceptado estos términos y condiciones.
            </p>
            <button className="mt-4 bg-white text-[var(--primary)] px-6 py-2 rounded-full font-bold text-sm hover:bg-[var(--light-gray)] transition-all duration-300 shadow-md">
              Aceptar y Continuar
            </button>
          </div>
        </section>
      </main>
    );
  }
  