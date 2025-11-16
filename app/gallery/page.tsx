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

      {/* Latest Work */}
      <div className="px-8 lg:px-16 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-white font-light mb-8">
            Latest Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="px-8 lg:px-16 py-16 border-t border-white/10">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light text-center mb-4">
          Selected Work
        </h2>
        <p className="text-center text-gray-500 text-sm tracking-wide">
          {projects.length} Projects
        </p>
      </div>

      <ProjectGrid projects={projects} />

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-8 lg:px-16">
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
