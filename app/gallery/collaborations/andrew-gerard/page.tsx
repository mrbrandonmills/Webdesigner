'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'

export default function AndrewGerardCollaboration() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Andrew Gerard Vancouver collaboration - First shoot after cancer
  // This was the pivotal moment of reclaiming identity and power
  const images = [
    {
      src: '/images/collaborations/andrew-gerard-vancouver/image-01.jpg',
      alt: 'The Bad Guy - Character work that sparked rebirth',
      series: 'Vancouver Revival',
      story: 'Playing the antagonist helped me see I still had power within'
    },
    {
      src: '/images/collaborations/andrew-gerard-vancouver/image-02.jpg',
      alt: 'Reclaiming identity through character',
      series: 'Vancouver Revival',
      story: 'Each frame was a droplet of mercury coalescing back into form'
    },
    {
      src: '/images/collaborations/andrew-gerard-vancouver/image-03.jpg',
      alt: 'First collaboration post-cancer',
      series: 'Vancouver Revival',
      story: 'Andrew saw the artist in me when I could only see the cancer victim'
    },
    // More images will be added when photos are downloaded
  ]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
            <div className="inline-flex items-center gap-3 px-6 py-3 border border-accent-gold/20 bg-accent-gold/5 rounded-full mb-4">
              <Heart className="text-accent-gold" size={20} fill="currentColor" />
              <span className="text-sm tracking-[0.2em] uppercase text-accent-gold font-light">
                The Rebirth
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
              Andrew Gerard
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              Vancouver — The First Collaboration After Cancer
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Story - Pivotal Moment */}
      <section className="pb-20 container-wide">
        <motion.div
          className="max-w-3xl mx-auto space-y-8 text-lg text-white/80 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="border-l-2 border-accent-gold pl-8 space-y-6">
            <p className="text-2xl font-light font-serif text-white">
              "Cancer victim was my new identity."
            </p>

            <p>
              This was my first modeling collaboration after being declared cancer-free. I was lost.
              The person I used to be felt like a ghost. Cancer had stripped away my identity, my confidence,
              my sense of self. All that remained was the label: <em>cancer survivor</em>.
            </p>

            <p>
              Andrew Gerard saw something in me that I couldn't see yet. He created space for me to play
              the <strong>bad guy</strong> — to embody strength, darkness, edge. Something opposite of
              the fragility I felt inside.
            </p>

            <p className="text-accent-gold italic">
              "Like droplets of mercury coalescing..."
            </p>

            <p>
              That's how it felt. Each frame we shot, each character choice, each moment of embodied
              power — they were small pieces of myself coming back together. Not the old me. A new me.
              Stronger. Wiser. Reborn through fire.
            </p>

            <p>
              I am so grateful for Andrew working with me at a time when I couldn't yet see that I could
              get my career back. This collaboration wasn't just a photoshoot. It was the first step toward
              reclaiming my life. And now, the career is even stronger than before.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Photographer</p>
            <a
              href="https://www.instagram.com/andrewgerardphotography"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-serif text-accent-gold hover:text-accent-hover transition-colors"
            >
              Andrew Gerard
            </a>
            <p className="text-white/60 mt-2">Director of Photography • Vancouver, Canada</p>
            <p className="text-white/50 text-sm mt-1">23.7K followers • Fujifilm GFX</p>
          </div>
        </motion.div>
      </section>

      {/* Image Gallery - Masonry with full images */}
      <section className="pb-32 container-wide">
        <div className="masonry-grid">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="gallery-item-full group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700"
                  style={{ display: 'block' }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-6 text-center">
                  <p className="text-accent-gold text-xs tracking-wider uppercase mb-2">
                    {image.series}
                  </p>
                  <p className="text-white text-sm font-light">
                    {image.story}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact & Gratitude */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto">
          <div className="border border-accent-gold/30 bg-gradient-to-br from-accent-gold/10 to-transparent p-12 text-center space-y-8 rounded-3xl">
            <Heart size={48} className="text-accent-gold mx-auto" fill="currentColor" />

            <div>
              <h3 className="text-3xl md:text-4xl font-light font-serif text-white mb-4">
                The Power of Collaboration
              </h3>
              <p className="text-white/70 leading-relaxed max-w-2xl mx-auto text-lg">
                Some photoshoots are just work. Others change your life. This was the latter.
                Andrew didn't just take photos — he helped me remember who I was capable of becoming.
              </p>
            </div>

            <div className="pt-6">
              <p className="text-accent-gold text-sm tracking-wider uppercase mb-4">
                If you're a photographer or creative collaborator
              </p>
              <a
                href="/contact"
                className="inline-block px-10 py-4 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all duration-300 tracking-wider text-sm"
              >
                LET'S CREATE SOMETHING MEANINGFUL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-accent-gold transition-colors z-10"
          >
            <X size={32} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-8 text-white hover:text-accent-gold transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-8 text-white hover:text-accent-gold transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] p-8">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-contain"
              quality={100}
            />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/80 max-w-2xl px-8">
            <p className="text-accent-gold text-sm tracking-wider uppercase mb-2">
              {images[currentIndex].series}
            </p>
            <p className="text-white/90 mb-2">{images[currentIndex].story}</p>
            <p className="text-sm text-white/50">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
