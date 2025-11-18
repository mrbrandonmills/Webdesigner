'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Filter, X, Search } from 'lucide-react'
import { useState } from 'react'

interface FilterSortBarProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  productCount: number
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
]

export function FilterSortBar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  productCount,
}: FilterSortBarProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || 'Sort By'

  return (
    <>
      {/* Desktop Filter Bar */}
      <motion.div
        className="hidden md:block sticky top-20 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-wide py-6">
          <div className="flex items-center justify-between gap-6">
            {/* Category Filters */}
            <div className="flex gap-3 flex-wrap flex-1">
              {categories.map((category) => {
                const isActive = selectedCategory === category
                return (
                  <motion.button
                    key={category}
                    className={`px-6 py-2 border text-sm tracking-wider uppercase transition-all ${
                      isActive
                        ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                        : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white'
                    }`}
                    onClick={() => onCategoryChange(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                    {isActive && (
                      <motion.div
                        className="ml-2 inline-block w-1.5 h-1.5 bg-accent-gold rounded-full"
                        layoutId="active-category"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 focus:border-accent-gold focus:bg-white/10 transition-all text-white placeholder:text-white/40 outline-none text-sm"
              />
              {searchQuery && (
                <motion.button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  onClick={() => onSearchChange('')}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <motion.button
                className="px-6 py-2 border border-white/10 hover:border-accent-gold transition-colors text-sm tracking-wider uppercase flex items-center gap-2 min-w-[200px] justify-between"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                whileHover={{ scale: 1.02 }}
              >
                <span>{currentSortLabel}</span>
                <motion.div
                  animate={{ rotate: showSortDropdown ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSortDropdown(false)}
                    />

                    {/* Dropdown Menu */}
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/20 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sortOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          className={`w-full px-6 py-3 text-left text-sm transition-colors border-b border-white/10 last:border-0 ${
                            sortBy === option.value
                              ? 'bg-accent-gold/10 text-accent-gold'
                              : 'hover:bg-white/5 text-white/70'
                          }`}
                          onClick={() => {
                            onSortChange(option.value)
                            setShowSortDropdown(false)
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Product Count */}
            <div className="text-sm text-white/60 whitespace-nowrap">
              {productCount} {productCount === 1 ? 'Product' : 'Products'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Filter Bar */}
      <motion.div
        className="md:hidden sticky top-16 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-wide py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Filter Button */}
            <motion.button
              className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-accent-gold transition-colors text-sm tracking-wider uppercase"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={16} />
              <span>Filters</span>
              {selectedCategory !== 'All' && (
                <div className="w-2 h-2 bg-accent-gold rounded-full" />
              )}
            </motion.button>

            {/* Mobile Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-9 py-2 bg-white/5 border border-white/10 focus:border-accent-gold transition-all text-white placeholder:text-white/40 outline-none text-sm"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                  onClick={() => onSearchChange('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Sort Button */}
            <motion.button
              className="px-4 py-2 border border-white/10 hover:border-accent-gold transition-colors"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronDown size={16} />
            </motion.button>
          </div>

          {/* Product Count */}
          <div className="mt-3 text-xs text-white/60 text-center">
            {productCount} {productCount === 1 ? 'Product' : 'Products'}
          </div>
        </div>
      </motion.div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
            />

            <motion.div
              className="fixed left-0 right-0 bottom-0 bg-black border-t border-white/20 z-50 md:hidden max-h-[70vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif">Filter Products</h3>
                  <button
                    className="p-2 hover:bg-white/5 transition-colors"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-white/60">
                    Category
                  </h4>
                  <div className="flex flex-col gap-2">
                    {categories.map((category) => {
                      const isActive = selectedCategory === category
                      return (
                        <motion.button
                          key={category}
                          className={`px-4 py-3 border text-left text-sm tracking-wider uppercase transition-all ${
                            isActive
                              ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                              : 'border-white/10 hover:border-white/30 text-white/70'
                          }`}
                          onClick={() => {
                            onCategoryChange(category)
                            setShowMobileFilters(false)
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {category}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-white/60">
                    Sort By
                  </h4>
                  <div className="flex flex-col gap-2">
                    {sortOptions.map((option) => {
                      const isActive = sortBy === option.value
                      return (
                        <motion.button
                          key={option.value}
                          className={`px-4 py-3 border text-left text-sm transition-all ${
                            isActive
                              ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                              : 'border-white/10 hover:border-white/30 text-white/70'
                          }`}
                          onClick={() => {
                            onSortChange(option.value)
                            setShowMobileFilters(false)
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Clear Filters */}
                {selectedCategory !== 'All' && (
                  <motion.button
                    className="w-full px-6 py-3 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all text-sm tracking-wider uppercase"
                    onClick={() => {
                      onCategoryChange('All')
                      onSearchChange('')
                      setShowMobileFilters(false)
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear Filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sort Dropdown */}
      <AnimatePresence>
        {showSortDropdown && (
          <>
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setShowSortDropdown(false)}
            />

            <motion.div
              className="md:hidden fixed right-4 top-32 w-64 bg-black/95 backdrop-blur-xl border border-white/20 overflow-hidden z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors border-b border-white/10 last:border-0 ${
                    sortBy === option.value
                      ? 'bg-accent-gold/10 text-accent-gold'
                      : 'hover:bg-white/5 text-white/70'
                  }`}
                  onClick={() => {
                    onSortChange(option.value)
                    setShowSortDropdown(false)
                  }}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
