'use client';

import { useState, useEffect } from "react"
import { currentFixer,mockJobOfferService, type JobOfferBackend } from "@/app/lib/mock-data"
import { useTranslations } from 'next-intl'

import { Plus, Edit2, Trash2, ImageIcon } from "lucide-react"
import { JobOfferCard } from "@/Components/Job-offers/Job-offer-card"
import JobOfferForm from "@/Components/Job-offers/Job-offer-form"
import type { JobOfferFormData } from "@/app/lib/validations/Job-offer-Schemas"
import NotificationModal from "@/Components/Modal-notifications"
import ConfirmationModal from "@/Components/Modal-confirmation"
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks"
import { setFixer } from "@/app/redux/slice/fixerSlice"
import {
  useGetJobOffersByFixerQuery,
  useCreateJobOfferMutation,
  useUpdateJobOfferMutation,
  useDeleteJobOfferMutation,
} from "@/app/redux/services/jobOfferApi"

type JobOfferWithId = Omit<JobOfferBackend, "createdAt"> & {
  id: string
  createdAt: Date
  tags: string[]
}

export default function MyOffersPage() {
  const t = useTranslations('myOffers')
  
  const dispatch = useAppDispatch()
  const currentFixerRedux = useAppSelector((state) => state.fixer.currentFixer)

  const { data: offersFromAPI = [], isLoading, refetch } = useGetJobOffersByFixerQuery(currentFixer.id)
  const [createJobOffer] = useCreateJobOfferMutation()
  const [updateJobOffer] = useUpdateJobOfferMutation()
  const [deleteJobOffer] = useDeleteJobOfferMutation()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<JobOfferWithId | null>(null)

  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: "success" | "error" | "info" | "warning"
    title: string
    message: string
  }>({ isOpen: false, type: "success", title: "", message: "" })

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    offerId: string | null;
  }>({ isOpen: false, offerId: null });

  useEffect(() => {
    if (!currentFixerRedux) {
      dispatch(setFixer(currentFixer));
    }
  }, [dispatch, currentFixerRedux])

  const handleEdit = (offer: JobOfferWithId) => {
    setEditingOffer(offer)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (offerId: string) => {
    setConfirmDelete({ isOpen: true, offerId });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.offerId) {
      try {
        mockJobOfferService.deleteOffer(confirmDelete.offerId)
        dispatch(deleteOfferRedux(confirmDelete.offerId))
        setNotification({
          isOpen: true,
          type: "success",
          title: t('notifications.offerDeleted.title'),
          message: t('notifications.offerDeleted.message'),
        })
      } catch (error) {
        console.error("Error al eliminar la oferta:", error)
        setNotification({
          isOpen: true,
          type: "error",
          title: t('notifications.error.title'),
          message: t('notifications.error.deleteMessage'),
        })
      }
    }
  }

  const handleSubmit = async (formData: JobOfferFormData) => {
    try {
      const servicesAsStrings = formData.services.map(s => s.value)

      const defaultLocations: Record<string, { lat: number; lng: number }> = {
        Cochabamba: { lat: -17.3895, lng: -66.1568 },
        'La Paz': { lat: -16.5, lng: -68.15 },
        'Santa Cruz': { lat: -17.7834, lng: -63.1821 },
        'El Alto': { lat: -16.5207, lng: -68.1742 },
      };

      const cityLocation = defaultLocations[formData.city] || defaultLocations.Cochabamba

      const offerData = {
        title: formData.title,
        description: formData.description,
        city: formData.city,
        services: servicesAsStrings,
        photos: formData.photos || ["/placeholder.svg?height=300&width=400&text=trabajo"],
        price: formData.price || 0,
        fixerId: currentFixer.id,
        fixerName: currentFixer.name,
        whatsapp: currentFixer.whatsapp || currentFixer.phone.replace(/\D/g, "").slice(3),
        location: {
          lat: cityLocation.lat,
          lng: cityLocation.lng,
          address: `${formData.city}, Bolivia`,
        },
        tags: formData.services.map(s => s.value), // o puedes tener un campo tags separado
      }

      if (editingOffer) {
        await updateJobOffer({
          offerId: editingOffer.id,
          data: offerData,
        }).unwrap()

        setNotification({
          isOpen: true,
          type: "success",
          title: "¡Actualizada!",
          message: "Los cambios se guardaron correctamente",
        })
        if (updatedOffer) {
          dispatch(updateOfferRedux(updatedOffer))
          setNotification({
            isOpen: true,
            type: "success",
            title: t('notifications.offerUpdated.title'),
            message: t('notifications.offerUpdated.message'),
          })
        }
      } else {
        await createJobOffer(offerData).unwrap()
        setNotification({
          isOpen: true,
          type: "success",
          title: t('notifications.offerCreated.title'),
          message: t('notifications.offerCreated.message'),
        })
      }

      setIsFormOpen(false)
      setEditingOffer(null)
      refetch()
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; error?: string; status?: number }
      let message = "Error al procesar la oferta"

      if (err?.data?.message) message = err.data.message
      else if (err?.error) message = err.error
      else if (err?.status === 401) message = "Sesión expirada"

      setNotification({
        isOpen: true,
        type: "error",
        title: t('notifications.error.title'),
        message: t('notifications.error.formMessage'),
      })
    }
  };

      // Normalización 100% tipada – CERO any, CERO unknown
      const offers: JobOfferWithId[] = offersFromAPI.map((raw: unknown) => {
        const offer = raw as {
          _id?: string
          id?: string
          title?: string
          description?: string
          city?: string
          services?: string[]
          photos?: string[]
          price?: number
          fixerId?: string
          fixerName?: string
          whatsapp?: string
          location?: { lat: number; lng: number; address: string }
          createdAt?: string | Date
          tags?: string[]
          fixerPhoto?: string
          rating?: number
          completedJobs?: number
        }

        return {
          _id: offer._id,
          id: offer._id || offer.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: offer.title ?? "",
          description: offer.description ?? "",
          city: offer.city ?? "Cochabamba",
          services: offer.services ?? [],
          photos: offer.photos ?? ["/placeholder.svg?height=300&width=400&text=trabajo"],
          price: offer.price ?? 0,
          fixerId: offer.fixerId ?? currentFixer.id,
          fixerName: offer.fixerName ?? currentFixer.name,
          whatsapp: offer.whatsapp ?? currentFixer.whatsapp ?? currentFixer.phone,
          location: offer.location ?? { lat: -17.3895, lng: -66.1568, address: "Cochabamba, Bolivia" },
          tags: offer.tags ?? [],
          fixerPhoto: offer.fixerPhoto ?? currentFixer.photo,
          rating: offer.rating ?? currentFixer.rating,
          completedJobs: offer.completedJobs ?? currentFixer.completedJobs,
          createdAt: typeof offer.createdAt === "string" 
            ? new Date(offer.createdAt) 
            : offer.createdAt instanceof Date 
              ? offer.createdAt 
              : new Date(),
        } satisfies JobOfferWithId
      })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mis Ofertas</h1>
          <button
            onClick={() => {
              setEditingOffer(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            {t('newOffer')}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <JobOfferForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingOffer(null);
              }}
              defaultValues={editingOffer ?? undefined}
              submitButtonText={editingOffer ? t('actions.saveChanges') : t('actions.publishOffer')}
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Cargando tus ofertas...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t('noOffers.title')}</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              {t('noOffers.description')}
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl hover:scale-105 transition font-bold"
            >
              <Plus className="w-5 h-5" />
              {t('noOffers.createFirst')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className="animate-fade-in relative group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobOfferCard offer={offer} showFixerInfo={true} />

                  
                  <div className="absolute left-3 bottom-16 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(offer)
                      }}
                      className="p-2 bg-white/95 text-primary rounded-lg transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                      title={t('actions.edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(offer.id)
                      }}
                      className="p-2 bg-white/95 text-destructive rounded-lg transition-all hover:scale-110 shadow-lg hover:shadow-xl"
                      title={t('actions.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, offerId: null })}
        onConfirm={handleConfirmDelete}
        title={t('confirmDelete.title')}
        message={t('confirmDelete.message')}
        confirmText={t('confirmDelete.confirm')}
        cancelText={t('confirmDelete.cancel')}
        type="danger"
      />
    </div>
  )
}