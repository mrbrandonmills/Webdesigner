'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  location: string
  content: string
  rating: number
  tool: 'dreams' | 'oracle' | 'visualize' | 'general'
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah M.',
    role: 'Therapist',
    location: 'California',
    content: 'The Dream Decoder gave me insights into recurring nightmares I\'ve had for years. The Jungian interpretation was spot-on and helped me understand underlying anxieties I hadn\'t processed.',
    rating: 5,
    tool: 'dreams'
  },
  {
    id: 2,
    name: 'James K.',
    role: 'Entrepreneur',
    location: 'New York',
    content: 'Discovering I\'m "The Visionary" archetype was a revelation. It explained why I approach problems differently and gave me confidence to trust my unconventional thinking.',
    rating: 5,
    tool: 'oracle'
  },
  {
    id: 3,
    name: 'Elena R.',
    role: 'Writer',
    location: 'London',
    content: 'Visualizing my journal entries as a 3D neural network showed me patterns in my thinking I\'d never noticed. Incredibly powerful for self-reflection.',
    rating: 5,
    tool: 'visualize'
  },
  {
    id: 4,
    name: 'Michael T.',
    role: 'Software Engineer',
    location: 'Seattle',
    content: 'I was skeptical at first, but the archetype analysis was eerily accurate. It identified patterns in my behavior that matched what my therapist and I had been working on.',
    rating: 5,
    tool: 'oracle'
  },
  {
    id: 5,
    name: 'Amanda L.',
    role: 'Teacher',
    location: 'Austin',
    content: 'The dream analysis helped me understand a dream about my late grandmother. The symbolism interpretation brought me to tears - it was exactly what I needed to hear.',
    rating: 5,
    tool: 'dreams'
  },
  {
    id: 6,
    name: 'David H.',
    role: 'Artist',
    location: 'Portland',
    content: 'As a visual thinker, seeing my essays transformed into interactive 3D visualizations unlocked a new way of understanding my creative process. Absolutely mind-blowing.',
    rating: 5,
    tool: 'visualize'
  },
  {
    id: 7,
    name: 'Rachel S.',
    role: 'Life Coach',
    location: 'Miami',
    content: 'I recommend the Life Path Oracle to all my clients now. It\'s like having a master Jungian analyst available instantly. The archetype descriptions are profound.',
    rating: 5,
    tool: 'oracle'
  },
  {
    id: 8,
    name: 'Thomas W.',
    role: 'Student',
    location: 'Chicago',
    content: 'Been using Dream Decoder for 3 months now. It\'s become an essential part of my morning routine. The sleep recommendations have actually improved my sleep quality.',
    rating: 5,
    tool: 'dreams'
  }
]

interface TestimonialCarouselProps {
  filter?: 'dreams' | 'oracle' | 'visualize' | 'general'
  autoPlay?: boolean
  interval?: number
  className?: string
}

export function TestimonialCarousel({
  filter,
  autoPlay = true,
  interval = 5000,
  className = ''
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const filteredTestimonials = filter
    ? testimonials.filter(t => t.tool === filter || t.tool === 'general')
    : testimonials

  useEffect(() => {
    if (!autoPlay || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, isPaused, filteredTestimonials.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredTestimonials.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const currentTestimonial = filteredTestimonials[currentIndex]

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10">
        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-[#C9A050]/30 mb-6" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTestimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < currentTestimonial.rating
                      ? 'text-[#C9A050] fill-[#C9A050]'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed font-serif italic">
              "{currentTestimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A050]/20 to-[#C9A050]/5 flex items-center justify-center">
                <span className="text-[#C9A050] font-medium">
                  {currentTestimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{currentTestimonial.name}</p>
                <p className="text-sm text-gray-400">
                  {currentTestimonial.role} • {currentTestimonial.location}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:-mx-4 pointer-events-none">
          <button
            onClick={goToPrevious}
            className="p-2 bg-black/50 border border-white/10 rounded-full hover:bg-black/80 transition-colors pointer-events-auto"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 bg-black/50 border border-white/10 rounded-full hover:bg-black/80 transition-colors pointer-events-auto"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {filteredTestimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-[#C9A050] w-6'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Single testimonial card for grid layouts
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#C9A050]/30 transition-colors">
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < testimonial.rating
                ? 'text-[#C9A050] fill-[#C9A050]'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-4">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#C9A050]/10 flex items-center justify-center">
          <span className="text-[#C9A050] text-xs font-medium">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-white">{testimonial.name}</p>
          <p className="text-xs text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

// Export testimonials data for use in grids
export { testimonials }
