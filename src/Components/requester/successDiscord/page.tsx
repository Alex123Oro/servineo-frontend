"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Components/requester/auth/usoAutentificacion";

export default function SuccessDiscord() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      router.push("/signup");
      return;
    }

    localStorage.setItem("servineo_token", token);

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
      localStorage.setItem("servineo_user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Error decoding token", error);
    }

    router.push("/signUp/registrar/registroUbicacion");
    ////redireccion a ubicacion para guardar datos de geolocalizacion y datos especificos 
  }, [router, setUser]);

  return <p>Redirigiendo…</p>;
}
