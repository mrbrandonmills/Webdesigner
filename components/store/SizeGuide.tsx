'use client'

import { useState } from 'react'
import { X, Ruler, Home, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SizeComparison } from '@/types/store'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  productType: string
}

export default function SizeGuide({ isOpen, onClose, productType }: SizeGuideProps) {
  // Example size data - customize based on product type
  const printSizes: SizeComparison[] = [
    {
      size: '8" × 10"',
      dimensions: { width: 8, height: 10, unit: 'inches' },
      commonComparison: 'Small desk frame or shelf display',
      roomType: 'Perfect for desks, bookshelves, or small spaces',
      viewingDistance: '2-3 feet',
    },
    {
      size: '11" × 14"',
      dimensions: { width: 11, height: 14, unit: 'inches' },
      commonComparison: 'Standard small wall art',
      roomType: 'Ideal for bathrooms, small entryways, or gallery walls',
      viewingDistance: '3-4 feet',
    },
    {
      size: '16" × 20"',
      dimensions: { width: 16, height: 20, unit: 'inches' },
      commonComparison: 'Medium wall art, slightly larger than a laptop',
      roomType: 'Great for bedrooms, home offices, or medium walls',
      viewingDistance: '4-6 feet',
    },
    {
      size: '18" × 24"',
      dimensions: { width: 18, height: 24, unit: 'inches' },
      commonComparison: 'Large poster size, about the size of a small TV',
      roomType: 'Perfect for living rooms, bedrooms, or as a focal point',
      viewingDistance: '5-7 feet',
    },
    {
      size: '24" × 36"',
      dimensions: { width: 24, height: 36, unit: 'inches' },
      commonComparison: 'Movie poster size, makes a bold statement',
      roomType: 'Ideal for large walls, living rooms, or galleries',
      viewingDistance: '6-8 feet',
    },
    {
      size: '30" × 40"',
      dimensions: { width: 30, height: 40, unit: 'inches' },
      commonComparison: 'Statement piece, similar to medium TV',
      roomType: 'Perfect for large living rooms or as a centerpiece',
      viewingDistance: '8-10 feet',
    },
  ]

  const apparelSizes = [
    { size: 'XS', chest: '31-34"', length: '27"', description: 'Extra Small' },
    { size: 'S', chest: '34-37"', length: '28"', description: 'Small' },
    { size: 'M', chest: '38-41"', length: '29"', description: 'Medium' },
    { size: 'L', chest: '42-45"', length: '30"', description: 'Large' },
    { size: 'XL', chest: '46-49"', length: '31"', description: 'Extra Large' },
    { size: '2XL', chest: '50-53"', length: '32"', description: '2X Large' },
  ]

  const isPrint = productType.toLowerCase().includes('poster') ||
                  productType.toLowerCase().includes('print') ||
                  productType.toLowerCase().includes('canvas')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-black border border-white/20 rounded-3xl z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Ruler className="text-accent-gold" size={24} />
                <h2 className="text-2xl font-serif">Size Guide</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 transition-colors rounded-full"
                aria-label="Close size guide"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-5rem)] p-6">
              {isPrint ? (
                <div className="space-y-8">
                  {/* Intro */}
                  <div className="text-center max-w-2xl mx-auto">
                    <p className="text-white/60 leading-relaxed">
                      Choose the perfect size for your space. All dimensions are approximate and
                      may vary slightly. Consider viewing distance and wall size when selecting.
                    </p>
                  </div>

                  {/* Size Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {printSizes.map((sizeInfo) => (
                      <div
                        key={sizeInfo.size}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-accent-gold/30 transition-all duration-300 group"
                      >
                        {/* Size Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-light text-accent-gold group-hover:scale-110 transition-transform duration-300">
                            {sizeInfo.size}
                          </div>
                          <div className="text-sm text-white/40">
                            {sizeInfo.dimensions.width} × {sizeInfo.dimensions.height}{' '}
                            {sizeInfo.dimensions.unit}
                          </div>
                        </div>

                        {/* Visual representation */}
                        <div className="mb-4 h-32 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                          <div
                            className="border-2 border-accent-gold/30 bg-accent-gold/5"
                            style={{
                              width: `${Math.min((sizeInfo.dimensions.width / 40) * 100, 90)}%`,
                              height: `${Math.min((sizeInfo.dimensions.height / 40) * 100, 90)}%`,
                            }}
                          />
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Eye className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                                Comparison
                              </div>
                              <div className="text-sm text-white/80">{sizeInfo.commonComparison}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Home className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                                Best For
                              </div>
                              <div className="text-sm text-white/80">{sizeInfo.roomType}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Ruler className="text-accent-gold mt-1 flex-shrink-0" size={16} />
                            <div>
                              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                                Viewing Distance
                              </div>
                              <div className="text-sm text-white/80">{sizeInfo.viewingDistance}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-6">
                    <h3 className="text-lg font-serif mb-4 text-accent-gold">Sizing Tips</h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      <li className="flex items-start gap-2">
                        <span className="text-accent-gold mt-1">•</span>
                        <span>
                          Measure your wall space before ordering. Leave breathing room around the art.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-gold mt-1">•</span>
                        <span>
                          For over furniture: art should be 2/3 to 3/4 the width of the furniture.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-gold mt-1">•</span>
                        <span>
                          Hang art at eye level (center at 57-60 inches from the floor).
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent-gold mt-1">•</span>
                        <span>
                          Consider viewing distance - larger rooms can accommodate larger prints.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Apparel Size Chart */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-4 px-4 text-sm tracking-wider uppercase text-white/40">
                            Size
                          </th>
                          <th className="text-left py-4 px-4 text-sm tracking-wider uppercase text-white/40">
                            Chest
                          </th>
                          <th className="text-left py-4 px-4 text-sm tracking-wider uppercase text-white/40">
                            Length
                          </th>
                          <th className="text-left py-4 px-4 text-sm tracking-wider uppercase text-white/40">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {apparelSizes.map((size) => (
                          <tr
                            key={size.size}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium text-accent-gold">{size.size}</td>
                            <td className="py-4 px-4 text-white/80">{size.chest}</td>
                            <td className="py-4 px-4 text-white/80">{size.length}</td>
                            <td className="py-4 px-4 text-white/60">{size.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Measurement Guide */}
                  <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-6">
                    <h3 className="text-lg font-serif mb-4 text-accent-gold">How to Measure</h3>
                    <div className="space-y-3 text-sm text-white/80">
                      <div>
                        <strong className="text-white">Chest:</strong> Measure around the fullest part
                        of your chest, keeping the tape measure horizontal.
                      </div>
                      <div>
                        <strong className="text-white">Length:</strong> Measure from the highest point
                        of the shoulder to the hem.
                      </div>
                      <div className="text-accent-gold mt-4">
                        Between sizes? We recommend sizing up for a more relaxed fit.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
