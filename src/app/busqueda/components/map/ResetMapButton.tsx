"use client";

interface ResetMapButtonProps {
  onReset: () => void;
}

export default function ResetMapButton({ onReset }: ResetMapButtonProps) {
  const handleClick = () => {
    // Borra automáticamente sin pedir confirmación
    localStorage.removeItem("pinPosition");
    localStorage.removeItem("mapCenter");
    localStorage.removeItem("mapZoom");
    onReset();
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 z-[1000] 
                 bg-gradient-to-r from-[#4B3FE8] to-[#3FD6D6]
                 hover:from-[#3B7BDD] hover:to-[#2B6AE0]
                 text-white font-semibold py-2 px-5 rounded-xl
                 shadow-lg hover:shadow-[#3FD6D6]/40 
                 transition-all duration-300 ease-in-out
                 border border-white/20 backdrop-blur-sm"
    >
      🔄 Reiniciar Mapa
    </button>
  );
}
