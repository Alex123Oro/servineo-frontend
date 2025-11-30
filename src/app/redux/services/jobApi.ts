import { baseApi } from './baseApi';
import type { IJob } from '@/types/job-offer';

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query<IJob[], void>({
      query: () => '/jobs', // Asegúrate que esta ruta coincida con tu backend (ej: /job-offers)
      providesTags: ['Job'],
    }),
    getJobsByFixer: builder.query<IJob[], string>({
      query: (fixerId) => `/jobs/fixer/${fixerId}`,
      providesTags: ['Job'],
    }),

    // --- AQUÍ ESTÁ EL CAMBIO ---
    // 1. Cambiamos el tipo de entrada de Omit<IJob...> a FormData
    createJob: builder.mutation<IJob, FormData>({
      query: (formData) => ({
        url: '/jobs', // Asegúrate que coincida con tu backend router.post('/', ...)
        method: 'POST',
        body: formData,
        // NOTA: No necesitas poner headers manuales.
        // RTK Query y el navegador detectarán que es FormData
        // y pondrán el 'multipart/form-data' automáticamente.
      }),
      invalidatesTags: ['Job'],
    }),
    // ---------------------------

    updateJob: builder.mutation<IJob, { jobId: string; data: Partial<IJob> & { fixerId: string } }>(
      {
        query: ({ jobId, data }) => ({
          url: `/jobs/${jobId}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['Job'],
      },
    ),
    deleteJob: builder.mutation<{ message: string }, { jobId: string; fixerId: string }>({
      query: ({ jobId, fixerId }) => ({
        url: `/jobs/${jobId}`,
        method: 'DELETE',
        body: { fixerId },
      }),
      invalidatesTags: ['Job'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllJobsQuery,
  useGetJobsByFixerQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
