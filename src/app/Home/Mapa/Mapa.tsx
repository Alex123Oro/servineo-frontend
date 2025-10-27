'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Mapa.module.css';

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
        </MapContainer>
      </div>
      
      {/* Información adicional */}
      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>Funcionalidades del Mapa:</h3>
        <div className={styles.infoGrid}>
          <div>
            <h4 className={styles.infoSubtitle}>Controles:</h4>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>• Zoom in/out con la rueda del mouse</li>
              <li className={styles.infoItem}>• Arrastra para mover el mapa</li>
              <li className={styles.infoItem}>• Doble clic para hacer zoom</li>
              <li className={styles.infoItem}>• Toque y arrastra en dispositivos móviles</li>
            </ul>
          </div>
          <div>
            <h4 className={styles.infoSubtitle}>Marcadores:</h4>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>• 🔵 Punto azul: Tu ubicación actual</li>
              <li className={styles.infoItem}>• 🔴 Punto rojo: Plaza 14 de Septiembre</li>
              <li className={styles.infoItem}>• Haz clic en los marcadores para más información</li>
            </ul>
          </div>
        </div>
        {!userPosition && (
          <div className={styles.tipBox}>
            <p className={styles.tipText}>
              💡 <strong>Tip:</strong> Permite el acceso a tu ubicación para una mejor experiencia
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Mapa;