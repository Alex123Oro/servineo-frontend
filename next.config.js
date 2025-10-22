/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Configuración explícita de Turbopack
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Desactivar temporalmente la optimización de imágenes si causa problemas
    // images: { unoptimized: true },
  },
  // Otras opciones de configuración
  /* config options here */
};

module.exports = nextConfig;