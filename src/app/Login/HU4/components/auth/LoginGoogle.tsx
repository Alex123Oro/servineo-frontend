"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { api, ApiResponse } from "../../lib/api";
import { persistSession } from "../../lib/session";

interface LoginGoogleProps {
  onMensajeChange: (mensaje: string, tipo: 'error') => void; // solo error
}

export default function LoginGoogle({ onMensajeChange }: LoginGoogleProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: ApiResponse<any> = await api.post("/google/auth", {
        credential: credentialResponse.credential,
        token: credentialResponse.credential,
        modo: "login",
      });

      if (res.success && res.data) {
        // Guardamos token y usuario
        localStorage.setItem("servineo_token", res.data.token);
        localStorage.setItem("servineo_user", JSON.stringify(res.data.user));

        // Persistimos sesión para que el Header muestre el avatar/menú
        persistSession(res.data.user);

        // Guardamos mensaje de éxito en sessionStorage para Home
        const mensajeExito = res.data?.message || `¡Inicio de sesión exitoso con Google! Bienvenido, ${res.data.user.name}!`;
        sessionStorage.setItem("toastMessage", mensajeExito);

        // Redirigimos al Home
        window.location.href = "/";
      } else {
        const mensajeError =
          res.message ||
          res.data?.message ||
          res.error ||
          "Error desconocido al iniciar sesión con Google.";
        onMensajeChange(mensajeError, 'error');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      onMensajeChange(err?.message ?? "No se pudo conectar con el servidor.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    onMensajeChange("Error al iniciar sesión con Google.", 'error');
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {!clientId ? (
        <p className="text-sm text-gray-500">
          Inicio con Google no disponible: falta configuración.
        </p>
      ) : (
        <div className="w-full flex justify-center">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      )}

      {loading && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">
          Verificando credenciales...
        </p>
      )}
    </div>
  );
}
