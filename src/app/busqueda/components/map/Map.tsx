"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Fixer } from "@/app/busqueda/interface/Fixer_Interface";

import RecenterMap from "./RecenterMap";
import UserMarker from "./UserMaker";
import FixerMarker from "./FixerMaker";
import MapEvents from "./MapEvents";
import MapCircle from "./MapCircle";
import LocationButton from "./LocationButton";
import ResetMapButton from "./ResetMapButton";
import { distanceKm } from "@/app/busqueda/utils/distance";

// 📍 Plaza 14 de Septiembre (Cochabamba)
const defaultPosition: [number, number] = [-17.39381, -66.15693];

export default function Map() {
  const [fixers, setFixers] = useState<Fixer[]>([]);
  const [pinPosition, setPinPosition] = useState<[number, number]>(defaultPosition);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultPosition);
  const [zoom, setZoom] = useState(14);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  // 🔹 Cargar fixers desde JSON local
  useEffect(() => {
    import("@/jsons/fixers.json")
      .then((module) => setFixers(module.default))
      .catch(() => alert("No se pudieron cargar los fixers 😢"))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Restaurar vista y pin desde localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem("pinPosition");
    const savedCenter = localStorage.getItem("mapCenter");
    const savedZoom = localStorage.getItem("mapZoom");

    if (savedPin) setPinPosition(JSON.parse(savedPin));
    if (savedCenter) setMapCenter(JSON.parse(savedCenter));
    if (savedZoom) setZoom(Number(savedZoom));
  }, []);

  // 🔹 Guardar pin y vista
  const savePin = (pos: [number, number]) => {
    localStorage.setItem("pinPosition", JSON.stringify(pos));
  };

  const saveView = (center: [number, number], zoomLevel: number) => {
    localStorage.setItem("mapCenter", JSON.stringify(center));
    localStorage.setItem("mapZoom", zoomLevel.toString());
  };

  // 🔹 Click: mueve pin y guarda
  const handleClick = (pos: LatLngExpression) => {
    const [lat, lng] = Array.isArray(pos) ? pos : [pos.lat, pos.lng];
    setPinPosition([lat, lng]);
    savePin([lat, lng]);
  };

  // 🔹 Mover mapa o zoom: solo actualiza centro y zoom
  const handleMove = (center: LatLngExpression) => {
    const [lat, lng] = Array.isArray(center) ? center : [center.lat, center.lng];
    setMapCenter([lat, lng]);
    saveView([lat, lng], zoom);
  };

  const handleZoom = (newZoom: number) => {
    setZoom(newZoom);
    saveView(mapCenter, newZoom);
  };

  // 🔹 Filtrar fixers cercanos al pin
  const nearbyFixers = fixers.filter(
    (f) => f.available && distanceKm(pinPosition, [f.lat, f.lng]) <= 5
  );

  // 🔹 Vaciar el mapa (reiniciar vista y localStorage)
  const handleReset = () => {
    const plaza: [number, number] = defaultPosition;
    setPinPosition(plaza);
    setMapCenter(plaza);
    setZoom(14);
    localStorage.removeItem("pinPosition");
    localStorage.removeItem("mapCenter");
    localStorage.removeItem("mapZoom");
  };

  if (loading) return <div>Cargando mapa...</div>;

  return (
    <div className="relative z-0" style={{ height: "60vh", width: "100%", marginTop: "10px" }}>
      {/* 🔘 Botón para vaciar localStorage */}
      <ResetMapButton
  onReset={handleReset}
  isOnline={navigator.onLine} // PASAR el estado de conexión
/>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* 🔹 Controla el centrado */}
        <RecenterMap position={mapCenter} />

        {/* 📍 Pin del usuario */}
        <UserMarker position={pinPosition} />
        <MapCircle center={pinPosition} radius={5000} />

        {/* 🧰 Fixers cercanos */}
        {nearbyFixers.map((f) => (
          <FixerMarker key={f.id} fixer={f} />
        ))}

        {/* 🎯 Eventos del mapa */}
        <MapEvents
          onClick={handleClick} // click mueve el pin
          onMove={handleMove}   // arrastre guarda centro
          onZoom={handleZoom}   // zoom guarda nivel
        />

        {/* ⚠️ Sin resultados */}
        {nearbyFixers.length === 0 && (
          <Popup position={pinPosition} closeButton={false} autoPan={true}>
            ⚠️ No se encontraron fixers cercanos
          </Popup>
        )}
      </MapContainer>

      {/* 📍 Botón de ubicación del usuario */}
      <LocationButton
        onLocationFound={(lat, lng) => {
          setPinPosition([lat, lng]);
          savePin([lat, lng]);
          setMapCenter([lat, lng]);
          saveView([lat, lng], zoom);
        }}
      />
    </div>
  );
}
