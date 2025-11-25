"use client";

import React, { useEffect, useState, useRef } from "react";
import UserProfileSummary from "@/Components/profile/UserProfileSummary";
import { Bell, BellOff, ShieldCheck, User2, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/hooks/usoAutentificacion";
import type { User } from "../redux/services/services/registro";
import { UserData } from "@/types/User";

export default function MiPerfilPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  /* ======================================================
                      📌 ESTADOS BASE
  ====================================================== */
  const [refresh, setRefresh] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ======================================================
                 🔒 CARGA DE USUARIO SEGURO
  ====================================================== */
  const [userData, setUserData] = useState<UserData | null>(null);
  // Ref para rastrear si userData viene de localStorage (más confiable)
  const userDataFromStorageRef = useRef(false);

  /* ======================================================
               ✏️ EDICIÓN INLINE DEL PERFIL
  ====================================================== */
  const [editName, setEditName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [savingInline, setSavingInline] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function safeParse(json: string | null) {
    if (!json) return null;
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  // Función para cargar usuario desde localStorage (siempre la fuente de verdad)
  const loadUserFromStorage = () => {
    const raw = localStorage.getItem("servineo_user");
    const parsed = safeParse(raw);
    if (parsed) {
      setUserData(parsed as UserData);
      setUser(parsed as User);
      userDataFromStorageRef.current = true; // Marcar que viene de localStorage
      return parsed as UserData;
    }
    userDataFromStorageRef.current = false;
    return null;
  };

  // Función auxiliar para actualizar campos editables desde datos
  const updateEditableFields = (
    data: UserData & { firstName?: string; lastName?: string }
  ) => {
    if (!data || hasUnsavedChanges) return;

    // 🔥 Si ya existen firstName / lastName guardados → usar esos SIEMPRE
    // Esto preserva exactamente cómo el usuario dividió el nombre
    // Usamos !== undefined para detectar si el campo existe (incluso si es string vacío)
    if (data.firstName !== undefined || data.lastName !== undefined) {
      setEditName(data.firstName ?? "");
      setEditLastName(data.lastName ?? "");
      setEditEmail(data.email ?? "");
      return;
    }

    // Si NO hay firstName/lastName guardados, dividir el name completo
    // Pero solo si los campos editables están vacíos (no interferir con escritura del usuario)
    if (editName || editLastName) return;

    const full = (data.name || "").trim().replace(/\s+/g, " ");
    const parts = full.split(" ").filter(p => p.length > 0);

    if (parts.length === 0) {
      setEditName("");
      setEditLastName("");
    } else if (parts.length === 1) {
      setEditName(parts[0]);
      setEditLastName("");
    } else if (parts.length === 2) {
      // Ej: "Juan Pérez"
      setEditName(parts[0]);
      setEditLastName(parts[1]);
    } else if (parts.length === 3) {
      // Ej: "Juan Carlos Pérez"
      setEditName(parts[0] + " " + parts[1]); // 2 nombres
      setEditLastName(parts[2]); // 1 apellido
    } else if (parts.length === 4) {
      // Ej: "Juan Carlos Pérez García" → 2 nombres + 2 apellidos
      setEditName(parts[0] + " " + parts[1]);
      setEditLastName(parts[2] + " " + parts[3]);
    } else {
      // 5 o más palabras: primeros N-2 en nombre, últimos 2 en apellido
      const apellidos = parts.slice(-2).join(" ");
      const nombres = parts.slice(0, -2).join(" ");
      setEditName(nombres);
      setEditLastName(apellidos);
    }

    setEditEmail(data.email ?? "");
  };


  useEffect(() => {
    const loaded = loadUserFromStorage();
    // Inicializar campos editables inmediatamente desde localStorage
    if (loaded) {
      updateEditableFields(loaded);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      // Cuando hay un evento de actualización, cargar desde localStorage
      const loaded = loadUserFromStorage();
      if (loaded) {
        updateEditableFields(loaded);
      }
      setRefresh(Date.now());
    };

    window.addEventListener("servineo_user_updated", handler);
    window.addEventListener("storage", handler);

    // Verificar cuando la página recibe foco (al volver de otra página)
    const handleFocus = () => {
      const loaded = loadUserFromStorage();
      if (loaded) {
        updateEditableFields(loaded);
      }
    };
    window.addEventListener("focus", handleFocus);

    // Verificar cuando la página se vuelve visible (al volver de otra pestaña/página)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const loaded = loadUserFromStorage();
        if (loaded) {
          updateEditableFields(loaded);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("servineo_user_updated", handler);
      window.removeEventListener("storage", handler);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasUnsavedChanges]);

  // También actualizar cuando el user del contexto cambie, pero SIEMPRE priorizar localStorage
  // IMPORTANTE: NO actualizar campos editables aquí para evitar interferir con la escritura del usuario
  useEffect(() => {
    // Leer siempre de localStorage primero (fuente de verdad)
    const raw = localStorage.getItem("servineo_user");
    const parsed = safeParse(raw);
    
    if (parsed) {
      const parsedName = parsed.name || '';
      const parsedEmail = parsed.email || '';
      
      // SIEMPRE actualizar userData con localStorage (es la fuente de verdad)
      // Marcar que viene de localStorage
      setUserData(parsed as UserData);
      userDataFromStorageRef.current = true;
      
      // Si el contexto tiene datos diferentes (más antiguos), actualizar el contexto con localStorage
      if (user) {
        const contextName = user.name || '';
        const contextEmail = user.email || '';
        
        // Si los datos de localStorage son diferentes (más recientes), actualizar el contexto
        if (parsedName !== contextName || parsedEmail !== contextEmail) {
          setUser(parsed as User);
        }
      } else {
        // Si no hay contexto pero hay localStorage, actualizar el contexto
        setUser(parsed as User);
      }
      
      // NO actualizar campos editables aquí - solo se actualizan en:
      // 1. Al montar (useEffect inicial)
      // 2. En los eventos (servineo_user_updated, storage, focus, visibilitychange)
      // Esto evita interferir cuando el usuario está escribiendo
    } else if (user) {
      // Solo usar el contexto si NO hay datos en localStorage
      const userAsData: UserData = {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        photo: user.picture,
      };
      setUserData(userAsData);
      userDataFromStorageRef.current = false; // Viene del contexto, no de localStorage
    }
  }, [user, setUser]);

  /* ======================================================
                     🔔 NOTIFICACIONES
  ====================================================== */
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("servineo_notifications");
    if (saved === "true" || saved === "false") {
      setNotifications(saved === "true");
    }
  }, []);

  function toggleNotifications() {
    setNotifications((prev) => {
      const next = !prev;
      localStorage.setItem("servineo_notifications", next.toString());
      return next;
    });
  }

  /* ======================================================
               ✏️ EDICIÓN INLINE DEL PERFIL
  ====================================================== */
  // Los estados ya están definidos arriba, aquí solo el useEffect

// Este useEffect solo actualiza si userData cambia Y los campos están vacíos
// SIEMPRE prioriza localStorage sobre userData - NUNCA usar userData si localStorage tiene datos
useEffect(() => {
  // Si hay cambios sin guardar, NO actualizar
  if (hasUnsavedChanges) return;
  
  // Si ya hay texto escrito, NO tocar (el usuario está editando)
  if (editName || editLastName) return;
  
  // SIEMPRE leer de localStorage primero (fuente de verdad absoluta)
  // NUNCA usar userData si localStorage tiene datos
  const raw = localStorage.getItem("servineo_user");
  const parsed = safeParse(raw);
  
  if (parsed) {
    // SIEMPRE usar datos de localStorage (más recientes y confiables)
    const parsedName = parsed.name || '';
    const currentFullName = `${editName.trim()} ${editLastName.trim()}`.trim();
    
    // Actualizar solo si es diferente (evitar loops)
    if (parsedName !== currentFullName || (parsed.email || '') !== editEmail) {
      updateEditableFields(parsed as UserData);
    }
  } else if (userData && !userDataFromStorageRef.current) {
    // Solo usar userData si NO hay datos en localStorage Y viene del contexto (no de localStorage)
    // Si userData viene de localStorage, ya lo manejamos arriba
    const userDataName = userData.name || '';
    const currentFullName = `${editName.trim()} ${editLastName.trim()}`.trim();
    
    if (userDataName !== currentFullName || (userData.email || '') !== editEmail) {
      updateEditableFields(userData);
    }
  }
}, [userData, hasUnsavedChanges, editName, editLastName, editEmail]);




  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditPhotoFile(file);
  };

  async function saveProfileInline() {
    try {
      const token = localStorage.getItem("servineo_token");
      if (!token) return alert("No autenticado");

      setSavingInline(true);

      let base64Photo: string | null = null;
      if (editPhotoFile) {
        base64Photo = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(editPhotoFile);
        });
      }

      const fullName = `${editName.trim()} ${editLastName.trim()}`
      .replace(/\s+/g, " ")
      .trim();


    // VALIDAR EMAIL ESTRICTO
function isValidEmail(email: string) {
  const allowedDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
    "live.com"
  ];

  if (!email) return false;

  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!regex.test(email)) return false;

  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
}

