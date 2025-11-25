"use client";

import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { vincularGitHub } from "../service/api";

interface VincularGithubProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLinked?: (client: any) => void;
}

export default function VincularGithub({ onLinked }: VincularGithubProps) {
  const [loading, setLoading] = useState(false);

  const handleVincularGitHub = () => {
    const token = localStorage.getItem("servineo_token");
    if (!token) {
      toast.error("No hay sesión activa para vincular cuenta");
      return;
    }

    setLoading(true);

    vincularGitHub(
      token,
      (client) => {
        toast.success("Cuenta de GitHub vinculada con éxito");
        setLoading(false);
        onLinked?.(client);
      },
      (msg) => {
        toast.error(msg);
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <FaGithub size={30} className="text-gray-800" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">GitHub</span>
          <span className="text-xs text-gray-500">
            Vincula tu cuenta de GitHub
          </span>
        </div>
      </div>
      <div>
        <button
          onClick={handleVincularGitHub}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gray-800 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-900 transition disabled:opacity-60"
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
