const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; 
const ULTIMO_CAMBIO_BASE = '/api/controlC/ultimo-cambio';

export interface LastPasswordChangeResponse {
  success: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  hasPassword: boolean;
  lastPasswordChange: string | null;
  fechaFormateada: string;
}

export async function obtenerUltimoCambio(): Promise<LastPasswordChangeResponse> {
  const token = localStorage.getItem("servineo_token");

  if (!token) {
    throw new Error("No se encontró token de autenticación.");
  }

  try {
    console.log('🔍 Consultando último cambio...');
    console.log('🔑 Token disponible:', !!token);
    
    const fullUrl = `${BASE_URL}${ULTIMO_CAMBIO_BASE}/fecha-ultimo-cambio`;
    console.log('🌐 URL completa:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error response:', errorData);
      throw new Error(errorData.message || `Error ${response.status}: No se pudo obtener última modificación.`);
    }

    const result: LastPasswordChangeResponse = await response.json();
    console.log('✅ Resultado obtenido:', result);
    
    return result;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error al obtener último cambio:', error.message);
      throw error; // <- siempre lanza, TypeScript ya sabe que no sigue
    }

    // 👇 Si no es una instancia de Error, igualmente lanzamos uno
    throw new Error('Ocurrió un error desconocido al obtener el último cambio.');
  }
}


