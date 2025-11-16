'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'

interface GenesisPhoto {
  id: string
  src: string
  title: string
  story: string
  year: string
  client?: string
  location?: string
  category: 'editorial' | 'commercial' | 'runway' | 'campaign'
}

// Sample data structure - will be populated with real content
const genesisPhotos: GenesisPhoto[] = [
  {
    id: '1',
    src: '/images/genesis/placeholder-1.jpg',
    title: 'Dolce & Gabbana Campaign',
    story: 'My first major luxury brand campaign. Shot in Milan during Fashion Week. This was the moment I realized modeling could be art.',
    year: '2018',
    client: 'Dolce & Gabbana',
    location: 'Milan, Italy',
    category: 'campaign'
  },
  {
    id: '2',
    src: '/images/genesis/placeholder-2.jpg',
    title: 'Armani Editorial',
    story: 'Working with Armani taught me the meaning of timeless elegance. The photographer said I had "the look of old Hollywood" - it changed how I approached my craft.',
    year: '2019',
    client: 'Giorgio Armani',
    location: 'Rome, Italy',
    category: 'editorial'
  },
  {
    id: '3',
    src: '/images/genesis/placeholder-3.jpg',
    title: 'GQ Feature',
    story: 'This GQ spread explored masculinity in the modern era. We shot for 14 hours straight. Every frame tells a story about vulnerability and strength.',
    year: '2020',
    client: 'GQ Magazine',
    location: 'Los Angeles, CA',
    category: 'editorial'
  },
]

export default function GenesisGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GenesisPhoto | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-accent-gold mb-4">
              The Archive
            </p>
            <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
              Genesis
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              Where it all began. A visual biography of campaigns, editorials, and moments that shaped a career.
              Dolce & Gabbana. Armani. GQ. Each photo has a story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3D Museum Gallery */}
      <section className="pb-32 container-wide">
        <div className="space-y-32">
          {genesisPhotos.map((photo, index) => {
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <div className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? '' : 'md:grid-flow-dense'}`}>
                  {/* Image - 3D Floating Effect */}
                  <motion.div
                    className={`relative group cursor-pointer ${isEven ? '' : 'md:col-start-2'}`}
                    whileHover={{ scale: 1.02, rotateY: 5, rotateX: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    {/* Shadow for 3D effect */}
                    <div className="absolute inset-0 bg-accent-gold/20 blur-3xl translate-y-8 -z-10 group-hover:bg-accent-gold/30 transition-all" />

                    <div className="gallery-item-full relative overflow-hidden bg-white/5 border border-white/10 group-hover:border-accent-gold/50 transition-all">
                      <Image
                        src={photo.src}
                        alt={photo.title}
                        width={800}
                        height={1200}
                        className="w-full h-auto object-contain"
                        style={{ display: 'block' }}
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                        <p className="text-white text-sm">Click to view story</p>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm border border-accent-gold/30 text-accent-gold text-xs tracking-wider uppercase">
                      {photo.category}
                    </div>
                  </motion.div>

                  {/* Story */}
                  <div className={`space-y-6 ${isEven ? '' : 'md:col-start-1 md:row-start-1'}`}>
                    <div className="space-y-2">
                      <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
                        {photo.year}
                      </p>
                      <h2 className="text-3xl md:text-4xl font-light font-serif text-white">
                        {photo.title}
                      </h2>
                    </div>

                    {photo.client && (
                      <div className="flex items-center gap-2 text-white/60">
                        <span className="text-accent-gold">Client:</span>
                        <span>{photo.client}</span>
                      </div>
                    )}

                    {photo.location && (
                      <div className="flex items-center gap-2 text-white/60">
                        <span className="text-accent-gold">Location:</span>
                        <span>{photo.location}</span>
                      </div>
                    )}

                    <p className="text-lg text-white/70 leading-relaxed">
                      {photo.story}
                    </p>

                    <motion.button
                      onClick={() => setSelectedPhoto(photo)}
                      className="inline-flex items-center gap-2 text-accent-gold hover:gap-4 transition-all text-sm tracking-wider"
                      whileHover={{ x: 10 }}
                    >
                      READ FULL STORY
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M1 8H15M15 8L8 1M15 8L8 15"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="pb-32 container-wide">
        <div className="border border-white/10 p-16 text-center space-y-6">
          <h3 className="text-2xl md:text-3xl font-light font-serif text-white">
            More Stories Coming Soon
          </h3>
          <p className="text-white/60 max-w-2xl mx-auto">
            This archive is being restored and enhanced. Each photo is being brought back to HD quality,
            paired with the story behind the shoot, the lessons learned, and the creative journey.
          </p>
        </div>
      </section>

      {/* Lightbox Modal with Full Story */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-8 right-8 text-white hover:text-accent-gold transition-colors z-10"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-5xl w-full grid md:grid-cols-2 gap-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                className="object-cover"
                quality={100}
              />
            </div>

            {/* Full Story */}
            <div className="flex flex-col justify-center space-y-6 overflow-y-auto max-h-[80vh]">
              <div>
                <p className="text-accent-gold text-xs tracking-[0.3em] uppercase mb-2">
                  {selectedPhoto.year} · {selectedPhoto.category}
                </p>
                <h2 className="text-4xl font-light font-serif text-white mb-4">
                  {selectedPhoto.title}
                </h2>
              </div>

              {selectedPhoto.client && (
                <div>
                  <p className="text-accent-gold text-sm tracking-wider uppercase mb-1">Client</p>
                  <p className="text-white/90 text-lg">{selectedPhoto.client}</p>
                </div>
              )}

              {selectedPhoto.location && (
                <div>
                  <p className="text-accent-gold text-sm tracking-wider uppercase mb-1">Location</p>
                  <p className="text-white/90 text-lg">{selectedPhoto.location}</p>
                </div>
              )}

              <div className="w-24 h-px bg-gradient-to-r from-accent-gold to-transparent" />

              <div>
                <p className="text-accent-gold text-sm tracking-wider uppercase mb-3">The Story</p>
                <p className="text-white/70 text-lg leading-relaxed">
                  {selectedPhoto.story}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
