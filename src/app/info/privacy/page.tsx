'use client';
import React from "react";

// Tipos para los subcomponentes
type SectionBlockProps = {
  index: string | number;
  title: string;
  gradient: string;
  borderColor: string;
  children?: React.ReactNode;
};

type InfoItemProps = {
  title: string;
  text: string;
};

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white py-16 px-6 md:px-12 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent)]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--dark-purple)]/30 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Política de Privacidad
          </h1>
          <p className="text-base opacity-90 max-w-2xl mx-auto">
            Tu privacidad es nuestra prioridad. Conoce cómo protegemos y
            manejamos tu información.
          </p>
          <p className="text-sm opacity-80 mt-2">
            Última actualización: Octubre 2025
          </p>
        </div>
      </section>

      {/* INTRODUCCIÓN */}
      <section className="max-w-5xl mx-auto py-14 px-6 md:px-10">
        <div className="mb-10 p-6 bg-[var(--light-gray)] border-l-4 border-[var(--primary)] rounded-r-xl shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--primary)] mb-3">
            Compromiso con tu Privacidad
          </h2>
          <p className="text-sm leading-relaxed mb-2">
            En <strong>Servineo</strong> nos tomamos muy en serio la protección
            de tu información personal. Esta política explica qué datos
            recopilamos, cómo los usamos y los derechos que tienes sobre ellos.
          </p>
          <p className="text-sm leading-relaxed">
            Al usar nuestros servicios, aceptas las prácticas descritas en esta
            política de privacidad.
          </p>
        </div>

        {/* SECCIONES */}
        <div className="space-y-10">
          {/* SECCIÓN 1 */}
          <SectionBlock
            index="1"
            title="Información que Recopilamos"
            gradient="from-[var(--primary)] to-[var(--secondary)]"
            borderColor="var(--primary)"
          >
            <p>
              Recopilamos diferentes tipos de información para brindarte
              nuestros servicios:
            </p>
            <ul className="space-y-3 mt-3 ml-2">
              <InfoItem
                title="Información de Cuenta"
                text="Nombre completo, correo electrónico, teléfono, dirección y fecha de nacimiento."
              />
              <InfoItem
                title="Información de Servicios"
                text="Detalles de los servicios solicitados, direcciones, videos de inspección, cotizaciones y preferencias."
              />
              <InfoItem
                title="Información de Pago"
                text="Datos procesados de forma segura por nuestros proveedores certificados."
              />
              <InfoItem
                title="Datos de Uso"
                text="Información sobre el uso de la app, páginas visitadas, tiempo de uso, dispositivo y dirección IP."
              />
            </ul>
          </SectionBlock>

          {/* SECCIÓN 2 */}
          <SectionBlock
            index="2"
            title="Cómo Usamos tu Información"
            gradient="from-[var(--secondary)] to-[var(--accent)]"
            borderColor="var(--secondary)"
          >
            <ul className="list-disc list-inside space-y-2 text-sm text-[var(--foreground)]">
              <li>
                <strong>Proveer el servicio:</strong> conectar con profesionales
                verificados.
              </li>
              <li>
                <strong>Procesar pagos:</strong> facilitar transacciones seguras.
              </li>
              <li>
                <strong>Mejorar la plataforma:</strong> optimizar funciones y
                experiencia.
              </li>
              <li>
                <strong>Comunicación:</strong> enviar confirmaciones y avisos.
              </li>
              <li>
                <strong>Seguridad:</strong> prevenir fraude y proteger la
                comunidad.
              </li>
            </ul>
          </SectionBlock>

          {/* SECCIÓN 3 */}
          <SectionBlock
            index="3"
            title="Compartir Información"
            gradient="from-[var(--accent)] to-[var(--dark-purple)]"
            borderColor="var(--accent)"
          >
            <p>
              Compartimos tu información únicamente en las siguientes
              circunstancias:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>
                <strong>Con profesionales:</strong> información necesaria para
                brindar el servicio.
              </li>
              <li>
                <strong>Proveedores:</strong> servicios de pago, hosting o
                análisis.
              </li>
              <li>
                <strong>Cumplimiento legal:</strong> cuando la ley lo requiera.
              </li>
              <li>
                <strong>Nunca vendemos:</strong> tu información no se comercializa
                bajo ninguna circunstancia.
              </li>
            </ul>
          </SectionBlock>

          {/* SECCIÓN 4 */}
          <SectionBlock
            index="4"
            title="Seguridad de los Datos"
            gradient="from-[var(--dark-purple)] to-[var(--primary)]"
            borderColor="var(--dark-purple)"
          >
            <p>
              Implementamos múltiples medidas de seguridad para proteger tu
              información:
            </p>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {[
                "Encriptación SSL/TLS",
                "Servidores Seguros",
                "Autenticación de Dos Factores",
                "Monitoreo Constante",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-[var(--light-gray)] p-2 rounded-lg shadow-sm"
                >
                  <svg
                    className="w-5 h-5 text-[var(--accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* SECCIÓN FINAL */}
          <SectionBlock
            index="5"
            title="Tus Derechos"
            gradient="from-[var(--primary)] to-[var(--accent)]"
            borderColor="var(--primary)"
          >
            <ul className="space-y-2 text-sm">
              <li>→ Acceso a tu información personal.</li>
              <li>→ Corrección o actualización de datos.</li>
              <li>→ Eliminación de tu cuenta (derecho al olvido).</li>
              <li>→ Portabilidad de datos.</li>
              <li>→ Oposición a ciertos tratamientos.</li>
              <li>→ Revocar consentimiento en cualquier momento.</li>
            </ul>
          </SectionBlock>
        </div>

        {/* CONTACTO */}
        <div className="mt-16 p-6 bg-[var(--light-gray)] rounded-xl border border-[var(--accent)] shadow-md">
          <h3 className="text-lg font-bold text-[var(--primary)] mb-2">
            Contacto sobre Privacidad
          </h3>
          <p className="text-sm mb-2">
            Si tienes preguntas o deseas ejercer tus derechos, contáctanos:
          </p>
          <a
            href="mailto:privacidad@servineo.com"
            className="text-[var(--secondary)] font-semibold hover:text-[var(--accent)] transition-colors"
          >
            privacidad@servineo.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-center py-8">
        <p className="text-sm font-medium">
          Tu privacidad está protegida con nosotros. © Servineo 2025.
        </p>
      </footer>
    </main>
  );
}

/* Subcomponentes para limpieza */
function SectionBlock({ index, title, gradient, borderColor, children }: SectionBlockProps) {
  return (
    <div
      className="pl-5 border-l-4 rounded-lg bg-white p-5 shadow-sm"
      style={{ borderColor }}
    >
      <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
        <span
          className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white text-sm font-bold`}
        >
          {index}
        </span>
        {title}
      </h3>
      <div className="text-sm text-[var(--foreground)] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ title, text }: InfoItemProps) {
  return (
    <div className="bg-[var(--light-gray)] p-3 rounded-lg shadow-sm">
      <h4 className="font-semibold text-[var(--primary)] text-sm mb-1">
        {title}
      </h4>
      <p className="text-sm text-[var(--foreground)]/80">{text}</p>
    </div>
  );
}
