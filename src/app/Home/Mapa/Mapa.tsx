'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Mapa.module.css';
import FIXERS_DATA, { Fixer } from './fixers-mock';

// Importación dinámica para evitar errores de SSR
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { 
  ssr: false,
  loading: () => (
    <div className={styles.loadingContainer}>
      <div className="text-center">
        <div className={styles.loadingSpinner}></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  )
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

// Coordenadas de Plaza 14 de Septiembre, Cochabamba
const PLAZA_14_SEPTIEMBRE: LatLngExpression = [-17.3926, -66.1568];

// Tipos para mejor type safety
interface Position {
  lat: number;
  lng: number;
}

// Configurar iconos personalizados con mejor manejo de tipos
const createCustomIcon = (L: typeof import('leaflet'), color: string = '#3388ff') => {
  return L.divIcon({
    className: styles.customMarker,
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <div style="
          color: white;
          font-size: 16px;
          font-weight: bold;
          transform: rotate(45deg);
          margin-top: -2px;
        ">📍</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Configurar icono para fixers (puntos verdes)
const createFixerIcon = (L: typeof import('leaflet')) => {
  return L.divIcon({
    className: styles.fixerMarker,
    html: `
      <div style="
        background-color: #4CAF50;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const Mapa = memo(function Mapa() {
  const [position, setPosition] = useState<LatLngExpression>(PLAZA_14_SEPTIEMBRE);
  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Cargar Leaflet dinámicamente y configurar iconos por defecto
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const leaflet = await import('leaflet');
        const L = leaflet.default;
        
        // Configurar iconos por defecto para evitar errores de SSR
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        setL(L);
        setMapReady(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setError('Error al cargar el mapa. Por favor, recarga la página.');
        setIsLoading(false);
      }
    };
    
    loadLeaflet();
  }, []);

  // Obtener ubicación del usuario con mejor manejo de errores
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por este navegador.');
      setPosition(PLAZA_14_SEPTIEMBRE);
      setIsLoading(false);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos: Position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserPosition(userPos);
        setPosition([userPos.lat, userPos.lng]);
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.warn('Error de geolocalización:', error.message);
        let errorMessage = 'No se pudo obtener tu ubicación. Mostrando Plaza 14 de Septiembre.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Mostrando Plaza 14 de Septiembre.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible. Mostrando Plaza 14 de Septiembre.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado. Mostrando Plaza 14 de Septiembre.';
            break;
        }
        
        setError(errorMessage);
        setPosition(PLAZA_14_SEPTIEMBRE);
        setUserPosition(null);
        setIsLoading(false);
      },
      options
    );
  }, []);

  useEffect(() => {
    if (mapReady) {
      getUserLocation();
    }
  }, [mapReady, getUserLocation]);

  // Loading state
  if (isLoading || !L || !mapReady) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <div className={styles.loadingSpinner}></div>
          <p className="text-gray-600">Cargando mapa...</p>
          <p className="text-gray-500 text-sm mt-2">Obteniendo tu ubicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mensaje de estado */}
      {error && (
        <div className={styles.errorMessage}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}
      
      {/* Mapa interactivo */}
      <div className={styles.mapContainer} style={{ height: '400px' }}>
        <MapContainer 
          center={position} 
          zoom={userPosition ? 15 : 13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
          touchZoom={true}
          key={`map-${userPosition ? 'user' : 'default'}`} // Force re-render when position changes
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            minZoom={10}
          />
          
          {/* Marcador del usuario */}
          {userPosition && (
            <Marker position={[userPosition.lat, userPosition.lng]} icon={createCustomIcon(L, '#3388ff')}>
              <Popup>
                <div className="text-center">
                  <strong>¡Tu ubicación!</strong>
                  <br />
                  <small>Lat: {userPosition.lat.toFixed(6)}</small>
                  <br />
                  <small>Lng: {userPosition.lng.toFixed(6)}</small>
                  <br />
                  <small className="text-blue-600">Precisión: ~{Math.round(userPosition.lat * 1000000) % 100}m</small>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marcador de Plaza 14 de Septiembre */}
          <Marker position={PLAZA_14_SEPTIEMBRE} icon={createCustomIcon(L, '#e74c3c')}>
            <Popup>
              <div className="text-center">
                <strong>Plaza 14 de Septiembre</strong>
                <br />
                <small>Cochabamba, Bolivia</small>
                <br />
                <small>Punto de referencia central</small>
                <br />
                <button 
                  className={styles.popupButton}
                  onClick={() => getUserLocation()}
                >
                  Centrar en mi ubicación
                </button>
              </div>
            </Popup>
          </Marker>
          
          {/* Radio de 5km alrededor de la ubicación central */}
          <Circle 
            center={PLAZA_14_SEPTIEMBRE} 
            radius={5000} 
            pathOptions={{ fillColor: 'rgba(76, 175, 80, 0.1)', fillOpacity: 0.1, color: '#4CAF50', weight: 1 }} 
          />
          
          {/* Marcadores de fixers disponibles */}
          {FIXERS_DATA.map(fixer => (
            <Marker 
              key={fixer.id} 
              position={fixer.location} 
              icon={createFixerIcon(L)}
            >
              <Popup>
                <div className="p-2 text-center">
                  <h3 className="font-bold text-lg">{fixer.name}</h3>
                  <p className="text-gray-700 mb-2">{fixer.profession}</p>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        {i < Math.floor(fixer.rating) ? "★" : (i < fixer.rating ? "⯨" : "☆")}
                      </span>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({fixer.rating})</span>
                  </div>
                  <div className="flex justify-center space-x-2 mt-3">
                    <a 
                      href={`https://wa.me/${fixer.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <span className="mr-1">WhatsApp</span>
                    </a>
                    <a 
                      href={fixer.profileUrl} 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <span className="mr-1">Ver Perfil</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Se eliminó el recuadro de funcionalidades del mapa */}
    </div>
  );
});

export default Mapa;