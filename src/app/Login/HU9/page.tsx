// src/app/controlC/HU9/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BASE_API =
  `${process.env.NEXT_PUBLIC_API_URL}/api/controlC` || 'http://localhost:8000/api/controlC';

export default function RecuperacionCorreoPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(id);
    }
  }, [error]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError('El correo no puede estar vacío');
    if (!emailValid) return setError('Correo inválido');

    setLoading(true);
    const fallback = setTimeout(() => setError('Estamos tardando más de lo normal…'), 3000);

    try {
      const res = await fetch(`${BASE_API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // 🔒 Guardar correo en sessionStorage (no en URL)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('servineo_last_email', email);
        }
        router.push('/controlC/HU9/enlace-enviado'); // sin ?email=...
      } else if (res.status === 404) {
        setError('El correo no está asociado a ninguna cuenta.');
      } else if (res.status === 429) {
        setError('Ya existe una solicitud en curso. Intenta nuevamente en 1 minuto.');
      } else {
        setError(data.message || 'Error al solicitar el enlace.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      clearTimeout(fallback);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-servineo-500 via-servineo-300 to-servineo-400 p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border border-servineo-100">
        <h1 className="text-2xl font-semibold text-servineo-500 mb-2">Recuperación de acceso</h1>
        <p className="text-sm text-gray-700 mb-6">
          Te enviaremos un correo electrónico con un enlace para ingresar a tu cuenta.
        </p>

        <form onSubmit={handleEnviar} className="flex flex-col gap-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-servineo-400 transition"
            required
            aria-invalid={!!error}
            aria-describedby={error ? 'email-error' : undefined}
          />

          {error && (
            <p id="email-error" role="status" aria-live="polite" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!emailValid || loading}
            className={`w-full font-semibold rounded-xl p-3.5 mt-2 transition-all duration-300 shadow-md
              ${
                !emailValid || loading
                  ? 'bg-servineo-200 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-servineo-500 to-servineo-300 hover:from-servineo-400 hover:to-servineo-200 text-white'
              }`}
          >
            {loading ? 'Enviando...' : 'Enviar correo electrónico'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/controlC/HU4/login" className="text-servineo-400 hover:text-servineo-500 hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  );
}
