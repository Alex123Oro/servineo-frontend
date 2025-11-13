"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onLoginSuccess: (credentialResponse: CredentialResponse) => void;
}

export default function GoogleButton({ onLoginSuccess }: GoogleButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg shadow-sm text-black transition-colors disabled:opacity-60"
        disabled={!clientId}
      >
        <FcGoogle size={24} />
        {clientId ? 'Continuar con Google' : 'Google no disponible'}
      </button>

      {clientId && (
        <div className="absolute inset-0 opacity-0 cursor-pointer">
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={() => console.log("Error al iniciar sesión con Google")}
          />
        </div>
      )}
    </div>
  );
}
