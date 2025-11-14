// Pequeña utilidad para persistir la sesión de usuario
// en el almacenamiento que usa el Header/UserProfile
// (localStorage 'booka_users' y evento 'booka-profile-updated').

export type SessionUser = {
  loggedIn?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  [k: string]: any;
};

export function persistSession(user: SessionUser) {
  if (typeof window === 'undefined') return;

  try {
    const devIdKey = 'booka_device_id';
    let deviceId = localStorage.getItem(devIdKey);
    if (!deviceId) {
      deviceId = 'dev-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(devIdKey, deviceId);
    }

    // Normalizar campo de foto desde distintas respuestas del backend
    const normalizedPhoto = (user as any).photo
      || (user as any).picture
      || (user as any).avatar
      || (user as any).image
      || (user as any).profileImageUrl
      || '';

    const updated: SessionUser = {
      ...user,
      photo: normalizedPhoto || '/avatar.png',
      loggedIn: true,
    };
    const storeRaw = localStorage.getItem('booka_users');
    const store = storeRaw ? JSON.parse(storeRaw) : { sessions: {} };
    store.sessions = store.sessions || {};
    store.sessions[deviceId!] = updated;
    store.lastUpdated = Date.now();
    localStorage.setItem('booka_users', JSON.stringify(store));

    localStorage.setItem('booka_user', JSON.stringify(updated));
    (window as any).userProfile = updated;
    (window as any).isAuthenticated = true;

    window.dispatchEvent(new CustomEvent('booka-profile-updated', { detail: updated }));
    window.dispatchEvent(new CustomEvent('booka-auth-updated', { detail: updated }));
  } catch (err) {
    console.error('persistSession error:', err);
  }
}