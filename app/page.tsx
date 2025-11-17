import HeroVideo from '@/components/home/hero-video'
import FeaturedCollections from '@/components/home/featured-collections'
import PhilosophySection from '@/components/home/philosophy-section'

export const metadata = {
  title: 'Brandon Mills - Polymath, Model, Philosopher & Entrepreneur',
  description: 'Renaissance living in the modern age. Philosophy, meditation, premium products for deep thinkers. Quality over quantity.',
  keywords: [
    'Brandon Mills',
    'polymath',
    'philosopher',
    'model',
    'entrepreneur',
    'guided meditation',
    'philosophy essays',
    'premium products',
    'renaissance man',
    'self-actualization',
    'deep thinker',
    'curated products'
  ],
  openGraph: {
    title: 'Brandon Mills - Polymath, Model, Philosopher & Entrepreneur',
    description: 'Renaissance living in the modern age. Philosophy, meditation, premium products for deep thinkers.',
    type: 'website',
    url: 'https://brandonmills.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brandon Mills - Polymath & Philosopher',
    description: 'Renaissance living in the modern age. Philosophy, meditation, premium products.',
  },
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
