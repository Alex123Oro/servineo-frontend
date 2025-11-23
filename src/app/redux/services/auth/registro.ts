const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/controlC`;

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface GoogleAuthResponse {
  status: "ok" | "firstTime" | "exists" | "error";
  firstTime?: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface UbicacionResponse {
  success: boolean;
  message?: string;
}

export async function enviarTokenGoogle(token: string): Promise<GoogleAuthResponse> {
  try {
    const res = await fetch(`${BASE_URL}/google/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    throw error;
  }
}

export async function verificarSesionBackend(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/google/verify`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Token inválido o expirado");
    return await res.json();
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    throw error;
  }
}

export async function enviarUbicacion(
  lat: number,
  lng: number,
  direccion: string | null,
  departamento: string | null,
  pais: string | null
): Promise<UbicacionResponse> {
  const token = localStorage.getItem("servineo_token");
  try {
    const res = await fetch(`${BASE_URL}/ubicacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat, lng, direccion, departamento, pais }),
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error al enviar la ubicación al backend:", error);
    throw error;
  }
}



export interface RegistroResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  statusCode?: number;
}

export async function enviarRegistroManual(name: string, email: string, password: string): Promise<RegistroResponse> {
  try {
    const res = await fetch(`${BASE_URL}/registro/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: (data as { message?: string }).message || `Error ${res.status}`,
        statusCode: res.status,
      };
    }

    return { ...(data as RegistroResponse), statusCode: res.status };
  } catch (error) {
    console.error("Error al registrar manualmente:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error de conexión",
      statusCode: 0,
    };
  }
}
