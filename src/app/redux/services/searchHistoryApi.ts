// src/app/redux/services/searchHistoryApi.ts
import { baseApi } from './baseApi';
import { ensureSessionId } from '@/app/lib/session';

interface SearchHistoryItem {
  searchTerm: string;
}

interface HistoryResponse {
  success: boolean;
  sessionId?: string;
  searchHistory?: SearchHistoryItem[];
  deleted?: boolean;
  cleared?: number;
}

interface SuggestionItem {
  term?: string;
  count?: number;
  score?: number;
  source?: string;
}

interface SuggestionsResponse {
  success: boolean;
  sessionId?: string;
  suggestions?: SuggestionItem[];
}

export const searchHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== OBTENER HISTORIAL =====
    getSearchHistory: builder.query<string[], string>({
      query: (searchTerm = '') => {
        // Asegurar que existe sessionId antes de cada petición
        ensureSessionId();
        const sessionId = localStorage.getItem('sessionId') || '';

        return {
          url: `/devmaster/offers`,
          params: {
            action: 'getHistory',
            search: searchTerm,
            sessionId,
          },
        };
      },
      transformResponse: (response: HistoryResponse) => {
        if (response.sessionId && typeof window !== 'undefined') {
          const currentSid = localStorage.getItem('sessionId');
          if (currentSid !== response.sessionId) {
            console.log('🔄 Actualizando sessionId desde getHistory:', response.sessionId);
            localStorage.setItem('sessionId', response.sessionId);
          }
        }

        if (response.success && response.searchHistory) {
          return response.searchHistory.map((item) => item.searchTerm);
        }
        return [];
      },
      providesTags: ['SearchHistory'],
    }),

    // ===== ELIMINAR ITEM DEL HISTORIAL =====
    deleteSearchHistory: builder.mutation<{ success: boolean; updatedHistory: string[] }, string>({
      query: (searchTerm) => {
        ensureSessionId();
        const sessionId = localStorage.getItem('sessionId') || '';

        return {
          url: `/devmaster/offers`,
          params: {
            action: 'deleteHistory',
            searchTerm,
            sessionId,
          },
        };
      },
      transformResponse: (response: HistoryResponse) => {
        if (response.sessionId && typeof window !== 'undefined') {
          const currentSid = localStorage.getItem('sessionId');
          if (currentSid !== response.sessionId) {
            console.log('🔄 Actualizando sessionId desde deleteHistory:', response.sessionId);
            localStorage.setItem('sessionId', response.sessionId);
          }
        }

        return {
          success: response.success,
          updatedHistory: response.searchHistory?.map((item) => item.searchTerm) || [],
        };
      },
      invalidatesTags: ['SearchHistory'],
    }),

    // ===== LIMPIAR TODO EL HISTORIAL =====
    clearSearchHistory: builder.mutation<{ success: boolean; updatedHistory: string[] }, void>({
      query: () => {
        ensureSessionId();
        const sessionId = localStorage.getItem('sessionId') || '';

        return {
          url: `/devmaster/offers`,
          params: {
            action: 'clearAllHistory',
            sessionId,
          },
        };
      },
      transformResponse: (response: HistoryResponse) => {
        if (response.sessionId && typeof window !== 'undefined') {
          const currentSid = localStorage.getItem('sessionId');
          if (currentSid !== response.sessionId) {
            console.log('🔄 Actualizando sessionId desde clearHistory:', response.sessionId);
            localStorage.setItem('sessionId', response.sessionId);
          }
        }

        return {
          success: response.success,
          updatedHistory: response.searchHistory?.map((item) => item.searchTerm) || [],
        };
      },
      invalidatesTags: ['SearchHistory'],
    }),

    // ===== OBTENER SUGERENCIAS =====
    getSearchSuggestions: builder.query<string[], { query: string; limit?: number }>({
      query: ({ query, limit = 6 }) => {
        ensureSessionId();
        const sessionId = localStorage.getItem('sessionId') || '';

        return {
          url: `/devmaster/offers`,
          params: {
            search: query,
            limit,
            record: 'false', // No registrar en historial
            sessionId,
          },
        };
      },
      transformResponse: (response: SuggestionsResponse) => {
        if (response.sessionId && typeof window !== 'undefined') {
          const currentSid = localStorage.getItem('sessionId');
          if (currentSid !== response.sessionId) {
            console.log('🔄 Actualizando sessionId desde suggestions:', response.sessionId);
            localStorage.setItem('sessionId', response.sessionId);
          }
        }

        if (response.success && response.suggestions) {
          return response.suggestions.map((s) => String(s.term ?? '')).filter(Boolean);
        }
        return [];
      },
      // No invalidar tags porque es solo lectura
    }),
  }),
  overrideExisting: false,
});

// ===== EXPORTAR HOOKS =====
export const {
  useGetSearchHistoryQuery,
  useDeleteSearchHistoryMutation,
  useClearSearchHistoryMutation,
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery,
} = searchHistoryApi;
