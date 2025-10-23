import { NextResponse } from 'next/server';

type Fixer = {
  id: number;
  nombre: string;
  servicio: string;
  lat: number;
  lng: number;
  available: boolean;
};

// Distribución solicitada:
// - Cochabamba: 6 fixers, esparcidos (Centro, Estación del Tren, La Cancha, Recoleta, Sarco, Laguna Alalay)
// - Quillacollo: 4 fixers, esparcidos (Centro, NW, Colcapirhua, Cotapachi)
const FIXERS: Fixer[] = [
  // Cochabamba
  { id: 1, nombre: 'Juan Pérez', servicio: 'Electricista', lat: -17.389, lng: -66.156, available: true }, // Centro
  { id: 2, nombre: 'María López', servicio: 'Plomero', lat: -17.402, lng: -66.157, available: true }, // La Cancha
  { id: 3, nombre: 'Carlos Gómez', servicio: 'Carpintero', lat: -17.382, lng: -66.151, available: false }, // Estación del Tren
  { id: 4, nombre: 'Ana Torres', servicio: 'Pintor', lat: -17.390, lng: -66.146, available: true }, // Recoleta
  { id: 5, nombre: 'Luis Rojas', servicio: 'Cerrajero', lat: -17.383, lng: -66.170, available: true }, // Sarco
  { id: 6, nombre: 'Elena Aguilar', servicio: 'Jardinera', lat: -17.406, lng: -66.145, available: true }, // Laguna Alalay (NE)

  // Quillacollo y alrededores
  { id: 7, nombre: 'Sofía Vargas', servicio: 'Electricista', lat: -17.394, lng: -66.282, available: true }, // Centro Quillacollo
  { id: 8, nombre: 'Miguel Álvarez', servicio: 'Plomero', lat: -17.385, lng: -66.290, available: false }, // Quillacollo NW
  { id: 9, nombre: 'Pedro Castro', servicio: 'Carpintero', lat: -17.392, lng: -66.250, available: true }, // Colcapirhua
  { id: 10, nombre: 'Daniela Ruiz', servicio: 'Limpieza', lat: -17.416, lng: -66.302, available: true }, // Cotapachi
];

export async function GET() {
  return NextResponse.json(FIXERS, { status: 200 });
}