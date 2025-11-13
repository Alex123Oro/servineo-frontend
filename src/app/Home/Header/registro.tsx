'use client';
import React from 'react';
import { mockUser } from '@/app/Home/UserProfile/UI/mockUser'; 

interface RegistroProps {
  isOpen: boolean;
  onClose: () => void;
}

const Registro: React.FC<RegistroProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = React.useState(mockUser);

  React.useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const saved =
          JSON.parse(localStorage.getItem('booka_user') || 'null') ||
          (window as any)?.userProfile ||
          mockUser;
        setUser(saved);
      } catch (e) {
        console.error('Error al cargar userProfile:', e);
        setUser(mockUser);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

 const handleContinuar = () => {
    try {
      const u = { ...user, loggedIn: true };
      const deviceId =
        localStorage.getItem('booka_device_id') ||
        (window as any)?.deviceId ||
        'dev-default';

      const usersStoreRaw = localStorage.getItem('booka_users') || null;
      const usersStore = usersStoreRaw ? JSON.parse(usersStoreRaw) : { sessions: {} };

      usersStore.sessions = usersStore.sessions || {};
      usersStore.sessions[deviceId] = u;
      usersStore.lastUpdated = Date.now();

      localStorage.setItem('booka_users', JSON.stringify(usersStore));
      localStorage.setItem('booka_user', JSON.stringify(u));

      (window as any).userProfile = u;
      (window as any).isAuthenticated = true;

      window.dispatchEvent(new CustomEvent('booka-auth-updated', { detail: u }));
      window.dispatchEvent(new CustomEvent('booka-profile-updated', { detail: u }));

      onClose();
    } catch (err) {
      console.error('Error al continuar sesión:', err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] px-4 bg-black/50">
      <div className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg p-6 md:p-8 rounded-2xl shadow-lg relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition text-lg font-bold"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-3">Bienvenido a Servineo</h2>
        <p className="text-center text-gray-600 mb-6 text-sm md:text-base">
          Para acceder a la opción{' '}
          <span className="font-semibold text-blue-700">
            {'"'}Ayuda{'"'}
          </span>
          , inicia sesión o crea una cuenta.
        </p>

        {/* Campo correo (rellenado y bloqueado) */}
<input
  type="email"
  value={user.email || ''} // <- aquí se cambió
  readOnly
  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-100 text-gray-600 cursor-not-allowed text-sm md:text-base"
/>

        <button
          onClick={handleContinuar}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 active:bg-blue-900 transition-colors duration-300 text-sm md:text-base font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Registro;