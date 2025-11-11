'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { ChangeEvent } from 'react';

const DEMO_FIXER_ID = '65f3f23f4a6b9645f0c98765';
const API_BASE_URL = '/api';

type PathSetter = (path: string) => void;

const PaymentSuccessPage = ({ onCloseAll }: { onCloseAll?: () => void }) => {
  const [statusMessage, setStatusMessage] = useState('Cuenta bancaria registrada exitosamente.');

  useEffect(() => {
    const msg = localStorage.getItem('statusMessage');
    if (msg) {
      setStatusMessage(msg);
      localStorage.removeItem('statusMessage');
    }
  }, []);

  const handleBackToPaymentsDemo = () => {
    if (onCloseAll) {
      onCloseAll();
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="max-w-xl mx-auto p-8 space-y-6 text-center bg-white rounded-xl shadow-2xl">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-3xl font-bold text-gray-800">¡Registro Exitoso!</h2>
        <p className="text-lg text-gray-600">
          Tu cuenta bancaria ha sido registrada en la base de datos con el ID temporal:{' '}
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{DEMO_FIXER_ID}</span>.
        </p>
        <div className="p-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm">
          {statusMessage || 'Redirigiendo al Demo de Pagos...'}
        </div>
        <button
          onClick={handleBackToPaymentsDemo}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md hover:shadow-lg"
        >
          Continuar al Demo de Pagos
        </button>
      </div>
    </div>
  );
};

const RegistrationForm = ({ 
    pathSetter, 
    onCloseAll, 
    mode = 'register'
}: { 
    pathSetter: PathSetter; 
    onCloseAll?: () => void;
    mode?: 'register' | 'delete'
}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    nombreTitular: '',
    identificacion: '',
    numeroCuenta: '',
  });

  const [formData, setFormData] = useState({
    nombreTitular: '', 
    identificacion: '', 
    identificationSuffix: '',
    tipoCuenta: 'Cuenta de Ahorros',
    numeroCuenta: '', 
    banco: 'Banco Nacional de Bolivia',
  });

  const handleGoBack = () => {
    if (onCloseAll) {
      onCloseAll();
    }
  };
    
  const isNumeric = (str: string) => /^\d+$/.test(str);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue = value;

    if (name === 'nombreTitular') {
        const filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        const rawValue = filteredValue.toLowerCase();
        processedValue = rawValue.replace(/(^|\s)\S/g, (char) => char.toUpperCase());
    } 
    else if (name === 'identificationSuffix') {
        const letters = (value.match(/[a-zA-Z]/g) || []).length;
        const numbers = (value.match(/[0-9]/g) || []).length;
        
        if (letters > 1 || numbers > 1) {
            return; 
        }
    }

    if (name !== 'identificationSuffix' && name !== 'banco' && name !== 'tipoCuenta') {
      validateField(name, name === 'nombreTitular' ? processedValue : value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nombreTitular' ? processedValue : (type === 'checkbox' ? checked : value),
    }));
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    const literalValue = value;

    switch (name) {
      case 'nombreTitular':
        const cleanValue = literalValue.trim().replace(/\s+/g, ' '); 
        const wordCount = (cleanValue.match(/\s/g) || []).length + 1;
        
        if (/\s\s+/.test(literalValue)) {
          error = 'No puedes escribir dos o más espacios seguidos entre palabras.';
        } else if (literalValue.length > 0 && / $/.test(literalValue)) {
          error = 'No se permite espacio al final del nombre.';
        } else if (literalValue.length > 0 && /^ /.test(literalValue)) {
          error = 'No se permite espacio al inicio del nombre.';
        }

        if (literalValue.length < 1 && !error) {
            error = ''; 
        } 
        else if (!error) {
          if (cleanValue.length < 7 || cleanValue.length > 50) {
            error = `Longitud: 7-50 caracteres. (Palabras: ${wordCount})`;
          } else if (wordCount < 2) {
            error = 'Se requieren al menos 2 palabras (Nombre y Apellido).';
          } else if (wordCount > 4) {
            error = 'Máximo 4 palabras permitidas.';
          } else if (!/[aeiouAEIOUáéíóúÁÉÍÓÚ]/.test(cleanValue)) {
            error = 'El nombre debe contener al menos una vocal.';
          }
        }
        break;

      case 'identificacion':
        if (literalValue.length > 0 && (!isNumeric(literalValue) || literalValue.length < 7 || literalValue.length > 8)) {
          error = 'Debe ser de 7 a 8 dígitos numéricos.';
        }
        break;

      case 'numeroCuenta':
        if (literalValue.length > 0 && (!isNumeric(literalValue) || literalValue.length < 10 || literalValue.length > 14)) {
          error = 'Debe ser de 10 a 14 dígitos numéricos.';
        }
        break;
    }

    setFieldErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  useEffect(() => {
    if (localStorage.getItem('fix_bank_status') === 'CCB') {
      setAlreadyRegistered(true);
    }
  }, []);
  
  const handleDelete = async () => {
    setLoading(true);
    setDeleteError(null);
    try {
        const response = await fetch(`${API_BASE_URL}/bank-accounts/${DEMO_FIXER_ID}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Fallo al eliminar (Status: ${response.status})`);
        }

        localStorage.setItem('fix_bank_status', 'SCB');
        localStorage.setItem('statusMessage', 'Cuenta bancaria eliminada exitosamente. Vuelve a registrar una cuenta.');
        alert('Cuenta bancaria eliminada exitosamente.'); 
        
        if (onCloseAll) {
            onCloseAll();
        }

    } catch (error: unknown | null) {
        console.error('Error al eliminar la cuenta:', error);
        setDeleteError(`Error al eliminar la cuenta: ${error.message || 'Error desconocido.'}`);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const nombre = formData.nombreTitular;
    
    if (/\s\s+/.test(nombre)) {
        setFormError('El Nombre del titular no puede tener dos o más espacios seguidos.');
        return;
    }
    if (/ $/.test(nombre)) {
        setFormError('El Nombre del titular no puede terminar con un espacio.');
        return;
    }
    if (/^ /.test(nombre)) {
        setFormError('El Nombre del titular no puede empezar con un espacio.');
        return;
    }
    
    const cleanNombre = nombre.trim().replace(/\s+/g, ' '); 
    const nombreWordCount = (cleanNombre.match(/\s/g) || []).length + 1;
    
    if (cleanNombre.length < 7 || cleanNombre.length > 50 || nombreWordCount < 2 || nombreWordCount > 4 || !/[aeiouAEIOUáéíóúÁÉÍÓÚ]/.test(cleanNombre)) {
        setFormError('Por favor, verifica el Nombre completo del titular. Debe tener 2-4 palabras, 7-50 caracteres y contener vocales.');
        return; 
    }

    const ci = formData.identificacion.trim();
    if (ci.length < 7 || ci.length > 8 || !isNumeric(ci)) {
      setFormError('El CI debe contener entre 7 y 8 dígitos numéricos.');
      return;
    }

    const suffix = formData.identificationSuffix.trim().toUpperCase();
    if (suffix) { 
        const regexValidSuffix = /^([A-Z]\d|\d[A-Z])$/; 

        if (suffix.length !== 2 || !regexValidSuffix.test(suffix)) {
            setFormError('El Sufijo debe contener exactamente 2 caracteres: una letra y un número, sin caracteres especiales. (Ej: 9L o L9).');
            return;
        }
    }

    const accountNumber = formData.numeroCuenta.trim();
    if (accountNumber.length < 10 || accountNumber.length > 14 || !isNumeric(accountNumber)) {
      setFormError('El Número de Cuenta debe contener entre 10 y 14 dígitos numéricos.');
      return;
    }

    setLoading(true);

    const dataToSend = {
      fixerId: DEMO_FIXER_ID,
      accountNumber: formData.numeroCuenta,
      bankName: formData.banco,
      nameFixer: cleanNombre,
      accountType: formData.tipoCuenta,
      identification:
        formData.identificacion +
        (formData.identificationSuffix ? '-' + formData.identificationSuffix.toUpperCase() : ''),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bank-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Fallo en el registro (Status: ${response.status})`);
      }

      localStorage.setItem('fix_bank_status', 'CCB');
      localStorage.setItem('statusMessage', 'Cuenta bancaria registrada exitosamente.');
      pathSetter('/agregarCuenta/payment');
    } catch (error: unknown | null) {
      console.error('Error en el flujo de registro:', error?.message);
      const displayError =
        error?.message?.includes('duplicado') || error?.message?.includes('Duplicate account number')
          ? 'El número de cuenta bancaria ya ha sido registrado. Por favor, verifica tus datos.'
          : `Error al procesar la solicitud: ${error?.message || 'Error desconocido'}`;
      setFormError(displayError);
    } finally {
      setLoading(false);
    }
  };
  
  if (mode === 'delete' && localStorage.getItem('fix_bank_status') === 'CCB') {
    return (
        <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
            <div className="max-w-xl mx-auto p-8 space-y-6 text-center bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-red-600">
                    ¿Eliminar Cuenta Bancaria?
                </h2>
                <p className="text-lg text-gray-600">
                    Esta acción eliminará la cuenta asociada al ID: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{DEMO_FIXER_ID}</span>.
                    <br/> Tu estado de cuenta volverá a Sin Cuenta Bancaria (SCB).
                </p>
                {deleteError && (
                     <div className="p-3 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm">
                         {deleteError}
                     </div>
                )}
                
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleGoBack}
                        disabled={loading}
                        className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete} 
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md"
                    >
                        {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
                    </button>
                </div>
            </div>
        </div>
    );
  }
  
  if (alreadyRegistered && mode === 'register') {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
        <div className="max-w-xl mx-auto p-6 space-y-4 text-center bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            ¡Ya tienes una cuenta registrada (Simulación)!
          </h2>
          <p className="text-gray-700 mb-6">
            El registro de la cuenta se completó anteriormente. Puedes continuar con el demo de
            pagos.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-150 shadow-md hover:shadow-lg"
          >
            Ir al Demo de Pagos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col font-sans">
      <header className="px-6 py-4 flex items-center justify-between shadow-lg bg-blue-700">
        <button
          onClick={handleGoBack}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-150 shadow-md"
        >
          &larr; Volver a Demo de Pagos
        </button>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-3 text-gray-800 border-b pb-2">
            Registro de cuenta bancaria
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Por favor, completa el registro de la cuenta bancaria.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label
                htmlFor="nombreTitular"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre completo del titular
                {(formData.nombreTitular.trim().length === 0 || fieldErrors.nombreTitular) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                name="nombreTitular"
                id="nombreTitular"
                value={formData.nombreTitular}
                onChange={handleChange}
                placeholder="Nombre Apellido Apellido"
                className={`w-full border p-2.5 rounded-lg focus:ring-4 focus:ring-blue-100 transition-colors text-gray-900 
                    ${fieldErrors.nombreTitular ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                required
                onKeyPress={(e) => {
                  const char = e.key;
                  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(char) && char !== ' ' && char !== 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
              {fieldErrors.nombreTitular && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.nombreTitular}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificación (CI)
                {(formData.identificacion.trim().length === 0 || fieldErrors.identificacion) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="identificacion"
                  id="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  placeholder="7 a 8 dígitos"
                  maxLength={8}
                  className="flex-grow border border-gray-300 p-2.5 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors text-gray-900"
                  required
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <input
                  type="text"
                  name="identificationSuffix"
                  id="identificationSuffix"
                  value={formData.identificationSuffix}
                  onChange={handleChange}
                  placeholder="Sufijo (Ej: 9L o L9)"
                  maxLength={2} 
                  className="w-1/4 border border-gray-300 p-2.5 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 uppercase text-center transition-colors text-gray-900"
                  onKeyPress={(e) => {
                    const char = e.key;
                    const currentValue = e.currentTarget.value.toUpperCase();
                    const isLetter = /[a-zA-Z]/.test(char);
                    const isNumber = /[0-9]/.test(char);

                    if (!isLetter && !isNumber) {
                      e.preventDefault();
                      return;
                    }
                    
                    const currentLetters = (currentValue.match(/[A-Z]/g) || []).length;
                    const currentNumbers = (currentValue.match(/[0-9]/g) || []).length;

                    if (isLetter && currentLetters >= 1) {
                      e.preventDefault();
                      return;
                    }

                    if (isNumber && currentNumbers >= 1) {
                      e.preventDefault();
                      return;
                    }
                  }}
                />
              </div>
              {fieldErrors.identificacion && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.identificacion}</p>
              )}
            </div>

            <div>
              <label htmlFor="tipoCuenta" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de cuenta
              </label>
              <select
                name="tipoCuenta"
                id="tipoCuenta"
                value={formData.tipoCuenta}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors appearance-none text-gray-900"
                required
              >
                <option>Cuenta de Ahorros</option>
                <option>Cuenta Corriente</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="numeroCuenta"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de cuenta (Solo números)
                {(formData.numeroCuenta.trim().length === 0 || fieldErrors.numeroCuenta) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                name="numeroCuenta"
                id="numeroCuenta"
                value={formData.numeroCuenta}
                onChange={handleChange}
                placeholder="10 a 14 dígitos"
                maxLength={14}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors text-gray-900"
                required
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {fieldErrors.numeroCuenta && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.numeroCuenta}</p>
              )}
            </div>

            <div>
              <label htmlFor="banco" className="block text-sm font-medium text-gray-700 mb-1">
                Banco
              </label>
              <select
                name="banco"
                id="banco"
                value={formData.banco}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-colors appearance-none text-gray-900"
                required
              >
                <option>Banco Nacional de Bolivia</option>
                <option>Banco Mercantil Santa Cruz</option>
                <option>Banco de Crédito de Bolivia</option>
                <option>Banco Económico</option>
                <option>Banco Ganadero</option>
                <option>Banco Solidario</option>
                <option>Banco FIE</option>
                <option>Banco Fortaleza</option>
                <option>Banco BISA</option>
                <option>Banco Unión</option>
              </select>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-400 text-red-700 rounded-lg text-sm transition-all duration-300">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg mt-6 transition duration-150 ease-in-out shadow-lg 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Guardando...
                </span>
              ) : (
                'Guardar cuenta'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = ({ onClose, mode = 'register' }: { onClose?: () => void; mode?: 'register' | 'delete' }) => { 
  const [path, setPath] = useState('/agregarCuenta');

  const renderContent = () => {
    switch (path) {
      case '/agregarCuenta/payment':
        return <PaymentSuccessPage onCloseAll={onClose} />;
      case '/agregarCuenta':
      default:
        return <RegistrationForm pathSetter={setPath} onCloseAll={onClose} mode={mode} />;
    }
  };

  return <div style={{ fontFamily: 'Inter, sans-serif' }}>{renderContent()}</div>;
};

export default App;