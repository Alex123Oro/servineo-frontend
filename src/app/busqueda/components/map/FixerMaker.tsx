



"use client";

import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Fixer } from "@/app/busqueda/interface/Fixer_Interface";

interface FixerMarkerProps { 
  fixer: Fixer;
}

// 🎨 Paleta profesional tipo Uber + WhatsApp
const palette = {
  popupBg: "#FFFFFF",
  popupShadow: "0 6px 18px rgba(0,0,0,0.2)",
  nameColor: "#2B31E0",
  serviceColor: "#759AE0",
  whatsappBg: "#25D366",       // verde WhatsApp
  whatsappHover: "#1EBE57",    // hover WhatsApp
  profileBg: "#2BDDE0",
  profileHover: "#26AEE0",
  buttonText: "#FFFFFF",
  iconBorderAvailable: "#00C851", // verde disponible
  iconBorderBusy: "#ff4444",      // rojo ocupado
};
  
export default function FixerMarker({ fixer }: FixerMarkerProps) {
  const icon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        overflow: hidden;
        border: 2px solid ${fixer.available ? palette.iconBorderAvailable : palette.iconBorderBusy};
        ${fixer.available ? '' : 'opacity:0.7;'}
      ">
        <img src="/obreroPremiun.png"
             style="width:46px; height:46px; border-radius:50%; object-fit:cover;" />
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <Marker position={[fixer.lat, fixer.lng]} icon={icon}>
      <Tooltip direction="top" offset={[0, -25]} opacity={1} permanent={false}>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "14px",
            backgroundColor: palette.popupBg,
            boxShadow: palette.popupShadow,
            textAlign: "center",
            fontWeight: 600,
            minWidth: "140px",
          }}
        >
          <div style={{ color: palette.serviceColor, fontSize: "13px" }}>
            {fixer.servicio}
          </div>
          <div style={{ color: palette.nameColor, fontSize: "12px", marginTop: "2px" }}>
            {fixer.nombre} - {fixer.available ? "Disponible" : "No disponible"}
          </div>
        </div>
      </Tooltip>

      <Popup closeButton autoClose={false}>
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "22px",
            backgroundColor: palette.popupBg,
            boxShadow: palette.popupShadow,
            minWidth: "240px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <img
              src="/obreroPremiun.png"
              alt="Avatar"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${fixer.available ? palette.iconBorderAvailable : palette.iconBorderBusy}`,
                opacity: fixer.available ? 1 : 0.7
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: palette.nameColor, fontSize: "15px", fontWeight: 700 }}>
                {fixer.servicio}
              </h3>
              <span style={{ fontSize: "13px", color: palette.serviceColor }}>
                {fixer.nombre} - {fixer.available ? "Disponible" : "No disponible"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* Botón WhatsApp */}
            <a
              href={fixer.available ? `https://wa.me/591${fixer.id}` : "#"}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                padding: "8px 0",
                background: fixer.available ? palette.whatsappBg : "#ccc",
                color: palette.buttonText,
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "13px",
                textAlign: "center",
                textDecoration: "none",
                pointerEvents: fixer.available ? "auto" : "none",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => {
                if (fixer.available) e.currentTarget.style.background = palette.whatsappHover;
              }}
              onMouseOut={(e) => {
                if (fixer.available) e.currentTarget.style.background = palette.whatsappBg;
              }}
            >
              WhatsApp
            </a>

            {/* Botón Ver perfil */}
            <button
              style={{
                flex: 1,
                padding: "8px 0",
                background: palette.profileBg,
                color: palette.buttonText,
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = palette.profileHover)}
              onMouseOut={(e) => (e.currentTarget.style.background = palette.profileBg)}
              onClick={() => alert(`Ver perfil de ${fixer.nombre}`)}
            >
              Ver perfil
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
