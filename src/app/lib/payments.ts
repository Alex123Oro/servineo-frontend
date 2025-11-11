// src/lib/payments.ts
import { apiFetch } from "./api";

export type Status = "pending" | "paid" | "failed" | "cancelled";

export async function createCashPayment(input: {
  jobId: string;
  subTotal: number;
  service_fee: number;
  discount?: number;
  currency?: "BOB" | "USD";
  paymentMethods?: "cash"; // alineado con tu backend
}) {
  // backend: POST /lab/payments
  return apiFetch<{ message: string; data: unknown | null }>(`/lab/payments`, {
    method: "POST",
    json: input,
  });
}

export async function getPaymentSummaryById(id: string) {
  // backend: GET /lab/payments/:id/summary
  return apiFetch<{ data: { id: string; code?: string | null; total: number; status: Status; expiresAt: string | null } }>(
    `/lab/payments/${id}/summary`
  );
}

export async function getLastPaymentSummaryByJob(jobId: string) {
  // backend: GET /lab/jobs/:jobId/payments/summary
  return apiFetch<{ data: { id: string; jobId: string; total: number; status: Status; expiresAt: string | null } }>(
    `/lab/jobs/${jobId}/payments/summary`
  );
}

export async function confirmPayment(id: string, code: string) {
  // backend: PATCH /lab/payments/:id/confirm
  return apiFetch<{ message: string; data: { id: string; total: number; status: Status; paidAt?: string } }>(
    `/lab/payments/${id}/confirm`,
    { method: "PATCH", json: { code } }
  );
}


//add para qr

/** Estados para intents QR (son distintos del Status "paid/cancelled" de tus labs) */
export type PaymentIntentStatus =
  | "pending"
  | "under_review"
  | "confirmed"
  | "rejected"
  | "expired";

/** Payload para crear el intent (lo que envías a tu backend) */
export type CreateQRIntentInput = {
  bookingId: string;
  providerId: string;
  amount: number;
  currency?: string; // "BOB" por defecto en tu back
};

/** Respuesta esperada desde tu backend */
export type CreateQRIntentOutput = {
  intent: {
    _id: string;
    bookingId: string;
    providerId: string;
    amountExpected: number;
    currency: string;
    paymentReference: string;
    status: PaymentIntentStatus;
    deadlineAt?: string;
    createdAt?: string;
  };
  paymentMethod?: {
    qrImageUrl?: string;
    accountDisplay?: string;
  };
  error?: string;   // p.ej. "NO_QR"
  message?: string; // mensaje explicativo
};

/** POST /api/payments/intent (proxy interno) → crea/reusa intent y devuelve el QR */
export async function createQRIntent(input: CreateQRIntentInput) {
  return apiFetch<CreateQRIntentOutput>("/payments/intent", {
    method: "POST",
    json: input,
  });
}

/** (Opcional) POST /api/payments/evidence → registrar comprobante */
export async function registerQREvidence(input: {
  paymentIntentId: string;
  operationNumber?: string;
  receiptUrl?: string; // URL al archivo (Drive/S3) cuando lo integren
  uploadedBy: string;  // id de usuario
}) {
  return apiFetch<{ ok: boolean; message?: string }>("/payments/evidence", {
    method: "POST",
    json: input,
  });
}

/** (Opcional) GET /api/payments/intent/:id → recuperar un intent */
export async function getQRIntentById(id: string) {
  return apiFetch<{ intent: CreateQRIntentOutput["intent"] }>(
    `/payments/intent/${id}`
  );
}
