'use client';

import { useEffect, useMemo, useState } from 'react';

const BASE_API =
  `${process.env.NEXT_PUBLIC_API_URL}/api/controlC` || 'http://localhost:8000/api/controlC';

const RESEND_COOLDOWN_MS = 60_000;     // 1 minuto
const LINK_VALIDITY_SEC = 5 * 60;      // contador visible de 5 minutos

export default function ClientView({ email: emailProp, token }: { email?: string; token?: string }) {
  // 1) Email: preferir prop; si no hay, recuperar de sessionStorage
  const [email, setEmail] = useState<string | undefined>(emailProp);
  useEffect(() => {
    if (!emailProp && typeof window !== 'undefined') {
      const s = sessionStorage.getItem('servineo_last_email');
      if (s) setEmail(s);
    }
  }, [emailProp]);

  // 2) Estado UI
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 3) Contador visual (5 min)
  const [countdown, setCountdown] = useState<number>(LINK_VALIDITY_SEC);
  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c <= 0 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const minutos = useMemo(() => Math.floor(countdown / 60), [countdown]);
  const segundos = useMemo(() => countdown % 60, [countdown]);

  // 4) Cooldown de reenvío basado en localStorage por correo
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const lastKey = email ? `servineo_last_request_${email}` : undefined;

  const lastTs = useMemo(() => {
    if (typeof window === 'undefined' || !lastKey) return undefined;
    const raw = localStorage.getItem(lastKey);
    return raw ? Number(raw) : undefined;
  }, [lastKey, now]); // recalc cada segundo

  const msFromLast = lastTs ? now - lastTs : Infinity;
  const canResend = msFromLast >= RESEND_COOLDOWN_MS;
  const secondsToResend = Math.max(0, Math.ceil((RESEND_COOLDOWN_MS - (msFromLast || 0)) / 1000));

  // 5) Acción de reenvío
  const handleResend = async () => {
    setInfo(null);

    if (!email) {
      setInfo('No se encontró el correo. Vuelve a la pantalla anterior.');
      return;
    }
    if (!canResend) {
      setInfo(`Espera ${secondsToResend}s para volver a reenviar.`);
      return;
    }

    setLoading(true);
    const fallback = setTimeout(() => setInfo('Estamos tardando más de lo normal…'), 3000);

    try {
      const res = await fetch(`${BASE_API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (typeof window !== 'undefined' && lastKey) {
          localStorage.setItem(lastKey, String(Date.now())); // inicia cooldown
        }
        setInfo('Enlace reenviado. Revisa tu bandeja de entrada.');
        setCountdown(LINK_VALIDITY_SEC); // reinicia contador visual del enlace
      } else if (res.status === 429) {
        setInfo('Ya existe una solicitud en curso. Intenta nuevamente en 1 minuto.');
        if (typeof window !== 'undefined' && lastKey && !lastTs) {
          localStorage.setItem(lastKey, String(Date.now())); // sincroniza cooldown local
        }
      } else if (res.status === 404) {
        setInfo('El correo no está asociado a ninguna cuenta.');
      } else {
        setInfo(data.message || 'No se pudo reenviar el enlace.');
      }
    } catch {
      setInfo('Error de conexión con el servidor.');
    } finally {
      clearTimeout(fallback);
      setLoading(false);
      setNow(Date.now()); // fuerza recálculo inmediato
    }
  };

  return (
    <div className="p-8">
      <p className="text-sm text-gray-700">
        Te enviamos un enlace para ingresar sin contraseña. Por seguridad, el enlace caduca en
        <span className="font-medium"> 5 minutos</span>.
      </p>

      <div className="mt-5 flex flex-col items-center gap-2" aria-live="polite">
        <p className="text-sm text-gray-700">Tiempo restante para usar el enlace:</p>
        <div
          className="px-6 py-2 rounded-full bg-gray-100 ring-1 ring-gray-300 text-3xl font-semibold text-gray-900 tracking-widest tabular-nums shadow-sm"
          title="Tiempo restante"
        >
          {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
        </div>
      </div>

      {info && (
        <div role="status" aria-live="polite" className="mt-4 rounded-xl bg-servineo-100/5 border border-servineo-300/40 text-gray-800 p-3 text-sm">
          {info}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleResend}
          // El botón sólo se bloquea por loading o si no tenemos email.
          disabled={loading || !email}
          className={`rounded-xl p-3.5 font-semibold transition shadow ${
            loading || !email
              ? 'bg-servineo-200 text-white cursor-not-allowed'
              : 'bg-servineo-500 hover:bg-servineo-600 text-white'
          }`}
          title={!canResend ? `Podrás reenviar en ${secondsToResend}s` : 'Reenviar enlace'}
        >
          {loading ? 'Reenviando…' : !canResend ? `Espera ${secondsToResend}s` : 'Reenviar enlace'}
        </button>

        <a
          href="/controlC/HU4/login"
          className="text-center rounded-xl p-3.5 font-semibold transition shadow bg-white text-servineo-500 hover:text-servineo-600 ring-1 ring-servineo-300 hover:ring-servineo-400"
        >
          Volver a inicio de sesión
        </a>
      </div>

      <div className="mt-6 text-xs text-gray-600 space-y-1">
        <p>• Revisa la carpeta de <span className="font-medium">Spam</span> o <span className="font-medium">Promociones</span> si no ves el correo.</p>
        <p>• Al generar un nuevo enlace, los anteriores quedan <span className="font-medium">inválidos</span>.</p>
      </div>
    </div>
  );
}
