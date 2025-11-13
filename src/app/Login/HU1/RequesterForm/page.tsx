"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { enviarRegistroManual } from "../service/conecionbackend";
import { persistSession } from "../../HU4/lib/session";
import { generarContrasena } from "../decoder/generadorContrasena";

export default function RegistroForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

  // 🔹 Estados de error para nombre y apellido
  const [errorNombre, setErrorNombre] = useState("");
  const [errorApellido, setErrorApellido] = useState("");

  const contrasenasCoinciden = password === confirmarPassword;
  const longitudValida = password.length >= 8;
  const emailValido = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const camposLlenos = nombre && apellido && email && password && confirmarPassword;
  const formularioValido = camposLlenos && contrasenasCoinciden && longitudValida && emailValido;

  const handleGenerarContrasena = () => {
    const nueva = generarContrasena({
      length: 12,
      symbols: true,
      avoidAmbiguous: true,
    });
    setPassword(nueva);
    setConfirmarPassword(nueva);
    setMostrarTooltip(false);
    setMostrarPassword(true);
    navigator.clipboard.writeText(nueva);
  };

  // 🔹 Validadores para nombre y apellido
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 50) {
      setErrorNombre("Solo se permiten 50 letras");
    } else {
      setErrorNombre("");
      setNombre(value);
    }
  };

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 50) {
      setErrorApellido("Solo se permiten 50 letras");
    } else {
      setErrorApellido("");
      setApellido(value);
    }
  };

  interface RegistroResponse {
    success: boolean;
    token?: string;
    message?: string;
    user?: { id?: string | number; _id?: string | number; name?: string; email: string; picture?: string };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setMensaje("");
      if (!formularioValido) return;

      setCargando(true);
      const nombreCompleto: string = `${nombre.trim()} ${apellido.trim()}`;

      try {
        const data: RegistroResponse = await enviarRegistroManual(nombreCompleto, email, password);
        if (data.success) {
          setMensaje("Registro exitoso");
          if (data.token) localStorage.setItem("servineo_token", data.token);
          // Persistir sesión con mayor información si el backend la envía
          if (data.user) {
            try {
              localStorage.setItem("servineo_user", JSON.stringify(data.user));
            } catch {}
            persistSession({ name: data.user.name || nombreCompleto, email: data.user.email || email, photo: data.user.picture });
          } else {
            // Persistir sesión mínima para que el Header muestre datos inmediatamente
            persistSession({ name: nombreCompleto, email });
          }
          // Guardar credenciales para disparar el cuadro "Guardar contraseña" en la siguiente pantalla
          sessionStorage.setItem(
            "signup_credentials",
            JSON.stringify({ email, password, name: nombreCompleto })
          );
          // Mensaje para Home, por si el flujo regresa directo o más tarde
          try {
            localStorage.setItem(
              "signup_success_toast",
              `¡Cuenta Creada Exitosamente! ¡Bienvenido, ${nombreCompleto}!`
            );
          } catch {}
          sessionStorage.setItem(
            "toastMessage",
            `¡Cuenta Creada Exitosamente! ¡Bienvenido, ${nombreCompleto}!`
          );
          router.push("../HU1/FotoPerfil");
        } else {
          setMensaje(` ${data.message || "Error al registrar el usuario."}`);
        }
      } catch {
        setMensaje(" Ocurrió un error al conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Nombre y Apellido */}
      <div className="flex gap-3">
        {/* Nombre */}
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Nombre*
          </label>
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            onKeyDown={(e) => {
              const key = e.key;
              if (
                !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(key) &&
                !["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(key)
              ) {
                e.preventDefault();
              }
            }}
            maxLength={50}
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errorNombre
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-servineo-400"
            }`}
            placeholder="Ingresa tu nombre"
            autoComplete="given-name"
            required
          />
          {errorNombre && (
            <p className="text-red-500 text-xs mt-1">{errorNombre}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="flex-1 relative">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Apellido*
          </label>
          <input
            type="text"
            value={apellido}
            onChange={handleApellidoChange}
            onKeyDown={(e) => {
              const key = e.key;
              if (
                !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(key) &&
                !["Backspace", "Tab", "Enter", "ArrowLeft", "ArrowRight"].includes(key)
              ) {
                e.preventDefault();
              }
            }}
            maxLength={50}
            className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
              errorApellido
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-servineo-400"
            }`}
            placeholder="Ingresa tu apellido"
            autoComplete="family-name"
            required
          />
          {errorApellido && (
            <p className="text-red-500 text-xs mt-1">{errorApellido}</p>
          )}
        </div>
      </div>

      {/* Correo */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Correo electrónico*
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@gmail.com"
          className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
            email && !emailValido
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-servineo-400"
          }`}
          name="username"
          autoComplete="email"
          required
        />

        {email && !emailValido && (
          <div className="absolute top-full left-0 mt-1 bg-red-50 border border-red-400 text-red-600 text-xs px-3 py-2 rounded-lg shadow-md animate-fade-in z-10">
            Solo se permiten correos @gmail.com
          </div>
        )}
      </div>

      {/* Contraseña */}
      {/* (resto de tu código de contraseña y confirmación igual que antes) */}
      {/* Contraseña */}
<div className="relative">
  <label className="block text-sm font-semibold text-gray-600 mb-2">
    Contraseña*
  </label>
  <div className="relative">
    <input
      type={mostrarPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Ingresa tu contraseña"
      className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
        password && !longitudValida
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-servineo-400"
      }`}
      name="password"
      autoComplete="new-password"
      required
    />
    <button
      type="button"
      onClick={() => setMostrarPassword(!mostrarPassword)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
    >
      {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {!longitudValida && password && (
    <p className="text-red-500 text-xs mt-1">Debe tener al menos 8 caracteres.</p>
  )}

  <button
    type="button"
    onClick={handleGenerarContrasena}
    onMouseEnter={() => setMostrarTooltip(true)}
    onMouseLeave={() => setMostrarTooltip(false)}
    className="text-sm text-servineo-500 hover:underline mt-1"
  >
    Generar contraseña segura
  </button>

  {mostrarTooltip && (
    <div className="absolute top-full left-0 mt-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-md animate-fade-in z-10">
      Se copiará automáticamente al portapapeles
    </div>
  )}
</div>

{/* Confirmar contraseña */}
<div className="relative">
  <label className="block text-sm font-semibold text-gray-600 mb-2">
    Confirmar contraseña*
  </label>
  <div className="relative">
    <input
      type={mostrarConfirmarPassword ? "text" : "password"}
      value={confirmarPassword}
      onChange={(e) => setConfirmarPassword(e.target.value)}
      placeholder="Confirma tu contraseña"
      className={`w-full border rounded-xl p-2.5 text-gray-800 focus:outline-none focus:ring-2 transition ${
        confirmarPassword && !contrasenasCoinciden
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-servineo-400"
      }`}
      autoComplete="new-password"
      required
    />
    <button
      type="button"
      onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
    >
      {mostrarConfirmarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
  {!contrasenasCoinciden && confirmarPassword && (
    <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden.</p>
  )}
</div>

      {/* Mensaje */}
      {mensaje && (
        <p
          className={`text-center text-sm font-medium mt-3 ${
            mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={!formularioValido || cargando}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl p-2.5 mt-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
      >
        {cargando ? "Registrando..." : "Únete"}
      </button>
    </form>
  );
}
