'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cambiarContrasena } from '../../../app/redux/services/editPassword';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { obtenerUltimoCambio } from '../../../app/redux/services/getLastChange';

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Ingresa tu contraseña actual")
    .refine(val => !val.includes(' '), "No puede contener espacios"),

  newPassword: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Debe tener mayúscula, minúscula y número"
    })
    .refine(val => !val.includes(' '), "No puede contener espacios"),

  confirmPassword: z
    .string()
    .min(1, "Confirma tu nueva contraseña")
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "La nueva contraseña debe ser diferente a la actual",
  path: ["newPassword"]
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

type Props = {
  onCancel?: () => void;
  onSaved?: () => void;
};

export default function ChangePasswordForm({ onCancel }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    clearErrors
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange'
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [ultimaModificacion, setUltimaModificacion] = useState<string>('');
  const [cargandoFecha, setCargandoFecha] = useState(true);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setApiError('Por seguridad, no se permite pegar en los campos de contraseña');
  };

  useEffect(() => {
    const cargarUltimoCambio = async () => {
      try {
        setCargandoFecha(true);
        const resultado = await obtenerUltimoCambio();
        setUltimaModificacion(resultado.fechaFormateada);
      } catch (error) {
        console.error('Error al cargar último cambio:', error);
        setUltimaModificacion('No disponible');
      } finally {
        setCargandoFecha(false);
      }
    };
    cargarUltimoCambio();
  }, []);

  const onSubmit = async (data: ChangePasswordFormData) => {
    setApiError(null);
    setSuccess(null);

    const token = localStorage.getItem("servineo_token");
    if (!token) {
      setApiError('No hay sesión activa. Por favor, inicia sesión.');
      return;
    }

    try {
      const result = await cambiarContrasena(data);

      if (result.success) {
        setSuccess('Contraseña actualizada exitosamente. Cerrando sesión...');
        reset();
        
        setTimeout(() => {
          localStorage.removeItem("servineo_token");
          localStorage.removeItem("servineo_user");
          window.location.href = "/login";
        }, 2000);

      } else {
        setApiError(result.message || 'El cambio no se completó, error inesperado.');

        if (result.forceLogout) {
          return;
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error al cambiar contraseña:', err.message);
        if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          setApiError('El cambio no se completó, error de conexión.');
        } else {
          setApiError(err.message || 'El cambio no se completó, error inesperado.');
        }
      } else {
        console.error('Error desconocido:', err);
        setApiError('El cambio no se completó, error inesperado.');
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-6 rounded-lg border border-[#E5F4FB] bg-white p-6 shadow-sm transition-all duration-300">
      <p className="text-sm text-gray-400 mb-2">
        Elige una contraseña segura y no la utilices en otras cuentas.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-semibold text-[#1A223F] mb-2 text-left">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword')}
              placeholder="Ingresa tu contraseña actual"
              className={`w-full rounded-md border px-3 py-2 text-[#1A223F] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.currentPassword
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#E5F4FB] bg-[#F5FAFE] focus:border-[#2BDDE0] focus:ring-[#2BDDE0]'
                }`}
              disabled={isSubmitting}
              onPaste={handlePaste}
              onChange={() => {
                clearErrors();
                setApiError(null);
              }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-[#1A223F] mb-2 text-left">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número"
              className={`w-full rounded-md border px-3 py-2 text-[#1A223F] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.newPassword
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#E5F4FB] bg-[#F5FAFE] focus:border-[#2BDDE0] focus:ring-[#2BDDE0]'
                }`}
              disabled={isSubmitting}
              onPaste={handlePaste}
              onChange={() => {
                clearErrors();
                setApiError(null);
              }}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1A223F] mb-2 text-left">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="Repita su nueva contraseña"
              className={`w-full rounded-md border px-3 py-2 text-[#1A223F] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.confirmPassword
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#E5F4FB] bg-[#F5FAFE] focus:border-[#2BDDE0] focus:ring-[#2BDDE0]'
                }`}
              disabled={isSubmitting}
              onPaste={handlePaste}
              onChange={() => {
                clearErrors();
                setApiError(null);
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {apiError && (
          <div className={`rounded-md p-3 text-sm transition-opacity duration-1000 ease-out ${apiError.includes('bloqueada') || apiError.includes('Demasiados intentos') || apiError.includes('restantes')
              ? 'bg-red-100 border border-red-300 text-red-800'
              : 'bg-red-50 text-red-700'
            }`}>
            {(apiError.includes('bloqueada') || apiError.includes('Demasiados intentos')) && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔒</span>
                <strong>Seguridad Activada</strong>
              </div>
            )}
            {apiError.includes('restantes') && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⚠️</span>
                <strong>Atención</strong>
              </div>
            )}
            {apiError}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 transition-opacity duration-1000 ease-out flex items-center gap-2">
            <span className="text-lg">✅</span>
            {success}
          </div>
        )}

        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Última modificación:
            </span>
            {cargandoFecha ? (
              <div className="flex items-center gap-1">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm text-gray-500">Cargando...</span>
              </div>
            ) : (
              <span className="text-sm text-gray-600">{ultimaModificacion}</span>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-md bg-[#1A223F] px-4 py-2 text-white font-semibold hover:bg-[#2B31E0] disabled:bg-[#759AE0]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Guardando...
              </>
            ) : (
              'Cambiar contraseña'
            )}
          </button>
          <button
            type="button"
            onClick={() => (onCancel ? onCancel() : router.back())}
            disabled={isSubmitting}
            className="rounded-md bg-[#E5F4FB] px-4 py-2 text-[#1A223F] font-semibold hover:bg-[#2BDDE0]/20"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}