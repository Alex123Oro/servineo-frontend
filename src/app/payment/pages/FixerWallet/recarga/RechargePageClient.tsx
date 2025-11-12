// src/app/payment/FixerWallet/recharge/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, QrCode, Building2, ArrowLeft } from 'lucide-react';

export default function FixerWalletRecharge() {
  const [amount, setAmount] = useState('0.00');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [receivedFixerId, setReceivedFixerId] = useState<string | null>(null);

  useEffect(() => {
    // <-- Lee el fixerId de la URL para saber a quién recargar
    const fixerId = searchParams.get('fixerId');
    if (fixerId) {
      setReceivedFixerId(fixerId);
      console.log("Fixer ID Recibido en Recarga:", fixerId);
    }
  }, [searchParams]);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toFixed(2));
  };

  // Pantalla 2: Recargar Saldo
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-4">
        {/* Botón para volver atrás */}
        <button onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Recargar Saldo</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Monto */}
        <div>
          <label className="block text-gray-900 font-semibold text-lg mb-2">
            Monto a recargar (Bs.)
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-2xl font-semibold focus:border-blue-500 focus:outline-none"
            placeholder="0.00"
          />
        </div>

        {/* Montos rápidos */}
        <div className="grid grid-cols-4 gap-3">
          {[20, 50, 100, 200].map((value) => (
            <button
              key={value}
              onClick={() => handleQuickAmount(value)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-3 rounded-lg font-bold text-xl transition-colors"
            >
              {value}
            </button>
          ))}
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-gray-900 font-semibold text-lg mb-3">
            Metodo de Pago
          </label>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedMethod('card')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedMethod === 'card'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <CreditCard size={28} className="text-gray-700" />
              <span className="text-lg font-semibold text-gray-900">Tarjeta de Credito</span>
            </button>

            <button
              onClick={() => setSelectedMethod('qr')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedMethod === 'qr'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <QrCode size={28} className="text-gray-700" />
              <span className="text-lg font-semibold text-gray-900">Pago QR</span>
            </button>

            <button
              onClick={() => setSelectedMethod('transfer')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedMethod === 'transfer'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <Building2 size={28} className="text-gray-700" />
              <span className="text-lg font-semibold text-gray-900">Transferencia Bancaria</span>
            </button>
          </div>
        </div>

        {/* Botón Volver */}
        <button
          onClick={() => router.back()}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-bold text-lg transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
}