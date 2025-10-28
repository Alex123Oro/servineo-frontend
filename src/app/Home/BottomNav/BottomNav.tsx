import Link from 'next/link';
import { FaHome, FaBriefcase, FaTags, FaQuestionCircle } from 'react-icons/fa';

const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] flex justify-around items-center gap-2 py-2 px-2 pb-[env(safe-area-inset-bottom)]">
      <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
        <FaHome className="text-xl mb-1" />
        <span className="text-sm">Inicio</span>
      </Link>
      <Link href="/servicios" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
        <FaBriefcase className="text-xl mb-1" />
        <span className="text-sm">Servicios</span>
      </Link>
      <Link href="/ofertas" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
        <FaTags className="text-xl mb-1" />
        <span className="text-sm">Ofertas</span>
      </Link>
      <Link href="/ayuda" className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
        <FaQuestionCircle className="text-xl mb-1" />
        <span className="text-sm">Ayuda</span>
      </Link>
    </nav>
  );
};

export default BottomNav;