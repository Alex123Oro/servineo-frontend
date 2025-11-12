"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentMethodUI from './PaymentMethodUI';
import CardList from './CardList';
import { createCashPayment } from '../service/payments';
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

const RegistroCuentaApp = dynamic(() => import('../../cuenta-bancaria/CuentaBancariaClient'), { ssr: false });

const stripePromise = loadStripe(
  'pk_test_51SIL9sCiQE1vT29jMXy7gnJ1N2VvGHHvLLPyhlVqEWoCGLhsQJXcR4ZtROYiJgiezETeTV2B67cGaoGHuXPJwnCp003Ix0t5oI',
);

interface Trabajo {
  id: number;
  estado: string;
  monto: number;
}

export default function PaymentDemo() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([
    { id: 1, estado: 'Sin Pagar', monto: 500 },
    { id: 2, estado: 'Sin Pagar', monto: 100 },
    { id: 3, estado: 'Sin Pagar', monto: 200 },
  ]);

  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showRegistroCuenta, setShowRegistroCuenta] = useState(false);
  const [bankStatus, setBankStatus] = useState<'SCB' | 'CCB'>('SCB');
  const [selectedTrabajo, setSelectedTrabajo] = useState<Trabajo | null>(null);
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'register' | 'delete'>('register');

  // Datos para pago con tarjeta
  const requesterId = '68ed47b64ed596d659c1ed8f';
  const fixerId = '68ef1be7be38c7f1c3c2c78c';
  const jobId = '68ea51ee0d80087528ad803f';

  useEffect(() => {
    const storedStatus = localStorage.getItem('fix_bank_status');
    if (storedStatus === 'CCB' || storedStatus === 'SCB') {
      setBankStatus(storedStatus);
    }
  }, []);

  // Escuchar cuando se complete un pago QR
  useEffect(() => {
    const handleQRPaymentComplete = (event: unknown | null) => {
      const trabajoId = event.detail?.trabajoId;
      if (trabajoId) {
        actualizarEstadoTrabajo(trabajoId, 'Pagado');
      }
    };

    window.addEventListener('qr-payment-complete', handleQRPaymentComplete);

    // También verificar localStorage al montar el componente
    const lastPaidTrabajo = localStorage.getItem('last-paid-trabajo');
    if (lastPaidTrabajo) {
      actualizarEstadoTrabajo(Number(lastPaidTrabajo), 'Pagado');
      localStorage.removeItem('last-paid-trabajo');
    }

    return () => {
      window.removeEventListener('qr-payment-complete', handleQRPaymentComplete);
    };
  }, []);

  const agregarTrabajo = () => {
    const nuevoId = trabajos.length > 0 ? Math.max(...trabajos.map((t) => t.id)) + 1 : 1;
    const montoAleatorio = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
    setTrabajos(prev => [...prev, { id: nuevoId, estado: 'Sin Pagar', monto: montoAleatorio }]);
  };

  const actualizarEstadoTrabajo = (trabajoId: number, nuevoEstado: string) => {
    setTrabajos(prev =>
      prev.map(trabajo =>
        trabajo.id === trabajoId
          ? { ...trabajo, estado: nuevoEstado }
          : trabajo
      )
    );
  };

  const handlePagar = (trabajo: Trabajo) => {
    setSelectedTrabajo(trabajo);
    setShowPaymentSelector(true);
  };

  const handleSelectPaymentMethod = (method: string) => {
    if (method === 'cash') {
      setShowPaymentSelector(false);
      setShowCashPayment(true);
    } else if (method === 'card') {
      setShowPaymentSelector(false);
      setShowCardPayment(true);
    } else {
      setShowPaymentSelector(false);
    }
  };

  const handleCloseCashPayment = (paymentCompleted?: boolean) => {
    if (paymentCompleted && selectedTrabajo) {
      actualizarEstadoTrabajo(selectedTrabajo.id, 'Pagado');
    }
    setShowCashPayment(false);
    setSelectedTrabajo(null);
    setCreatedPaymentId(null);
  };

  const handleCloseCardPayment = (paymentCompleted?: boolean) => {
    if (paymentCompleted && selectedTrabajo) {
      actualizarEstadoTrabajo(selectedTrabajo.id, 'Pagado');
    }
    setShowCardPayment(false);
    setSelectedTrabajo(null);
  };

  const handleAgregarCuentaBancaria = () => {
    setModalMode('register');
    setShowRegistroCuenta(true);
  };

  const handleEliminarCuentaBancaria = () => {
    setModalMode('delete');
    setShowRegistroCuenta(true);
  };

  const handleCloseRegistroCuenta = () => {
    setShowRegistroCuenta(false);
    const updatedStatus = localStorage.getItem('fix_bank_status');
    if (updatedStatus === 'CCB' || updatedStatus === 'SCB') {
      setBankStatus(updatedStatus);
    }
  };

  if (showRegistroCuenta) {
    return <RegistroCuentaApp onClose={handleCloseRegistroCuenta} mode={modalMode} />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-[#2B31E0] text-[#F9FAFB] px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Demo de pagos</h1>
      </div>

      {/* Buttons Section */}
      <div className="p-6 flex items-center gap-4">
        <button
          onClick={agregarTrabajo}
          className="bg-[#2B31E0] hover:bg-[#2B6AE0] text-[#F9FAFB] px-6 py-3 rounded-lg flex items-center gap-2 text-lg font-medium transition-colors"
        >
          <span className="text-2xl">🔧</span>
          Agregar Trabajo
        </button>
        <button
          onClick={bankStatus === 'SCB' ? handleAgregarCuentaBancaria : handleEliminarCuentaBancaria}
          className="bg-[#2B31E0] hover:bg-[#2B6AE0] text-[#F9FAFB] px-6 py-3 rounded-lg flex items-center gap-2 text-lg font-medium transition-colors"
        >
          <span className="text-2xl">🏦</span>
          {bankStatus === 'SCB' ? 'Agregar cuenta bancaria' : 'Eliminar cuenta bancaria'}
        </button>
        <div className="ml-auto bg-[#2B31E0] text-[#F9FAFB] px-6 py-3 rounded-lg text-lg font-medium">
          Estado: {bankStatus}
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        <table className="w-full border-collapse border-2 border-[#D1D5DB]">
          <thead>
            <tr className="bg-[#2B31E0]">
              <th className="border-2 border-[#D1D5DB] px-4 py-3 text-left text-2xl font-bold text-[#F9FAFB]">
                Nro Trabajo
              </th>
              <th className="border-2 border-[#D1D5DB] px-4 py-3 text-left text-2xl font-bold text-[#F9FAFB]">
                Estado
              </th>
              <th className="border-2 border-[#D1D5DB] px-4 py-3 text-left text-2xl font-bold text-[#F9FAFB]">
                Monto
              </th>
              <th className="border-2 border-[#D1D5DB] px-4 py-3 text-left text-2xl font-bold text-[#F9FAFB]">
                Pagar
              </th>
            </tr>
          </thead>
          <tbody>
            {trabajos.map((trabajo) => (
              <tr key={trabajo.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="border-2 border-[#D1D5DB] px-4 py-4 text-xl text-[#111827]">
                  {trabajo.id}
                </td>
                <td className="border-2 border-[#D1D5DB] px-4 py-4 text-xl text-[#111827]">
                  <span className={`font-semibold ${
                    trabajo.estado === 'Pagado' ? 'text-[#16A34A]' :
                    trabajo.estado === 'Procesando' ? 'text-[#FFC857]' :
                    'text-[#64748B]'
                    }`}>
                    {trabajo.estado}
                  </span>
                </td>
                <td className="border-2 border-[#D1D5DB] px-4 py-4 text-xl text-right text-[#111827]">
                  {trabajo.monto} BOB
                </td>
                <td className="border-2 border-[#D1D5DB] px-4 py-4 text-center">
                  <button
                    onClick={() => handlePagar(trabajo)}
                    disabled={trabajo.estado === 'Pagado'}
                    className={`px-8 py-2 rounded text-lg font-semibold transition-colors ${
                      trabajo.estado === 'Pagado'
                        ? 'bg-[#E5E7EB] text-[#64748B] cursor-not-allowed'
                        : 'bg-[#2BDDE0] hover:bg-[#5E2BE0] text-[#111827]'
                      }`}
                  >
                    {trabajo.estado === 'Pagado' ? 'PAGADO' : 'PAGAR'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selector */}
      {showPaymentSelector && (
        <PaymentMethodSelector
          onSelectMethod={handleSelectPaymentMethod}
          onClose={() => setShowPaymentSelector(false)}
          trabajo={selectedTrabajo}
          onAfterPostCash={() => {
            setShowPaymentSelector(false);
            setShowCashPayment(true);
          }}
          setCreatedPaymentId={setCreatedPaymentId}
        />
      )}

      {/* Cash Payment Modal */}
      {showCashPayment && (
        <PaymentMethodUI
          paymentId={createdPaymentId}
          onClose={handleCloseCashPayment}
        />
      )}

      {/* Card Payment Modal */}
      {showCardPayment && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => handleCloseCardPayment(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-3xl font-bold transition-colors"
            >
              ✕
            </button>

            <Elements stripe={stripePromise}>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-[#111827] mb-6">
                  Selecciona tu tarjeta o agrega una nueva
                </h2>

                <CardList
                  requesterId={requesterId}
                  fixerId={fixerId}
                  jobId={jobId}
                  amount={selectedTrabajo?.monto || 0}
                  onPaymentSuccess={() => handleCloseCardPayment(true)}
                />
              </div>
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}

interface PaymentMethodSelectorProps {
  onSelectMethod: (m: string) => void;
  onClose: () => void;
  trabajo: Trabajo | null; 
  onAfterPostCash?: () => void;
  setCreatedPaymentId: (id: string) => void;
}

function PaymentMethodSelector({
  onSelectMethod,
  onClose,
  trabajo,
  onAfterPostCash,
  setCreatedPaymentId,
}: PaymentMethodSelectorProps) { 
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const router = useRouter();

  // Pasar trabajoId y monto a la URL del QR
  const goToQR = () => {
    const trabajoId = trabajo?.id ?? 1;
    const bookingId = `TRABAJO-${trabajoId}`;
    const providerId = "DEMO-PROVIDER";
    const amount = Number(trabajo?.monto ?? 0);
    const currency = "BOB";

    console.log("🔵 Redirigiendo a QR con:", { trabajoId, bookingId, amount });

    onClose();
    router.push(`/payment/qr?trabajoId=${trabajoId}&bookingId=${bookingId}&providerId=${providerId}&amount=${amount}&currency=${currency}`);
  };

  const handlePayCash = async () => {
    setErr(null);
    setOkMsg(null);
    setLoading(true);
    try {
      const payload = {
        jobId: "66fabc1234567890abc12345",
        payerId: "66fdef1234567890abc12345",
        subTotal: Number(trabajo?.monto || 0),
        service_fee: 0,
        discount: 0,
        currency: "BOB",
        paymentMethod: "Efectivo",
      };
      const resp = await createCashPayment(payload);
      const created: unknown | null = resp?.data || resp?.payment || resp;
      const newId: unknown | null = created?._id;
      if (!newId) throw new Error('No llegó _id del pago creado');

      setCreatedPaymentId(newId);
      setOkMsg('✅ Pago creado');
      onAfterPostCash?.();
    } catch (e: unknown | null) { 
      console.error(e);
      setErr(e.message ?? 'Error al crear el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-[#F9FAFB] w-full max-w-3xl mx-4 rounded-lg shadow-xl">
        <div className="bg-[#2B31E0] text-[#F9FAFB] px-6 py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">Demo de pagos Servineo</h2>
        </div>

        <div className="p-12">
          <h3 className="text-3xl font-semibold text-center mb-12 text-[#111827]">
            Seleccione su método de pago preferido
          </h3>

          <div className="space-y-6 max-w-xl mx-auto">
            <button
              onClick={() => onSelectMethod('card')}
              className="w-full bg-[#1AA7ED] hover:bg-[#2B6AE0] text-[#F9FAFB] px-8 py-4 rounded-lg flex items-center gap-4 text-2xl font-medium transition-colors"
            >
              <span className="text-3xl">💳</span>
              Tarjeta de Crédito
            </button>

            <button
              onClick={goToQR}
              className="w-full bg-[#1AA7ED] hover:bg-[#2B6AE0] text-[#F9FAFB] px-8 py-4 rounded-lg flex items-center gap-4 text-2xl font-medium transition-colors"
            >
              <span className="text-3xl">⊞</span>
              Pago QR
            </button>

            <button
              onClick={handlePayCash}
              disabled={loading}
              className="w-full bg-[#1AA7ED] hover:bg-[#2B6AE0] disabled:opacity-60 text-[#F9FAFB] px-8 py-4 rounded-lg flex items-center gap-4 text-2xl font-medium transition-colors"
            >
              <span className="text-3xl">💵</span>
              {loading ? 'Creando…' : 'Pago Efectivo'}
            </button>

            {err && <p className="text-[#EF4444] text-center font-medium">{err}</p>}
            {okMsg && <p className="text-[#16A34A] text-center font-medium">{okMsg}</p>}
          </div>

          <div className="flex justify-end mt-12">
            <button
              onClick={onClose}
              className="bg-[#2BDDE0] hover:bg-[#5E2BE0] text-[#111827] px-12 py-3 rounded-lg text-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}