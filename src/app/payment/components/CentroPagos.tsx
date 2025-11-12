'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { Wallet, Building2, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const CentroDePagos = () => {
  const router = useRouter();

  const searchParams = useSearchParams(); 

  const [fixerData, setFixerData] = useState<unknown | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fixerIdFromUrl = searchParams.get('fixerId');

    if (fixerIdFromUrl) {
      fetchFixerData(fixerIdFromUrl);
    } else {
      setError("No se especificó un ID de Fixer.");
      setLoading(false);
    }
  }, [searchParams]); // Se ejecuta cada vez que los parámetros de la URL cambian

  const fetchFixerData = async (fixerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      
      // <-- CAMBIO 6: Usar el fixerId del parámetro
      console.log(`🔍 Intentando conectar a: ${BACKEND_URL}/api/fixer/payment-center/${fixerId}`);
      
      const response = await fetch(`${BACKEND_URL}/api/fixer/payment-center/${fixerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Datos recibidos:', result);
      
      if (result.success && result.data) {
        setFixerData(result.data);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (err: unknown | null) {
      console.error('❌ Error fetching fixer data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      console.log('⚠️ Usando datos de prueba');
      setFixerData({
        saldoActual: 13.00,
        totalGanado: 15420.00,
        trabajosCompletados: 23,
        fixerId: fixerId, // <-- CAMBIO 7: Usar el ID dinámico en los datos de prueba
        isTestData: true 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Componente de Carga ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }
  
  // --- Manejo de Error (si no hay ID o fixerData) ---
  if (error || !fixerData) {
     return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error al cargar</h2>
          <p className="text-gray-600">{error || "No se pudieron cargar los datos."}</p>
          <button
            onClick={() => router.push('/')} // Botón para volver al inicio
            className="mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // --- Componente Principal ---
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">Centro de Pagos</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4"> 

        {fixerData?.isTestData && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <p className="text-sm text-yellow-800">
                Mostrando datos de prueba. No se encontró información del fixer.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 pb-4">
          <div className="bg-blue-600 rounded-2xl p-4 sm:p-6 shadow-xl text-white">
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <Wallet size={44} className="opacity-90 flex-shrink-0" />
              <div>
                <span className="text-sm opacity-90">Saldo Actual</span>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Bs. {fixerData?.saldoActual?.toFixed(2) || '0.00'}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-[#759ae0] rounded-xl p-4">
                <p className="text-xs text-white opacity-75 mb-1">Total Ganado</p>
                <p className="text-xl font-bold text-white">
                  Bs. {typeof fixerData?.totalGanado === 'number' 
                    ? fixerData.totalGanado.toFixed(2) 
                    : typeof fixerData?.totalGanado === 'string'
                    ? parseFloat(fixerData.totalGanado).toFixed(2)
                    : '0.00'}
                </p>
              </div>

              <div className="bg-[#759ae0] rounded-xl p-4">
                <p className="text-xs text-white opacity-75 mb-1">Trabajos Completados</p>
                <p className="text-3xl font-bold text-white">
                  {fixerData?.trabajosCompletados !== undefined 
                    ? fixerData.trabajosCompletados 
                    : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-6">
          <h3 className="text-base font-semibold text-gray-600 mb-3">Acciones Rápidas</h3>
          
          <div className="space-y-3">
            
            {/* <-- CAMBIO 8: Actualizar el onClick del botón Fixer Wallet --> */}
            <button
              onClick={() => router.push(`/payment/pages/FixerWallet?fixerId=${fixerData.fixerId}`)}
              disabled={!fixerData?.fixerId} // Deshabilitar si no hay fixerId
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group disabled:opacity-50"
            >
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Wallet className="text-blue-600" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-gray-800 text-base">Fixer Wallet</h4>
                <p className="text-sm text-gray-500">Ver saldo, recargar y revisar movimientos</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
            </button>

            <button 
  // RUTA CORREGIDA: 
  onClick={() => router.push(`/cuenta-bancaria?fixerId=${fixerData.fixerId}`)} 
  disabled={!fixerData?.fixerId} 
  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group disabled:opacity-50"
>
              <div className="bg-cyan-100 p-3 rounded-xl group-hover:bg-cyan-200 transition-colors">
                <Building2 className="text-cyan-600" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-gray-800 text-base">Mi cuenta bancaria</h4>
                <p className="text-sm text-gray-500">Administración de la cuenta bancaria</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-cyan-600 transition-colors" size={24} />
            </button>

            <button 
              onClick={() => router.push('/facturas')} 
              className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
            >
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                <FileText className="text-blue-600" size={28} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-gray-800 text-base">Mis Facturas</h4>
                <p className="text-sm text-gray-500">Ver registro de facturas</p>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
            </button>
          </div>
        </div>

        {error && !fixerData?.isTestData && (
          <div className="pb-6">
            <button
              onClick={() => fetchFixerData(searchParams.get('fixerId') || '')} // Reintentar con el ID de la URL
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reintentar carga
            </button>
          </div>
        )}

      </div> 
    </div>
  );
};

export default CentroDePagos;