// src/app/redux/features/searchHistory/useSearchHistory.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  useGetSearchHistoryQuery,
  useDeleteSearchHistoryMutation,
  useClearSearchHistoryMutation,
} from '@/app/redux/services/searchHistoryApi';

const HISTORY_KEY = 'job_search_history_v1';
const MAX_HISTORY_ITEMS = 10;

interface UseSearchHistoryOptions {
  useBackend?: boolean;
  maxItems?: number;
  storageKey?: string;
}

interface UseSearchHistoryReturn {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (item: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useSearchHistory(options: UseSearchHistoryOptions = {}): UseSearchHistoryReturn {
  const { useBackend = false, maxItems = MAX_HISTORY_ITEMS, storageKey = HISTORY_KEY } = options;

  const [history, setHistory] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const lastBackendData = useRef<string[] | undefined>(undefined);

  // ===== RTK QUERY HOOKS =====
  const {
    data: backendHistory,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useGetSearchHistoryQuery('', {
    skip: !useBackend,
  });

  const [deleteHistoryItem, { isLoading: isDeleting }] = useDeleteSearchHistoryMutation();
  const [clearHistoryMutation, { isLoading: isClearing }] = useClearSearchHistoryMutation();

  const isLoading = isLoadingHistory || isDeleting || isClearing;
  const error = localError || (historyError ? 'Error al cargar historial' : null);

  // ===== FUNCIONES DE LOCALSTORAGE =====
  const loadFromLocalStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading search history from localStorage:', error);
      return [];
    }
  }, [storageKey]);

  const persistToLocalStorage = useCallback(
    (items: string[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items));
        console.log('💾 Persisted to localStorage:', items);
      } catch (error) {
        console.error('Error saving search history to localStorage:', error);
      }
    },
    [storageKey],
  );

  // ===== INICIALIZACIÓN (solo una vez al montar) =====
  useEffect(() => {
    if (hasInitialized.current) return;

    console.log('🎬 Initializing search history...');

    // SIEMPRE cargar desde localStorage primero
    const localHistory = loadFromLocalStorage();
    console.log('📂 Loaded from localStorage:', localHistory);

    if (localHistory.length > 0) {
      setHistory(localHistory);
    }

    hasInitialized.current = true;
  }, [loadFromLocalStorage]);

  // ===== SINCRONIZAR CON BACKEND (solo cuando cambia el backend) =====
  useEffect(() => {
    // No hacer nada si no estamos usando backend
    if (!useBackend) return;

    // No hacer nada si aún no hemos inicializado
    if (!hasInitialized.current) return;

    // No hacer nada si el backend no ha devuelto datos aún
    if (backendHistory === undefined) return;

    // Evitar re-procesar los mismos datos del backend
    if (lastBackendData.current === backendHistory) {
      console.log('⏭️ Skipping - same backend data');
      return;
    }

    console.log('🔄 Backend data changed:', {
      previous: lastBackendData.current,
      current: backendHistory,
      currentHistory: history,
    });

    lastBackendData.current = backendHistory;

    // Si el backend tiene datos, usarlos
    if (backendHistory.length > 0) {
      console.log('✅ Using backend data:', backendHistory);
      setHistory(backendHistory);
      persistToLocalStorage(backendHistory);
    }
    // Si el backend está vacío Y nuestro estado actual también está vacío
    else if (backendHistory.length === 0 && history.length === 0) {
      console.log('📭 Both backend and state are empty');
      // Todo bien, ambos vacíos
    }
    // Si el backend está vacío pero tenemos datos locales
    else if (backendHistory.length === 0 && history.length > 0) {
      console.log('⚠️ Backend empty but we have local data:', history);
      console.log('🔒 KEEPING local data - NOT overwriting');
      // NO sobrescribir - mantener los datos locales
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useBackend, backendHistory, persistToLocalStorage]);
  // NOTA: NO incluir 'history' en las dependencias para evitar loops

  // ===== AGREGAR AL HISTORIAL =====
  const addToHistory = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      console.log('➕ Adding to history:', trimmed);

      // Actualizar estado y localStorage inmediatamente
      setHistory((prev) => {
        const filtered = prev.filter((item) => item !== trimmed);
        const updated = [trimmed, ...filtered].slice(0, maxItems);
        persistToLocalStorage(updated);
        return updated;
      });

      // Si usamos backend, refrescar después
      if (useBackend) {
        setTimeout(() => {
          console.log('🔄 Refetching from backend...');
          refetchHistory();
        }, 500);
      }
    },
    [maxItems, persistToLocalStorage, useBackend, refetchHistory],
  );

  // ===== ELIMINAR ITEM =====
  const removeFromHistory = useCallback(
    async (item: string) => {
      setLocalError(null);
      console.log('🗑️ Removing from history:', item);

      // Guardar estado previo para rollback
      const previousHistory = history;

      try {
        // Actualización optimista: actualizar UI y localStorage inmediatamente
        setHistory((prev) => {
          const updated = prev.filter((h) => h !== item);
          persistToLocalStorage(updated);
          return updated;
        });

        if (useBackend) {
          // Intentar eliminar en el backend
          const result = await deleteHistoryItem(item).unwrap();

          if (!result.success) {
            throw new Error('Backend deletion failed');
          }

          // Confirmar con el backend
          console.log('✅ Backend confirmed delete:', result.updatedHistory);
          lastBackendData.current = result.updatedHistory;
          setHistory(result.updatedHistory);
          persistToLocalStorage(result.updatedHistory);
        }
      } catch (err) {
        console.error('❌ Remove from history error:', err);
        setLocalError('Error al eliminar del historial');

        // Rollback: restaurar estado anterior
        setHistory(previousHistory);
        persistToLocalStorage(previousHistory);
      }
    },
    [history, useBackend, deleteHistoryItem, persistToLocalStorage],
  );

  // ===== LIMPIAR TODO =====
  const clearHistory = useCallback(async () => {
    setLocalError(null);
    console.log('🧹 Clearing all history');

    // Guardar estado previo para rollback
    const previousHistory = history;

    try {
      // Actualización optimista: limpiar UI y localStorage inmediatamente
      setHistory([]);
      persistToLocalStorage([]);

      if (useBackend) {
        // Intentar limpiar en el backend
        const result = await clearHistoryMutation().unwrap();

        if (!result.success) {
          throw new Error('Backend clear failed');
        }

        console.log('✅ Backend confirmed clear:', result.updatedHistory);
        lastBackendData.current = result.updatedHistory;
        setHistory(result.updatedHistory);
        persistToLocalStorage(result.updatedHistory);
      }
    } catch (err) {
      console.error('❌ Clear history error:', err);
      setLocalError('Error al limpiar historial');

      // Rollback: restaurar estado anterior
      setHistory(previousHistory);
      persistToLocalStorage(previousHistory);
    }
  }, [history, useBackend, clearHistoryMutation, persistToLocalStorage]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isLoading,
    error,
  };
}
