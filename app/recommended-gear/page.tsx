import { Metadata } from 'next'
import { AffiliateProductGrid } from '@/components/marketing/affiliate-product-card'
import { AffiliateDisclosure, ProductPageDisclosure } from '@/components/marketing/affiliate-disclosure'
import { getRecommendedProducts } from '@/lib/affiliate-manager'

export const metadata: Metadata = {
  title: 'Recommended Photography Gear | Brandon Mills',
  description: 'Curated selection of professional photography equipment, software, and accessories that I personally use and recommend.',
  openGraph: {
    title: 'Recommended Photography Gear',
    description: 'Professional photography equipment curated by Brandon Mills',
    images: ['/og-gear.jpg'],
  },
}

// Mock function - replace with actual API call
async function fetchRecommendedProducts(category: string) {
  // In production, this would fetch from your API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/affiliates/recommendations?category=${category}`, {
    cache: 'no-store'
  })

  if (!response.ok) {
    console.error('Failed to fetch recommendations')
    return []
  }

  const data = await response.json()
  return data.recommendations || []
}

export default async function RecommendedGearPage() {
  // Fetch products for each category
  const [photography, luxury, art, workspace] = await Promise.all([
    fetchRecommendedProducts('photography'),
    fetchRecommendedProducts('luxury'),
    fetchRecommendedProducts('art'),
    fetchRecommendedProducts('workspace'),
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Affiliate Disclosure Banner */}
      <AffiliateDisclosure type="banner" variant="short" />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Recommended Photography Gear
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Carefully curated equipment and tools that I personally use and recommend
            for professional photography and creative work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#photography" className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800">
              Cameras & Lenses
            </a>
            <a href="#workspace" className="px-6 py-3 bg-white text-black border border-black rounded hover:bg-gray-50">
              Workspace
            </a>
            <a href="#luxury" className="px-6 py-3 bg-white text-black border border-black rounded hover:bg-gray-50">
              Luxury
            </a>
            <a href="#art" className="px-6 py-3 bg-white text-black border border-black rounded hover:bg-gray-50">
              Art & Printing
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Product Page Disclosure */}
        <ProductPageDisclosure />

        {/* Photography Equipment Section */}
        <section id="photography" className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Photography Equipment</h2>
            <p className="text-gray-600">
              Professional cameras, lenses, and accessories that deliver exceptional results.
              These are the tools I rely on for my commercial and fine art photography.
            </p>
          </div>
          <AffiliateProductGrid
            products={photography}
            showCommission={false}
            utmSource="gear-page"
          />
        </section>

        {/* Workspace Section */}
        <section id="workspace" className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Creative Workspace</h2>
            <p className="text-gray-600">
              Essential tools for a productive creative workspace, from color-accurate monitors
              to ergonomic furniture that supports long editing sessions.
            </p>
          </div>
          <AffiliateProductGrid
            products={workspace}
            showCommission={false}
            utmSource="gear-page"
          />
        </section>

        {/* Luxury Items Section */}
        <section id="luxury" className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Luxury & Collectibles</h2>
            <p className="text-gray-600">
              Premium products for discerning photographers and collectors who appreciate
              exceptional craftsmanship and timeless design.
            </p>
          </div>
          <AffiliateProductGrid
            products={luxury}
            showCommission={false}
            utmSource="gear-page"
          />
        </section>

        {/* Art & Printing Section */}
        <section id="art" className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Art & Printing</h2>
            <p className="text-gray-600">
              Professional printing equipment and archival materials for creating
              gallery-quality prints that will last generations.
            </p>
          </div>
          <AffiliateProductGrid
            products={art}
            showCommission={false}
            utmSource="gear-page"
          />
        </section>

        {/* FAQ Section */}
        <section className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Why do you recommend these products?
              </h3>
              <p className="text-gray-600">
                I only recommend equipment that I personally use or have extensively tested.
                Each product here has earned its place through real-world professional use.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                How do affiliate links work?
              </h3>
              <p className="text-gray-600">
                When you purchase through our links, we may earn a small commission at no
                additional cost to you. This helps support the creation of free content and
                tutorials.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Are these the only products you use?
              </h3>
              <p className="text-gray-600">
                This is a curated selection of my most recommended gear. I update this list
                regularly as I discover new products that meet my professional standards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Can I get personalized recommendations?
              </h3>
              <p className="text-gray-600">
                Feel free to <a href="/contact" className="text-blue-600 hover:underline">contact me</a> with
                your specific needs and budget. I'm happy to provide personalized gear recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="text-center py-12 border-t">
          <h2 className="text-2xl font-bold mb-4">Get Gear Updates</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to receive updates when I add new recommended products or
            find great deals on photography equipment.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Footer Disclosure */}
      <div className="border-t mt-12">
        <AffiliateDisclosure type="footer" variant="full" />
      </div>
    </div>
  )
}