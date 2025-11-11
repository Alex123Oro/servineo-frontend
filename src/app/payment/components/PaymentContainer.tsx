"use client"

import React, { useState } from 'react';

import PaymentDemo from './PaymentDemo';
import PaymentMethodUI from './PaymentMethodUI';

const PaymentContainer = () => {
  const [currentStep, setCurrentStep] = useState('select');

  const handleSelectMethod = (method) => {
    setCurrentStep(method);
  };

  const handleBack = () => {
    setCurrentStep('select');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      
      {/* Renderizar componente según el paso actual */}
      {currentStep === 'select' && (
        <PaymentDemo onSelectMethod={handleSelectMethod} />
      )}
      
     {/* {currentStep === 'card' && (
        <CardPayment onBack={handleBack} />
      )}
      
      {currentStep === 'qr' && (
        <QRPayment onBack={handleBack} />
      )}*/}

      {currentStep === 'cash' && (
        <PaymentMethodUI onBack={handleBack} />
      )}
    </div>
  );
};

export default PaymentContainer;