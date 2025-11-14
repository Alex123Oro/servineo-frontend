/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Fuerza a Next a usar este proyecto como raíz del tracing
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      // Avatares de demostración
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      // Avatares de Google OAuth
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // Avatares de GitHub (si se usan)
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // images: { unoptimized: true },
  },
};

module.exports = nextConfig;