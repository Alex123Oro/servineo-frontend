'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa6';
import { Play, Pause } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

const subtitle =
  'Estos son los pasos que debe seguir para\npoder usar nuestra plataforma facilmente';

export const Title = () => {
  const [playing, setPlaying] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPauseScreen, setShowPauseScreen] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleAllowAudio = async () => {
    setAudioAllowed(true);
    setOpen(false);
  };

  const handleNoAudio = () => {
    setOpen(false);
    setAudioAllowed(false);
  };

  const handlePlayPause = () => {
    if (!audioAllowed) {
      setOpen(true);
      return;
    }

    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
      setShowPauseScreen(!playing);
    }
  };

  // Controlar play/pause cuando cambia el estado
  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  // Detectar cuando el video termina
  const handleVideoEnd = () => {
    setPlaying(false);
    setShowPauseScreen(true);
  };

  return (
    <div>
      <div className='flex flex-col items-center min-h-screen gap-[10px] bg-gradient-to-b from-[#2B6AE0] to-[#2B31E0]'>
        <div>
          <h1 className='text-center text-[60px] text-white mt-[40px]'> Cómo funciona Servineo </h1>
        </div>

        <div>
          <h3 className='text-white mb-[24px] whitespace-pre-line'> {subtitle} </h3>
        </div>

        {/*popover*/}
        <Popover.Root open={open}>
          <Popover.Trigger asChild>
            <button>{audioAllowed ? '' : ''}</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className='bg-white p-4 rounded-xl shadow-md max-w-sm text-center w-auto h-auto animate__animated animate__fadeInDown'>
              <p className='mb-2 font-semibold'>¿Deseas activar el sonido?</p>
              <p className='text-sm text-gray-500 mb-3'>
                Activa el sonido para una mejor experiencia visual y auditiva.
              </p>
              <div className='flex justify-center gap-2'>
                <button
                  className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]'
                  onClick={handleAllowAudio}
                >
                  Sí, activar
                </button>
                <button
                  className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]'
                  onClick={handleNoAudio}
                >
                  No
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {/* */}

        {/* contenedor del video - USANDO <video> NATIVO */}
        <div className='relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-lg mb-[30px] bg-black'>
          <video
            ref={videoRef}
            className='w-full h-full object-cover'
            controls={audioAllowed && playing}
            muted={!audioAllowed}
            onEnded={handleVideoEnd}
            preload='metadata'
            poster='/videos/poster.jpg' // Opcional: imagen de portada
          >
            {/* Agrega múltiples formatos para compatibilidad */}
            <source src='/videos/SERVINEO_TUTORIAL.mp4' type='video/mp4' />
            <source src='/videos/SERVINEO_TUTORIAL.webm' type='video/webm' />
            Tu navegador no soporta videos HTML5.
          </video>

          {showPauseScreen && (
            <div
              className='absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer transition-opacity duration-300'
              onClick={handlePlayPause}
            >
              <button className='flex items-center justify-center w-20 h-20 bg-white/20 rounded-full hover:bg-white/30 transition-colors'>
                <Play className='text-white drop-shadow-lg' size={48} />
              </button>
            </div>
          )}

          {/* Botón de play/pause flotante cuando el video está reproduciéndose */}
          {!showPauseScreen && playing && (
            <button
              className='absolute top-4 right-4 flex items-center justify-center w-12 h-12 bg-black/50 rounded-full hover:bg-black/70 transition-colors'
              onClick={handlePlayPause}
            >
              <Pause className='text-white' size={24} />
            </button>
          )}
        </div>
        {/* */}
        <div className='flex flex-col items-center mb-[30px] text-[25px] gap-[10px]'>
          <span className='text-white'> Descúbrelo </span>
          <FaArrowDown
            className='animate__animated animate__shakeY animate__slower animate__infinite'
            color='white'
          />
        </div>
      </div>
    </div>
  );
};
