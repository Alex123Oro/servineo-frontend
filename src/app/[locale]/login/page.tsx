'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api, ApiResponse } from '@/app/redux/services/loginApi';
import { Eye, EyeOff } from 'lucide-react';
import LoginGoogle from '@/Components/login/google/LoginGoogle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NotificationModal from '@/Components/Modal-notifications';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { useAppDispatch } from '@/app/redux/hooks';
import { setUser } from '@/app/redux/slice/userSlice';

const loginSchema = z.object({
  email: z.string().email('Debe ingresar un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

interface LoginFormData {
  email: string;
  password: string;
}

interface BackendUser {
  // Ajusta si tu backend usa otras claves; solo usamos 'name' aquí
  name: string;
  // Opcionales por si los tienes
  id?: string;
  email?: string;
  [key: string]: unknown;
  role?: string;
}

interface LoginResponse {
  token: string;
  user: BackendUser;
  message?: string;
}

interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

/* ------------------------------ Component ----------------------------- */
export default function LoginPage() {
  const [mostrarPass, setMostrarPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const manejarLogin = async (data: LoginFormData): Promise<void> => {
    setLoading(true);
    try {
      const res: ApiResponse<LoginResponse> = await api.post('/auth/login', data);

      if (res.success && res.data) {
        const datos = res.data;

        const normalizedUser = {
          ...datos.user,
          _id: (datos.user._id || datos.user.id) as string,
          id: (datos.user.id || datos.user._id) as string,
          name: (datos.user.name || datos.user.displayName || 'Usuario') as string,
          email: datos.user.email as string,
          url_photo: (datos.user.picture || datos.user.url_photo || null) as string | undefined,
          role: (datos.user.role || 'requester') as 'requester' | 'fixer' | 'admin',
        };

        localStorage.setItem('servineo_token', datos.token);
        localStorage.setItem('servineo_user', JSON.stringify(normalizedUser));

        dispatch(setUser(normalizedUser)); // ← ahora sí, sin errores

        const mensajeExito = datos.message || `¡Bienvenido, ${normalizedUser.name}!`;

        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Inicio de sesión exitoso',
          message: mensajeExito,
        });

        setTimeout(() => router.push('/'), 2000);
      } else {
        const mensajeError =
          res.message ||
          (res.data as unknown as { message?: string })?.message ||
          (res as unknown as { error?: string })?.error ||
          'Credenciales inválidas o error en el servidor.';

        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Error al iniciar sesión',
          message: mensajeError,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo conectar con el servidor.';
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error de conexión',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMensajeChange = (mensaje: string): void => {
    setNotification({
      isOpen: true,
      type: 'error',
      title: 'Error con Google',
      message: mensaje,
    });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {/* 🔹 Todo el contenido dentro de un solo elemento raíz */}
      <main className="relative min-h-screen flex items-center justify-center px-6 text-foreground">
        {/* Fondo ultra sutil */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]" />
        </div>

        {/* Card de Login */}
        <div className="w-full max-w-sm bg-card/95 backdrop-blur-sm rounded-3xl shadow-lg p-10 border border-border/70">
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent">
            Iniciar sesión <span className="sr-only">Servineo</span>
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-8">Modo requester</p>

          {/* Formulario */}
          <form onSubmit={handleSubmit(manejarLogin)} className="flex flex-col gap-5">
            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-2">
                Correo electrónico*
              </label>
              <input
                type="email"
                placeholder="Ingrese su correo"
                {...register('email')}
                className="w-full rounded-xl p-3.5 text-foreground bg-background border border-border
                           focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-foreground/80 mb-2">
                Contraseña*
              </label>
              <div className="relative">
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  {...register('password')}
                  className="w-full rounded-xl p-3.5 pr-10 text-foreground bg-background border border-border
                             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary/80 transition"
                  aria-label={mostrarPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Enlace auxiliar */}
            <div className="flex justify-end items-center">
              <Link
                href="/login/forgotpass"
                className="text-primary/90 hover:text-primary underline-offset-2 hover:underline text-sm font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl p-3.5 mt-2 font-semibold text-primary-foreground
                         bg-primary/90 hover:bg-primary transition-all duration-300
                         shadow-sm hover:shadow disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-border/70" />
            <span className="px-2 text-muted-foreground text-sm">o</span>
            <div className="flex-1 h-px bg-border/70" />
          </div>

          {/* Botón Google */}
          <div className="mt-4">
            <LoginGoogle onMensajeChange={handleMensajeChange} />
          </div>

          {/* Registro */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => router.push('../signUp')}
              className="text-primary/90 hover:text-primary font-medium underline-offset-2 hover:underline"
            >
              Regístrate
            </button>
          </p>
        </div>

        {/* 🔔 Notificación personalizada */}
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
      </main>
    </GoogleOAuthProvider>
  );
}
