'use client'

import { useState, MouseEvent } from 'react'

interface RippleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
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
  disabled = false
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

    onClick?.()
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
    >
      {children}

      {/* Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animation: 'ripple 600ms ease-out',
          }}
        />
      ))}
    </button>
  )
}
