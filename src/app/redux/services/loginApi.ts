const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/controlC`;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout = 30000) { // Aumentado a 30 segundos para móviles
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fullUrl = `${this.baseUrl}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        // Always include cookies for cross-site auth (Render deployment)
        mode: 'cors',
        credentials: 'include',
      });

      // Verificar si la respuesta es JSON antes de parsear
      const contentType = response.headers.get("content-type");
      let data: unknown;
      
      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error("Error al parsear JSON:", parseError);
          const text = await response.text();
          return {
            success: false,
            error: `Error del servidor (${response.status}): La respuesta no es JSON válido`,
            message: text.substring(0, 200),
          };
        }
      } else {
        const text = await response.text();
        return {
          success: false,
          error: `Error del servidor (${response.status}): Respuesta no JSON`,
          message: text.substring(0, 200),
        };
      }

      return { 
        success: response.ok, 
        data: data as T, 
        message: (data as { message?: string }).message 
      };
    } 
    catch (error: unknown) {
      // Manejar diferentes tipos de errores de red
      if (error instanceof Error) {
        // Error de aborto (timeout)
        if (error.name === 'AbortError') {
          return { 
            success: false, 
            error: 'La solicitud tardó demasiado. Verifica tu conexión a internet e intenta nuevamente.',
          };
        }
        
        // Error de red (Failed to fetch)
        if (error.message.includes('fetch') || error.message === 'Failed to fetch') {
          return { 
            success: false, 
            error: 'No se pudo conectar al servidor. Verifica tu conexión a internet y que el servidor esté disponible.',
          };
        }
        
        // Error de CORS
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
          return { 
            success: false, 
            error: 'Error de configuración del servidor (CORS). Contacta al administrador.',
          };
        }
        
        return { success: false, error: error.message };
      }
      
      return { success: false, error: 'Error desconocido al conectar con el servidor' };
    }
    finally {
      clearTimeout(id);
    }
  }

  get<T>(url: string) {
    return this.request<T>(url, { method: 'GET' });
  }
  post<T, B = unknown>(url: string, body: B) {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient(BASE_URL);