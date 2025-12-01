import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Configuración de las variables de entorno (normalizamos sin slash final)
const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const API_URL = `${apiOrigin}/api/controlC`;

// Configuración base para las queries
export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    // Puedes obtener el token del estado si lo necesitas
    // const token = (getState() as RootState).auth.token
    const token = localStorage.getItem('servineo_token');
    
    // Si tenemos un token, lo añadimos a los headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
  // No usar cookies/credentials por defecto. Usamos header Bearer para autenticación.
  credentials: undefined,
});

// API base que otros servicios pueden extender
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['Requester', 'Fixer', 'JobOffer'],
});


export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}


export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error
  );
};