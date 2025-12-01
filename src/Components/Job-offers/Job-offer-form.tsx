'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';

// Imports de tus tipos y esquemas reales
import {
  jobOfferSchema,
  jobCategories,
  boliviaCities,
  type JobOfferFormData,
  type IJobOffer,
} from '@/app/lib/validations/Job-offer-Schemas';

interface JobOfferFormProps {
  // Ahora onSubmit recibe los datos limpios y el array de nuevos archivos
  onSubmit: (data: JobOfferFormData, newImages: File[]) => void;
  onCancel: () => void;
  defaultValues?: IJobOffer | null;
  isSubmitting?: boolean;
}

export default function JobOfferForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
}: JobOfferFormProps) {
  // === ESTADOS PARA IMÁGENES Y TAGS ===
  const [selectedNewImages, setSelectedNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // Separamos las URLs que vienen del backend de las nuevas
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  // === CONFIGURACIÓN DEL FORMULARIO ===
  // ...
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(jobOfferSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      city: 'Cochabamba',
      contactPhone: '',
      category: '',
      tags: [],
    },
  });

  // === EFECTO DE CARGA DE DATOS (EDICIÓN) ===
  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title,
        description: defaultValues.description,
        price: defaultValues.price,
        city: defaultValues.city,
        contactPhone: defaultValues.contactPhone,
        category: defaultValues.category,
        tags: defaultValues.tags || [],
      });
      // Cargar fotos existentes del backend
      setExistingPhotos(defaultValues.photos || []);
    }
  }, [defaultValues, reset]);

  // === LÓGICA DE TAGS ===
  const currentTags = watch('tags') || [];

  const handleAddTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    if (!currentTags.includes(value) && currentTags.length < 5) {
      setValue('tags', [...currentTags, value], { shouldValidate: true });
    }
    e.target.value = '';
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = currentTags.filter((t) => t !== tagToRemove);
    setValue('tags', newTags, { shouldValidate: true });
  };

  // === LÓGICA DE IMÁGENES ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingPhotos.length + selectedNewImages.length + files.length;

    if (totalImages > 5) {
      alert('Máximo 5 imágenes permitidas en total.');
      return;
    }

    const newFiles: File[] = [];
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`La imagen ${file.name} es muy pesada (máx 5MB)`);
      } else {
        newFiles.push(file);
      }
    });

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedNewImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index: number) => {
    setSelectedNewImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]); // Limpiar memoria
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    // Aquí solo la quitamos visualmente.
    // Nota: Si tu backend requiere una lista de "fotos a borrar", necesitarías lógica extra aquí.
    // Por ahora asumimos que al enviar, el backend reemplaza o gestiona las fotos.
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // === MANEJO DEL SUBMIT ===
  const onFormSubmit = (data: JobOfferFormData) => {
    // Pasamos los datos del formulario + las nuevas imágenes al padre
    onSubmit(data, selectedNewImages);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Fijo */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <h2 className="text-xl font-bold text-gray-900">
          {defaultValues ? 'Editar Oferta' : 'Nueva Oferta'}
        </h2>
        <button
          onClick={onCancel}
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cuerpo Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form id="job-offer-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Ej: Instalación de tuberías"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              <option value="">Seleccionar...</option>
              {jobCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Tags (Etiquetas) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas <span className="text-xs text-gray-400 font-normal">(Máx. 5)</span>
            </label>

            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px] p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 focus:outline-none ml-1 rounded-full hover:bg-white/50"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {currentTags.length === 0 && (
                <span className="text-xs text-gray-400 italic self-center px-1">
                  Sin etiquetas seleccionadas
                </span>
              )}
            </div>

            <select
              onChange={handleAddTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={currentTags.length >= 5}
              defaultValue=""
            >
              <option value="" disabled>
                {currentTags.length >= 5 ? 'Límite alcanzado' : '+ Agregar etiqueta...'}
              </option>
              {jobCategories.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  disabled={currentTags.includes(cat.value)}
                >
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.tags && <p className="text-sm text-red-500 mt-1">{errors.tags.message}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Describe detalladamente el servicio..."
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Precio y Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Bs)</label>
              <input
                type="number"
                {...register('price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                min="0"
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <select
                {...register('city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
              >
                {boliviaCities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Celular de Contacto
            </label>
            <input
              {...register('contactPhone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Ej: 70000000"
            />
            {errors.contactPhone && (
              <p className="text-sm text-red-500 mt-1">{errors.contactPhone.message}</p>
            )}
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Imágenes del Trabajo
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {/* Fotos Existentes (Backend) */}
              {existingPhotos.map((url, idx) => (
                <div
                  key={`existing-${idx}`}
                  className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image src={url} alt="existing" fill className="object-cover" sizes="100px" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 text-center py-0.5">
                    Guardada
                  </span>
                </div>
              ))}

              {/* Fotos Nuevas (Preview) */}
              {previewUrls.map((url, idx) => (
                <div
                  key={`new-${idx}`}
                  className="relative aspect-square group rounded-lg overflow-hidden border border-blue-200"
                >
                  <Image src={url} alt="preview" fill className="object-cover" sizes="100px" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <span className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-white text-[10px] px-1 text-center py-0.5">
                    Nueva
                  </span>
                </div>
              ))}

              {/* Botón de Subida */}
              {existingPhotos.length + previewUrls.length < 5 && (
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-primary/50 transition-all group">
                  <div className="p-2 rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors mb-1">
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium group-hover:text-primary">
                    Subir
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">Máximo 5 imágenes en total (5MB cada una).</p>
          </div>
        </form>
      </div>

      {/* Footer Fijo con Botones */}
      <div className="border-t border-gray-100 p-4 bg-gray-50 shrink-0 flex gap-3 justify-end rounded-b-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="job-offer-form"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : defaultValues ? (
            'Actualizar Oferta'
          ) : (
            'Publicar Oferta'
          )}
        </button>
      </div>
    </div>
  );
}
