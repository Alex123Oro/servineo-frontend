'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'

export default function HU7Layout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const content = <>{children}</>;
  if (!clientId) return content;
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {content}
    </GoogleOAuthProvider>
  )
}
