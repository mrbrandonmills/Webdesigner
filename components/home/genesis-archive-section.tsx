'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

interface FeaturedPhoto {
  src: string
  title: string
  category: string
  year?: string
  story: string
}

const featuredPhotos: FeaturedPhoto[] = [
  {
    src: '/images/gallery/genesis/campaigns/B.40.jpg',
    title: 'Underwear Campaign',
    category: 'CAMPAIGN',
    year: '2019',
    story: 'A major underwear campaign that required intense physical preparation and absolute confidence. The results spoke for themselves.',
  },
  {
    src: '/images/gallery/genesis/editorial/B.3.jpg',
    title: 'TETU Magazine Cover',
    category: 'EDITORIAL',
    year: '2018',
    story: 'Landing this French magazine cover was a career milestone. Shot in Paris, exploring modern masculinity.',
  },
  {
    src: '/images/gallery/genesis/campaigns/B.43.jpg',
    title: 'Global Campaign',
    category: 'CAMPAIGN',
    year: '2020',
    story: 'Shot for international markets, this campaign ran in over 30 countries. Seeing your face on billboards worldwide is surreal.',
  },
]

export default function GenesisArchiveSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.95])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden bg-black">
      {/* Cinematic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />

      {/* Accent Light Effect */}
      <motion.div
        style={{ opacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.08] blur-[150px] pointer-events-none"
      >
        <div className="w-full h-full bg-gradient-radial from-accent-gold/40 via-accent-gold/10 to-transparent" />
      </motion.div>

      <div className="container-wide relative z-10">
        <motion.div style={{ opacity, scale }}>
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent-gold/30 bg-accent-gold/5 rounded-full mb-6">
                <Sparkles className="text-accent-gold" size={16} />
                <span className="text-xs tracking-[0.3em] uppercase text-accent-gold font-light">
                  The Archive
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-light font-serif text-white mb-6 leading-tight">
                Genesis
              </h2>

              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto mb-8" />

              <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed max-w-3xl mx-auto">
                Where it all began. 50 photos from runway shows, campaigns, and editorials that shaped a career—
                <span className="text-white italic"> from cancer survivor to international model.</span>
              </p>

              <p className="text-white/50 text-sm mt-6 italic max-w-2xl mx-auto leading-relaxed">
                Each photograph tells a story of transformation, resilience, and rebirth.
                This isn't just a modeling archive—it's a visual memoir of becoming.
              </p>
            </motion.div>
          </div>

          {/* Featured Photos Grid - Dolce & Gabbana Style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
            {featuredPhotos.map((photo, index) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-sm border border-accent-gold/40">
                    <span className="text-accent-gold text-xs tracking-[0.25em] uppercase font-light">
                      {photo.category}
                    </span>
                  </div>

                  {/* Year Badge */}
                  {photo.year && (
                    <div className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-accent-gold/20 backdrop-blur-sm border border-accent-gold/40">
                      <span className="text-accent-gold text-sm font-light">
                        '{photo.year.slice(2)}
                      </span>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-2xl md:text-3xl font-light font-serif mb-3 leading-tight">
                      {photo.title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                      {photo.story}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <Link
              href="/gallery/genesis"
              className="group inline-flex items-center gap-4 px-12 py-5 border border-accent-gold/40 bg-accent-gold/5 hover:bg-accent-gold/10 text-white transition-all duration-500 relative overflow-hidden"
            >
              {/* Button Background Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

              <span className="text-lg tracking-[0.2em] uppercase font-light relative z-10">
                Explore Full Archive
              </span>
              <ArrowRight className="text-accent-gold group-hover:translate-x-2 transition-transform duration-500 relative z-10" size={20} />
            </Link>

            <p className="text-white/40 text-sm mt-6 tracking-wide">
              50 photographs · 3 categories · One unforgettable journey
            </p>
          </motion.div>

          {/* The Rebirth Teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="border border-accent-gold/20 bg-gradient-to-br from-accent-gold/5 to-transparent p-8 md:p-12 relative overflow-hidden">
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent-gold/30" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent-gold/30" />

              <div className="relative z-10 text-center">
                <p className="text-2xl md:text-3xl font-light font-serif text-white/90 italic leading-relaxed mb-4">
                  "Cancer victim was my new identity."
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  This archive includes my first collaboration after being declared cancer-free.
                  A photographer saw something in me I couldn't see yet—and helped me find my way back.
                </p>
                <div className="text-accent-gold text-sm tracking-wider uppercase">
                  Read the Full Story in the Archive
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
