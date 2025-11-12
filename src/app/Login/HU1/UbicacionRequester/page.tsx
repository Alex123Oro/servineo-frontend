"use client";
import dynamic from "next/dynamic";

const MapaLeaflet = dynamic(() => import("./Mapa"), { ssr: false });

export default function PageUbicacion() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gray-50 pt-24">
      <MapaLeaflet />
    </div>
  );
}