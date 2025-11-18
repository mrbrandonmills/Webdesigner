'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { WebflowProject } from '@/lib/webflow-client'

interface ProjectGridProps {
  projects: WebflowProject[]
}

/**
 * Project Grid - Bento style layout with stagger animations
 * Museum-quality presentation of portfolio projects
 */
export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-16 py-12 sm:py-16">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}

function ProjectCard({ project, index }: { project: WebflowProject; index: number }) {
  // Alternate between regular and tall cards for bento effect
  const isTall = index % 5 === 0 || index % 5 === 3
  const gridClass = isTall ? 'md:row-span-2' : 'md:row-span-1'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group relative ${gridClass}`}
    >
      <Link href={`/work/${project.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-900">
          {/* Image with zoom on hover */}
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={project['main-image'].url}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              quality={90}
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white"
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl sm:text-2xl font-serif mb-2">{project.name}</h3>
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
              {project['meta-description']}
            </p>
            <div className="mt-2 sm:mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-400">{project.category}</span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-400">
                {project['gallery-images']?.length || 0} images
              </span>
            </div>
          </motion.div>

          {/* Hover indicator */}
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white"
            >
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
