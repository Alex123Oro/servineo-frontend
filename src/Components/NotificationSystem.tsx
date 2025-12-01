'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="p-4 space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

type NotificationType = 'todos' | 'whatsapp' | 'email' | 'citas' | 'ofertas' | 'billetera' | 'no_leidas';

interface INotification {
  _id: string;
  appointment_id?: string;
  recipient_phone?: string;
  notification_type?: 'whatsapp' | 'email' | 'citas' | 'ofertas' | 'billetera';
  message_content?: string;
  send_status?: string;
  error_details?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  users_id?: string;
  tipo?: string;
  estado?: string;
  creado?: string;
  siguiente?: string;
  saldo?: number;
  leido?: boolean;
  action_url?: string; // URL para redirección
}

const API_URL = 'http://localhost:3000/api/notifications';
const NOTIFICATIONS_PER_PAGE = 20;
const POLLING_INTERVAL = 5000; // 5 segundos para actualizaciones en tiempo real
const SKELETON_DELAY = 300; // ms antes de mostrar skeleton

interface NotificationSystemProps {
  userId?: string;
}

// Función para enmascarar datos sensibles
const maskSensitiveData = (text: string | undefined): string => {
  if (!text) return '';
  
  // Si parece un número de tarjeta (16 dígitos) o teléfono largo
  const cardPattern = /(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?)(\d{4})/;
  const phonePattern = /(\d{4}[\s-]?\d{4}[\s-]?)(\d{4})/;
  
  if (cardPattern.test(text)) {
    return text.replace(cardPattern, '**** **** **** $2');
  }
  
  if (phonePattern.test(text) && text.length > 8) {
    const last4 = text.slice(-4);
    return `****${last4}`;
  }
  
  // Si contiene números de más de 8 dígitos, enmascarar
  if (/\d{9,}/.test(text)) {
    return text.replace(/\d(?=\d{4})/g, '*');
  }
  
  return text;
};

