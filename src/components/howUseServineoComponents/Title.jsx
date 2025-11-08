'use client'

import 'animate.css';
import React, { useState } from 'react'
import dynamic from "next/dynamic";
import { FaArrowDown } from "react-icons/fa6"
import { Play, Pause } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const subtitle = "Estos son los pasos que debe seguir para\npoder usar nuestra plataforma facilmente"

export const Title = () => {

    const [playing, setPlaying] = useState(false);
    const [audioAllowed, setAudioAllowed] = useState(false)
    const [open, setOpen] = useState(true)
    const [showPauseScreen, setShowPauseScreen] = useState(true)

    const handleAllowAudio = () => { 
        setAudioAllowed(true);
        setOpen(false);
        setPlaying(true);
        setShowPauseScreen(false);
    }

    const handlePlayPause= () => {
        if(audioAllowed === false){
            setOpen(true);
            return;
        }
        //setAudioAllowed(!audioAllowed);
        setPlaying(!playing);
    }

  return (
    <div>
        <div className="flex flex-col items-center min-h-screen gap-[10px] bg-gradient-to-b from-[#2B6AE0] to-[#2B31E0]">
            <div>
                <h1 className='text-center text-[60px] text-white mt-[80px]' > Cómo funciona Servineo </h1>
            </div>

            <div>
                <h3 className='text-white mb-[24px] whitespace-pre-line'> {subtitle} </h3>
            </div>

            {/*popover*/}
            <Popover.Root open={open}>
                <Popover.Trigger asChild>
                    <button>
                        {audioAllowed ? "" : ""}
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content className="bg-white p-4 rounded-xl shadow-md max-w-sm text-center w-auto h-auto animate__animated animate__fadeInDown">
                        <p className="mb-2 font-semibold">¿Deseas activar el sonido?</p>
                        <p className="text-sm text-gray-500 mb-3">
                            Activa el sonido para una mejor experiencia visual y auditiva.
                        </p>
                        <div className="flex justify-center gap-2">
                        <button 
                            className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]' 
                            onClick={handleAllowAudio}
                        >
                            Sí, activar
                        </button>
                        <button 
                            className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]' 
                            onClick={() => setOpen(false)}
                        >
                            No
                        </button>
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            {/* */}
            
            {/* contenedor del video */}
            <div className="relative w-full max-w-3xl aspect-video cursor-pointer rounded-2xl overflow-hidden shadow-lg mb-[30px]">
                <ReactPlayer
                    src="/videos/SERVINEO TUTORIAL.mp4"
                    playing={playing}
                    muted={audioAllowed ? false : true}
                    controls
                    width="100%"
                    height="100%"
                />
                
                { showPauseScreen === true && (
                    <div
                        onClick={handlePlayPause}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-300"
                    >
                        <Play size={64} color="white" />
                    </div>
                )}
            </div>
            {/* */}
            <div className='flex flex-col items-center mb-[30px] text-[25px] gap-[10px]'>
                <span className='text-white'> Descubrelo </span>
                <FaArrowDown className="animate__animated animate__shakeY animate__slower animate__infinite" color='white'/>
            </div>
        </div>
    </div>
  )
}
