'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface VideoHeroProps {
  videoSrc: string
  posterSrc?: string
  children?: ReactNode
  className?: string
  overlay?: boolean
}

export default function VideoHero({
  videoSrc,
  posterSrc,
  children,
  className = '',
  overlay = true,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video autoplays on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      })
    }
  }, [])

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
