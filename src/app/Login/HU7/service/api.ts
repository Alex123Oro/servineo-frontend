const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_BASE = '/api/controlC/cliente';

export interface AuthProvider {
  provider: 'email' | 'google' | 'apple' | 'github';
  email?: string;
  token?: string;
}

interface APIResponse {
  success?: boolean;
  message?: string;
  client?: {
    authProviders: AuthProvider[];
  };
}

export async function obtenerMetodosCliente(): Promise<AuthProvider[]> {
  const token = localStorage.getItem("servineo_token");
  if (!token) throw new Error("No se encontró token de autenticación.");

  try {
    const res = await fetch(`${BASE_URL}${CLIENT_BASE}/profile`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    const data: APIResponse = await res.json().catch(() => ({ client: { authProviders: [] } }));

    if (!res.ok) throw new Error(data.message || "Error al cargar métodos de login.");

    return data.client?.authProviders || [];
  } catch (error) {
    console.error("Error obtenerMetodosCliente:", error);
    throw error;
  }
}

export async function desvincularMetodo(provider: string): Promise<AuthProvider[]> {
  const token = localStorage.getItem("servineo_token");
  if (!token) throw new Error("No se encontró token de autenticación.");

  try {
    const res = await fetch(`${BASE_URL}${CLIENT_BASE}/unlink`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ provider }),
    });

    const data: APIResponse = await res.json().catch(() => ({ client: { authProviders: [] } }));

    if (!res.ok) throw new Error(data.message || "Error al desvincular método.");

    return data.client?.authProviders || [];
  } catch (error) {
    console.error("Error desvincularMetodo:", error);
    throw error;
  }
}

// app/HU7/services/vincularCorreoService.ts

export interface VincularResultado {
  success: boolean;
  message: string;
  client?: any;
}

export async function vincularCorreoContrasena(
  token: string,
  email: string,
  password: string
): Promise<VincularResultado> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/controlC/cliente/link-email-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al vincular método");

    return { success: true, message: "Método vinculado correctamente", client: data.client };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}


// app/HU7/services/vincularGithubService.ts

export interface GitHubLinkResult {
  success: boolean;
  client?: any;
  message?: string;
}

export function vincularGitHub(token: string, onSuccess?: (client: any) => void, onError?: (msg: string) => void) {
  const state = encodeURIComponent(JSON.stringify({ mode: "link", token }));

  const popup = window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/github?state=${state}`,
    "GitHubLink",
    "width=600,height=700"
  );

  if (!popup) {
    onError?.("No se pudo abrir la ventana de GitHub");
    return;
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

    const data = event.data;

    if (data.type === "GITHUB_LINK_SUCCESS") {
      onSuccess?.(data.client);
      popup.close();
      window.removeEventListener("message", handleMessage);
    } else if (data.type === "GITHUB_LINK_ERROR") {
      onError?.(data.message || "Error al vincular cuenta GitHub");
      popup.close();
      window.removeEventListener("message", handleMessage);
    }
  };

  window.addEventListener("message", handleMessage);
}


// app/HU7/services/vincularGoogleService.ts

export interface GoogleLinkResult {
  success: boolean;
  client?: any;
  message?: string;
}

export async function vincularGoogle(tokenUsuario: string, tokenGoogle: string): Promise<GoogleLinkResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/controlC/cliente/link-google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenUsuario}`,
      },
      body: JSON.stringify({ tokenGoogle }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Error al vincular Google" };
    }

    return { success: true, message: "Cuenta de Google vinculada correctamente", client: data.client };
  } catch (err: any) {
    return { success: false, message: err.message || "Error al vincular Google" };
  }
}
