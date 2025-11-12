// src/lib/api.ts
export async function apiFetch<T = unknown | null>(
  path: string,
  init?: RequestInit & { json?: unknown | null }
): Promise<T> {
  const opts: RequestInit = {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  };
  if (init?.json !== undefined) {
    opts.body = JSON.stringify(init.json);
  }
  const res = await fetch(`/api${path}`, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  // algunos endpoints devuelven 204; adapta si fuera tu caso
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : ({} as T);
}
