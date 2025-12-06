import React from 'react';

interface Props {
  number: number;
  title: string;
  imageUrl: string;
  descripcion: string;
}

export const PasoCards = ({ number, title, imageUrl, descripcion }: Props) => {
  return (
    <div className='flex flex-col items-center text-center gap-[15px]'>
      <div className='flex flex-row gap-[8px] items-center'>
        <strong className='text-2xl text-blue-600 font-bold'> {number}. </strong>
        <strong className='text-xl font-bold text-gray-800'> {title} </strong>
      </div>

      {/* SOLUCIÓN APLICADA: <img> nativo en lugar de <Image /> */}
      <img
        className='rounded-lg w-48 h-45 object-cover shadow-md'
        src={imageUrl}
        alt={`Paso ${number}: ${title}`}
        loading='lazy'
        decoding='async'
      />

      <p className='opacity-[80%] text-gray-600 leading-relaxed px-2'> {descripcion} </p>
    </div>
  );
};
