'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, BookOpen, Cpu } from 'lucide-react'

const collections = [
  {
    id: 'premium-tech',
    title: 'Premium Tech',
    description: 'MacBook Pro, AirPods Max, iPad Pro - the tools that power creative work and deep thinking',
    icon: Camera,
    image: '/images/gallery/genesis/editorial/B.3.jpg',
    href: '/store',
    items: '6 products',
  },
  {
    id: 'books',
    title: 'Philosophy & Books',
    description: 'Meditations, Sapiens, Atomic Habits - foundational texts for polymaths and deep thinkers',
    icon: BookOpen,
    image: '/images/gallery/genesis/editorial/B.2.jpg',
    href: '/store',
    items: '4 titles',
  },
  {
    id: 'lifestyle',
    title: 'Luxury Lifestyle',
    description: 'YETI tumblers, Kindle Oasis, Moleskine notebooks - quality items for daily excellence',
    icon: Cpu,
    image: '/images/gallery/genesis/campaigns/B.40.jpg',
    href: '/store',
    items: '5 essentials',
  },
]

export default function FeaturedCollections() {
  return (
    <section id="collections" className="py-32 bg-black relative">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-[0.03] blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
        }}
      />

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold mb-4">
            Curated Excellence
          </p>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-light font-serif mb-6 px-4">
            Featured Collections
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((collection, index) => {
            const Icon = collection.icon

            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Link
                  href={collection.href}
                  className="group block relative overflow-hidden bg-white/5 border border-white/10 hover:border-accent-gold transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* Collection image */}
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-accent-gold" strokeWidth={1} />
                    </div>

                    {/* Item count badge */}
                    <div className="absolute top-4 right-4 px-4 py-2 bg-black/80 backdrop-blur-sm text-white/90 text-xs tracking-wider">
                      {collection.items}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 space-y-3 sm:space-y-4">
                    <h3 className="text-xl xs:text-2xl font-serif text-white group-hover:text-accent-gold transition-colors duration-300">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {collection.description}
                    </p>

                    {/* Arrow CTA */}
                    <div className="flex items-center gap-2 text-accent-gold text-sm tracking-wider uppercase pt-2">
                      <span>Explore</span>
                      <motion.svg
                        className="w-4 h-4"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </motion.svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
