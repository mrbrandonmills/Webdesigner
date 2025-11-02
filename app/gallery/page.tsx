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
