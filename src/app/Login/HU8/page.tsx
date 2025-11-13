'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../HU3/hooks/usoAutentificacion'
import { useRouter } from 'next/navigation'

const ChangePasswordForm = dynamic(() => import('./ChangePasswordForm'), { ssr: false })

export default function ChangePasswordPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isChanging, setIsChanging] = useState(false)

  // Callback cuando se cancela
  const handleCancel = () => {
    router.back() // O router.push('/controlC') si quieres ir a una página específica
  }

  // Callback cuando se guarda exitosamente
  const handleSaved = () => {
    setIsChanging(false)
    // Puedes redirigir donde quieras después de cambiar la contraseña
    setTimeout(() => {
      router.back(); // O router.back()
    }, 1500)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5FAFE] flex items-center justify-center">
        <p className="text-[#2B6AE0] text-lg">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5FAFE] p-8 text-center">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Acceso Denegado</h1>
        <p className="text-[#1A223F]">Por favor, inicie sesión para ver esta página.</p>
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
      <main className="flex-grow p-5 max-w-2xl mx-auto w-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#1A223F' }}>
          Cambiar Contraseña
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5F4FB] w-full">
          <ChangePasswordForm 
            onCancel={handleCancel}
            onSaved={handleSaved}
          />
        </div>
      </main>

      {/* 🔹 Footer */}
      <footer className="text-center p-4 text-[#759AE0] text-sm border-t border-[#E5F4FB] bg-white/70">
        &copy; {new Date().getFullYear()} Servineo
      </footer>
    </div>
  )
}