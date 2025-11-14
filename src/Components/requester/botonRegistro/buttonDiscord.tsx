"use client";
import { FaDiscord } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiscordButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDiscord = () => {
    setLoading(true);
    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://backdos.vercel.app";

    const popup = window.open(
      `${baseUrl}/auth/discord`,
      "DiscordLogin",
      "width=600,height=700"
    );

    if (!popup) {
      setLoading(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;

      if (data.type === "DISCORD_AUTH_SUCCESS") {
        localStorage.setItem("servineo_token", data.token);
        if (data.isFirstTime) {
          router.push("/signUp/registrar/registroUbicacion");
        } else {
          router.push("/");
        }
        popup.close();
        window.removeEventListener("message", handleMessage);
      }

      if (data.type === "DISCORD_AUTH_ERROR") {
        console.error(data.message);
        popup.close();
        window.removeEventListener("message", handleMessage);
      }
      setLoading(false);
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <button
      onClick={handleDiscord}
      disabled={loading}
      className="flex items-center gap-2 bg-[#5865F2] text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
    >
      <FaDiscord size={20} />
      {loading ? "Cargando..." : "Continuar con Discord"}
    </button>
  );
}

