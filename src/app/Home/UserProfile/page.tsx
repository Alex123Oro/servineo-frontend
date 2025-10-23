"use client";

import Image from "next/image";
import { mockUser } from "@/app/UI/mockUser";

export default function ProfilePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--light-gray)] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl shadow-2xl bg-white overflow-hidden border border-gray-100">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center gap-4">
            <Image
              src={mockUser.photo}
              alt="Foto de perfil"
              width={80}
              height={80}
              className="rounded-full border-2 border-white"
            />
            <div>
              <h1 className="text-xl font-bold">{mockUser.name}</h1>
              <p className="text-sm opacity-90">{mockUser.email}</p>
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div>
              <span className="block text-gray-500 text-sm">Teléfono</span>
              <span className="text-gray-900 font-medium">{mockUser.phone}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => alert("Función pendiente: editar perfil")}
              >
                Editar perfil
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition"
                onClick={() => alert("Función pendiente: cambiar contraseña")}
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}