// src/app/payment/FixerWallet/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

// --- Tus datos de MOCK (los moveremos a un fetch real después) ---
const MOCK_FIXER_DATA = {
  wallet: { balance: 13.00, currency: "BOB" },
  recentTransactions: [
    { _id: "1", type: "deposit", amount: 50.00, description: "Recargar con Tarjeta", createdAt: "2025-10-25" },
    { _id: "2", type: "commission", amount: -2.50, description: "Comision - Trabajo #1234 (Efectivo)", jobId: "1234", createdAt: "2025-10-24" },
    { _id: "3", type: "commission", amount: -3.75, description: "Comision - Trabajo #1228 (Efectivo)", jobId: "1228", createdAt: "2025-10-23" }
  ]
};
// --- Fin de Mocks ---

export default function FixerWalletDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);
  
  // Aquí cargarías los datos del Fixer usando el ID
  const [walletData, setWalletData] = useState(MOCK_FIXER_DATA);

  useEffect(() => {
    // <-- ¡NUEVA LÓGICA! Lee el fixerId de la URL
    const fixerId = searchParams.get('fixerId');
    if (fixerId) {
      setReceivedFixerId(fixerId);
      console.log("Fixer ID Recibido en Wallet:", fixerId);
    } else {
      console.warn("No se recibió fixerId en la URL.");
    }
  }, [searchParams]);

  const formatCurrency = (value: number) => {
    return `Bs. ${Math.abs(value).toFixed(2)}`;
  };

  // Pantalla 1: Wallet Principal
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">Fixer Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="p-6">
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={20} />
            <span className="text-sm opacity-90">Saldo Actual</span>
          </div>
          <div className="text-5xl font-bold mb-6">
            Bs. {walletData.wallet.balance.toFixed(2)}
          </div>
          
          {/* CAMBIO: Botón ahora es un Link a la página de recarga */}
          <Link
            href={`/payment/pages/FixerWallet/recarga?fixerId=${receivedFixerId}`}
            className="w-full block text-center bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Recargar Saldo
          </Link>
        </div>
      </div>

      {/* Movimientos Recientes */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-600 font-semibold text-lg">Movientos Recientes</h2>
          
          {/* CAMBIO: Botón ahora es un Link a la página de historial */}
          <Link
            href={`/payment/pages/FixerWallet/historial?fixerId=${receivedFixerId}`}
            className="text-blue-600 font-semibold"
          >
            Ver todo
          </Link>
        </div>

        <div className="space-y-3">
          {walletData.recentTransactions.map((tx) => (
            <div key={tx._id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {tx.amount > 0 ? (
                  <TrendingUp className="text-green-600" size={24} />
                ) : (
                  <TrendingDown className="text-red-600" size={24} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{tx.description}</p>
                <p className="text-sm text-gray-500">{tx.createdAt}</p>
              </div>
              <div className={`font-bold text-lg ${
                tx.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {tx.amount > 0 ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}