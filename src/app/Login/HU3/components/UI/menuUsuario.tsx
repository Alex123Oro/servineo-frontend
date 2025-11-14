'use client';

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/usoAutentificacion";
import { useRouter } from "next/navigation";

type Props = {
  open?: boolean;                // si el padre quiere controlarlo
  onToggle?: () => void;         // función para alternar (desde el padre)
  // si no se pasan props el componente se comporta como antes (control interno)
};

export default function UserMenu({ open: openProp, onToggle }: Props) {
  const { user, logout } = useAuth();
  const [openInternal, setOpenInternal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isControlled = typeof onToggle === "function";
  const open = isControlled ? Boolean(openProp) : openInternal;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isControlled) {
          // si es controlado por el padre, asumimos que el padre manejará el cierre
          // nada que hacer aquii
        } else {
          setOpenInternal(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isControlled]);

  if (!user) return null;

  // Función para alternar el menú (usa onToggle si está dado, sino su propio state)
  function toggle() {
    if (isControlled) {
      onToggle && onToggle();
    } else {
      setOpenInternal((s) => !s);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* El trigger (avatar) está en el padre; aqui solo mostramos el menu */}
      {open && (
        <div className="absolute right-0 mt-7 w-56 
            bg-white border border-gray-200 rounded-xl shadow-xl z-50 
            overflow-hidden text-center transform transition-all duration-200
            origin-top scale-95 animate-slideDown">
          <ul className="py-1">
            <li>
              <button
                className="w-full text-center px-4 py-3 hover:bg-gray-100 text-gray-700 transition cursor-pointer hover:scale-[1.03] hover:font-semibold   transition-all duration-300 ease-out"
                onClick={() => {
                  // cerramos y navegamos a Perfil
                  if (isControlled) {
                    onToggle && onToggle();
                    router.push("/controlC/HU5");
                  } else {
                    setOpenInternal(false);
                    router.push("/controlC/HU5");
                  }
                }}
              >
                Perfil
              </button>
            </li>

            <li>
              <button
                className="w-full text-center px-4 py-3 hover:bg-gray-100 text-gray-700 cursor-pointer hover:scale-[1.03] hover:font-semibold   transition-all duration-300 ease-out"
                onClick={() => {
                  // cerramos y navegamos a Configuracioon HU8
                   if (isControlled) {
                    onToggle && onToggle();
                    router.push("/controlC/Configuracion");
                  } else {
                    setOpenInternal(false);
                    router.push("/controlC/Configuracion");
                  }
                }}
              >
                Configuración
              </button>
            </li>

            <li>
              <button
                className="w-full text-center px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer hover:scale-[1.03] hover:font-semibold   transition-all duration-200 ease-in"
                onClick={() => {
                  if (isControlled) {
                    onToggle && onToggle();
                    logout();
                  } else {
                    setOpenInternal(false);
                    logout();
                  }
                }}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}