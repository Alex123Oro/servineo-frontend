'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../Login/HU3/hooks/usoAutentificacion';

export default function AuthProviderClient({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const content = (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  // Si no hay clientId configurado, evitamos montar GoogleOAuthProvider
  // para prevenir errores en tiempo de ejecución y mantener la UI operativa.
  if (!clientId) {
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {content}
    </GoogleOAuthProvider>
  );
}