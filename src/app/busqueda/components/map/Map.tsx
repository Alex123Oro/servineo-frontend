"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { Fixer } from "@/app/busqueda/interface/Fixer_Interface";
import { LatLngExpression } from "leaflet";

import RecenterMap from "./RecenterMap";
import UserMarker from "./UserMaker"  ;
import FixerMarker from "./FixerMaker";
import MapEvents from "./MapEvents";
import MapCircle from "./MapCircle";
import LocationButton from "./LocationButton";
import { distanceKm } from "@/app/busqueda/utils/distance";

interface MapProps {
  fixers: Fixer[];
}

const defaultPosition: [number, number] = [-17.39381, -66.15693];

export default function Map({ fixers }: MapProps) {
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  const [zoom, setZoom] = useState(14);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Actualiza posición desde eventos del mapa
  const handleMove = (pos: LatLngExpression) => {
    const [lat, lng] = Array.isArray(pos) ? pos : [pos.lat, pos.lng];
    setPosition([lat, lng]);
  };

  // Lee posición y zoom guardados en localStorage y geolocalización
  useEffect(() => {
    const savedPos = localStorage.getItem("mapPosition");
    const savedZoom = localStorage.getItem("mapZoom");
    if (savedPos) setPosition(JSON.parse(savedPos));
    if (savedZoom) setZoom(Number(savedZoom));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setError("No se pudo obtener tu ubicación")
      );
    } else setError("No se pudo obtener tu ubicación");

    setLoading(false);
  }, []);

  // Guarda la posición y zoom actuales en localStorage
  useEffect(() => {
    localStorage.setItem("mapPosition", JSON.stringify(position));
    localStorage.setItem("mapZoom", zoom.toString());
  }, [position, zoom]);

  // Filtra solo fixers disponibles dentro de 5 km
  const nearbyFixers = fixers.filter(
    (f) => f.available && distanceKm(position, [f.lat, f.lng]) <= 5
  );

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <div className="relative" style={{ height: "60vh", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <RecenterMap position={position} />
        <UserMarker position={position} />
        <MapCircle center={position} radius={5000} />

        {nearbyFixers.map((f) => (
          <FixerMarker key={f.id} fixer={f} />
        ))}

        <MapEvents onClick={handleMove} />

        {/* Popup si no hay fixers cercanos */}
        {nearbyFixers.length === 0 && (
          <Popup position={position} closeButton={false} autoPan={true}>
            ⚠️ No se encontraron fixers cercanos
          </Popup>
        )}
      </MapContainer>

      <LocationButton
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
              () => setError("No se pudo obtener tu ubicación")
            );
          }
        }}
      />

      {error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
}
