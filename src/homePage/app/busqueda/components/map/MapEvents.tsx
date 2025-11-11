"use client";

import { useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface MapEventsProps {
  onClick?: (pos: LatLngExpression) => void; // clic para mover pin
  onMove?: (pos: LatLngExpression) => void;  // arrastre o moveend
  onZoom?: (zoom: number) => void;           // zoom
}

export default function MapEvents({ onClick, onMove, onZoom }: MapEventsProps) {
  useMapEvents({
    click: (e) => onClick && onClick([e.latlng.lat, e.latlng.lng]),
    moveend: (e) => onMove && onMove(e.target.getCenter()),
    zoomend: (e) => onZoom && onZoom(e.target.getZoom()),
  });

  return null;
}
