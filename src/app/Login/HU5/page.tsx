'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../HU3/hooks/usoAutentificacion'
import { obtenerDatosUsuarioLogueado } from './service/api'

const RequesterEditForm = dynamic(() => import('./RequesterEditForm'), { ssr: false })

interface RequesterDataState {
  requesterId: string
  phone: string
  direction: string
  coordinates: [number, number]
}

const INITIAL_DATA: RequesterDataState = {
  requesterId: '',
  phone: '',
  direction: '',
  coordinates: [0, 0],
}

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profileData, setProfileData] = useState<RequesterDataState>(INITIAL_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfileData = useCallback(async () => {
    if (authLoading || !user) return

    setLoading(true)
    setError(null)

    try {
      const rawData = await obtenerDatosUsuarioLogueado()

      // 🔹 Mapear correctamente los datos de la API a nuestro estado
      const data: RequesterDataState = {
        requesterId: rawData.requesterId,
        phone: rawData.telefono || '',
        direction: rawData.ubicacion?.direccion || '',
        coordinates: [
          rawData.ubicacion?.lat || 0,
          rawData.ubicacion?.lng || 0,
        ],
      }

      setProfileData(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos del perfil.'
      setError(message)
      setProfileData(INITIAL_DATA)
    } finally {
      setLoading(false)
    }
  }, [authLoading, user])

  useEffect(() => {
    loadProfileData()
  }, [loadProfileData])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5FAFE] flex items-center justify-center">
        <p className="text-[#2B6AE0] text-lg">Cargando datos del perfil...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F5FAFE] p-8 text-center">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          {user ? 'Error de Carga' : 'Acceso Denegado'}
        </h1>
        <p className="text-[#1A223F]">
          {user ? `No se pudo cargar el perfil: ${error}` : 'Por favor, inicie sesión para ver esta página.'}
        </p>
        {user && (
          <button
            onClick={loadProfileData}
            className="mt-4 p-2 bg-[#1AA7ED] text-white rounded hover:bg-[#2B6AE0] transition"
          >
            Reintentar Carga
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#F5FAFE] flex flex-col">
      {/* 🔹 Header */}
      <header className="flex justify-between items-center p-4 shadow bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b border-[#E5F4FB]">
        <div className="text-2xl font-bold tracking-wide ml-6" style={{ color: '#1A223F' }}>
          Servineo
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#E5F4FB] w-9 h-9 flex items-center justify-center">
              <User size={18} className="text-[#2B6AE0]" />
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-sm font-medium" style={{ color: '#1A223F' }}>
                {user.name || user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 Contenido principal */}
      <main className="flex-grow p-5 max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A223F' }}>
          Editar Mapa
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5F4FB] w-full">
          <RequesterEditForm />
        </div>
      </main>

      {/* 🔹 Footer */}
      <footer className="text-center p-4 text-[#759AE0] text-sm border-t border-[#E5F4FB] bg-white/70">
        &copy; {new Date().getFullYear()} Servineo
      </footer>
    </div>
  )
}
