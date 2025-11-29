
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { mockJobOffers } from '../../lib/mock-data';
import { JobOffer } from '../../lib/mock-data';
import { JobOfferCard } from '@/Components/Job-offers/Job-offer-card';
import { JobOfferModal } from '@/Components/Job-offers/Job-offer-modal';
import { MapView } from '@/Components/Job-offers/maps/MapView';
import { SearchHeader } from '@/Components/SearchHeader';
import { useLogClickMutation } from '../../redux/services/activityApi';
import { useLogSearchMutation, useUpdateFiltersMutation } from '../../redux/services/searchApi';
import { FiltersPanel } from '@/Components/FiltersPanel';
import { useAppSelector } from '../../redux/hooks';
import {
  selectSearchQuery,
  selectSelectedCities,
  selectSelectedJobTypes,
  selectSelectedFixerNames,
  selectRecentSearches,
} from '../../redux/slice/filterSlice';
import { ArrowLeft, Briefcase, Map, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { JobOfferData, AdaptedJobOffer } from '@/types/jobOffers';
import { adaptOfferToModalFormat } from '@/types/jobOffers';

const SCROLL_POSITION_KEY = 'jobOffers_scrollPosition';

// ============================================================================
// CONSTANTS
// ============================================================================
const ITEMS_PER_PAGE = 6;
const SEARCH_DEBOUNCE_MS = 300;
const LOADING_DELAY_MS = 500;
const USER_PERSONA = { id: '507f1f77bcf86cd799439011', nombre: 'Usuario POC' };

export default function JobOffersPage() {
  const t = useTranslations('jobOffers');

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedOfferId, setClickedOfferId] = useState<string | null>(null);

  // ============================================================================
  // REDUX SELECTORS
  // ============================================================================
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCities = useAppSelector(selectSelectedCities);
  const selectedJobTypes = useAppSelector(selectSelectedJobTypes);
  const selectedFixerNames = useAppSelector(selectSelectedFixerNames);
  const recentSearches = useAppSelector(selectRecentSearches);

  // ============================================================================
  // API HOOKS
  // ============================================================================
  const [logClick] = useLogClickMutation();
  const [logSearch] = useLogSearchMutation();
  const [updateFilters] = useUpdateFiltersMutation();

  // ============================================================================
  // REFS FOR TRACKING
  // ============================================================================
  const previousSearchQueryRef = useRef<string>('');
  const previousRecentSearchesRef = useRef<string[]>([]);
  const previousFixerNamesRef = useRef<string[]>([]);
  const previousCitiesRef = useRef<string[]>([]);
  const previousJobTypesRef = useRef<string[]>([]);
  const isInitialMountRef = useRef<boolean>(true);
  const lastSearchSentRef = useRef<string>('');
  const filteredOffersCountRef = useRef<number>(0);

  // ============================================================================
  // LOAD OFFERS ON MOUNT
  // ============================================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffers(mockJobOffers);
      setIsLoading(false);
    }, LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // ============================================================================
  // FILTER HELPERS (MEMOIZED)
  // ============================================================================
  const getFixerNameValue = useCallback((): string => {
    return selectedFixerNames.length === 0 ? 'not_applied' : selectedFixerNames.join(',');
  }, [selectedFixerNames]);

  const getCityValue = useCallback((): string => {
    return selectedCities.length === 0 ? 'not_applied' : selectedCities.join(',');
  }, [selectedCities]);

  const getJobTypeValue = useCallback((): string => {
    return selectedJobTypes.length === 0 ? 'not_applied' : selectedJobTypes.join(',');
  }, [selectedJobTypes]);

  // ============================================================================
  // FILTERED OFFERS (MEMOIZED)
  // ============================================================================
  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        const matchesSearch =
          !searchQuery ||
          offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.fixerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCity =
          selectedCities.length === 0 || (offer.city && selectedCities.includes(offer.city));

        const matchesJobType =
          selectedJobTypes.length === 0 ||
          offer.services?.some((service) => selectedJobTypes.includes(service));

        return matchesSearch && matchesCity && matchesJobType;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [offers, searchQuery, selectedCities, selectedJobTypes]);

  // Update filteredOffersCount ref whenever it changes
  useEffect(() => {
    filteredOffersCountRef.current = filteredOffers.length;
  }, [filteredOffers.length]);

  // ============================================================================
  // PAGINATION LOGIC
  // ============================================================================
  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    if (!isLoading && Array.isArray(offers) && offers.length > 0 && !scrollRestoredRef.current) {
      try {
        const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          if (!isNaN(position)) {
            setTimeout(() => {
              window.scrollTo(0, position);
              scrollRestoredRef.current = true;
              sessionStorage.removeItem(SCROLL_POSITION_KEY);
            }, 100);
          }
        }
      } catch {
        // ignorar errores
      }
    }
  }, [isLoading, offers]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleCardClick = useCallback(
    async (offer: JobOffer) => {
      // Prevent multiple clicks
      if (clickedOfferId === offer.id) return;

      setClickedOfferId(offer.id);

      // Set selected offer FIRST
      setSelectedOffer(offer);

      // Small delay to ensure state is set before opening modal
      setTimeout(() => {
        setIsModalOpen(true);
      }, 50);

      // Log click activity in background
      const activityData = {
        userId: USER_PERSONA.id,
        date: new Date().toISOString(),
        role: 'requester' as const,
        type: 'click' as const,
        metadata: {
          button: 'job_offer',
          jobTitle: offer.title || 'Sin título',
          jobId: offer.id,
        },
        timestamp: new Date().toISOString(),
      };

      try {
        await logClick(activityData).unwrap();
        console.log('✓ Click registrado:', offer.title);
      } catch (error) {
        console.error('✗ Error al registrar clic:', error);
      }
    },
    [logClick, clickedOfferId]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Clear selected offer and clicked ID after animation completes
    setTimeout(() => {
      setSelectedOffer(null);
      setClickedOfferId(null);
    }, 300);
  }, []);

  const handleResetSearch = useCallback(() => {
    setCurrentPage(1);
    window.location.href = window.location.pathname;
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ============================================================================
  // SEARCH TRACKING (POST)
  // ============================================================================
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousSearchQueryRef.current = searchQuery;
      previousRecentSearchesRef.current = recentSearches;
      previousFixerNamesRef.current = selectedFixerNames;
      previousCitiesRef.current = selectedCities;
      previousJobTypesRef.current = selectedJobTypes;
      return;
    }

    const prevFirstSearch = previousRecentSearchesRef.current[0] || '';
    const currFirstSearch = recentSearches[0] || '';
    const hasNewSearch =
      recentSearches.length > 0 &&
      currFirstSearch !== prevFirstSearch &&
      currFirstSearch.trim().length > 0 &&
      currFirstSearch !== lastSearchSentRef.current;

    if (!hasNewSearch) {
      if (currFirstSearch !== prevFirstSearch) {
        previousRecentSearchesRef.current = [...recentSearches];
      }
      return;
    }

    const currentQuery = currFirstSearch.trim();
    const timeoutId = setTimeout(async () => {
      if (recentSearches[0] !== currentQuery || currentQuery.length === 0) return;

      const searchData = {
        user_type: 'visitor' as const,
        search_query: currentQuery,
        search_type: 'search_box' as const,
        filters: {
          filter_1: {
            fixer_name: getFixerNameValue(),
            city: getCityValue(),
            job_type: getJobTypeValue(),
            search_count: filteredOffersCountRef.current,
          },
        },
      };

      try {
        await logSearch(searchData).unwrap();
        console.log('✓ Búsqueda registrada:', currentQuery);
        lastSearchSentRef.current = currentQuery;
        previousSearchQueryRef.current = currentQuery;
        previousRecentSearchesRef.current = [...recentSearches];
      } catch (error) {
        console.error('✗ Error al registrar búsqueda:', error);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [recentSearches, logSearch, getFixerNameValue, getCityValue, getJobTypeValue]);

  // ============================================================================
  // FILTER TRACKING (PATCH)
  // ============================================================================
  useEffect(() => {
    if (isInitialMountRef.current) return;

    const arraysEqual = (a: string[], b: string[]) =>
      JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

    const fixerNamesChanged = !arraysEqual(previousFixerNamesRef.current, selectedFixerNames);
    const citiesChanged = !arraysEqual(previousCitiesRef.current, selectedCities);
    const jobTypesChanged = !arraysEqual(previousJobTypesRef.current, selectedJobTypes);

    if (!fixerNamesChanged && !citiesChanged && !jobTypesChanged) return;

    // Update refs immediately to prevent duplicates
    previousFixerNamesRef.current = [...selectedFixerNames];
    previousCitiesRef.current = [...selectedCities];
    previousJobTypesRef.current = [...selectedJobTypes];

    const timeoutId = setTimeout(async () => {
      const filterData = {
        filters: {
          fixer_name: getFixerNameValue(),
          city: getCityValue(),
          job_type: getJobTypeValue(),
          search_count: filteredOffersCountRef.current,
        },
      };

      try {
        await updateFilters(filterData).unwrap();
        console.log('✓ Filtros actualizados:', filterData);
      } catch (error) {
        console.error('✗ Error al actualizar filtros:', error);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [
    selectedFixerNames,
    selectedCities,
    selectedJobTypes,
    updateFilters,
    getFixerNameValue,
    getCityValue,
    getJobTypeValue,
  ]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage: number;
    if (totalPages <= maxButtons) {
      startPage = 1;
    } else if (currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxButtons + 1;
    } else {
      startPage = currentPage - 2;
    }

    for (let i = 0; i < Math.min(maxButtons, totalPages); i++) {
      const pageNum = startPage + i;
      buttons.push(
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`min-w-[40px] h-10 px-3 rounded-lg font-semibold transition-all shadow-sm ${
            currentPage === pageNum
              ? 'bg-blue-600 text-white scale-110 shadow-md'
              : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
          }`}
        >
          {pageNum}
        </button>
      );
    }

    return buttons;
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-all hover:gap-2 gap-1 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">{t('backToHome')}</span>
              </Link>
              <div className="hidden md:flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">{t('pageTitle')}</h1>
                  <span className="text-xs text-gray-500">
                    {filteredOffers.length} {t('available')}
                  </span>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg shadow-inner">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all font-medium ${
                  viewMode === 'list'
                    ? 'bg-white shadow-md text-blue-600 scale-105'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">{t('viewModes.list')}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all font-medium ${
                  viewMode === 'map'
                    ? 'bg-white shadow-md text-blue-600 scale-105'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">{t('viewModes.map')}</span>
              </button>
            </div>
          </div>

    setTimeout(() => {
      dispatch(enablePersistence());
      dispatch(setPaginaActual(pageToRestore));
    }, 0);
  };

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-full md:w-80 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm z-10">
          <div className="sticky top-[180px] p-6">
            <FiltersPanel />
          </div>
        </aside>

        {/* Mobile Filters */}
        <div className="md:hidden p-4 border-b border-gray-200 bg-white shadow-sm z-10">
          <FiltersPanel />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-180px)] relative z-0">
          {isLoading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Cargando ofertas...</p>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                // List View
                <>
                  {filteredOffers.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600">
                        Mostrando{' '}
                        <span className="font-semibold text-gray-900">{startIndex + 1}</span> -{' '}
                        <span className="font-semibold text-gray-900">
                          {Math.min(endIndex, filteredOffers.length)}
                        </span>{' '}
                        de{' '}
                        <span className="font-semibold text-gray-900">{filteredOffers.length}</span>{' '}
                        resultados
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {paginatedOffers.map((offer, index) => (
                      <div
                        key={`offer-${offer.id}`}
                        className={`animate-fade-in transition-all duration-200 ${
                          clickedOfferId === offer.id ? 'opacity-100 scale-100' : 'opacity-100'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <JobOfferCard
                          offer={offer}
                          onClick={() => handleCardClick(offer)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {filteredOffers.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col items-center gap-4 mt-10">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="p-2.5 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-all shadow-sm"
                          aria-label="Página anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1.5">{renderPaginationButtons()}</div>

                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2.5 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 transition-all shadow-sm"
                          aria-label="Página siguiente"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Página {currentPage} de {totalPages}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                // Map View
                <div className="relative w-full h-[calc(100vh-280px)] max-h-[800px]">
                  <div className="absolute inset-0 rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-lg">
                    <MapView offers={filteredOffers} onOfferClick={handleCardClick} />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredOffers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-6 bg-gray-100 rounded-full mb-6">
                    <Briefcase className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {t('emptyState.title')}
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">{t('emptyState.description')}</p>
                  <button
                    onClick={handleResetSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Reiniciar búsqueda
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal */}
      {selectedOffer && (
        <JobOfferModal
          offer={selectedOffer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}