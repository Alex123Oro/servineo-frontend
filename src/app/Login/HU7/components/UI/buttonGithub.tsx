"use client";
import React, { useState } from "react";
import { Github } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GithubButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGithub = () => {
    setLoading(true);

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/github`,
      "GitHubLogin",
      "width=600,height=700"
    );
    if (!popup) {
      toast.error("No se pudo abrir la ventana de GitHub");
      setLoading(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

      const data = event.data;

      if (data.type === "GITHUB_AUTH_SUCCESS") {
        toast.success("Autenticación con GitHub exitosa");
        localStorage.setItem("servineo_token", data.token);

        if (data.isFirstTime) {
          // Redirigir al flujo de Foto de Perfil (HU1) cuando es primera vez
          router.push("/Login/HU1/FotoPerfil");
        } else {
          router.push("/");
        }

        window.removeEventListener("message", handleMessage);
        setLoading(false);
        popup.close();
      }

      if (data.type === "GITHUB_AUTH_ERROR") {
        toast.error(data.message || "Error en autenticación con GitHub");
        window.removeEventListener("message", handleMessage);
        setLoading(false);
        popup.close();
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleGithub}
        disabled={loading}
        className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg shadow-sm text-black transition-colors"
      >
        <Github size={24} className="text-black" />
        {loading ? "Cargando..." : "Continuar con GitHub"}
      </button>
    </div>
  );
}