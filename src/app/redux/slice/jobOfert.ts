// src\app\redux\slice\jobOfert.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState, JobOffersState } from '../features/jobOffers/types';
import { saveToStorage, clearJobOffersStorage, STORAGE_KEYS } from '../features/jobOffers/storage';

const getDefaultState = (): JobOffersState => ({
  loading: false,
  error: null,
  filters: {
    range: [],
    city: '',
    category: [],
  },
  sortBy: 'recent',
  search: '',
  date: null,
  rating: null,
  titleOnly: false,
  exact: false,
  paginaActual: 1,
  registrosPorPagina: 10,
  totalRegistros: 0,
  preservedTotalRegistros: 0,
  totalPages: 0,
  paginaciones: {
    offers: {
      paginaActual: 1,
      registrosPorPagina: 10,
      totalRegistros: 0,
      totalPages: 0,
    },
  },
  shouldPersist: true,
});

const initialState: JobOffersState = getDefaultState();

const jobOffersSlice = createSlice({
  name: 'jobOffers',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.SEARCH, action.payload);
      }
    },

    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.FILTERS, action.payload);
      }
    },

    setTitleOnly: (state, action: PayloadAction<boolean>) => {
      state.titleOnly = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.TITLE_ONLY, action.payload);
      }
    },

    setExact: (state, action: PayloadAction<boolean>) => {
      state.exact = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.EXACT, action.payload);
      }
    },

    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.SORT, action.payload);
      }
    },

    setDate: (state, action: PayloadAction<string | null>) => {
      state.date = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.DATE, action.payload);
      }
    },

    setRating: (state, action: PayloadAction<number | null>) => {
      state.rating = action.payload;
      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.RATING, action.payload);
      }
    },

    setRegistrosPorPagina: (state, action: PayloadAction<number>) => {
      state.registrosPorPagina = action.payload;
      state.paginaActual = 1;

      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.PAGE_SIZE, action.payload);
        saveToStorage(STORAGE_KEYS.PAGE, 1);
      }

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: 1,
          registrosPorPagina: action.payload,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].registrosPorPagina = action.payload;
        state.paginaciones['offers'].paginaActual = 1;
      }
    },

    setPaginaActual: (state, action: PayloadAction<number>) => {
      state.paginaActual = action.payload;

      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.PAGE, action.payload);
      }

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: action.payload,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].paginaActual = action.payload;
      }
    },

    updatePagination: (
      state,
      action: PayloadAction<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        listKey?: string;
        isInitialSearch?: boolean;
      }>,
    ) => {
      const {
        total,
        page,
        limit,
        totalPages,
        listKey = 'offers',
        isInitialSearch,
      } = action.payload;

      if (!state.paginaciones[listKey]) {
        state.paginaciones[listKey] = {
          paginaActual: 1,
          registrosPorPagina: 10,
          totalRegistros: 0,
          totalPages: 0,
        };
      }

      state.paginaciones[listKey].paginaActual = page;
      state.paginaciones[listKey].registrosPorPagina = limit;
      state.paginaciones[listKey].totalRegistros = total;
      state.paginaciones[listKey].totalPages = totalPages;

      // ✅ Preservar total en búsqueda inicial para no perderlo en páginas siguientes
      if (page === 1 && isInitialSearch) {
        state.preservedTotalRegistros = total;
      }

      const totalToUse = state.preservedTotalRegistros > 0 ? state.preservedTotalRegistros : total;

      state.paginaActual = page;
      state.registrosPorPagina = limit;
      state.totalRegistros = totalToUse;
      state.totalPages = totalPages;

      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.PAGE, page);
      }
    },

    // ✅ Limpiar filtros sin persistir
    resetFilters: (state) => {
      const defaultState = getDefaultState();
      state.filters = defaultState.filters;
      state.sortBy = defaultState.sortBy;
      state.search = defaultState.search;
      state.date = defaultState.date;
      state.rating = defaultState.rating;
      state.titleOnly = defaultState.titleOnly;
      state.exact = defaultState.exact;
      state.paginaActual = 1;
      state.preservedTotalRegistros = 0;
      state.shouldPersist = false; // Desactivar persistencia temporalmente

      // Limpiar localStorage explícitamente
      clearJobOffersStorage();

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: 1,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].paginaActual = 1;
      }
    },

    // ✅ Reactivar persistencia
    enablePersistence: (state) => {
      state.shouldPersist = true;
    },

    resetPagination: (state) => {
      state.paginaActual = 1;

      if (state.shouldPersist) {
        saveToStorage(STORAGE_KEYS.PAGE, 1);
      }

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: 1,
          registrosPorPagina: state.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      } else {
        state.paginaciones['offers'].paginaActual = 1;
      }
    },

    restoreSavedState: (
      state,
      action: PayloadAction<{
        search: string;
        filters: FilterState;
        sortBy: string;
        paginaActual: number;
        registrosPorPagina: number;
        titleOnly: boolean;
        exact: boolean;
        date: string | null;
        rating: number | null;
      }>,
    ) => {
      const restored = action.payload;
      state.search = restored.search;
      state.filters = restored.filters;
      state.sortBy = restored.sortBy;
      state.paginaActual = restored.paginaActual;
      state.registrosPorPagina = restored.registrosPorPagina;
      state.titleOnly = restored.titleOnly;
      state.exact = restored.exact;
      state.date = restored.date;
      state.rating = restored.rating;
      state.shouldPersist = true;

      if (!state.paginaciones['offers']) {
        state.paginaciones['offers'] = {
          paginaActual: restored.paginaActual,
          registrosPorPagina: restored.registrosPorPagina,
          totalRegistros: 0,
          totalPages: 0,
        };
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSearch,
  setFilters,
  setTitleOnly,
  setExact,
  setSortBy,
  setDate,
  setRating,
  setRegistrosPorPagina,
  setPaginaActual,
  updatePagination,
  resetFilters,
  enablePersistence,
  resetPagination,
  restoreSavedState,
  setLoading,
  setError,
} = jobOffersSlice.actions;

export default jobOffersSlice.reducer;
