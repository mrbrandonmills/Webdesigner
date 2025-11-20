import { fetchProjects } from '@/lib/webflow-client'
import { Hero } from '@/components/gallery/hero'
import { ProjectGrid } from '@/components/gallery/project-grid'
import { JsonLd } from '@/components/seo/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/json-ld'

export const metadata = {
  title: 'Model Portfolio & Fashion Photography | Brandon Mills',
  description: 'Professional modeling portfolio featuring editorial, runway, and campaign photography. Fashion model and creative based in Los Angeles.',
  keywords: [
    'Brandon Mills model',
    'fashion photography',
    'model portfolio',
    'editorial photography',
    'runway model',
    'Los Angeles model',
    'fashion editorial',
    'campaign photography',
    'male model',
    'creative portfolio',
  ],
  alternates: {
    canonical: 'https://brandonmills.com/gallery',
  },
  openGraph: {
    title: 'Model Portfolio & Fashion Photography | Brandon Mills',
    description: 'Professional modeling portfolio featuring editorial, runway, and campaign photography.',
    type: 'website',
    url: 'https://brandonmills.com/gallery',
    siteName: 'Brandon Mills',
    images: [
      {
        url: 'https://brandonmills.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brandon Mills Model Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Model Portfolio | Brandon Mills',
    description: 'Professional modeling portfolio - editorial, runway, and campaign photography.',
    images: ['https://brandonmills.com/og-image.jpg'],
  },
}

// Generate ImageGallery schema
function generatePortfolioSchema(projectCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Brandon Mills Model Portfolio',
    description: 'Professional modeling portfolio featuring editorial, runway, and campaign photography',
    url: 'https://brandonmills.com/gallery',
    mainEntity: {
      '@type': 'ImageGallery',
      name: 'Brandon Mills Photography Portfolio',
      description: `${projectCount} professional photography projects showcasing editorial, runway, and campaign work`,
      about: {
        '@type': 'Person',
        name: 'Brandon Mills',
        jobTitle: 'Model',
      },
    },
  }
}

export default async function GalleryPage() {
  const projects = await fetchProjects()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Gallery', url: '/gallery' },
  ])
  const portfolioSchema = generatePortfolioSchema(projects.length)

  return (
    <>
      <JsonLd data={[breadcrumbSchema, portfolioSchema]} />
      <main className="min-h-screen bg-black">
      <Hero />

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
    </>
  )
}
