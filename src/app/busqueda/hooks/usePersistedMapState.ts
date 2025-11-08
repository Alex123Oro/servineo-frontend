'use client';
import { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

const DEFAULT_POSITION: [number, number] = [-17.39381, -66.15693];
const DEFAULT_ZOOM = 14;

export function usePersistedMapState() {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

  // 🔹 Recuperar del localStorage al montar
  useEffect(() => {
    const savedPos = localStorage.getItem("mapPosition");
    const savedZoom = localStorage.getItem("mapZoom");

    if (savedPos) setPosition(JSON.parse(savedPos));
    if (savedZoom) setZoom(Number(savedZoom));
  }, []);

  // 🔹 Guardar cambios automáticamente
  useEffect(() => {
    localStorage.setItem("mapPosition", JSON.stringify(position));
    localStorage.setItem("mapZoom", zoom.toString());
  }, [position, zoom]);

  // 🔹 Función para actualizar posición
  const updatePosition = (pos: LatLngExpression) => {
    const [lat, lng] = Array.isArray(pos) ? pos : [pos.lat, pos.lng];
    setPosition([lat, lng]);
  };

  // 🔹 Función para actualizar zoom
  const updateZoom = (z: number) => setZoom(z);

  return { position, zoom, updatePosition, updateZoom };
}
