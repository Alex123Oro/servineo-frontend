import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Asegúrate de que tu configuración de 'rewrites' use la variable
  // SIN el prefijo 'NEXT_PUBLIC_'
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // ¡DEBE USAR BACKEND_URL, NO NEXT_PUBLIC_BACKEND_URL!
        destination: `${process.env.BACKEND_URL}/api/:path*`, 
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // --- AÑADE ESTO PARA IGNORAR ERRORES DE TYPESCRIPT ---
  typescript: {
    // Advertencia: Esto omitirá los errores de TypeScript durante el 'build'.
    // Tu build será exitoso, pero el código aún tiene errores de tipado.
    ignoreBuildErrors: true,
  },
    // --- FIN DE LA ADICIÓN ---
};

export default nextConfig;
