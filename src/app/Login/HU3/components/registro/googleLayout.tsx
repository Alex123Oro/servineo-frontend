"use client"

import { ReactNode } from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"

interface GoogleLayoutProps {
  children: ReactNode
}

export default function GoogleLayout({ children }: GoogleLayoutProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const content = (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );

  if (!clientId) return content;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {content}
    </GoogleOAuthProvider>
  )
}