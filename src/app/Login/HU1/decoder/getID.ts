import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken(): string | null {
  // 1) Intentar extraer desde el JWT con múltiples claves posibles
  try {
    const token = localStorage.getItem("servineo_token");
    if (token) {
      const decoded: any = jwtDecode<any>(token);
      const possible = decoded?.id
        || decoded?.userId
        || decoded?.usuarioId
        || decoded?.requesterId
        || decoded?.sub
        || decoded?._id;
      if (possible && typeof possible === "string") return possible;
      if (typeof possible === "number") return String(possible);
    }
  } catch (error) {
    console.warn("Error decodificando token:", error);
  }

  // 2) Fallback: intentar leer desde el usuario persistido localmente
  try {
    const raw = localStorage.getItem("servineo_user");
    if (raw) {
      const u = JSON.parse(raw);
      const possible = u?.id || u?._id || u?.userId || u?.requesterId || u?.usuarioId;
      if (possible && typeof possible === "string") return possible;
      if (typeof possible === "number") return String(possible);
    }
  } catch (error) {
    console.warn("Error leyendo 'servineo_user':", error);
  }

  return null;
}