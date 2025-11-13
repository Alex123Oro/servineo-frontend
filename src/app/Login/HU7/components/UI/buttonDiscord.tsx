"use client";

export default function DiscordButton() {
  const handleClick = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_DISCORD_START || "";
    window.location.href = baseUrl;
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 bg-[#5865F2] text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition w-full justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d="M20 0H4a4 4 0 00-4 4v16l4-4h16a4 4 0 004-4V4a4 4 0 00-4-4zM9.7 9.3c.53 0 .96.47.96 1.05 0 .58-.43 1.05-.96 1.05s-.96-.47-.96-1.05c0-.58.43-1.05.96-1.05zm4.6 0c.53 0 .96.47.96 1.05 0 .58-.43 1.05-.96 1.05s-.96-.47-.96-1.05c0-.58.43-1.05.96-1.05zM12 16.05c-2.19 0-4.14-.99-5.4-2.58l.78-.63c1.05 1.17 2.58 1.83 4.17 1.83s3.12-.66 4.17-1.83l.78.63c-1.26 1.59-3.21 2.58-5.4 2.58z" />
      </svg>
      Continuar con Discord
    </button>
  );
}



