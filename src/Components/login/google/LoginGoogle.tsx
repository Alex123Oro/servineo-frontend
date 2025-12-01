"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { api, ApiResponse } from "../../../app/redux/services/loginApi";

interface LoginGoogleProps {
  onMensajeChange: (mensaje: string, tipo: "error") => void;
}

interface GoogleLoginResponse {
  token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
    picture?: string;
  };
  message?: string;
}

export default function LoginGoogle({ onMensajeChange }: LoginGoogleProps) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);

    try {
      const res: ApiResponse<GoogleLoginResponse> = await api.post(
        "/auth/google",
        {
          credential: credentialResponse.credential,
          token: credentialResponse.credential,
          modo: "login",
        }
      );

      if (res.success && res.data) {
        localStorage.setItem("servineo_token", res.data.token);
        try {
          const prev = JSON.parse(localStorage.getItem("servineo_user") || "{}");
          const initialMerged = {
            ...res.data.user,
            name: prev?.name ?? res.data.user.name,
            email: prev?.email ?? res.data.user.email,
            picture: prev?.picture ?? res.data.user.picture,
            photo: prev?.photo,
            url_photo: prev?.url_photo,
          };
          localStorage.setItem("servineo_user", JSON.stringify(initialMerged));
        } catch {
          localStorage.setItem("servineo_user", JSON.stringify(res.data.user));
        }
        try { sessionStorage.setItem("prefill_email", res.data.user.email); } catch {}
        try {
          const extraRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/controlC/modificar-datos/requester/data`, {
            method: "GET",
            headers: { Authorization: `Bearer ${res.data.token}` },
            credentials: "include",
          });
          const extra = await extraRes.json().catch(() => ({}));
          if (extra && (extra.telefono || extra.ubicacion)) {
            const merged = { ...res.data.user, telefono: extra.telefono, phone: extra.telefono, ubicacion: extra.ubicacion };
            localStorage.setItem("servineo_user", JSON.stringify(merged));
          }
        } catch {}
        // Sincronizar perfil completo (nombre/correo/foto) tras login con Google
        try {
          const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/controlC/usuario/profile`, {
            method: "GET",
            headers: { Authorization: `Bearer ${res.data.token}` },
            credentials: "include",
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json().catch(() => ({}));
            const fromApi = profileData?.user ?? profileData ?? {};
            const storedUser = JSON.parse(localStorage.getItem("servineo_user") || "{}");
            const constructedName = (() => {
              const fn = fromApi.firstName ?? fromApi.nombre;
              const ln = fromApi.lastName ?? fromApi.apellido ?? fromApi.apellidos ?? fromApi.last_name ?? (() => {
                const ap1 = fromApi.apellidoPaterno; const ap2 = fromApi.apellidoMaterno; return [ap1, ap2].filter(Boolean).join(' ').trim() || undefined;
              })();
              if (fn || ln) return `${(fn || '').trim()} ${(ln || '').trim()}`.trim().replace(/\s+/g, ' ');
              return undefined;
            })();
            const apiName = constructedName ?? fromApi.name;
            const storedName = storedUser.name;
            const finalName = (() => {
              const aLen = (apiName || '').trim().split(/\s+/).filter(Boolean).length;
              const sLen = (storedName || '').trim().split(/\s+/).filter(Boolean).length;
              return aLen >= sLen ? (apiName ?? storedName) : storedName;
            })();
            const finalFirst = (fromApi.firstName ?? fromApi.nombre ?? storedUser.firstName) ?? ((finalName || '').trim().split(/\s+/)[0] || undefined);
            const finalLast = (fromApi.lastName ?? fromApi.apellido ?? fromApi.apellidos ?? fromApi.last_name ?? storedUser.lastName) ?? (() => { const p=(finalName||'').trim().split(/\s+/); return p.length>1?p.slice(1).join(' '):undefined; })();
            const mergedUser = {
              ...storedUser,
              name: (finalName || storedUser.name),
              email: fromApi.email ?? storedUser.email,
              photo: fromApi.photo ?? fromApi.url_photo ?? storedUser.photo,
              url_photo: fromApi.url_photo ?? fromApi.photo ?? storedUser.url_photo,
              picture: fromApi.picture ?? storedUser.picture,
              firstName: finalFirst,
              lastName: finalLast,
              nombre: finalFirst,
              apellido: finalLast,
            };
            localStorage.setItem("servineo_user", JSON.stringify(mergedUser));
          }
        } catch {}
        window.dispatchEvent(new Event("servineo_user_updated"));
        window.location.href = "/";
      } else {
        const mensajeError =
          res.message ||
          res.data?.message ||
          res.error ||
          "Error desconocido al iniciar sesión con Google.";
        onMensajeChange(mensajeError, "error");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        onMensajeChange(err.message, "error");
      } else {
        onMensajeChange("No se pudo conectar con el servidor.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    onMensajeChange("Error al iniciar sesión con Google.", "error");
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full flex justify-center">
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>

      {loading && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">
          Verificando credenciales...
        </p>
      )}
    </div>
  );
}
