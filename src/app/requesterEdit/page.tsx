'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/hooks/usoAutentificacion';
import AccountLoginSettings from './linkAccounts/page';
import RequesterEditForm from '../../Components/requester/request/RequesterEditForm';
import ChangePasswordForm from '../../Components/requester/request/ChangePasswordForm';
import Image from 'next/image';

export default function ConfiguracionPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  
  type SafeUser = { name?: string; email?: string; photo?: string; picture?: string; url_photo?: string };
  const [localUser, setLocalUser] = useState<SafeUser | null>(() => {
    
    return (user as SafeUser) ?? null;
  });

  const readUserFromStorage = () => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem("servineo_user");
      if (raw) {
        return JSON.parse(raw) as SafeUser;
      }
    } catch (e) {
      console.error("Error reading user from localStorage:", e);
    }
    return null;
  };


  useEffect(() => {
    const storedUser = readUserFromStorage();
    if (storedUser) {
      setLocalUser(storedUser);
    } else if (user) {
      setLocalUser(user as SafeUser);
    }
  }, []);

  useEffect(() => {
  
    const storedUser = readUserFromStorage();
    if (storedUser) {
      console.log("🔄 Actualizando usuario desde contexto (priorizando localStorage):", storedUser);
      setLocalUser(storedUser);
    } else if (user) {
      console.log("🔄 Actualizando usuario desde contexto (no hay localStorage):", user);
      setLocalUser(user as SafeUser);
    }
  }, [user]);

  useEffect(() => {
    const handleUserUpdate = () => {
      
      setTimeout(() => {
        const storedUser = readUserFromStorage();
        if (storedUser) {
          console.log("🔄 Actualizando usuario desde evento:", storedUser);
          setLocalUser(storedUser);
        }
      }, 50);
    };

    const checkAndUpdate = () => {
      const storedUser = readUserFromStorage();
      if (storedUser) {
        console.log("🔄 Actualizando usuario desde focus/visibility:", storedUser);
        setLocalUser(storedUser);
      }
    };

    window.addEventListener("servineo_user_updated", handleUserUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "servineo_user" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as SafeUser;
          console.log("🔄 Actualizando usuario desde storage event:", parsed);
          setLocalUser(parsed);
        } catch (err) {
          console.error("Error parsing storage event:", err);
        }
      }
    });
    
    window.addEventListener("focus", checkAndUpdate);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        checkAndUpdate();
      }
    });

    return () => {
      window.removeEventListener("servineo_user_updated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("focus", checkAndUpdate);
      document.removeEventListener("visibilitychange", checkAndUpdate);
    };
  }, []);

  const safeUser = localUser;
  const userPhoto = useMemo(() => {
    return (safeUser?.photo?.trim() || safeUser?.picture?.trim() || safeUser?.url_photo?.trim() || "");
  }, [safeUser]);

  function getInitials(name: string) {
    const clean = (name || '').trim();
    if (!clean) return 'U';
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  
  const loadProfileData = useCallback(async () => {
    if (!user) return

    setProfileLoading(true)
    setProfileError(null)

    try {
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos del perfil.'
      setProfileError(message)
      
    } finally {
      setProfileLoading(false)
    }
  }, [user])

  
  useEffect(() => {
    if (seccionActiva === 'perfil') {
      loadProfileData()
    }
    if (seccionActiva === 'inicio') {
      setTimeout(() => {
        const storedUser = readUserFromStorage();
        if (storedUser) {
          console.log("🔄 Actualizando usuario al cambiar a inicio:", storedUser);
          setLocalUser(storedUser);
        }
      }, 100);
    }
  }, [seccionActiva, loadProfileData])

  
  const handlePasswordCancel = () => {
    setSeccionActiva('inicio') 
  }

  const handlePasswordSaved = () => {
    
    setTimeout(() => {
      setSeccionActiva('inicio') 
    }, 1500)
  }

  
  const renderContenido = () => {
    switch (seccionActiva) {
      case 'perfil':
        if (profileLoading) {
          return (
            <div className="flex items-center justify-center h-64">
              <p className="text-blue-600 text-lg animate-pulse">Cargando datos del perfil...</p>
            </div>
          )
        }

        if (profileError) {
          return (
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Error de Carga</h2>
              <p className="text-gray-600 mb-6">No se pudo cargar el perfil: {profileError}</p>
              <button
                onClick={loadProfileData}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
              >
                Reintentar Carga
              </button>
            </div>
          )
        }

        return (
          <div className="max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Configuraciones Avanzadas
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <RequesterEditForm />
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Cambiar Contraseña
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <ChangePasswordForm 
                onCancel={handlePasswordCancel}
                onSaved={handlePasswordSaved}
              />
            </div>
          </div>
        );

      case 'seguridad':
        return (
          <div className="max-w-4xl w-full">
            <h2 className="text-xl font-semibold text-center mb-2">Seguridad</h2>
            <p className="text-sm text-center text-gray-600 mb-8">
              Opciones y recomendaciones que te ayudan a proteger tu cuenta
            </p>

            <div className="flex justify-center gap-6">
              {/* Cambiar contraseña - Ahora interno */}
              <button
                onClick={() => setSeccionActiva('password')}
                className="flex items-center gap-3 px-6 py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out bg-white text-gray-800 cursor-pointer min-w-[220px]"
              >
                <div className="p-2 rounded-md bg-blue-50">
                  <Image 
                  src="/icons/edit-pass.png" 
                  alt="Cambiar contraseña" 
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain text-blue-600" />
                </div>
                <span className="font-medium">Cambiar contraseña</span>
              </button>

              {/* Dispositivos vinculados */}
              <button
                onClick={() => router.push('/requesterEdit/closeSession/')}
                className="flex items-center gap-3 px-6 py-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out bg-white text-gray-800 cursor-pointer min-w-[220px]"
              >
                <div className="p-2 rounded-md bg-blue-50">
                  <Image 
                  src="/icons/logins.png" 
                  alt="Dispositivos vinculados" 
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain text-blue-600" />
                </div>
                <span className="font-medium">Dispositivos vinculados</span>
              </button>
            </div>
          </div>
        );

      case 'cuentas':
        return <AccountLoginSettings token={localStorage.getItem("servineo_token") ?? ""} />;

      default: // 'inicio'
        return (
          <div className="flex flex-col items-center justify-top flex-1 mt-10">
            {safeUser ? (
              <>
                <div className="mb-4">
                  {userPhoto ? (
                    <img 
                      src={userPhoto}
                      alt="Foto de perfil" 
                      className="w-28 h-28 rounded-full border-4 border-blue-100 object-cover mb-4 shadow-sm"/>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-700 mb-4 shadow-sm border-4 border-blue-200">
                      {getInitials(safeUser?.name ?? safeUser?.email ?? '')}
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  Te damos la bienvenida, <span className="text-blue-600">{safeUser.name ?? 'Usuario'}</span>
                </h2>
                <p className="text-gray-600 max-w-md text-center">
                  Gestiona tu información, privacidad y seguridad para mejorar tu experiencia en <strong>Servineo</strong>.
                </p>
              </>
            ) : (
              <p className="text-gray-600">Inicia sesión para ver tus configuraciones.</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header - igual */}
      
      <div className="flex flex-1">
        {/* Sidebar actualizado */}
        <aside className="w-64 bg-white p-6 flex flex-col justify-between relative shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <button onClick={() => router.back()} className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                Configuración
              </h2>
            </div>

            <nav className="space-y-2">
              {/* Configuraciones Avanzadas - Ahora interno */}
              <button
                onClick={() => setSeccionActiva('perfil')}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out ${
                  seccionActiva === 'perfil'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:font-semibold'
                }`}
              >
                <Image 
                src="/icons/edit-config.png" 
                alt="Configuraciones Avanzadas" 
                width={24}
                height={24}
                className="w-6 h-6" />
                Configuraciones Avanzadas
              </button>

              {/* Seguridad - Estado interno */}
              <button
                onClick={() => setSeccionActiva('seguridad')}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out ${
                  seccionActiva === 'seguridad' || seccionActiva === 'password'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:font-semibold'
                }`}
              >
                <Image 
                src="/icons/seguridad-config.png" 
                alt="Seguridad" 
                width={28}
                height={28}
                className="w-7 h-7" />
                Seguridad
              </button>

              {/* Cuentas vinculadas - Estado interno */}
              <button
                onClick={() => setSeccionActiva('cuentas')}
                className={`cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left transition-all duration-300 ease-out ${
                  seccionActiva === 'cuentas'
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'hover:bg-blue-50 hover:text-blue-600 hover:font-semibold'
                }`}
              >
                <Image 
                src="/icons/cuentas.png" 
                alt="Cuentas" 
                width={28}
                height={28}
                className="w-7 h-7" />
                Cuentas vinculadas
              </button>
            </nav>
          </div>
        </aside>

        {/* Contenido dinámico */}
        <main className="flex-1 flex flex-col items-center text-center p-8 relative">
          {renderContenido()}
        </main>
      </div>
    </div>
  );
}