"use client";

interface LocationButtonProps {
  onClick: () => void;
}

export default function LocationButton({ onClick }: LocationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2
        px-4 py-2
        bg-white
        rounded-full
        shadow-lg
        border border-gray-200
        text-blue-600
        font-medium
        transition
        duration-300
        transform
        hover:shadow-2xl
        hover:bg-blue-50
        hover:scale-105
        active:scale-95
      "
      title="Centrar en mi ubicación"
    >
      {/* Icono */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
        />
      </svg>

      {/* Texto */}
      Tu ubicación
    </button>
  );
}
