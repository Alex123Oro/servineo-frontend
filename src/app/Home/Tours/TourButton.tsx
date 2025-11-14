'use client';

import React from 'react';
import { TourButtonProps } from './types';

const TourButton: React.FC<TourButtonProps> = ({ onRestart }) => {
  return (
    <button
      onClick={onRestart}
      className="fixed bottom-5 right-5 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
    >
      Reiniciar Tour
    </button>
  );
};

export default TourButton;
