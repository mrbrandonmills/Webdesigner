'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function AMReedCollaboration() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Top 20 curated images from AM Reed August 2024 shoot
  // Organized to showcase modeling range
  const images = [
    // HERO IMAGES (Top 5 Signature Quality)
    {
      src: '/images/collaborations/am-reed-2024/IMG_1205.jpg',
      alt: 'Aqua Meditation - Reclined study in turquoise room',
      series: 'Aqua Dreams',
      category: 'Editorial'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0280.jpg',
      alt: 'The Weight of Elegance - B&W tuxedo portrait',
      series: 'Suited Sophistication',
      category: 'Formal'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_1124.jpg',
      alt: 'Chiaroscuro Warrior - B&W with fire extinguisher',
      series: 'Chiaroscuro Masters',
      category: 'Artistic'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0637.jpg',
      alt: 'Versace Study - Designer underwear editorial',
      series: 'Embodied Masculinity',
      category: 'Underwear Editorial'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0795.jpg',
      alt: 'Industrial Elegy - Worker series',
      series: 'Blue Collar Poetry',
      category: 'Character Work'
    },

    // FORMAL WEAR (Tuxedo)
    {
      src: '/images/collaborations/am-reed-2024/IMG_0007.jpg',
      alt: 'Charming tuxedo portrait with smile',
      series: 'Suited Sophistication',
      category: 'Formal'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0019.jpg',
      alt: 'Playful tuxedo moment',
      series: 'Suited Sophistication',
      category: 'Formal'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0091.jpg',
      alt: 'Powerful tuxedo stare',
      series: 'Suited Sophistication',
      category: 'Formal'
    },

    // UNDERWEAR EDITORIAL
    {
      src: '/images/collaborations/am-reed-2024/IMG_1456.jpg',
      alt: 'Black briefs editorial - Seated',
      series: 'Embodied Masculinity',
      category: 'Underwear Editorial'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_1599.jpg',
      alt: 'Full body editorial - Black briefs',
      series: 'Embodied Masculinity',
      category: 'Underwear Editorial'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_1651.jpg',
      alt: 'D&G window light study',
      series: 'Embodied Masculinity',
      category: 'Underwear Editorial'
    },

    // AQUA ROOM SERIES
    {
      src: '/images/collaborations/am-reed-2024/IMG_1196.jpg',
      alt: 'Aqua room vulnerable moment',
      series: 'Aqua Dreams',
      category: 'Editorial'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_1207.jpg',
      alt: 'Aqua room sculptural pose',
      series: 'Aqua Dreams',
      category: 'Editorial'
    },

    // B&W ARTISTIC
    {
      src: '/images/collaborations/am-reed-2024/IMG_1315.jpg',
      alt: 'Window light contemplation - B&W',
      series: 'Raw Contemplation',
      category: 'Artistic'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0738.jpg',
      alt: 'Athletic Versace study - B&W',
      series: 'Chiaroscuro Masters',
      category: 'Artistic'
    },

    // CHARACTER WORK
    {
      src: '/images/collaborations/am-reed-2024/IMG_0907.jpg',
      alt: 'Worker aesthetic - Industrial',
      series: 'Blue Collar Poetry',
      category: 'Character Work'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_0177.jpg',
      alt: 'Full body formal elegance',
      series: 'Suited Sophistication',
      category: 'Formal'
    },

    // DETAIL SHOTS
    {
      src: '/images/collaborations/am-reed-2024/IMG_0040.jpg',
      alt: 'Abstract formal detail',
      series: 'Suited Sophistication',
      category: 'Formal'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_1652.jpg',
      alt: 'D&G color editorial',
      series: 'Embodied Masculinity',
      category: 'Underwear Editorial'
    },
    {
      src: '/images/collaborations/am-reed-2024/IMG_1684.jpg',
      alt: 'Personal narrative - Tattoo detail',
      series: 'Raw Contemplation',
      category: 'Artistic'
    },
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
        {/* Background accents */}
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
              Latest Work
            </p>
            <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
              AM Reed
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto">
              August 2025 — Los Angeles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Story */}
      <section className="pb-20 container-wide">
        <motion.div
          className="max-w-3xl mx-auto space-y-6 text-lg text-white/70 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p>
            Working with AM Reed is a rare creative chemistry — the kind photographers and models
            spend careers searching for. He allows for intellectual exchange, welcomes exploration,
            and creates space for authentic expression.
          </p>
          <p>
            This August 2025 session south of Los Angeles produced 158 images across formal wear,
            editorial underwear, industrial character work, and intimate artistic studies. Each
            series showcases a different dimension of modeling range: classic elegance, raw
            vulnerability, athletic power, and conceptual storytelling.
          </p>
          <p className="text-accent-gold font-light italic">
            "A lot of photographers carry insecurity, arrogance, or complacency. With AM Reed,
            I get to play, explore, and expand my craft — and feel like I've done a good day's work
            creating art."
          </p>
        </motion.div>
      </section>

      {/* Image Gallery - Masonry layout with full images (no cropping) */}
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
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-accent-gold text-xs tracking-wider uppercase mb-2">
                    {image.series}
                  </p>
                  <p className="text-white text-sm font-light">
                    {image.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Series Categories */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light font-serif text-center mb-16">
            Modeling Range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Formal Wear',
                description: 'Classic tuxedo elegance, timeless sophistication',
                count: '8 images'
              },
              {
                title: 'Underwear Editorial',
                description: 'Designer brands, athletic physique, editorial campaigns',
                count: '5 images'
              },
              {
                title: 'Artistic Studies',
                description: 'B&W chiaroscuro, vulnerable moments, conceptual work',
                count: '4 images'
              },
              {
                title: 'Character Work',
                description: 'Blue collar authenticity, industrial aesthetic, storytelling',
                count: '3 images'
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-white/10 p-8 hover:border-accent-gold/50 transition-colors"
              >
                <h3 className="text-xl font-serif text-accent-gold mb-2">{category.title}</h3>
                <p className="text-white/60 mb-4">{category.description}</p>
                <p className="text-white/40 text-sm">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto text-center space-y-8 border-t border-white/10 pt-20">
          <h2 className="text-3xl md:text-5xl font-light font-serif">
            Available for Bookings
          </h2>
          <p className="text-white/60 text-lg">
            Modeling, acting, commercial campaigns, editorial, artistic collaborations
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all duration-300 tracking-wider text-sm"
          >
            INQUIRE ABOUT RATES
          </a>
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

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/80">
            <p className="text-accent-gold text-sm tracking-wider mb-1">
              {images[currentIndex].series}
            </p>
            <p className="text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
