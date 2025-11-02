import Link from 'next/link'

export default function WorkPage() {
  const categories = [
    {
      title: 'Modeling',
      description: 'Fashion editorial, commercial, and artistic modeling work',
      link: '/gallery?category=modeling',
      image: null, // Will add actual images later
    },
    {
      title: 'Photography',
      description: 'Portrait, fashion, and conceptual photography',
      link: '/gallery?category=photography',
      image: null,
    },
    {
      title: 'Creative Direction',
      description: 'Art direction, styling, and conceptual projects',
      link: '/gallery?category=creative',
      image: null,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none">
            Selected Work
          </h1>
          <div className="luxury-divider"></div>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            A multifaceted exploration of form, narrative, and aesthetic —
            where therapeutic warmth meets renaissance sophistication
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-32 container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              href={category.link}
              className="group relative aspect-[3/4] bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-500"
              style={{
                animation: `fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s forwards`,
                opacity: 0,
              }}
            >
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/80 transition-all duration-500">
                <h3 className="text-3xl md:text-4xl font-light font-serif mb-3 transform group-hover:translate-y-[-8px] transition-transform duration-500">
                  {category.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base transform group-hover:translate-y-[-8px] transition-transform duration-500">
                  {category.description}
                </p>
                <div className="mt-6 text-sm tracking-widest uppercase text-white/50 group-hover:text-white/80 transform group-hover:translate-y-[-8px] transition-all duration-500">
                  View Work →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Projects Section - Coming Soon */}
      <section className="pb-32 container-wide">
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-light font-serif">Featured Projects</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Highlighted collaborations and personal projects coming soon
          </p>
        </div>
      </section>
    </div>
  )
}
