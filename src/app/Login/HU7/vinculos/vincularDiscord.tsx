"use client";

import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VincularDiscordProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLinked?: (client: any) => void;
}

export default function VincularDiscord({ onLinked }: VincularDiscordProps) {
  const [loading, setLoading] = useState(false);

  const handleVincularDiscord = () => {
    const token = localStorage.getItem("servineo_token");
    if (!token) {
      toast.error("No hay sesión activa para vincular cuenta");
      return;
    }

    setLoading(true);

    const state = encodeURIComponent(
      JSON.stringify({
        mode: "link",
        token,
      })
    );

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const popup = window.open(
      `${API_BASE}/auth/discord?state=${state}`,
      "DiscordLink",
      "width=600,height=700"
    );

    if (!popup) {
      toast.error("No se pudo abrir la ventana de Discord");
      setLoading(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      const API_ORIGIN = API_BASE;
      if (event.origin !== API_ORIGIN) return;

      const data = event.data;

      if (data.type === "DISCORD_LINK_SUCCESS") {
        toast.success("Cuenta de Discord vinculada con éxito ✅");
        setLoading(false);
        popup.close();
        window.removeEventListener("message", handleMessage);

        if (onLinked) onLinked(data.client);
      } else if (data.type === "DISCORD_LINK_ERROR") {
        toast.error(data.message || "Error al vincular cuenta Discord ❌");
        setLoading(false);
        popup.close();
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <FaDiscord size={30} className="text-gray-800" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">Discord</span>
          <span className="text-xs text-gray-500">
            Vincula tu cuenta de Discord
          </span>
        </div>
      </div>
      <div>
        <button
          onClick={handleVincularDiscord}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Vinculando...
            </>
          ) : (
            "Vincular"
          )}
        </button>
      </div>
    </div>
  );
}
