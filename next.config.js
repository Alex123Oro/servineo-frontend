/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Fuerza a Next a usar este proyecto como raíz del tracing
  outputFileTracingRoot: __dirname,
  experimental: {
    // images: { unoptimized: true },
  },
};

module.exports = nextConfig;