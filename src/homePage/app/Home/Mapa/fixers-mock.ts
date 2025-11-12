// Datos mock de fixers disponibles en un radio de 5km
import { LatLngExpression } from 'leaflet';

export interface Fixer {
  id: string;
  name: string;
  profession: string;
  location: LatLngExpression;
  rating: number;
  phone: string;
  profileUrl: string;
}

// Coordenadas cercanas a Plaza 14 de Septiembre, Cochabamba
const FIXERS_DATA: Fixer[] = [
  {
    id: 'f1',
    name: 'Carlos Mendoza',
    profession: 'Electricista',
    location: [-17.3896, -66.1548],
    rating: 4.8,
    phone: '591-70123456',
    profileUrl: '/perfil/carlos-mendoza'
  },
  {
    id: 'f2',
    name: 'Ana Rojas',
    profession: 'Plomera',
    location: [-17.3956, -66.1528],
    rating: 4.9,
    phone: '591-70234567',
    profileUrl: '/perfil/ana-rojas'
  },
  {
    id: 'f3',
    name: 'Miguel Flores',
    profession: 'Carpintero',
    location: [-17.3916, -66.1618],
    rating: 4.7,
    phone: '591-70345678',
    profileUrl: '/perfil/miguel-flores'
  },
  {
    id: 'f4',
    name: 'Laura Vargas',
    profession: 'Pintora',
    location: [-17.3876, -66.1498],
    rating: 4.6,
    phone: '591-70456789',
    profileUrl: '/perfil/laura-vargas'
  },
  {
    id: 'f5',
    name: 'Roberto Guzmán',
    profession: 'Técnico en Climatización',
    location: [-17.3936, -66.1588],
    rating: 4.5,
    phone: '591-70567890',
    profileUrl: '/perfil/roberto-guzman'
  }
];

export default FIXERS_DATA;