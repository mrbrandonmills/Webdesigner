'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Mousewheel } from 'swiper/modules'
import { WebflowProject } from '@/lib/webflow-client'

import 'swiper/css'
import 'swiper/css/free-mode'

interface ProjectDetailProps {
  project: WebflowProject
}

/**
 * Project Detail Page
 * Immersive full-screen experience with horizontal scroll gallery
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const allImages = [
    project['main-image'],
    ...(project['gallery-images'] || []),
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        data-cursor-hover
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M16 10H4M10 16l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm tracking-wide">Back</span>
      </Link>

      {/* Hero image with parallax */}
      <div ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image
            src={project['main-image'].url}
            alt={project.name}
            fill
            className="object-cover"
            priority
            quality={95}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-12 md:p-16 lg:p-24"
          style={{ opacity }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-6">
              {project.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{project.category}</span>
              <span>•</span>
              <span>{allImages.length} images</span>
              <span>•</span>
              <span>{new Date(project.createdOn).getFullYear()}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Project description */}
      <div className="px-8 md:px-16 lg:px-24 py-16 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 leading-relaxed font-light whitespace-pre-line"
        >
          {project.description}
        </motion.p>
      </div>

      {/* Horizontal scroll gallery */}
      <div className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Swiper
            modules={[FreeMode, Mousewheel]}
            spaceBetween={24}
            slidesPerView="auto"
            freeMode={true}
            mousewheel={{
              forceToAxis: true,
            }}
            className="!px-8 md:!px-16 lg:!px-24"
          >
            {allImages.map((image, index) => (
              <SwiperSlide
                key={image.fileId}
                className="!w-auto !h-[70vh]"
                onClick={() => setSelectedImage(image.url)}
              >
                <motion.div
                  className="relative h-full cursor-pointer group"
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  data-cursor-hover
                >
                  <Image
                    src={image.url}
                    alt={`${project.name} - Image ${index + 1}`}
                    width={800}
                    height={1200}
                    className="h-full w-auto object-cover rounded-lg"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* Project meta */}
      <div className="px-8 md:px-16 lg:px-24 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Category
            </h3>
            <p className="text-lg text-gray-300">{project.category}</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Tags
            </h3>
            <p className="text-lg text-gray-300">{project.tags}</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
            data-cursor-hover
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Image
            src={selectedImage}
            alt="Full size"
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain"
            quality={95}
          />
        </motion.div>
      )}
    </div>
  )
}
