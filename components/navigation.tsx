'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, LogIn, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'WORK', href: '/work' },
    { name: 'GALLERY', href: '/gallery' },
    { name: 'BLOG', href: '/blog' },
    { name: 'WRITING', href: '/writing' },
    { name: 'MEDITATIONS', href: '/meditations' },
    { name: 'STORE', href: '/store' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/gallery"
              className="text-white text-xl md:text-2xl font-light tracking-[0.2em] hover:text-white/80 transition-colors font-serif"
            >
              BRANDON MILLS
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-[0.15em] transition-colors min-h-[44px] flex items-center ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://www.instagram.com/mrbrandonmills/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <button
                onClick={openCart}
                className="text-white/60 hover:text-white transition-colors relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 min-w-[20px] min-h-[20px] bg-accent-gold text-black text-xs font-medium rounded-full flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                href="/admin/login"
                className="text-white/40 hover:text-white/60 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Admin Login"
                aria-label="Admin Login"
              >
                <LogIn size={18} />
              </Link>
            </div>

            {/* Mobile Menu Button - Touch optimized */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white min-w-[48px] min-h-[48px] flex items-center justify-center -mr-3"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Touch optimized */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6 py-20 overflow-y-auto">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl sm:text-3xl tracking-[0.2em] text-white/80 hover:text-white transition-all min-h-[48px] flex items-center ${
                pathname === link.href ? 'text-white' : ''
              }`}
              style={{
                animation: mobileMenuOpen
                  ? `fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`
                  : 'none',
                opacity: mobileMenuOpen ? 1 : 0,
              }}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-8 mt-8">
            <a
              href="https://www.instagram.com/mrbrandonmills/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Instagram"
            >
              <Instagram size={28} />
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                openCart()
              }}
              className="text-white/60 hover:text-white transition-colors relative min-w-[48px] min-h-[48px] flex items-center justify-center"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={28} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 min-w-[24px] min-h-[24px] bg-accent-gold text-black text-xs font-medium rounded-full flex items-center justify-center px-1.5">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          <Link
            href="/admin/login"
            className="text-white/40 hover:text-white/60 transition-colors text-sm tracking-wider uppercase min-h-[44px] flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </>
  )
}
