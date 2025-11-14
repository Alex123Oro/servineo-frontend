"use client";
import { useState } from "react";
import { vincularCorreoContrasena } from "../service/api";

export default function VincularCorreo({
  token,
  onLinked,
}: {
  token: string;
  onLinked?: (client: any) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVincular = async () => {
    setLoading(true);
    setMessage("");

    const result = await vincularCorreoContrasena(token, email, password);

    setMessage(result.message);
    if (result.success && onLinked) onLinked(result.client);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-gray-50 mt-4 text-black">
      <h3 className="font-semibold mb-2">Vincular con correo y contraseña</h3>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-2 text-black"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-3 text-black"
      />

      <button
        disabled={loading}
        onClick={handleVincular}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Vinculando..." : "Vincular"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
