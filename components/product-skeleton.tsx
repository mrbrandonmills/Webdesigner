export function ProductSkeleton() {
  return (
    <div className="group relative animate-pulse">
      {/* Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {/* Image skeleton */}
        <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5"></div>

        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          {/* Brand */}
          <div className="h-3 w-16 bg-white/10 rounded"></div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-white/10 rounded"></div>
            <div className="h-4 w-full bg-white/5 rounded"></div>
          </div>

          {/* Variants */}
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-white/10 rounded-full"></div>
            <div className="h-8 w-16 bg-white/10 rounded-full"></div>
            <div className="h-8 w-16 bg-white/10 rounded-full"></div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="space-y-2">
              <div className="h-8 w-20 bg-white/10 rounded"></div>
              <div className="h-3 w-16 bg-white/5 rounded"></div>
            </div>
            <div className="h-4 w-16 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  )
}
