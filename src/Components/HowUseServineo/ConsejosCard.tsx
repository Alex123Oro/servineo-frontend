import React from 'react';

interface ConsejosCardProps {
  title: string;
  imageUrl: string;
  descripcion: string;
}

export const ConsejosCard = ({ title, imageUrl, descripcion }: ConsejosCardProps) => {
  return (
    <div className='flex flex-col items-center text-center gap-[15px]'>
      <div className='flex flex-col items-center gap-[15px]'>
        <strong className='text-xl font-bold text-gray-800'> {title} </strong>

        {/* SOLUCIÓN APLICADA: <img> nativo en lugar de <Image /> */}
        <img
          className='rounded-lg w-60 h-45 object-cover'
          src={imageUrl}
          alt={`Imagen ilustrativa de ${title}`}
          loading='lazy'
          decoding='async'
        />

        <p className='opacity-[80%] text-gray-600 leading-relaxed'> {descripcion} </p>
      </div>
    </div>
  );
};
