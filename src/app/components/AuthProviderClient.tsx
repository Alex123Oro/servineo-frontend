'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../Login/HU3/hooks/usoAutentificacion';

export default function AuthProviderClient({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}