export default function NotificationSystem({ userId }: NotificationSystemProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<NotificationType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notification_filter');
      return (saved as NotificationType) || 'todos';
    }
    return 'todos';
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set()
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState<INotification[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar estado persistido al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let loadedReadNotifications = new Set<string>();
      
      const savedRead = localStorage.getItem('read_notifications');
      if (savedRead) {
        try {
          const readIds = JSON.parse(savedRead);
          loadedReadNotifications = new Set(readIds);
          setReadNotifications(loadedReadNotifications);
        } catch (e) {
          console.error('Error loading read notifications:', e);
        }
      }

      const savedNotifications = localStorage.getItem('cached_notifications');
      if (savedNotifications) {
        try {
          const cached = JSON.parse(savedNotifications);
          setNotifications(cached);
          // No establecer el contador desde el caché, se cargará desde el servidor
        } catch (e) {
          console.error('Error loading cached notifications:', e);
        }
      }

      const savedPage = localStorage.getItem('notification_page');
      if (savedPage) {
        setPage(parseInt(savedPage, 10));
      }
    }
  }, []);

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} min`;
    return `hace ${Math.floor(seconds)} seg`;
  };

  const syncPendingNotifications = useCallback(async () => {
    setPendingSync((currentPending) => {
      if (currentPending.length === 0 || !isOnline) return currentPending;

      // Sincronizar en segundo plano
      (async () => {
        try {
          for (const notification of currentPending) {
            // Intentar sincronizar cada notificación pendiente
            await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(notification),
            });
          }
          setPendingSync([]);
        } catch (err) {
          console.error('Error syncing notifications:', err);
        }
      })();

      return currentPending;
    });
  }, [isOnline]);

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar cuando vuelve la conexión
  useEffect(() => {
    if (isOnline) {
      syncPendingNotifications();
    }
  }, [isOnline, syncPendingNotifications]);

  // Guardar estado en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification_filter', filter);
      localStorage.setItem('read_notifications', JSON.stringify(Array.from(readNotifications)));
      localStorage.setItem('notification_page', page.toString());
      if (notifications.length > 0) {
        localStorage.setItem('cached_notifications', JSON.stringify(notifications));
      }
    }
  }, [filter, readNotifications, page, notifications]);

  // Función para cargar solo el contador de notificaciones no leídas según el filtro activo
  const fetchUnreadCount = useCallback(async (currentFilter: string = filter) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al cargar notificaciones');
      }

      const data: INotification[] = await response.json();

      // Aplicar filtro si no es 'todos'
      let filteredData = data;
      if (currentFilter !== 'todos' && currentFilter !== 'no_leidas') {
        filteredData = data.filter((n) => {
          // Mapear tipos antiguos a nuevos
          if (currentFilter === 'citas' && n.appointment_id) return true;
          if (currentFilter === 'ofertas' && n.tipo === 'oferta') return true;
          if (currentFilter === 'billetera' && (n.tipo === 'billetera' || n.saldo !== undefined)) return true;
          if (n.notification_type) {
            return n.notification_type === currentFilter;
          }
          if (n.tipo) {
            return n.tipo === currentFilter;
          }
          return false;
        });
      }

      // Calcular el total de notificaciones NO LEÍDAS según el filtro
      const totalUnreadCount = filteredData.filter((n) => 
        !(n.leido || readNotifications.has(n._id))
      ).length;
      setUnreadCount(totalUnreadCount);
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
      // Si hay error, intentar usar caché
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cached_notifications');
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            let filteredCached = cachedData;
            if (currentFilter !== 'todos' && currentFilter !== 'no_leidas') {
              filteredCached = cachedData.filter((n: INotification) => {
                if (currentFilter === 'citas' && n.appointment_id) return true;
                if (currentFilter === 'ofertas' && n.tipo === 'oferta') return true;
                if (currentFilter === 'billetera' && (n.tipo === 'billetera' || n.saldo !== undefined)) return true;
                if (n.notification_type) {
                  return n.notification_type === currentFilter;
                }
                if (n.tipo) {
                  return n.tipo === currentFilter;
                }
                return false;
              });
            }
            setUnreadCount(filteredCached.filter((n: INotification) => 
              !(n.leido || readNotifications.has(n._id))
            ).length);
          } catch (e) {
            console.error('Error loading cached count:', e);
          }
        }
      }
    }
  }, [readNotifications, filter]);

  const fetchNotifications = useCallback(
    async (
      currentFilter: string,
      currentPage: number = 1,
      append: boolean = false
    ) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
        // Mostrar skeleton después de 300ms
        loadingTimeoutRef.current = setTimeout(() => {
          setShowSkeleton(true);
        }, SKELETON_DELAY);
      }

      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Error al cargar notificaciones');
        }

        const data: INotification[] = await response.json();

        let filteredData = data;
        if (currentFilter !== 'todos') {
          if (currentFilter === 'no_leidas') {
            // Filtrar solo las no leídas
            filteredData = data.filter((n) => 
              !(n.leido || readNotifications.has(n._id))
            );
          } else {
            // Filtrar por tipo
            filteredData = data.filter((n) => {
              // Mapear tipos antiguos a nuevos
              if (currentFilter === 'citas' && n.appointment_id) return true;
              if (currentFilter === 'ofertas' && n.tipo === 'oferta') return true;
              if (currentFilter === 'billetera' && (n.tipo === 'billetera' || n.saldo !== undefined)) return true;
              if (n.notification_type) {
                return n.notification_type === currentFilter;
              }
              if (n.tipo) {
                return n.tipo === currentFilter;
              }
              return false;
            });
          }
        }

        const sortedData = filteredData.sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : a.creado
              ? new Date(a.creado).getTime()
              : 0;
          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : b.creado
              ? new Date(b.creado).getTime()
              : 0;
          return dateB - dateA;
        });

        // Calcular el total de notificaciones NO LEÍDAS de TODOS los datos filtrados (no solo los paginados)
        // Solo actualizar el contador si NO estamos agregando más (append = false)
        // Esto evita que el contador cambie cuando se hace scroll
        if (!append) {
          const totalUnreadCount = sortedData.filter((n) => 
            !(n.leido || readNotifications.has(n._id))
          ).length;
          setUnreadCount(totalUnreadCount);
        }

        // Paginación
        const startIndex = 0;
        const endIndex = currentPage * NOTIFICATIONS_PER_PAGE;
        const paginatedData = sortedData.slice(startIndex, endIndex);

        if (append) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n._id));
            const newNotifications = paginatedData.filter(
              (n) => !existingIds.has(n._id)
            );
            return [...prev, ...newNotifications];
          });
        } else {
          setNotifications(paginatedData);
        }

        setHasMore(endIndex < sortedData.length);
        setPage(currentPage);

        // Guardar en caché
        if (typeof window !== 'undefined') {
          localStorage.setItem('cached_notifications', JSON.stringify(paginatedData));
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar notificaciones');
        console.error('Error fetching notifications:', err);
        
        // Si hay error y tenemos caché, usar caché
        if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('cached_notifications');
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              setNotifications(cachedData);
            } catch (e) {
              console.error('Error loading cached data:', e);
            }
          }
        }
      } finally {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setLoading(false);
        setLoadingMore(false);
        setShowSkeleton(false);
      }
    },
    [readNotifications]
  );

  // Cargar más notificaciones (scroll infinito)
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchNotifications(filter, page + 1, true);
    }
  }, [filter, page, loadingMore, hasMore, fetchNotifications]);

  // Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  // Cargar el contador de no leídas al montar el componente
  useEffect(() => {
    fetchUnreadCount(filter);
  }, [fetchUnreadCount, filter]);

  // Actualizar el contador cuando cambien las notificaciones leídas o el filtro
  useEffect(() => {
    fetchUnreadCount(filter);
  }, [readNotifications, filter, fetchUnreadCount]);

  useEffect(() => {
    if (isOpen && !hasLoadedOnce) {
      fetchNotifications(filter, 1, false);
      setHasLoadedOnce(true);
    }
  }, [isOpen, filter, fetchNotifications, hasLoadedOnce]);


  const handleMarkAsRead = async (notification: INotification) => {
    if (notification.leido || readNotifications.has(notification._id)) {
      // Si ya está leída, solo redirigir si tiene acción
      if (notification.action_url || notification.appointment_id) {
        handleNotificationClick(notification);
      }
      return;
    }

    // Marcar como leída inmediatamente (optimistic update)
    setReadNotifications((prev) => new Set(prev).add(notification._id));
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id ? { ...n, leido: true } : n
      )
    );
    // El contador se actualizará automáticamente por el useEffect que escucha cambios en readNotifications

    try {
      const response = await fetch(`${API_URL}/${notification._id}/leido`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al marcar notificación como leída');
      }
    } catch (err: any) {
      console.error('Error al marcar notificación como leída:', err);
      // Si falla, guardar para sincronizar después
      if (!isOnline) {
        setPendingSync((prev) => [...prev, notification]);
      }
    }

    // Redirigir si tiene acción asociada
    if (notification.action_url || notification.appointment_id) {
      handleNotificationClick(notification);
    }
  };

  const handleNotificationClick = (notification: INotification) => {
    if (notification.action_url) {
      router.push(notification.action_url);
      setIsOpen(false);
      return;
    }

    // Redirección basada en tipo
    if (notification.appointment_id) {
      router.push(`/calendar`);
      setIsOpen(false);
      return;
    }

    if (notification.tipo === 'oferta' || notification.notification_type === 'ofertas') {
      router.push('/fixer/my-offers');
      setIsOpen(false);
      return;
    }

    if (notification.tipo === 'billetera' || notification.notification_type === 'billetera' || notification.saldo !== undefined) {
      router.push('/calendar');
      setIsOpen(false);
      return;
    }
  };

  // Manejar tecla Esc para cerrar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen((prev) => {
            if (!prev) {
              // Solo resetear cuando se abre
              setHasLoadedOnce(false);
            }
            return !prev;
          });
        }}
        className="relative p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Notificaciones"
        aria-expanded={isOpen}
        aria-haspopup="true"
        role="button"
        tabIndex={0}
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center ring-2 ring-white font-bold"
            aria-label={`${unreadCount} notificaciones no leídas`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 sm:absolute sm:inset-auto sm:top-full sm:right-24 sm:mt-2 pointer-events-none"          role="dialog"
          aria-modal="true"
          aria-label="Panel de notificaciones"
        >
          {/* Overlay para móviles */}
          <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden pointer-events-auto" onClick={() => setIsOpen(false)} />
          
          <div
            ref={modalRef}
            className="fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-auto bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:w-96 max-w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col pointer-events-auto border-t sm:border border-gray-200"
          >
            <div className="flex items-center justify-between p-4 sm:p-4 border-b border-gray-200 bg-gray-50">
              {/* Indicador de arrastre para móviles */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full sm:hidden" />
              
              <h2 className="text-lg font-semibold text-gray-900 mt-2 sm:mt-0">
                Notificaciones
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded mt-2 sm:mt-0"
                aria-label="Cerrar panel de notificaciones"
                tabIndex={0}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <label
                  htmlFor="notification-filter"
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2"
                >
                  <FilterIcon className="w-4 h-4 text-gray-500" />
                  Filtrar por tipo
                </label>
                <select
                  id="notification-filter"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value as NotificationType);
                    setPage(1);
                    setHasMore(true);
                    setHasLoadedOnce(false); // Resetear para forzar nueva carga
                    // Actualizar el contador cuando cambia el filtro
                    fetchUnreadCount(e.target.value);
                  }}
                  className="w-full px-3 py-2.5 sm:py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                  aria-label="Filtrar notificaciones por tipo"
                >
                  <option value="todos">Todos</option>
                  <option value="no_leidas">No leídas</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="citas">Citas</option>
                  <option value="ofertas">Ofertas</option>
                  <option value="billetera">Billetera</option>
                </select>
                <div className="absolute right-3 top-8 sm:top-9 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto"
              role="list"
              aria-label="Lista de notificaciones"
            >
              {error && (
                <div className="p-4 text-center text-red-600 text-sm" role="alert">
                  {error}
                </div>
              )}

              {showSkeleton && loading && !loadingMore && (
                <SkeletonLoader />
              )}

              {!loading && !showSkeleton && notifications.length === 0 && (
                <div className="p-8 sm:p-8 text-center text-gray-500">
                  <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm sm:text-base">No hay notificaciones</p>
                </div>
              )}

              {notifications.map((notification) => {
                const isRead = notification.leido || readNotifications.has(notification._id);
                return (
                  <div
                    key={notification._id}
                    onClick={() => handleMarkAsRead(notification)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMarkAsRead(notification);
                      }
                    }}
                    className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isRead
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                    role="listitem"
                    tabIndex={0}
                    aria-label={`Notificación ${isRead ? 'leída' : 'no leída'}: ${notification.message_content || notification.tipo || 'Sin contenido'}`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div
                        className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 ${
                          isRead ? 'bg-gray-300' : 'bg-blue-600'
                        }`}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span
                            className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 ${
                              notification.notification_type === 'whatsapp'
                                ? 'bg-green-100 text-green-800'
                                : notification.notification_type === 'email'
                                  ? 'bg-blue-100 text-blue-800'
                                  : notification.notification_type === 'citas' || notification.appointment_id
                                    ? 'bg-purple-100 text-purple-800'
                                    : notification.notification_type === 'ofertas' || notification.tipo === 'oferta'
                                      ? 'bg-orange-100 text-orange-800'
                                      : notification.notification_type === 'billetera' || notification.tipo === 'billetera' || notification.saldo !== undefined
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : notification.tipo
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {notification.notification_type
                              ? notification.notification_type.toUpperCase()
                              : notification.tipo
                                ? notification.tipo.toUpperCase()
                                : 'NOTIFICACIÓN'}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
                            {notification.createdAt
                              ? timeAgo(notification.createdAt)
                              : notification.creado
                                ? timeAgo(notification.creado)
                                : 'Fecha no disponible'}
                          </span>
                        </div>
                        {notification.message_content ? (
                          <p
                            className={`text-xs sm:text-sm ${
                              isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                            } line-clamp-3`}
                          >
                            {maskSensitiveData(notification.message_content)}
                          </p>
                        ) : notification.tipo ? (
                          <div className="text-xs sm:text-sm">
                            <p
                              className={`${
                                isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                              }`}
                            >
                              Tipo: {notification.tipo}
                            </p>
                            {notification.estado && (
                              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                                Estado: {notification.estado}
                              </p>
                            )}
                            {notification.saldo !== undefined && (
                              <p className="text-[10px] sm:text-xs text-gray-600 mt-1">
                                Saldo: {maskSensitiveData(notification.saldo.toString())}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p
                            className={`text-xs sm:text-sm ${
                              isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
                            }`}
                          >
                            Notificación sin contenido
                          </p>
                        )}
                        {notification.recipient_phone && (
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            Tel: {maskSensitiveData(notification.recipient_phone)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loadingMore && (
                <div className="p-4 text-center">
                  <SpinnerIcon className="w-6 h-6 mx-auto text-blue-600" />
                </div>
              )}

              {hasMore && !loadingMore && (
                <div ref={observerTarget} className="h-4" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}