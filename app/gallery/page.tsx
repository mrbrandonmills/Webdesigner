import { fetchProjects } from '@/lib/webflow-client'
import { Hero } from '@/components/gallery/hero'
import { ProjectGrid } from '@/components/gallery/project-grid'

export const metadata = {
  title: 'Portfolio | Brandon Mills',
  description: 'Fashion model, actor, author, cognitive researcher, and AI engineer. Explore a multifaceted portfolio of creative work.',
}

export default async function GalleryPage() {
  const projects = await fetchProjects()

  return (
    <main className="min-h-screen bg-black">
      <Hero />

      {/* Genesis Archive - Featured Block */}
      <div className="px-4 sm:px-6 lg:px-16 py-12 sm:py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <a
            href="/gallery/genesis"
            className="group block relative overflow-hidden border border-white/10 hover:border-accent-gold/50 transition-all duration-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[600px] overflow-hidden">
                <img
                  src="/images/collaborations/andrew-gerard-vancouver/image-01.jpg"
                  alt="Genesis Archive - The Rebirth"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60 lg:to-black/80" />
              </div>

              {/* Right: Content */}
              <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-black/40 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <p className="text-accent-gold text-xs sm:text-sm tracking-[0.3em] uppercase mb-3">
                      The Archive
                    </p>
                    <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-serif font-light mb-4">
                      Genesis
                    </h2>
                    <div className="w-16 h-px bg-accent-gold/50 mb-6" />
                  </div>

                  <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-2xl">
                    A comprehensive archive documenting my modeling career's evolution—from the first shoot after cancer
                    to high-fashion campaigns across three continents.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <span className="px-4 py-2 border border-white/20 text-white/70 text-sm">The Rebirth</span>
                    <span className="px-4 py-2 border border-white/20 text-white/70 text-sm">Runway</span>
                    <span className="px-4 py-2 border border-white/20 text-white/70 text-sm">Editorial</span>
                    <span className="px-4 py-2 border border-white/20 text-white/70 text-sm">Campaigns</span>
                  </div>

                  <div className="pt-6">
                    <span className="inline-flex items-center gap-2 text-accent-gold text-sm tracking-wider group-hover:gap-4 transition-all">
                      EXPLORE THE ARCHIVE
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                        <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Latest Work */}
      <div className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl xs:text-3xl md:text-4xl text-white font-light mb-6 sm:mb-8">
            Latest Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* AM Reed - Los Angeles */}
            <a
              href="/gallery/collaborations/am-reed"
              className="group relative aspect-[3/4] overflow-hidden border border-white/10 hover:border-accent-gold/50 transition-all duration-500"
            >
              <img
                src="/images/collaborations/am-reed-2024/IMG_1205.jpg"
                alt="AM Reed Collaboration - August 2025"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <p className="text-accent-gold text-xs tracking-[0.2em] uppercase mb-2">
                  August 2025
                </p>
                <h3 className="text-white text-2xl font-serif mb-2">AM Reed</h3>
                <p className="text-white/60 text-sm">
                  158 images · 7 series · Los Angeles
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Section title */}
      <div className="px-4 sm:px-6 lg:px-16 py-12 sm:py-16 border-t border-white/10">
        <h2 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white font-light text-center mb-4 px-4">
          Selected Work
        </h2>
        <p className="text-center text-gray-500 text-sm tracking-wide">
          {projects.length} Projects
        </p>
      </div>

      <ProjectGrid projects={projects} />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Brandon Mills. All rights reserved.</p>
          <div className="flex gap-8">
            <a
              href="mailto:brandon@brandonmills.com"
              className="hover:text-white transition-colors"
              data-cursor-hover
            >
              Contact
            </a>
            <a
              href="/"
              className="hover:text-white transition-colors"
              data-cursor-hover
            >
              Dashboard
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
