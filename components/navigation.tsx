'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, LogIn, ShoppingBag, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mindToolsOpen, setMindToolsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMindToolsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { name: 'WORK', href: '/work' },
    { name: 'GALLERY', href: '/gallery' },
    { name: 'BLOG', href: '/blog' },
    { name: 'MEDITATIONS', href: '/meditations' },
    { name: 'SHOP', href: '/shop' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ]

  const mindToolsLinks = [
    { name: 'Mind Visualizer', href: '/visualize', description: 'Manifest your vision' },
    { name: 'Dream Decoder', href: '/dreams', description: 'Unlock your subconscious' },
    { name: 'Life Path Oracle', href: '/oracle', description: 'Discover your destiny' },
    { name: 'Warrior Archetype Quiz', href: '/quiz/warrior-archetype', description: 'Find your archetype' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-navbar'
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

              {/* Mind Tools Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMindToolsOpen(!mindToolsOpen)}
                  className={`text-sm tracking-[0.15em] transition-all duration-300 min-h-[44px] flex items-center gap-1 group ${
                    mindToolsLinks.some(link => pathname === link.href)
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                  aria-expanded={mindToolsOpen}
                  aria-haspopup="true"
                >
                  MIND TOOLS
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      mindToolsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Panel - Liquid Glass */}
                <div
                  className={`absolute top-full right-0 mt-4 w-80 transition-all duration-400 origin-top ${
                    mindToolsOpen
                      ? 'opacity-100 scale-100 pointer-events-auto'
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {/* Glass panel with border glow */}
                  <div
                    className="rounded-lg overflow-hidden border border-white/10 shadow-2xl"
                    style={{
                      background: 'rgba(0, 0, 0, 0.85)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    }}
                  >
                    {/* Gold accent line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

                    <div className="p-2">
                      {mindToolsLinks.map((link, index) => {
                        const isActive = pathname === link.href
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMindToolsOpen(false)}
                            className={`block px-4 py-3 rounded-md transition-all duration-300 min-h-[44px] group/item ${
                              isActive
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                            style={{
                              transitionDelay: mindToolsOpen ? `${index * 50}ms` : '0ms',
                            }}
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium tracking-wide text-sm">
                                {link.name}
                              </span>
                              <span className="text-xs text-white/40 group-hover/item:text-white/60 transition-colors">
                                {link.description}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

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

      {/* Mobile Menu Overlay - Touch optimized with liquid glass */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      >
        <div className="flex flex-col items-center justify-start h-full gap-5 px-6 pt-28 pb-8 overflow-y-auto">
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

          {/* Mind Tools Dropdown Section - Mobile */}
          <div className="w-full max-w-sm mt-4">
            <button
              onClick={() => setMindToolsOpen(!mindToolsOpen)}
              className="text-2xl sm:text-3xl tracking-[0.2em] text-white/80 hover:text-white transition-all min-h-[48px] flex items-center justify-center gap-2 w-full"
              style={{
                animation: mobileMenuOpen
                  ? `fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${navLinks.length * 0.1}s forwards`
                  : 'none',
                opacity: mobileMenuOpen ? 1 : 0,
              }}
            >
              MIND TOOLS
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  mindToolsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Mobile Mind Tools Submenu */}
            <div
              className={`overflow-hidden transition-all duration-400 ${
                mindToolsOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div className="flex flex-col gap-3 px-4">
                {mindToolsLinks.map((link, index) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setMindToolsOpen(false)
                        setMobileMenuOpen(false)
                      }}
                      className={`block px-4 py-3 rounded-md transition-all duration-300 min-h-[48px] ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                      style={{
                        transitionDelay: mindToolsOpen ? `${index * 50}ms` : '0ms',
                      }}
                    >
                      <div className="flex flex-col gap-0.5 text-center">
                        <span className="font-medium tracking-wide text-lg">
                          {link.name}
                        </span>
                        <span className="text-xs text-white/40">
                          {link.description}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

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