if (!isValidEmail(editEmail.trim())) {
  alert("⚠️ Correo inválido.");
  setSavingInline(false);
  return;
}

      const payload = {
        name: fullName,
        email: editEmail.trim(),
        photo: base64Photo ?? userData?.photo ?? userData?.picture ?? userData?.url_photo ?? null,
      };

      const res = await fetch(
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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar");

      // Construir el nuevo usuario con los datos actualizados
      // IMPORTANTE: Usar SIEMPRE los datos que se enviaron (payload) como fuente de verdad
      // No confiar en data.user del backend si puede estar desactualizado
      const currentUser = userData || {};
      const newUser = {
        ...currentUser,
        ...data.user,
        // SIEMPRE usar los datos del payload (lo que el usuario acaba de enviar)
        name: payload.name,
        email: payload.email,
        // Guardar firstName y lastName por separado para preservar la división exacta
        firstName: editName.trim(),
        lastName: editLastName.trim(),
        photo: payload.photo ?? currentUser?.photo ?? currentUser?.picture ?? currentUser?.url_photo ?? data.user?.photo ?? null,
        picture: payload.photo ?? currentUser?.picture ?? currentUser?.photo ?? currentUser?.url_photo ?? data.user?.picture ?? null,
        url_photo: payload.photo ?? currentUser?.url_photo ?? currentUser?.photo ?? currentUser?.picture ?? data.user?.url_photo ?? null,
      };

      // IMPORTANTE: Guardar en localStorage PRIMERO con los datos que acabamos de enviar
      // Esto asegura que localStorage siempre tenga los datos más recientes
      // Verificar que el nombre se está guardando correctamente
      console.log("💾 Guardando en localStorage:", { 
        name: payload.name, 
        email: payload.email,
        firstName: editName.trim(),
        lastName: editLastName.trim()
      });
      localStorage.setItem("servineo_user", JSON.stringify(newUser));
      
      // Verificar que se guardó correctamente
      const verify = localStorage.getItem("servineo_user");
      if (verify) {
        const verified = JSON.parse(verify);
        console.log("✅ Verificado en localStorage:", { 
          name: verified.name, 
          email: verified.email,
          firstName: verified.firstName,
          lastName: verified.lastName
        });
      }
      
      // Disparar evento personalizado INMEDIATAMENTE después de guardar
      window.dispatchEvent(new Event("servineo_user_updated"));
      
      // Actualizar estados locales
      setUserData(newUser);
      setUser(newUser as User);
      setHasUnsavedChanges(false);
      setEditPhotoFile(null);

      // Forzar actualización en otras pestañas/componentes
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        // También disparar un evento de storage para sincronizar entre pestañas
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'servineo_user',
          newValue: JSON.stringify(newUser),
          storageArea: localStorage
        }));
      }

      alert("Los cambios se han guardado correctamente");
    } catch {
      alert("No se pudo actualizar el perfil.");
    } finally {
      setSavingInline(false);
    }
  }

  /* ======================================================
         ⚠️ DETECTAR CAMBIOS SIN GUARDAR
  ====================================================== */
  useEffect(() => {
    if (!userData) return;
    const fullName = `${editName.trim()} ${editLastName.trim()}`
    .replace(/\s+/g, " ")
    .trim();
 
    const initialName = userData.name ?? "";
    const initialEmail = userData.email ?? "";
    const nameChanged = fullName !== initialName;
    const emailChanged = editEmail.trim() !== initialEmail;
    const photoChanged = !!editPhotoFile;

    setHasUnsavedChanges(nameChanged || emailChanged || photoChanged);
  }, [editName, editLastName, editEmail, editPhotoFile, userData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  /* ======================================================
                  🗑️ ELIMINAR CUENTA
  ====================================================== */
  async function handleDeleteAccount() {
    try {
      const token = localStorage.getItem("servineo_token");
      if (!token) return alert("Usuario no autenticado");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/controlC/usuario/delete-account`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!data.success) {
        alert(data.message || "No se pudo eliminar la cuenta");
        return;
      }

      localStorage.removeItem("servineo_token");
      localStorage.removeItem("servineo_user");
      alert("Tu cuenta ha sido eliminada");
      window.location.href = "/login";
    } catch {
      alert("Error eliminando la cuenta");
    }
  }

  /* ======================================================
                           UI
  ====================================================== */
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
              
              {/* =================== 🧾 EDITAR PERFIL =================== */}
              <div className="bg-white rounded-2xl p-7 shadow-md border border-gray-100 mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <User2 className="text-primary min-w-[24px] min-h-[24px]" size={24} />
                  <h3 className="text-2xl font-semibold text-[#16203A]">
                    Editar perfil
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mb-8">
                  Actualiza tu foto, nombre y correo de manera sencilla.
                </p>

                {/* FOTO */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <img
                      src={
                        editPhotoFile
                          ? URL.createObjectURL(editPhotoFile)
                          : userData?.photo?.trim() ||
                            userData?.picture?.trim() ||
                            userData?.url_photo?.trim() ||
                            "/no-photo.png"
                      }
                      className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-white"
                    />

                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
                      <span className="text-white text-xs font-medium tracking-wide">
                        Cambiar foto
                      </span>
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
                    <p className="text-xs text-gray-400">
                      Formatos PNG o JPG, máx 5 MB
                    </p>
                  </div>
                </div>

                {/* FORMULARIO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-[#16203A]">
                      Nombre
                    </label>
                    <input
                      className="mt-1 p-3 border rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary transition"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#16203A]">
                      Apellido
                    </label>
                    <input
                      className="mt-1 p-3 border rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-primary transition"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-semibold text-[#16203A]">
                    Correo electrónico
                  </label>
                  <input
                    className="mt-1 p-3 border rounded-xl w-full bg-gray-100 text-gray-600 focus:ring-2 focus:ring-primary transition"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                {/* BOTÓN GUARDAR */}
                <button
                  onClick={saveProfileInline}
                  disabled={savingInline}
                  className="mt-7 w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg transition tracking-wide"
                >
                  {savingInline ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>

              {/* =================== 🔔 NOTIFICACIONES =================== */}
              <div className="p-7 bg-white rounded-2xl border shadow-md mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Bell className="text-primary" size={22} />
                    <div>
                      <h3 className="text-lg font-semibold">Notificaciones</h3>
                      <p className="text-sm text-gray-500">
                        Activa o desactiva alertas importantes.
                      </p>
                    </div>
                  </div>

<button
  onClick={toggleNotifications}
  className={`self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full shadow text-sm font-medium transition ${
    notifications ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
  }`}
>

                    {notifications ? <Bell size={18} /> : <BellOff size={18} />}
                    {notifications ? "Activadas" : "Desactivadas"}
                  </button>
                </div>
              </div>

              {/* ===================== 🛡️ SEGURIDAD ===================== */}
              <div className="p-7 bg-white rounded-2xl border shadow mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="text-primary min-w-[22px] min-h-[22px]" size={22} />
                  <h3 className="font-semibold text-lg">
                    Seguridad de la cuenta
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Tu cuenta está protegida correctamente.
                </p>
              </div>

              {/* =================== ℹ️ INFORMACIÓN EXTRA =================== */}
              <div className="p-5 bg-white rounded-2xl border shadow mb-10 flex gap-4">
                <Info className="text-primary min-w-[22px] min-h-[22px]" size={22} />
                <div>
                  <h3 className="font-semibold text-lg">
                    Configuraciones avanzadas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Para cambiar <b>teléfono, dirección o contraseña</b>, entra
                    en <b>Configuración</b>.
                  </p>
                </div>
              </div>

              {/* ===================== 🎛️ BOTONES FINALES ===================== */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                <button
                  onClick={() => {
                    if (
                      hasUnsavedChanges &&
                      !confirm(
                        "Tienes cambios sin guardar. ¿Seguro que quieres salir?"
                      )
                    )
                      return;
                    window.location.href = "/requesterEdit?section=perfil";
                  }}
                  className="px-6 py-2.5 bg-white border text-primary rounded-full shadow hover:bg-gray-50 transition"
                >
                  Configuración
                </button>

                <button
                  onClick={() => {
                    if (
                      hasUnsavedChanges &&
                      !confirm(
                        "Tienes cambios sin guardar. ¿Seguro que quieres salir?"
                      )
                    )
                      return;
                    router.push("/");
                  }}
                  className="px-6 py-2.5 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition"
                >
                  Volver al inicio
                </button>

                <button
                  onClick={() => {
                    if (
                      hasUnsavedChanges &&
                      !confirm(
                        "Tienes cambios sin guardar. ¿Deseas continuar?"
                      )
                    )
                      return;
                    setShowDeleteConfirm(true);
                  }}
                  className="px-6 py-2.5 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition font-medium"
                >
                  Eliminar cuenta
                </button>

                {/* ===================== ❌ MODAL ELIMINAR ===================== */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/40 w-80 text-center">
                      <h3 className="text-lg font-semibold text-[#16203A] mb-3">
                        ¿Está seguro de eliminar su cuenta?
                      </h3>

                      <p className="text-gray-600 mb-6 text-sm">
                        Esta acción eliminará su cuenta de manera permanente.
                      </p>

                      <div className="flex justify-between gap-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 py-2.5 rounded-full bg-white border text-primary shadow hover:bg-gray-50 transition font-medium"
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={handleDeleteAccount}
                          className="flex-1 py-2.5 rounded-full bg-primary text-white shadow hover:bg-primary/90 transition font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}




