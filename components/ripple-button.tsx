'use client'

import { useState, MouseEvent } from 'react'

interface RippleButtonProps {
  children: React.ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'default' | 'glass' | 'glass-accent'
}

interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function RippleButton({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  variant = 'default'
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    }

    setRipples((prev) => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  // Variant styles for liquid glass effect
  const variantClasses = {
    default: '',
    glass: 'glass-button',
    'glass-accent': 'glass-button bg-accent-gold/10 border-accent-gold/30 hover:border-accent-gold/50 hover:bg-accent-gold/20',
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${variantClasses[variant]} ${className}`}
    >
      {children}

      {/* Ripples with glass effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animation: 'ripple 600ms ease-out',
            background: variant === 'default'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(201, 160, 80, 0.2) 100%)',
          }}
        />
      ))}
    </button>
  )
}
