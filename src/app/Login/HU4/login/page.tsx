'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api, ApiResponse } from '../lib/api';
import { persistSession } from '../lib/session';
import { Eye, EyeOff } from 'lucide-react';
import LoginGoogle from "../components/auth/LoginGoogle";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../HU3/hooks/usoAutentificacion';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: ApiResponse<any> = await api.post('/auth/login', { email, password });

      if (res.success && res.data) {
        const data = res.data;

        localStorage.setItem("servineo_token", data.token);
        localStorage.setItem("servineo_user", JSON.stringify(data.user));
        setUser(data.user);

        // Persistir sesión para Header/UserProfile
        persistSession(data.user);

        // Guardamos mensaje de éxito en sessionStorage para Home
        const mensajeExito = data.message || `¡Cuenta Creada Exitosamente! Bienvenido, ${data.user.name}!`;
        sessionStorage.setItem("toastMessage", mensajeExito);

        router.push('/');

      } else {
        const mensajeBruto = res.message || res.data?.message || res.error || '';
        // Mejora de mensaje: caso "Hash de contraseña no encontrado"
        const mensajeError = mensajeBruto?.includes('Hash de contraseña no encontrado')
          ? 'Tu cuenta fue creada con Google y no tiene contraseña. Inicia sesión con Google o crea una contraseña en Configuración > Seguridad.'
          : (mensajeBruto || 'Credenciales inválidas o error en el servidor.');

        toast.error(mensajeError, {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      toast.error(`Error: ${err?.message ?? 'No se pudo conectar con el servidor.'}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center 
      bg-gradient-to-br from-dark-purple via-light-blue to-accent p-6 pt-24 pb-24">

      <div className="w-full max-w-[340px] md:max-w-[380px] bg-white rounded-3xl shadow-xl p-6 md:p-7 border border-light-gray">

        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-1">Iniciar sesión</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">Servineo</h2>
        <p className="text-center text-sm text-gray-600 mb-4">Modo requester</p>

        <form onSubmit={manejarLogin} className="flex flex-col gap-4">
          {/* Correo */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Correo electrónico*
            </label>
            <input
              type="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-secondary 
                focus:border-secondary transition"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Contraseña*
            </label>
            <div className="relative">
              <input
                type={mostrarPass ? 'text' : 'password'}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 pr-10 
                  text-gray-800 focus:outline-none focus:ring-2 
                  focus:ring-secondary transition"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPass(!mostrarPass)}
                className="absolute inset-y-0 right-3 flex items-center 
                  text-gray-400 hover:text-secondary transition"
              >
                {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botón ingresar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-700 hover:to-blue-800 text-white 
              font-semibold rounded-xl p-3.5 mt-2 transition-all 
              duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-2 text-gray-400 text-sm">o</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Botón Google */}
        <div className="mt-4">
          <LoginGoogle
            onMensajeChange={(msg, tipo) =>
              tipo === 'error'
                ? toast.error(msg, { position: 'top-center', theme: 'colored' })
                : null // éxito ya se guarda en sessionStorage
            }
          />
        </div>

        {/* Registro */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link
            href="/Login/HU3/FormularioRegistro"
            prefetch={false}
            className="text-secondary hover:text-primary font-medium hover:underline transition"
          >
            Regístrate
          </Link>
        </p>
      </div>

      {/* Contenedor Toastify */}
      <ToastContainer />
    </main>
  );
}
