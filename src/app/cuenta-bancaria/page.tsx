// src/app/cuenta-bancaria/page.tsx

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// 1. Importa el componente cliente que acabas de renombrar
import CuentaBancariaClient from './CuentaBancariaClient'; 

// 2. Un componente de carga (Fallback)
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
        <p className="text-gray-600">Cargando cuenta bancaria...</p>
      </div>
    </div>
  );
}

// 3. Esta es tu nueva página (un Server Component)
export default function CuentaBancariaPage() {
  return (
    // 4. Envuelve tu componente cliente en <Suspense>
    <Suspense fallback={<LoadingFallback />}>
      <CuentaBancariaClient />
    </Suspense>
  );
}