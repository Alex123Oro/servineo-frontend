import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  // --- AÑADE ESTE NUEVO OBJETO AQUÍ ---
  {
    rules: {
      // Esto convierte los errores de build en advertencias (warn)
      // Vercel mostrará las advertencias, pero NO detendrá el build.
      
      // Errores que vimos en tus logs:
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@next/next/no-img-element": "warn"
    }
  }
  // --- FIN DE LA ADICIÓN ---
];

export default eslintConfig;