'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, LogIn, ShoppingBag, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'

// Dynamically import 3D menu (client-side only, no SSR)
const ThreeDNavMenu = dynamic(() => import('./3d-nav-menu'), { ssr: false })
const MobileNavMenu = dynamic(() => import('./3d-nav-menu').then(mod => ({ default: mod.MobileNavMenu })), { ssr: false })

export default function NavigationWith3D() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [threeDMenuOpen, setThreeDMenuOpen] = useState(false)
  const [mindToolsOpen, setMindToolsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { totalItems, openCart } = useCart()

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const mainNavLinks = [
    { name: 'HOME', href: '/' },
    { name: 'WORK', href: '/work' },
    { name: 'SHOP', href: '/shop' },
    { name: 'BLOG', href: '/blog' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ]

  const mindToolsLinks = [
    { name: 'Mind Visualizer', href: '/visualize', description: 'Manifest your vision' },
    { name: 'Dream Decoder', href: '/dreams', description: 'Unlock your subconscious' },
    { name: 'Life Path Oracle', href: '/oracle', description: 'Discover your destiny' },
    { name: 'Warrior Archetype Quiz', href: '/quiz/warrior-archetype', description: 'Find your archetype' },
  ]

  const handleOpen3DMenu = () => {
    setThreeDMenuOpen(true)
  }

  const handleClose3DMenu = () => {
    setThreeDMenuOpen(false)
    setMobileMenuOpen(false)
  }

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
              href="/"
              className="text-white text-xl md:text-2xl font-light tracking-[0.2em] hover:text-white/80 transition-colors font-serif"
            >
              BRANDON MILLS
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* 3D Menu Trigger Button */}
              <button
                onClick={handleOpen3DMenu}
                className="text-sm tracking-[0.15em] transition-colors min-h-[44px] flex items-center gap-2 text-accent-gold hover:text-white group"
              >
                <span className="relative">
                  MENU
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-gold group-hover:w-full transition-all duration-300" />
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="transform group-hover:rotate-90 transition-transform duration-300"
                >
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="1" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </svg>
              </button>

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

                {/* Dropdown Panel */}
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
                  <div
                    className="rounded-lg overflow-hidden border border-white/10 shadow-2xl"
                    style={{
                      background: 'rgba(0, 0, 0, 0.85)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    }}
                  >
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

            {/* Mobile Menu Button */}
            <button
              onClick={handleOpen3DMenu}
              className="md:hidden text-white min-w-[48px] min-h-[48px] flex items-center justify-center -mr-3"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-white transition-all duration-300"></span>
                <span className="w-full h-0.5 bg-white transition-all duration-300"></span>
                <span className="w-full h-0.5 bg-white transition-all duration-300"></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 3D Navigation Menu */}
      <AnimatePresence>
        {threeDMenuOpen && (
          isMobile ? (
            <MobileNavMenu
              navItems={mainNavLinks}
              isOpen={threeDMenuOpen}
              onClose={handleClose3DMenu}
            />
          ) : (
            <ThreeDNavMenu
              navItems={mainNavLinks}
              isOpen={threeDMenuOpen}
              onClose={handleClose3DMenu}
            />
          )
        )}
      </AnimatePresence>
    </>
  )
}
