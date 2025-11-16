'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

interface ArtistStatementProps {
  artistName: string
  statement: string
  signature?: string
}

/**
 * Artist Statement component for luxury product pages
 * Displays the artist's creative vision and story
 */
export default function ArtistStatement({ artistName, statement, signature }: ArtistStatementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 relative overflow-hidden"
    >
      {/* Decorative quote mark */}
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="w-24 h-24 text-accent-gold" strokeWidth={1} />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-accent-gold to-transparent" />
          <h3 className="text-xs tracking-[0.3em] uppercase text-accent-gold">
            Artist Statement
          </h3>
        </div>

        <blockquote className="space-y-4">
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed italic">
            "{statement}"
          </p>

          <div className="pt-4">
            <div className="text-accent-gold font-serif text-xl">
              — {artistName}
            </div>
            {signature && (
              <div className="mt-2 text-accent-gold/60 italic text-sm">
                {signature}
              </div>
            )}
          </div>
        </blockquote>
      </div>

      {/* Subtle paper texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </motion.div>
  )
}
