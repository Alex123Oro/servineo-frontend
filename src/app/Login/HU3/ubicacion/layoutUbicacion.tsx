import 'leaflet/dist/leaflet.css'
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Mi Proyecto con Leaflet',
  description: 'Mapa integrado con React Leaflet en Next.js',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

