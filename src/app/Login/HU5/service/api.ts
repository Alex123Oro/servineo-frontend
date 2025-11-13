const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const MODIFICAR_DATOS_BASE = '/api/controlC/modificar-datos';
const CLIENT_BASE = '/api/controlC/cliente';

export interface User {
  email: string;
  name?: string;
  picture?: string;
  telefono?: string;
  ubicacion?: Ubicacion;
}

export interface UpdateRequesterData {
  telefono: string;
  ubicacion: Ubicacion;
}
export interface Ubicacion {
  lat: number;
  lng: number;
  direccion: string;
  departamento: string;
  pais: string;
}

export interface RequesterData {
  requesterId: string;
  telefono: string;
  ubicacion: Ubicacion;
}

export async function obtenerDatosUsuarioLogueado(): Promise<RequesterData> {
  const token = localStorage.getItem("servineo_token");

  if (!token) {
    throw new Error("No se encontró token de autenticación.");
  }

  try {
    // Endpoint de perfil confirmado por backend: GET /api/controlC/cliente/profile
    const fullUrl = `${BASE_URL}${CLIENT_BASE}/profile`;

    const res = await fetch(fullUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body.message || `Error ${res.status}: No se pudo cargar el perfil.`);
    }

    // Normalizamos el shape para HU5
    const src = body.client || body;
    const requesterId = src.requesterId || src.id || "";
    const telefono = src.telefono || src.phone || "";
    const ubicacion = src.ubicacion || src.location || {};

    const data: RequesterData = {
      requesterId,
      telefono,
      ubicacion: {
        lat: Number(ubicacion.lat || ubicacion.latitude || 0),
        lng: Number(ubicacion.lng || ubicacion.longitude || 0),
        direccion: ubicacion.direccion || ubicacion.address || "",
        departamento: ubicacion.departamento || ubicacion.state || "",
        pais: ubicacion.pais || ubicacion.country || "",
      },
    };
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
}
export async function actualizarDatosUsuario(
  data: UpdateRequesterData
): Promise<{ success: boolean; message?: string; code?: string }> {
  const token = localStorage.getItem("servineo_token");

  if (!token) {
    return { success: false, message: "No autenticado." };
  }

  try {
    // Preferimos la ruta confirmada por HU7: cliente/profile
    const urlClienteProfile = `${BASE_URL}${CLIENT_BASE}/profile`;

    // Enviamos payload con ambos nombres para máxima compatibilidad
    const payload = {
      telefono: data.telefono,
      phone: data.telefono,
      ubicacion: data.ubicacion,
      location: {
        lat: data.ubicacion.lat,
        lng: data.ubicacion.lng,
        address: data.ubicacion.direccion,
        state: data.ubicacion.departamento,
        country: data.ubicacion.pais,
      },
    };

    // Intento 1: PUT /cliente/profile
    let res = await fetch(urlClienteProfile, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let responseData = await res.json().catch(() => ({}));

    // Si el backend usa PATCH en lugar de PUT, hacemos fallback
    if (!res.ok && (res.status === 404 || res.status === 405)) {
      try {
        res = await fetch(urlClienteProfile, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        responseData = await res.json().catch(() => ({}));
      } catch {}
    }

    // Manejo específico para 409 PHONE_TAKEN
    if (res.status === 409 && responseData?.error === "PHONE_TAKEN") {
      return {
        success: false,
        message: responseData.message || "Número ya registrado",
        code: "PHONE_TAKEN",
      };
    }

    // Si aún falla, intentamos la ruta antigua por compatibilidad
    if (!res.ok) {
      const urlLegacy = `${BASE_URL}${MODIFICAR_DATOS_BASE}/requester/update-profile`;
      try {
        const resLegacy = await fetch(urlLegacy, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        const legacyBody = await resLegacy.json().catch(() => ({}));
        if (!resLegacy.ok) {
          return {
            success: false,
            message:
              legacyBody.message ||
              responseData.message ||
              `Error ${resLegacy.status}: No se pudo actualizar.`,
          };
        }
        return { success: true, message: "Perfil actualizado con éxito." };
      } catch (err: any) {
        return {
          success: false,
          message: responseData.message || err?.message || "Fallo en la conexión o servidor.",
        };
      }
    }

    return { success: true, message: "Perfil actualizado con éxito." };
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    const errAny = error as any;
    return { success: false, message: errAny?.message || "Fallo en la conexión o servidor." };
  }
}