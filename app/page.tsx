import HeroVideo from '@/components/home/hero-video'
import FeaturedCollections from '@/components/home/featured-collections'
import PhilosophySection from '@/components/home/philosophy-section'

export const metadata = {
  title: 'Brandon Mills | Renaissance Man of the Modern Era',
  description: 'Model, Author, AI Engineer, Visual Artist. Explore exclusive collections of fine art photography, groundbreaking books, and revolutionary AI tools.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <HeroVideo />
      <FeaturedCollections />
      <PhilosophySection />
      {/* Additional sections will be added in next tasks */}
    </div>
  )
}
