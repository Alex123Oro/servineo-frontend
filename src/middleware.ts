import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true,
  localeCookie: true,
});

export const config = {
  // Excluir rutas públicas y assets para que el middleware no intercepte
  // las peticiones a imágenes estáticas en /img, /assets, /icons, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|img|assets|icons).*)',
  ],
};
