const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export async function cambiarContrasena(
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  const token = localStorage.getItem("servineo_token");

  if (!token) {
    throw new Error("No se encontró token de autenticación.");
  }

  try {
    // 🔧 URL limpia sin espacios ni saltos de línea
    const url = `${API_URL}/cambiar-contrasena/change-password`.trim();
    
    console.log('🌐 URL final:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error ${response.status}: No se pudo cambiar la contraseña`);
    }

    const result: ChangePasswordResponse = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error al cambiar contraseña:", error);
    throw error;
  }
}