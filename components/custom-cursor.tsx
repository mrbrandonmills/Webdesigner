'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Museum-Quality Custom Cursor
 * Luxury cursor with smooth spring physics, magnetic effect, and contextual states
 * Inspired by high-end fashion websites and Apple's design language
 */
export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [cursorText, setCursorText] = useState('')
  const [cursorVariant, setCursorVariant] = useState<'default' | 'link' | 'button' | 'drag'>('default')
  const cursorTrailsRef = useRef<Array<{ x: number; y: number; id: number }>>([])

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Smoother spring for luxury feel
  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Trail effect for ambient motion
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)
  const trailSpring = { damping: 40, stiffness: 200, mass: 0.8 }
  const trailXSpring = useSpring(trailX, trailSpring)
  const trailYSpring = useSpring(trailY, trailSpring)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      let finalX = e.clientX
      let finalY = e.clientY

      // Magnetic effect for buttons and links
      if (isHovering && target.closest('button, a, [data-cursor-magnetic]')) {
        const element = target.closest('button, a, [data-cursor-magnetic]') as HTMLElement
        const rect = element.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Pull cursor towards element center (magnetic effect)
        const distance = Math.sqrt(
          Math.pow(finalX - centerX, 2) + Math.pow(finalY - centerY, 2)
        )

        if (distance < 100) {
          const strength = Math.min(0.3, (100 - distance) / 100 * 0.3)
          finalX += (centerX - finalX) * strength
          finalY += (centerY - finalY) * strength
        }
      }

      cursorX.set(finalX - 20)
      cursorY.set(finalY - 20)
      trailX.set(finalX - 20)
      trailY.set(finalY - 20)

      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(true)

      // Set cursor text from data attribute
      const text = target.getAttribute('data-cursor-text') || ''
      setCursorText(text)

      // Determine cursor variant
      if (target.closest('button')) {
        setCursorVariant('button')
      } else if (target.closest('a')) {
        setCursorVariant('link')
      } else if (target.hasAttribute('data-cursor-drag')) {
        setCursorVariant('drag')
      }
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setCursorText('')
      setCursorVariant('default')
    }

    const handleMouseDown = () => {
      cursorX.set(cursorX.get() - 2)
      cursorY.set(cursorY.get() - 2)
    }

    const handleMouseUp = () => {
      cursorX.set(cursorX.get() + 2)
      cursorY.set(cursorY.get() + 2)
    }

    // Track mouse movement
    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], [data-cursor-magnetic]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter as EventListener)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter as EventListener)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [cursorX, cursorY, trailX, trailY, isVisible, isHovering])

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  // Cursor sizes based on variant
  const cursorSizes = {
    default: { main: 40, dot: 6 },
    link: { main: 60, dot: 0 },
    button: { main: 80, dot: 0 },
    drag: { main: 100, dot: 0 },
  }

  const { main: mainSize, dot: dotSize } = cursorSizes[cursorVariant]

  return (
    <>
      {/* Cursor trail - luxury ambient effect */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[9998]"
        style={{
          x: trailXSpring,
          y: trailYSpring,
          opacity: isVisible ? 0.3 : 0,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 160, 80, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Main cursor ring - luxury gold */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
          width: 40,
          height: 40,
        }}
      >
        <motion.div
          className="rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: 'var(--accent)',
          }}
          animate={{
            width: mainSize,
            height: mainSize,
            borderWidth: isHovering ? 1 : 2,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Cursor text for contextual hints */}
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[10px] text-accent-gold font-light tracking-wider uppercase whitespace-nowrap"
            >
              {cursorText}
            </motion.span>
          )}

          {/* View/Drag icons */}
          {cursorVariant === 'link' && !cursorText && (
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              className="text-accent-gold"
            >
              <path
                d="M8 3v10M13 8l-5 5-5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(-90 8 8)"
              />
            </motion.svg>
          )}

          {cursorVariant === 'drag' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-gold text-xs"
            >
              ⟷
            </motion.div>
          )}
        </motion.div>

        {/* Outer glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 160, 80, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovering ? 1.5 : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Cursor dot - center point */}
      {dotSize > 0 && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            opacity: isVisible ? 1 : 0,
            left: 17,
            top: 17,
          }}
        >
          <motion.div
            className="rounded-full bg-white"
            animate={{
              width: dotSize,
              height: dotSize,
              scale: isHovering ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      )}

      {/* Hide default cursor and add luxury styles */}
      <style jsx global>{`
        body * {
          cursor: none !important;
        }

        /* Preserve focus indicators for accessibility */
        *:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* Smooth cursor transitions */
        body {
          cursor: none !important;
        }

        /* Prevent cursor flicker */
        * {
          cursor: inherit !important;
        }

        /* Ensure text selection still works */
        ::selection {
          background-color: var(--accent);
          color: var(--background);
        }

        ::-moz-selection {
          background-color: var(--accent);
          color: var(--background);
        }
      `}</style>
    </>
  )
}
