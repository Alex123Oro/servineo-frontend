"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "../Registrardecoder/getID";

export default function FotoPerfil() {
  const router = useRouter();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Manejar cambio de archivo
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Eliminar foto seleccionada
  const eliminarFoto = () => {
    setArchivo(null);
    setFotoPreview(null);
  };

  // Convertir File a Base64
  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // Continuar: enviar foto al backend
  const continuar = async () => {
    if (!archivo) return alert("Primero selecciona una foto");

    const usuarioId = getUserIdFromToken();
    if (!usuarioId) return alert("No se encontró el ID del usuario");

    try {
      setCargando(true);
      const fotoBase64 = await fileToBase64(archivo);

      const response = await fetch(
        "http://localhost:8000/api/controlC/foto-perfil/usuarios/foto",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuarioId,
            fotoPerfil: fotoBase64,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Foto actualizada correctamente");
        router.push("/signUp/registrar/registrarUbicacion");
      } else {
        alert(data.message || "Error al subir la foto");
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background: "linear-gradient(135deg, #2B31E0 0%, #1AA7ED 50%, #5E2BE0 100%)",
      }}
    >
      <main className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-6">Foto de perfil</h2>

          <div className="flex flex-col items-center gap-4">
            {/* Vista previa */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg">
              {fotoPreview ? (
                <Image
                  src={fotoPreview}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-full h-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                    1.79-4 4 1.79 4 4 4zm0 2c-2.67 
                    0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {/* Input de archivo */}
            <input
              id="input-foto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={manejarCambio}
            />

            {/* Botones subir/eliminar */}
            <div className="flex gap-2 mt-3">
              <label
                htmlFor="input-foto"
                className="px-4 py-2 bg-[#2B31E0] text-white rounded-full cursor-pointer hover:bg-[#1AA7ED] transition"
              >
                {fotoPreview ? "Cambiar foto" : "Subir foto"}
              </label>

              {fotoPreview && (
                <button
                  onClick={eliminarFoto}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => router.push("/signUp/registrar/registrarServicios")}
              className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-700 transition"
            >
              Atrás
            </button>

            <button
              onClick={continuar}
              disabled={!archivo || cargando}
              className={`px-5 py-2 rounded-full transition ${
                archivo
                  ? "bg-[#2B31E0] hover:bg-[#1AA7ED]"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              {cargando ? "Subiendo..." : "Continuar"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
