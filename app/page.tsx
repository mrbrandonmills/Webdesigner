import HeroVideo from '@/components/home/hero-video'

export const metadata = {
  title: 'Brandon Mills | Renaissance Man of the Modern Era',
  description: 'Model, Author, AI Engineer, Visual Artist. Explore exclusive collections of fine art photography, groundbreaking books, and revolutionary AI tools.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <HeroVideo />
      {/* Featured collections and other sections will be added in next tasks */}
    </div>
  )
}
