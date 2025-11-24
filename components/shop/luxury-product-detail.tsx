'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules'
import { ShoppingBag, ExternalLink, Check, Star, Shield, Award, Clock } from 'lucide-react'
import type { AffiliateProduct } from '@/lib/affiliate-products'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface LuxuryProductDetailProps {
  product: AffiliateProduct
}

export function LuxuryProductDetail({ product }: LuxuryProductDetailProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#F2EFE7]">
      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-32 pb-8 container mx-auto px-6 max-w-7xl"
      >
        <div className="inline-block px-4 py-2 bg-[#63692B] text-[#F2EFE7] text-xs uppercase tracking-[0.3em] font-medium">
          {product.category}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 pb-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Gallery - Swiper Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Main Swiper */}
            <Swiper
              modules={[Navigation, Pagination, Thumbs, FreeMode]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="aspect-square bg-white/50 backdrop-blur-sm overflow-hidden group"
              spaceBetween={10}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={800}
                      height={800}
                      className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                    {product.originalPrice && index === 0 && (
                      <div className="absolute top-6 right-6 px-6 py-3 bg-[#63692B] text-[#F2EFE7]">
                        <span className="text-3xl font-serif font-light">{discount}%</span>
                        <span className="text-xs block tracking-wider uppercase mt-1">OFF</span>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail Swiper */}
            {product.images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                modules={[FreeMode, Thumbs]}
                freeMode
                watchSlidesProgress
                slidesPerView={4}
                spaceBetween={12}
                className="thumbs-swiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                    <div className="aspect-square bg-white/50 overflow-hidden border-2 border-transparent hover:border-[#63692B] transition-all duration-300">
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/60 backdrop-blur-sm p-6 text-center space-y-3 hover:bg-white/80 transition-colors duration-300"
              >
                <Shield size={28} className="text-[#63692B] mx-auto" />
                <p className="text-xs text-charcoal uppercase tracking-wider">Verified Authentic</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/60 backdrop-blur-sm p-6 text-center space-y-3 hover:bg-white/80 transition-colors duration-300"
              >
                <Award size={28} className="text-[#63692B] mx-auto" />
                <p className="text-xs text-charcoal uppercase tracking-wider">Top Rated</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/60 backdrop-blur-sm p-6 text-center space-y-3 hover:bg-white/80 transition-colors duration-300"
              >
                <Clock size={28} className="text-[#63692B] mx-auto" />
                <p className="text-xs text-charcoal uppercase tracking-wider">Fast Shipping</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-10"
          >
            {/* Brand */}
            <div className="text-[#63692B] text-xs tracking-[0.3em] uppercase font-medium">
              {product.brand}
            </div>

            {/* Title */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-display-2 font-light leading-tight text-charcoal">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-[#63692B] text-[#63692B]'
                        : 'text-graphite/30'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-graphite">
                {product.rating} ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price with luxury spacing */}
            <div className="border-t border-b border-charcoal/20 py-8">
              <div className="flex items-baseline gap-6">
                <span className="font-serif text-5xl font-light text-charcoal">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-graphite line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-4 py-2 bg-[#63692B]/10 border border-[#63692B]/30 text-[#63692B] text-sm font-medium">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              {product.inStock && (
                <p className="text-sm text-[#63692B] mt-4 flex items-center gap-2">
                  <Check size={18} />
                  In Stock - Ships Within 24 Hours
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-charcoal/80 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Refined CTA Buttons - House of Corto Style */}
            <div className="space-y-4">
              <motion.a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group relative block w-full overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-10 flex items-center justify-center gap-4 py-6 px-8 bg-[#63692B] text-[#F2EFE7] font-medium tracking-[0.2em] uppercase text-sm transition-all duration-800">
                  <ShoppingBag size={22} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative overflow-hidden">
                    <span className="inline-block transition-transform duration-800 group-hover:-translate-y-full">
                      Buy on Amazon
                    </span>
                    <span className="absolute inset-0 inline-block translate-y-full transition-transform duration-800 group-hover:translate-y-0">
                      Buy on Amazon
                    </span>
                  </span>
                  <ExternalLink size={20} className="transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </div>
                <motion.div
                  className="absolute inset-0 bg-charcoal origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.a>

              <p className="text-xs text-center text-graphite">
                Secure checkout on Amazon.com • Free returns • Prime eligible
              </p>
            </div>

            {/* Key Benefits */}
            <div className="bg-white/60 backdrop-blur-sm p-8 space-y-6">
              <h3 className="text-[#63692B] text-sm tracking-[0.3em] uppercase font-medium">
                Why Choose This
              </h3>
              <ul className="space-y-4">
                {product.benefits.slice(0, 4).map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 text-charcoal/90 text-sm leading-relaxed"
                  >
                    <Check size={20} className="text-[#63692B] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Detailed Sections Below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-32 space-y-24"
        >
          {/* Specifications Grid */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mb-12 pb-6 border-b border-charcoal/20">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specs).map(([key, value], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex justify-between items-center p-6 bg-white/60 backdrop-blur-sm border-l-2 border-[#63692B]/30 hover:border-[#63692B] transition-all duration-300"
                >
                  <dt className="text-sm uppercase tracking-wider text-graphite font-medium">{key}</dt>
                  <dd className="text-charcoal font-light text-lg">{value}</dd>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mb-12 pb-6 border-b border-charcoal/20">
              Features & Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => {
                const [title, ...descParts] = feature.split(' - ')
                const description = descParts.join(' - ')
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/60 backdrop-blur-sm p-8 space-y-3 hover:bg-white/80 transition-all duration-300 border border-transparent hover:border-[#63692B]/30"
                  >
                    <h3 className="text-[#63692B] font-semibold text-lg">{title}</h3>
                    {description && (
                      <p className="text-charcoal/80 text-sm leading-relaxed font-light">
                        {description}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Perfect For Section */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mb-12 pb-6 border-b border-charcoal/20">
              Perfect For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.forWhom.map((person, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-6 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300"
                >
                  <Check size={22} className="text-[#63692B] flex-shrink-0 mt-0.5" />
                  <span className="text-charcoal/80 text-sm leading-relaxed">{person}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#63692B]/10 to-[#63692B]/5 border border-[#63692B]/20 p-16 text-center space-y-8"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal max-w-3xl mx-auto">
              Ready to Experience Premium Quality?
            </h2>
            <p className="text-charcoal/70 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands who trust {product.brand} for exceptional quality and performance.
              Every purchase backed by our guarantee of authenticity.
            </p>
            <motion.a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center gap-4 py-6 px-12 bg-[#63692B] hover:bg-charcoal text-[#F2EFE7] font-medium tracking-[0.2em] uppercase text-sm transition-all duration-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={24} />
              Buy Now on Amazon
              <ExternalLink size={20} />
            </motion.a>
            {product.originalPrice && (
              <p className="text-xs text-graphite">
                Limited time offer • Save ${(product.originalPrice - product.price).toFixed(0)} •
                Free shipping with Prime
              </p>
            )}
          </motion.div>

          {/* Affiliate Disclosure */}
          <div className="p-8 bg-white/40 backdrop-blur-sm border border-charcoal/10">
            <p className="text-graphite/70 text-xs leading-relaxed">
              <strong className="text-[#63692B] font-semibold">Disclosure:</strong> As an Amazon Associate,
              I earn from qualifying purchases. This means if you purchase through the links on this page,
              I may receive a small commission at no additional cost to you. I only recommend products I
              genuinely believe in and use personally. Your support helps maintain this site and create
              quality content. Thank you for your trust.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
