"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

// --- Tus datos de MOCK (con más variedad para filtrar) ---
const MOCK_FIXER_DATA = {
  wallet: { balance: 13.00, currency: "BOB" },
  allTransactions: [
    { _id: "1", type: "deposit", amount: 50.00, description: "Recarga con Tarjeta", method: "Recarga con Tarjeta", createdAt: "2025-10-25", status: "completed" },
    { _id: "2", type: "commission", amount: -2.50, description: "Comision - Trabajo #1234 (Efectivo)", jobId: "1234", createdAt: "2025-10-24", status: "completed" },
    { _id: "3", type: "commission", amount: -3.75, description: "Comision - Trabajo #1228 (Efectivo)", jobId: "1228", createdAt: "2025-10-23", status: "completed" },
    { _id: "4", type: "deposit", amount: 50.00, description: "Recarga con QR", method: "Recarga con QR", createdAt: "2025-10-23", status: "completed" },
    { _id: "5", type: "deposit", amount: 75.00, description: "Recarga con QR", method: "Recarga con QR", createdAt: "2025-10-22", status: "completed" },
    { _id: "6", type: "deposit", amount: 30.00, description: "Recarga con Tarjeta", method: "Recarga con Tarjeta", createdAt: "2025-10-15", status: "completed" }
  ]
};
// --- Fin de Mocks ---

// Tipado para una transacción (basado en el mock)
interface Transaction {
  _id: string;
  type: 'deposit' | 'commission' | string; // 'deposit' = Recarga, 'commission' = Comisión
  amount: number;
  description: string;
  method?: string;
  createdAt: string; // Formato YYYY-MM-DD
  jobId?: string;
  status: string;
}

// Tipado para los filtros (con 'type' como array)
interface FilterSettings {
  fromDate: string;
  toDate: string;
  type: string[]; // <-- AHORA ES UN ARRAY DE STRINGS
}

