'use client';

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProviderClient from "@/app/components/AuthProviderClient";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderClient>
      <section className="flex justify-center items-center min-h-screen pt-20">
        {children}
      </section>
    </AuthProviderClient>
  );
}



