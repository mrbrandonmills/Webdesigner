'use client'

import { motion } from 'framer-motion'

const technologies = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js',
  'Framer Motion', 'GSAP', 'PostgreSQL', 'Vercel', 'Stripe',
  'Cloudinary', 'Resend', 'Zod', 'Zustand', 'SWR',
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Three.js', // Duplicate for infinite scroll
]

export function TechStackCarousel() {
  return (
    <div className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: [0, -50 * technologies.length / 2], // Move half the width
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
      >
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900/30 backdrop-blur-sm border border-white/10 text-gray-300 font-mono text-sm hover:border-orange-500/50 hover:text-orange-500 transition-all duration-300"
          >
            {tech}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
