'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram } from 'lucide-react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-[0.15em] transition-colors ${
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
                className="text-white/60 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-px bg-white transition-all ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-px bg-white transition-all ${
                    mobileMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-px bg-white transition-all ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-3xl tracking-[0.2em] text-white/80 hover:text-white transition-all ${
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
          <a
            href="https://www.instagram.com/mrbrandonmills/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Instagram size={32} />
          </a>
        </div>
      </div>
    </>
  )
}
