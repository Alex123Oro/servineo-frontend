"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { getUserIdFromToken } from "../decoder/getID";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { persistSession } from "../../HU4/lib/session";

export default function FotoPerfil() {
  const router = useRouter();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Mostrar toast de bienvenida y disparar cuadro "Guardar contraseña" si hay credenciales
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem("toastMessage");
      if (msg) {
        toast.success(msg, { position: "bottom-right" });
        sessionStorage.removeItem("toastMessage");
      }

      const credsRaw = sessionStorage.getItem("signup_credentials");
      if (credsRaw) {
        const creds = JSON.parse(credsRaw);
        // Intentar usar el Credential Management API para provocar el diálogo de guardar contraseña
        const run = async () => {
          if (navigator && "credentials" in navigator) {
            // Nueva sintaxis
            try {
              const cred = await (navigator as any).credentials.create({
                password: {
                  id: creds.email,
                  password: creds.password,
                  name: creds.name,
                  iconURL: "/avatar.png",
                },
              });
              if (cred) await (navigator as any).credentials.store(cred);
            } catch {}

            // Fallback a la sintaxis antigua
            try {
              const PasswordCredentialCtor = (window as any).PasswordCredential;
              if (PasswordCredentialCtor) {
                const c = new PasswordCredentialCtor({
                  id: creds.email,
                  password: creds.password,
                  name: creds.name,
                  iconURL: "/avatar.png",
                });
                (navigator as any).credentials.store(c).catch(() => {});
              }
            } catch {}
          }
        };
        run();
      }
    } catch {}
  }, []);

  const manejarCambio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      try {
        const dataUrl = await compressImage(file, 256, 0.75);
        setFotoPreview(dataUrl);
      } catch {
        // fallback: si falla la compresión, usamos objectURL
        setFotoPreview(URL.createObjectURL(file));
      }
    }
  };

  const eliminarFoto = () => {
    setArchivo(null);
    setFotoPreview(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const compressImage = (file: File, maxSize = 256, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No canvas context'));
        // Recorte centrado a cuadrado para encajar perfecto en el avatar
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const target = Math.min(maxSize, side);
        canvas.width = target;
        canvas.height = target;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, target, target);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      reader.readAsDataURL(file);
    });
  };

  const continuar = async (): Promise<boolean> => {
    if (!archivo) {
      alert("Primero selecciona una foto");
      return false;
    }

    const usuarioId = getUserIdFromToken();
    if (!usuarioId) {
      // Sin ID: guardamos la foto localmente para el Header y seguimos al mapa
      try {
        const base64Foto = fotoPreview || (archivo ? await compressImage(archivo) : null);
        if (base64Foto) {
          const currentRaw = localStorage.getItem("booka_user");
          const current = currentRaw ? JSON.parse(currentRaw) : {};
          persistSession({ ...current, photo: base64Foto });
        }
      } catch {}
      toast.warning("No se encontró el ID, continuando para completar ubicación", { position: "bottom-right" });
      return true; // permitir continuar al mapa; la ubicación usa el token
    }

    try {
      // Comprimir para evitar superar el límite de localStorage y mejorar rendimiento
      const base64Foto = fotoPreview || await compressImage(archivo);

      const response = await fetch("https://fronted-pearl.vercel.app/api/controlC/fotoPerfil/usuarios/foto", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          fotoPerfil: base64Foto,
        }),
      });

      if (response.ok) {
        // Actualizar sesión local para que el Header muestre la imagen inmediatamente
        try {
          const currentRaw = localStorage.getItem("booka_user");
          const current = currentRaw ? JSON.parse(currentRaw) : {};
          persistSession({
            ...current,
            photo: base64Foto,
          });
        } catch {}
        toast.success("Foto actualizada correctamente", { position: "bottom-right" });
        return true;
      } else {
        toast.error("Error al subir la foto, selecciona otra más ligera", { position: "bottom-right" });
        return false;
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
      toast.error("Error de conexión con el servidor", { position: "bottom-right" });
      return false;
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
        <ToastContainer position="bottom-right" />
        {/* Aumentamos opacidad del recuadro central */}
        <div className="bg-white/30 backdrop-blur-lg border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-6">Foto de perfil</h2>

          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg">
              {fotoPreview ? (
                <NextImage
                  src={fotoPreview}
                  alt="Foto"
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

            <input
              id="input-foto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={manejarCambio}
            />

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

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => router.push("/Login/HU1/RequesterForm")}
              className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-700 transition"
            >
              Atrás
            </button>

            <button
              onClick={() => {
                continuar().then((ok) => {
                  if (ok) router.push("/Login/HU1/UbicacionRequester");
                });
              }}
              disabled={!archivo}
              className={`px-5 py-2 rounded-full transition ${
                archivo
                  ? "bg-[#2B31E0] hover:bg-[#1AA7ED]"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