export default function FixerWalletHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);

  // --- Estados para la Lógica de Filtros ---
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  
  // Estado para guardar TODOS los movimientos (la fuente "real")
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(MOCK_FIXER_DATA.allTransactions);
  // Estado para los movimientos que se MUESTRAN en la UI
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(MOCK_FIXER_DATA.allTransactions);
  
  // Estado para los filtros seleccionados
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    fromDate: '',
    toDate: '',
    type: [], // <-- AHORA INICIA COMO ARRAY VACÍO
  });

  // --- Fin de Estados de Filtros ---

  // Aquí cargarías los datos del Fixer usando el ID
  const [walletData, setWalletData] = useState(MOCK_FIXER_DATA.wallet);

  useEffect(() => {
    const fixerId = searchParams.get('fixerId');
    if (fixerId) {
      setReceivedFixerId(fixerId);
      console.log("Fixer ID Recibido en Historial:", fixerId);
      // --- FUTURO: Carga de Datos Reales ---
      // fetchHistoryData(fixerId).then(data => {
      //   setAllTransactions(data.allTransactions);
      //   setFilteredTransactions(data.allTransactions);
      //   setWalletData(data.wallet);
      // });
    }
  }, [searchParams]);

  // --- EFECTO PARA APLICAR FILTROS (ACTUALIZADO) ---
  useEffect(() => {
    let tempTxs = [...allTransactions];

    // 1. Filtrar por Tipo (MODIFICADO PARA MANEJAR ARRAY)
    // Si hay tipos seleccionados (ej. ['deposit'] o ['commission'] o ['deposit', 'commission'])
    if (filterSettings.type.length > 0) {
      tempTxs = tempTxs.filter(tx => filterSettings.type.includes(tx.type));
    }
    // Si el array 'type' está vacío, no se aplica filtro de tipo (se muestran todos)

    // 2. Filtrar por Fecha "Desde"
    if (filterSettings.fromDate) {
      try {
        const from = new Date(filterSettings.fromDate + 'T00:00:00'); // Asume hora local
        tempTxs = tempTxs.filter(tx => new Date(tx.createdAt) >= from);
      } catch (e) { console.error("Fecha 'desde' inválida:", filterSettings.fromDate); }
    }

    // 3. Filtrar por Fecha "Hasta"
    if (filterSettings.toDate) {
      try {
        const to = new Date(filterSettings.toDate + 'T23:59:59'); // Incluye todo el día
        tempTxs = tempTxs.filter(tx => new Date(tx.createdAt) <= to);
      } catch (e) { console.error("Fecha 'hasta' inválida:", filterSettings.toDate); }
    }

    setFilteredTransactions(tempTxs);
  }, [filterSettings, allTransactions]);
  // --- FIN DEL EFECTO ---

  // Función que se llama desde el Modal
  const handleApplyFilter = (newFilters: FilterSettings) => {
    setFilterSettings(newFilters);
    // Un filtro se considera "aplicado" si tiene fechas o tipos seleccionados
    const active = newFilters.fromDate !== '' || newFilters.toDate !== '' || newFilters.type.length > 0;
    setIsFiltered(active);
    setShowFilterModal(false);
  };

  // Función para el botón "Eliminar Filtro"
  const clearFilter = () => {
    setFilterSettings({ fromDate: '', toDate: '', type: [] }); // <-- RESETEA A ARRAY VACÍO
    setIsFiltered(false);
  };

  const formatCurrency = (value: number) => {
    return `Bs. ${Math.abs(value).toFixed(2)}`;
  };

  // Pantalla 3: Historial Completo
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Historial de Movimientos</h1>
        </div>

        {/* Balance Card (como en el mockup) */}
        <div className="p-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Saldo Actual</p>
              <p className="text-blue-600 text-3xl font-bold">
                Bs. {walletData.balance.toFixed(2)}
              </p>
            </div>
            <Wallet size={32} className="text-blue-600 opacity-70" />
          </div>
        </div>

        {/* Todos los movimientos */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-700 font-semibold text-lg">Todos los Movimientos</h2>
            
            {/* --- BOTÓN DE FILTRO DINÁMICO --- */}
            {isFiltered ? (
              <button
                onClick={clearFilter}
                className="text-red-500 font-semibold text-sm"
              >
                Eliminar Filtro
              </button>
            ) : (
              <button
                onClick={() => setShowFilterModal(true)}
                className="text-blue-600 font-semibold text-sm"
              >
                Añadir Filtro
              </button>
            )}
          </div>
          
          {/* --- LISTA FILTRADA --- */}
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div key={tx._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.amount > 0 ? (
                      <TrendingUp className="text-green-600" size={20} />
                    ) : (
                      <TrendingDown className="text-red-600" size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {tx.type === 'deposit' ? tx.method : tx.description}
                    </p>
                    <p className="text-sm text-gray-500">{tx.createdAt}</p>
                  </div>
                  <p className={`font-bold text-lg whitespace-nowrap ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <p>No se encontraron movimientos que coincidan con su filtro.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DE FILTRO --- */}
      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilter}
          currentFilters={filterSettings}
        />
      )}
    </>
  );
}


// ===================================================================
// --- Componente del Modal de Filtro (ACTUALIZADO) ---
// ===================================================================
interface FilterModalProps {
  onClose: () => void;
  onApply: (settings: FilterSettings) => void;
  currentFilters: FilterSettings;
}

function FilterModal({ onClose, onApply, currentFilters }: FilterModalProps) {
  // Estado interno del modal
  const [fromDate, setFromDate] = useState(currentFilters.fromDate);
  const [toDate, setToDate] = useState(currentFilters.toDate);
  
  // --- CAMBIO: Estado para almacenar los tipos seleccionados (checkboxes) ---
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentFilters.type);
  
  // Estado para el error de fecha
  const [dateError, setDateError] = useState<string | null>(null);

  const handleSubmit = () => {
    // Validación de Fechas
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setDateError("La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.");
      return; // Detiene la ejecución
    }
    
    // Si pasa la validación, limpia el error y aplica
    setDateError(null);
    onApply({ fromDate, toDate, type: selectedTypes }); // <-- CAMBIO: Pasa selectedTypes
  };
  
  // Limpia el error cuando el usuario cambia una fecha
  const handleDateChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setDateError(null); 
  };

  // --- NUEVA FUNCIÓN: Manejar cambio de checkbox ---
  const handleTypeChange = (value: string) => {
    setSelectedTypes(prev => 
      prev.includes(value)
        ? prev.filter(type => type !== value) // Desmarcar
        : [...prev, value] // Marcar
    );
  };

  return (
    // Fondo oscuro
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      
      {/* Contenedor del Modal (con overflow-hidden para bordes redondeados) */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative overflow-hidden">
        
        {/* --- NUEVO: Header azul del Modal --- */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Añadir Filtro</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6"> {/* Padding para el contenido */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            Seleccione los campos para que se añada un filtro
          </h2>
          
          <div className="space-y-5">
            {/* Fila "Desde" */}
            <div className="flex items-center gap-4">
              <label htmlFor="fromDate" className="w-16 font-semibold text-gray-700">Desde</label>
              <div className="relative flex-1">
                <input 
                  id="fromDate"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={fromDate}
                  onChange={(e) => handleDateChange(setFromDate, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Fila "Hasta" */}
            <div className="flex items-center gap-4">
              <label htmlFor="toDate" className="w-16 font-semibold text-gray-700">Hasta</label>
              <div className="relative flex-1">
                <input 
                  id="toDate"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={toDate}
                  onChange={(e) => handleDateChange(setToDate, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* --- CAMBIO: Checkboxes para "Incluir" --- */}
            <div className="flex items-start gap-4">
              <label className="w-16 font-semibold text-gray-700 pt-2">Incluir</label>
              <div className="flex-1 flex flex-col gap-2 pt-2">
                {/* Checkbox Recargas */}
                <label htmlFor="filter-recargas" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="filter-recargas" 
                    value="deposit"
                    checked={selectedTypes.includes('deposit')}
                    onChange={() => handleTypeChange('deposit')}
                    className="w-5 h-5 accent-blue-600 rounded"
                  />
                  <span className="font-medium text-gray-700">Recargas</span>
                </label>
                {/* Checkbox Comisiones */}
                <label htmlFor="filter-comisiones" className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="filter-comisiones" 
                    value="commission"
                    checked={selectedTypes.includes('commission')}
                    onChange={() => handleTypeChange('commission')}
                    className="w-5 h-5 accent-blue-600 rounded"
                  />
                  <span className="font-medium text-gray-700">Comisiones</span>
                </label>
              </div>
            </div>

            {/* Mensaje de Error de Fecha */}
            {dateError && (
              <p className="text-red-500 text-sm text-center font-medium">
                {dateError}
              </p>
            )}
            
            {/* --- CAMBIO: Botones de Acción (Orden nuevo) --- */}
            <div className="flex items-center justify-between gap-4 pt-4"> 
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Añadir Filtro
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}