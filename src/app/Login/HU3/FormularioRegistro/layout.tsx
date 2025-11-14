'use client';

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginLayout({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // Si no hay clientId, renderizamos sin el provider para evitar fallo de build
  const content = (
    <div 
      className="min-h-screen w-full flex items-center justify-center 
                 bg-white 
                 bg-gradient-to-br from-servineo-500 via-servineo-300 to-servineo-400 
                 p-6"
    >
      {children}
    </div>
  );

  if (!clientId) return content;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {content}
    </GoogleOAuthProvider>
  );
}



