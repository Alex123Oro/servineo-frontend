"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function TopMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Ofertas de trabajo', href: '/job-offer-list' },
    { name: 'Convertir-fixer', href: '/become-fixer' },  //quitar estos campos porque son de prueba
    { name: 'mis ofertas', href: '/fixer/my-offers' },
    { name: 'perfil', href: '/fixer/profile' },
  ]
  const pathname = usePathname()

  const baseLink =
    'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200'
  const hoverLink =
    'hover:text-primary hover:bg-primary/10'
  const activeLink =
    'text-primary bg-primary/15 ring-1 ring-primary/20'

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300
          ${scrolled ? 'bg-white backdrop-blur-sm shadow-md' : 'bg-white/90 backdrop-blur-sm'}
          border-t-[1.5px] border-b-[1.5px] border-primary
          md:top-0 md:bottom-auto bottom-0
        `}
      >
        {/* Barra superior SOLO escritorio */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-primary font-bold text-xl">
                  LOGO
                </Link>
              </div>

              <nav className="flex items-center space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${baseLink} ${hoverLink} ${
                        isActive ? activeLink : 'text-gray-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="flex items-center space-x-4">
                <Link
                  href="../login"
                  className={`${baseLink} ${hoverLink} ${
                    pathname?.startsWith('/login') ? activeLink : 'text-gray-700'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/signUp"
                  className={`bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors ${
                    pathname?.startsWith('/signUp') ? 'ring-2 ring-primary/30' : ''
                  }`}
                >
                  Regístrate
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior SOLO móvil (sin desplegable) */}
        <nav
          className="md:hidden h-16 px-2 flex items-center bg-white/95 backdrop-blur-sm"
          aria-label="Mobile bottom navigation"
        >
          <div className="flex w-full items-center justify-between overflow-x-auto whitespace-nowrap">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`mx-1 ${baseLink} ${hoverLink} ${
                    isActive ? activeLink : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            <Link
              href="../login"
              className={`mx-1 ${baseLink} ${hoverLink} ${
                pathname?.startsWith('/login') ? activeLink : 'text-gray-700'
              }`}
            >
              Iniciar
            </Link>
            <Link
              href="/signUp"
              className={`mx-1 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200
                bg-primary text-white hover:bg-primary/90
                ${pathname?.startsWith('/signUp') ? 'ring-2 ring-primary/30' : ''}
              `}
            >
              Registro
            </Link>
          </div>
        </nav>
      </header>

      {/* Separador para que el contenido no quede debajo de la barra inferior */}
      <div className="h-16 md:h-0" />
    </>
  )
}