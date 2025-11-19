'use client';

import React, { useEffect, useState } from 'react';
import { Upload, Mail, User, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// =========================
// TIPOS
// =========================
type UserType = {
  name?: string;
  email?: string;
  photo?: string;
};

// REGEX EMAIL
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{3,}$/;

export default function UserProfileWizard({ onFinish }: { onFinish?: () => void }) {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const totalSteps = 3;

  const [user, setUser] = useState<UserType | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // NUEVOS CAMPOS
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // =========================
  // CARGAR USUARIO
  // =========================
  useEffect(() => {
    const raw = localStorage.getItem("servineo_user");
    if (raw) {
      const u = JSON.parse(raw);
      setUser(u);

      // Dividir nombre en dos partes
      const [first, ...rest] = (u.name || "").split(" ");
      setName(first || "");
      setLastName(rest.join(" ") || "");

      setEmail(u.email || "");
      if (u.photo) setPhotoPreview(u.photo);
    }
  }, []);

  // PREVIEW FOTO
  useEffect(() => {
    if (photoFile) setPhotoPreview(URL.createObjectURL(photoFile));
  }, [photoFile]);

  // =========================
  // VALIDACIÓN
  // =========================
  function validate() {
    const e: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim() || name.length < 2) e.name = "El nombre es muy corto";
      if (!lastName.trim() || lastName.length < 2) e.lastName = "El apellido es muy corto";
    }

    if (step === 2) {
      if (!emailRegex.test(email.trim())) e.email = "Correo inválido";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  // =========================
  // GUARDAR PERFIL
  // =========================
  async function saveProfile() {
    if (!validate()) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("servineo_token");
      if (!token) throw new Error("Usuario no autenticado");

      // foto
      let finalPhoto = user?.photo || null;
      if (photoFile) finalPhoto = await fileToBase64(photoFile);

      const payload = {
        name: `${name.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        photo: finalPhoto,
      };

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/controlC/usuario/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Error al actualizar");

      // Unificar usuario
      const mergedUser = {
        ...data.user,
        name: payload.name,
        photo: finalPhoto,
      };

      localStorage.setItem("servineo_user", JSON.stringify(mergedUser));
      window.dispatchEvent(new Event("servineo_user_updated"));

      if (onFinish) onFinish();
      else router.push("/mi-perfil");

    } catch (err) {
      console.error(err);
    }

    setSaving(false);
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Editar Perfil</h2>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="text-xs font-medium">Paso {step + 1} / {totalSteps}</div>
        <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 0 — FOTO */}
      {step === 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Foto de perfil</h3>

          <div className="flex flex-col items-center">
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg border relative">
              {photoPreview ? (
                <img src={photoPreview} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                  <Upload size={40} />
                </div>
              )}
            </div>

            <label className="mt-4 px-4 py-2 bg-primary text-white rounded-lg shadow cursor-pointer hover:bg-primary/90">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              Cambiar foto
            </label>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 flex items-center gap-2"
            >
              Siguiente <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 1 — NOMBRE + APELLIDO */}
      {step === 1 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Datos personales</h3>

          {/* Nombre */}
          <div className="flex items-center gap-3 p-3 border rounded-xl shadow-sm bg-white">
            <User className="text-gray-500" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="flex-1 outline-none"
            />
          </div>

          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

          {/* Apellido */}
          <div className="flex items-center gap-3 p-3 border rounded-xl shadow-sm bg-white">
            <User className="text-gray-500" />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido"
              className="flex-1 outline-none"
            />
          </div>

          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(0)}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>

            <button
              onClick={() => validate() && setStep(2)}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow flex items-center gap-2 hover:bg-primary/90"
            >
              Siguiente <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2 — EMAIL */}
      {step === 2 && (
        <section className="space-y-5">
          <h3 className="text-xl font-semibold">Correo electrónico</h3>

          <div className="flex items-center gap-3 p-3 border rounded-xl shadow-sm bg-white">
            <Mail className="text-gray-500" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="flex-1 outline-none"
            />
          </div>

          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>

            <button
              onClick={() => saveProfile()}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow flex items-center gap-2 hover:bg-primary/90"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
              <CheckCircle2 size={18} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}


