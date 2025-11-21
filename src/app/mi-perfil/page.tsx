'use client';

import React, { useEffect, useState } from 'react';
import UserProfileSummary from '@/Components/profile/UserProfileSummary';
import { Bell, BellOff, ShieldCheck, User2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserData } from '@/types/User';

export default function MiPerfilPage() {
  const [editing, setEditing] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();

  // ======================================================
  //                 🔒 CARGA DE USUARIO SEGURO
  // ======================================================
  const [userData, setUserData] = useState<UserData | null>(null);

  function safeParse(json: string | null) {
    if (!json) return null;
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const raw = localStorage.getItem('servineo_user');
    setUserData(safeParse(raw));
  }, []);

  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem('servineo_user');
      setUserData(safeParse(raw));
      setRefresh(Date.now());
    };

    window.addEventListener('servineo_user_updated', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('servineo_user_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  // ======================================================
  //                     🔔 NOTIFICACIONES
  // ======================================================
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('servineo_notifications');
    if (saved === 'true' || saved === 'false') {
      setNotifications(saved === 'true');
    }
  }, []);

  function toggleNotifications() {
    setNotifications(prev => {
      const next = !prev;
      localStorage.setItem('servineo_notifications', next.toString());
      return next;
    });
  }

  // ======================================================
  //              📄 EDICIÓN INLINE DEL PERFIL
  // ======================================================
  const [editName, setEditName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [savingInline, setSavingInline] = useState(false);

  useEffect(() => {
    if (!userData) return;

    const parts = userData.name?.split(' ') ?? [''];
    setEditName(parts[0] ?? '');
    setEditLastName(parts.slice(1).join(' ') ?? '');
    setEditEmail(userData.email ?? '');
  }, [userData]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditPhotoFile(file);
  };

  async function saveProfileInline() {
    try {
      const token = localStorage.getItem('servineo_token');
      if (!token) {
        alert('No autenticado');
        return;
      }

      setSavingInline(true);

      let base64Photo: string | null = null;
      if (editPhotoFile) {
        base64Photo = await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(editPhotoFile);
        });
      }

      const fullName = `${editName.trim()} ${editLastName.trim()}`.trim();

      const payload = {
        name: fullName,
        email: editEmail.trim(),
        photo: base64Photo,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/controlC/usuario/update`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error al actualizar');

      const newUser = {
        ...data.user,
        name: payload.name,
        email: payload.email,
        photo: payload.photo ?? data.user?.photo,
      };

      localStorage.setItem('servineo_user', JSON.stringify(newUser));
      window.dispatchEvent(new Event('servineo_user_updated'));
      setUserData(newUser);

      alert('Perfil actualizado correctamente');
    } catch {
      alert('No se pudo actualizar el perfil.');
    } finally {
      setSavingInline(false);
    }
  }

 // ======================================================
//                           UI
// ======================================================
return (
  <main className="min-h-screen bg-gradient-to-br from-[#F5F8FF] to-[#E9EEFA] py-10 px-4 font-roboto">
    <div className="max-w-6xl mx-auto">

      <h1 className="text-4xl font-bold mb-10 text-[#16203A] tracking-tight">
        Mi perfil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ===================== LADO IZQUIERDO ===================== */}
        <div className="lg:col-span-1">
          <UserProfileSummary key={refresh} />
        </div>

        {/* ===================== LADO DERECHO ===================== */}
        <div className="lg:col-span-2">
          <div className="backdrop-blur-md bg-white/60 p-8 rounded-3xl shadow-xl border border-white/40">

            {/* ============================================================
                 SECCIÓN 1 — EDITAR PERFIL 
            ============================================================ */}
            <div className="bg-white rounded-2xl p-7 shadow-md border border-gray-100 mb-10">
              
              <div className="flex items-center gap-3 mb-4">
                <User2 className="text-primary" size={24} />
                <h3 className="text-2xl font-semibold text-[#16203A]">Editar perfil</h3>
              </div>

              <p className="text-sm text-gray-500 mb-8">
                Actualiza tu foto, nombre y correo de manera sencilla.
              </p>

              {/* FOTO */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <img
                    src={editPhotoFile ? URL.createObjectURL(editPhotoFile) : userData?.photo || '/no-photo.png'}
                    className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-white"
                  />

                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
                    <span className="text-white text-xs font-medium tracking-wide">Cambiar foto</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div>
                  <p className="font-medium text-gray-700">Foto de perfil</p>
                  <p className="text-xs text-gray-400">Formatos PNG o JPG, máx 5 MB</p>
                </div>
              </div>

              {/* FORMULARIO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="text-sm font-semibold text-[#16203A]">Nombre</label>
                  <input
                    className="mt-1 p-3 border rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#16203A]">Apellido</label>
                  <input
                    className="mt-1 p-3 border rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-primary transition"
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                  />
                </div>

              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-[#16203A]">Correo electrónico</label>
                <input
                  className="mt-1 p-3 border rounded-xl w-full bg-gray-100 text-gray-600 focus:ring-2 focus:ring-primary transition"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                />
              </div>

              {/* BOTÓN GUARDAR */}
              <button
                onClick={saveProfileInline}
                disabled={savingInline}
                className="mt-7 w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg transition tracking-wide"
              >
                {savingInline ? 'Guardando…' : 'Guardar cambios'}
              </button>

            </div>

            {/* ============================================================
                 SECCIÓN 2 — NOTIFICACIONES
            ============================================================ */}
            <div className="p-7 bg-white rounded-2xl border shadow-md mb-10">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">
                  <Bell className="text-primary" size={22} />
                  <div>
                    <h3 className="text-lg font-semibold">Notificaciones</h3>
                    <p className="text-sm text-gray-500">Activa o desactiva alertas importantes.</p>
                  </div>
                </div>

                <button
                  onClick={toggleNotifications}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full shadow text-sm font-medium transition ${
                    notifications ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {notifications ? <Bell size={18} /> : <BellOff size={18} />}
                  {notifications ? 'Activadas' : 'Desactivadas'}
                </button>

              </div>
            </div>

            {/* ============================================================
                 SECCIÓN 3 — SEGURIDAD
            ============================================================ */}
            <div className="p-7 bg-white rounded-2xl border shadow mb-10">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="text-primary" size={22} />
                <h3 className="font-semibold text-lg">Seguridad de la cuenta</h3>
              </div>
              <p className="text-sm text-gray-500">
                Tu cuenta está protegida correctamente.
              </p>
            </div>

            {/* ============================================================
                 SECCIÓN 4 — INFO EXTRA
            ============================================================ */}
            <div className="p-5 bg-white rounded-2xl border shadow mb-10 flex gap-4">
              <Info className="text-primary" size={22} />
              <div>
                <h3 className="font-semibold text-lg">Configuraciones avanzadas</h3>
                <p className="text-sm text-gray-600">
                  Para cambiar <b>teléfono, dirección o contraseña</b>, entra en <b>Configuración</b>.
                </p>
              </div>
            </div>

            {/* ============================================================
                 BOTONES FINALES
            ============================================================ */}
            <div className="flex gap-4">
              <button
                onClick={() => (window.location.href = '/requesterEdit?section=perfil')}
                className="px-6 py-2.5 bg-white border text-primary rounded-full shadow hover:bg-gray-50 transition"
              >
                Configuración
              </button>

              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition"
              >
                Volver al inicio
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </main>
);

}




