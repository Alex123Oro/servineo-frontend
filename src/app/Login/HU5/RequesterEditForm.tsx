'use client'

import { useState, useEffect } from 'react'
import { Loader2, Crosshair } from 'lucide-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
  obtenerDatosUsuarioLogueado,
  actualizarDatosUsuario,
} from './service/api'

// 🔹 Importar dinámicamente los componentes de mapa
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
)

type LatLng = { lat: number; lng: number }
type Ubicacion = {
  lat: number
  lng: number
  direccion: string
  departamento: string
  pais: string
}

export default function RequesterEditForm() {
  const router = useRouter()
  const [telefono, setTelefono] = useState('')
  const [ubicacion, setUbicacion] = useState<Ubicacion>({
    lat: 0,
    lng: 0,
    direccion: '',
    departamento: '',
    pais: '',
  })
  const [latLng, setLatLng] = useState<LatLng | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Teléfono ya no se edita en esta vista; se conserva internamente
  const [mapReady, setMapReady] = useState(false)

  // 🟦 Cargar datos del usuario
  useEffect(() => {
    async function cargarDatos() {
      try {
        const userData = await obtenerDatosUsuarioLogueado()
        setTelefono(userData.telefono || '')
        setUbicacion(
          userData.ubicacion || {
            lat: 0,
            lng: 0,
            direccion: '',
            departamento: '',
            pais: '',
          }
        )

        if (userData.ubicacion?.lat && userData.ubicacion?.lng) {
          setLatLng({
            lat: userData.ubicacion.lat,
            lng: userData.ubicacion.lng,
          })
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Error al cargar tus datos.')
      }
    }
    cargarDatos()
  }, [])

  // 🟦 Configurar ícono por defecto de Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })
          ._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/Public Login/marker-icon-2x.png',
          iconUrl: '/Public Login/marker-icon.png',
          shadowUrl: '/Public Login/marker-shadow.png',
        })
      })
    }
  }, [])

  // Teléfono no se edita en HU5; solo se envía el valor existente.

  // 🟦 Obtener dirección desde coordenadas
  async function fetchAddress(lat: number, lng: number): Promise<void> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      const { country, state, road, suburb, city, town } = data.address || {}

      setUbicacion({
        lat,
        lng,
        direccion: [road, suburb, city || town].filter(Boolean).join(', ') || '',
        departamento: state || '',
        pais: country || '',
      })
    } catch {
      setUbicacion((prev) => ({
        ...prev,
        lat,
        lng,
        direccion: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      }))
    }
  }

  // 🟦 Obtener ubicación actual
  function handleGetLocation(): void {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización')
      return
    }
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLatLng(coords)
        fetchAddress(coords.lat, coords.lng)
      },
      () => setError('No se pudo obtener tu ubicación'),
      { enableHighAccuracy: true }
    )
  }

  // 🟦 Componente de marcador dinámico
  const LocationMarker = dynamic(
    async () => {
      const { useMap, useMapEvents, Marker } = await import('react-leaflet')
      const { useEffect } = await import('react')

      interface Props {
        latLng: LatLng | null
        onChange: (coords: LatLng) => void
      }

      const Component = ({ latLng, onChange }: Props) => {
        const map = useMap()

        useMapEvents({
          click(e) {
            const newCoords = { lat: e.latlng.lat, lng: e.latlng.lng }
            onChange(newCoords)
            map.flyTo(e.latlng, map.getZoom(), { animate: true })
          },
        })

        useEffect(() => {
          if (latLng) {
            map.flyTo([latLng.lat, latLng.lng], map.getZoom(), { animate: true })
          }
        }, [latLng, map])

        return latLng ? <Marker position={[latLng.lat, latLng.lng]} /> : null
      }

      return Component
    },
    { ssr: false }
  )

  // 🟦 Guardar cambios
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (loading) return
    setError(null)

    setLoading(true)
    try {
      const result = await actualizarDatosUsuario({ telefono, ubicacion })

      if (!result.success) {
        throw new Error(result.message)
      }

      alert('Perfil actualizado correctamente')
      // Redirigir al Home con el modal de editar perfil abierto
      try {
        localStorage.setItem('booka_open_edit_on_home', '1')
      } catch {}
      router.push('/')
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto bg-white rounded-2xl p-8"
      aria-busy={loading}
    >
      {/* Teléfono removido: esta vista se centra en la ubicación y el mapa */}

      {/* Ubicación */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-[#1A223F]">
          Ubicación:
        </label>
        <div className="flex items-center gap-2">
          <input
            value={ubicacion.direccion || ''}
            disabled
            placeholder="País, ciudad, departamento"
            className="flex-1 rounded-md border px-3 py-2 bg-[#F5FAFE] border-[#E5F4FB] cursor-not-allowed text-black"
          />
          <button
            type="button"
            onClick={handleGetLocation}
            className="p-2 rounded-md border border-[#E5F4FB] bg-[#F5FAFE] hover:bg-[#2BDDE0]/20 transition"
          >
            <Crosshair size={18} color="#2BDDE0" />
          </button>
        </div>
        <span className="text-xs text-[#759AE0]">
          Haz clic en el botón GPS o en el mapa para seleccionar tu ubicación
        </span>
      </div>

      {/* Mapa */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-[#1A223F]">
          Mapa
        </label>
        <div className="w-full h-64 border border-[#E5F4FB] rounded-lg overflow-hidden bg-gradient-to-br from-[#F5FAFE] to-[#E5F4FB] relative">
          <MapContainer
            center={latLng ? [latLng.lat, latLng.lng] : [-16.5, -68.15]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenReady={() => setMapReady(true)}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapReady && (
              <LocationMarker
                latLng={latLng}
                onChange={(coords: LatLng) => {
                  setLatLng(coords)
                  fetchAddress(coords.lat, coords.lng)
                }}
              />
            )}
          </MapContainer>
          {!mapReady && (
            <span className="absolute inset-0 flex items-center justify-center text-gray-600">
              Cargando mapa...
            </span>
          )}
        </div>
      </div>

      {/* Errores */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Botones */}
      <div className="pt-4 flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-[#1A223F] px-4 py-2 text-white font-semibold hover:bg-[#2B31E0] disabled:bg-[#759AE0]"
          translate="no"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            try { localStorage.setItem('booka_open_edit_on_home', '1') } catch {}
            router.push('/')
          }}
          className="rounded-md bg-[#E5F4FB] px-4 py-2 text-[#1A223F] font-semibold hover:bg-[#2BDDE0]/20"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
