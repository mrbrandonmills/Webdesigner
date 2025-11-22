'use client'

import { useEffect, useRef } from 'react'

export function Block3Content() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Track reading progress
    const handleScroll = () => {
      if (!iframeRef.current) return

      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.round((scrolled / total) * 100)

      // Track milestones
      if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'reading_progress', {
            event_category: 'engagement',
            event_label: `Block 3 ${progress}% read`,
            value: progress
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full">
      {/* Embed the full Block 3 HTML with all its beautiful Da Vinci styling */}
      <iframe
        ref={iframeRef}
        src="/block-3-content.html"
        className="w-full border-0"
        style={{ minHeight: '100vh', height: 'auto' }}
        title="Random Acts of Self-Actualization: The Laboratory of Living - Block 3"
        onLoad={(e) => {
          // Auto-resize iframe to content height
          const iframe = e.currentTarget
          if (iframe.contentWindow) {
            const resizeIframe = () => {
              const body = iframe.contentWindow?.document.body
              const html = iframe.contentWindow?.document.documentElement
              if (body && html) {
                const height = Math.max(
                  body.scrollHeight,
                  body.offsetHeight,
                  html.clientHeight,
                  html.scrollHeight,
                  html.offsetHeight
                )
                iframe.style.height = height + 'px'
              }
            }

            // Initial resize
            resizeIframe()

            // Resize on content changes
            const observer = new MutationObserver(resizeIframe)
            if (iframe.contentWindow.document.body) {
              observer.observe(iframe.contentWindow.document.body, {
                attributes: true,
                childList: true,
                subtree: true
              })
            }
          }
        }}
      />
    </div>
  )
}
