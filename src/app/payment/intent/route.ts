import { NextResponse } from "next/server";

const BASE = process.env.PAYMENTS_BACKEND_URL; // tu Express en :4000

export async function POST(request: Request) {
  try {
    if (!BASE) {
      return NextResponse.json({ error: "Missing PAYMENTS_BACKEND_URL" }, { status: 500 });
    }

    const body = await request.json();

    // Reenvía la petición al backend real
    const res = await fetch(`${BASE}/api/payments/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Nota: como esto corre en el servidor de Next, no hay problemas de CORS
    });

    // Intenta parsear JSON; si falla, devuelve vacío con el mismo status
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : {};
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/payments/intent error:", err);
    return NextResponse.json({ error: "PROXY_ERROR" }, { status: 500 });
  }
}
