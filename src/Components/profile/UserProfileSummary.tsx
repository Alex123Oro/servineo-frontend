'use client';
import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Lock } from 'lucide-react';
import { UserData } from '@/types/User';

export default function UserProfileSummary() {
  const [user, setUser] = useState<UserData | null>(null);

useEffect(() => {
  const loadUser = () => {
    const raw = localStorage.getItem("servineo_user");
    setUser(raw ? JSON.parse(raw) : null);
  };

  loadUser();

  window.addEventListener("servineo_user_updated", loadUser);
  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("servineo_user_updated", loadUser);
    window.removeEventListener("storage", loadUser);
  };
}, []);


const userPhoto =
  user?.photo?.trim() ||
  user?.picture?.trim() ||
  user?.url_photo?.trim() ||
  "/no-photo.png";

  return (
    <div className="rounded-2xl p-6 shadow-lg bg-white/70 backdrop-blur-xl border border-white/30 max-w-full">

      {/* FOTO + NOMBRE */}
      <div className="flex flex-col items-center">
        
        {/* CONTENEDOR DE FOTO MEJORADO */}
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white/90 bg-white">
          <img
            src={userPhoto}
            alt="Foto de perfil"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <h3 className="text-xl font-bold text-[#1A223F] mt-4">
          {user?.name ?? "Usuario"}
        </h3>

        <p className="text-sm text-gray-500">{user?.email ?? "—"}</p>

      </div>

      {/* SEPARADOR */}
      <div className="w-full h-px bg-gray-200 my-6" />

      {/* INFORMACIÓN */}
      <div className="space-y-4 text-sm text-[#1A223F]">

        {/* TELÉFONO */}
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-inner">
          <Phone size={18} className="text-primary" />
          <span className="flex-1">
            {user?.phone || user?.telefono || (
              <span className="text-gray-400">Sin teléfono</span>
            )}
          </span>
        </div>

        {/* UBICACIÓN 
        <div className="flex items-start gap-3 p-2 bg-white rounded-xl shadow-inner">
          <MapPin size={18} className="text-primary mt-1" />
          <span className="flex-1 leading-tight">
            {user?.ubicacion?.direccion ? (
              <>
                <span className="font-medium">{user.ubicacion.direccion}</span>
                <br />
                <span className="text-xs text-gray-400">
                  {user.ubicacion.departamento} · {user.ubicacion.pais}
                </span>
              </>
            ) : (
              <span className="text-gray-400">Sin ubicación</span>
            )}
          </span>
        </div>*/}

        {/* CONTRASEÑA */}
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-inner">
          <Lock size={18} className="text-primary" />
          <span className="flex-1">••••••••••••</span>
        </div>

      </div>

      {/* SEPARADOR */}
      <div className="w-full h-px bg-gray-200 my-6" />

      {/* INFORMACIÓN EXTRA */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-white to-white/60 border border-white shadow-inner">
        <strong className="block mb-1 text-primary text-sm">
          ¿Sabías qué?
        </strong>
        <p className="text-gray-600 text-sm leading-snug">
          Mantener tu foto y ubicación actualizadas mejora las recomendaciones
          y tu visibilidad dentro de la plataforma.
        </p>
      </div>

    </div>
  );
}




