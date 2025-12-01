import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      // Mantener solo la reescritura de la API; evitamos cambiar rutas de
      // assets aquí para no modificar archivos de configuración de proyecto
      // innecesariamente. El middleware ya excluye /img /assets /icons.
    ];
  },
};

export default withNextIntl(nextConfig);
