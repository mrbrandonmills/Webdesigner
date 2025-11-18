import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSortedPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog | Brandon Mills',
  description: 'Writing on modeling, photography collaborations, creative process, and the intersection of art and performance.',
  openGraph: {
    title: 'Blog | Brandon Mills',
    description: 'Essays, reflections, and stories from the creative journey',
  },
}

export default function BlogPage() {
  // Get all blog posts sorted by date (newest first)
  const posts = getSortedPosts()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        {/* Background accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold">
            Writing & Reflections
          </p>
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-light font-serif leading-tight px-4">
            Blog
          </h1>
          <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-6 sm:my-8" />
          <p className="text-base sm:text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto px-6">
            Essays on modeling, creative collaborations, and the art of performance
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-32 container-wide">
        <div className="max-w-5xl mx-auto space-y-16">
          {posts.map((post, index) => (
            <article key={index} className="group">
              <Link href={post.slug}>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5 order-2 md:order-1">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-4 order-1 md:order-2">
                    <p className="text-accent-gold text-xs tracking-[0.3em] uppercase">
                      {post.category}
                    </p>
                    <h2 className="text-2xl xs:text-3xl md:text-4xl font-light font-serif text-white group-hover:text-accent-gold transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-white/60 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="pt-4">
                      <span className="inline-flex items-center gap-2 text-accent-gold text-sm tracking-wider group-hover:gap-4 transition-all">
                        READ MORE
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          <path
                            d="M1 8H15M15 8L8 1M15 8L8 15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-3xl mx-auto mt-32 text-center">
          <div className="border border-white/10 p-16 space-y-6">
            <h3 className="text-xl xs:text-2xl md:text-3xl font-light font-serif text-white">
              More Stories Coming Soon
            </h3>
            <p className="text-white/60">
              Essays on creative process, poetry, and reflections on the intersection of performance and identity
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section (Optional - for future) */}
      <section className="pb-32 container-wide">
        <div className="max-w-2xl mx-auto border-t border-white/10 pt-20 text-center space-y-8">
          <h2 className="text-2xl xs:text-3xl md:text-4xl font-light font-serif">
            Stay Updated
          </h2>
          <p className="text-white/60">
            Subscribe to receive new posts and creative updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-gold/50 transition-colors"
            />
            <button className="px-8 py-4 bg-accent-gold text-black font-medium tracking-wider text-sm hover:bg-accent-gold/90 transition-colors">
              SUBSCRIBE
            </button>
          </div>
          <p className="text-white/40 text-xs">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  )
}
