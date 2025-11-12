"use client";
import { useState } from "react";
import {
  createCashPayment,
  getPaymentSummaryById,
  getLastPaymentSummaryByJob,
  confirmPayment,
} from "../lib/payments";

type Trabajo = { id: string; monto: number; estado: "Sin Pagar" | "Pagado" };

export default function PaymentsPage() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([
    { id: "6710f2e6f1a2c9a3c1111111", monto: 120, estado: "Sin Pagar" }, // usa ObjectId reales
    { id: "6710f2e6f1a2c9a3c2222222", monto: 60, estado: "Sin Pagar" },
  ]);

  const [loading, setLoading] = useState<string | null>(null);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");

  async function pagar(t: Trabajo) {
    setError(null);
    setMsg(null);
    setLoading(t.id);
    try {
      const created = await createCashPayment({
        jobId: t.id,
        subTotal: t.monto,
        service_fee: 0,
        discount: 0,
        currency: "BOB",
        paymentMethods: "cash",
      });
      const pid = created.data?._id || created.data?.id || null;
      setLastPaymentId(pid);

      // GET summary por id
      if (pid) {
        const s1 = await getPaymentSummaryById(pid);
        const total = s1.data?.total;
        if (typeof total !== "number") throw new Error("El pago no tiene total válido");
        setMsg(`Creado pago ${pid} | total: ${total}`);
      }

      // GET summary por job
      const s2 = await getLastPaymentSummaryByJob(t.id);
      if (typeof s2.data?.total !== "number") {
        throw new Error("El último pago por job no tiene total");
      }

      setTrabajos(prev =>
        prev.map(x => (x.id === t.id ? { ...x, estado: "Sin Pagar" } : x))
      );
    } catch (e: unknown | null) {
      setError(e.message || "Error al pagar");
    } finally {
      setLoading(null);
    }
  }

  async function confirmar() {
    if (!lastPaymentId) return setError("No hay pago para confirmar");
    setError(null);
    setMsg(null);
    setLoading("confirm");
    try {
      const r = await confirmPayment(lastPaymentId, code);
      setMsg(`Confirmado: ${r.data.status} | paidAt: ${r.data.paidAt || "—"}`);
      setTrabajos(prev =>
        prev.map(x => (x.id === lastPaymentId ? { ...x, estado: "Pagado" } : x))
      );
    } catch (e: unknown | null) {
      setError(e.message || "Error al confirmar");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Demo Pagos (Proxy)</h1>

      {trabajos.map(t => (
        <div key={t.id} className="border rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Trabajo #{t.id.slice(-6)}</div>
            <div className="text-sm text-gray-500">Estado: {t.estado}</div>
            <div className="text-sm">Monto: Bs. {t.monto}</div>
          </div>
          <button
            className="px-3 py-2 rounded-xl border"
            disabled={loading === t.id}
            onClick={() => pagar(t)}
          >
            {loading === t.id ? "Procesando..." : "Crear pago (POST + GETs)"}
          </button>
        </div>
      ))}

      <div className="border rounded-2xl p-4 space-y-2">
        <div className="font-medium">Confirmar pago (PATCH)</div>
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Código (AB12CD...)"
          className="border rounded-xl px-3 py-2 w-full"
        />
        <button
          className="px-3 py-2 rounded-xl border"
          disabled={!lastPaymentId || loading === "confirm"}
          onClick={confirmar}
        >
          {loading === "confirm" ? "Confirmando..." : "Confirmar"}
        </button>
        <div className="text-xs text-gray-500">
          Último payment id: {lastPaymentId ?? "—"}
        </div>
      </div>

      {msg && <div className="text-green-700">{msg}</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
