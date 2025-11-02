export default function StorePage() {
  const productCategories = [
    {
      title: 'AI Products',
      description: 'Intelligent automation systems for creators and businesses',
      products: [
        {
          name: 'Website Automation Agent',
          description: 'AI-powered photography portfolio automation',
          price: 'From $49/mo',
          status: 'Coming Soon',
        },
        {
          name: 'Sales Training Agent',
          description: 'AI coach for insurance sales training with Socratic method',
          price: 'From $29/mo',
          status: 'Coming Soon',
        },
        {
          name: 'Socratic Professor',
          description: 'AI learning companion for exam preparation',
          price: 'From $19/mo',
          status: 'Coming Soon',
        },
      ],
    },
    {
      title: 'Fashion',
      description: 'Custom designed clothing and apparel',
      products: [
        {
          name: 'Custom Collection',
          description: 'Exclusive fashion designs on premium materials',
          price: 'Shop on Printful',
          status: 'Coming Soon',
        },
      ],
    },
    {
      title: 'Books & Guides',
      description: 'Published works and digital resources',
      products: [
        {
          name: 'Ebooks',
          description: 'Available on Amazon',
          price: 'View on Amazon',
          status: 'Coming Soon',
        },
      ],
    },
    {
      title: 'Digital Products',
      description: 'Photography presets, templates, and creative resources',
      products: [
        {
          name: 'Photography Presets',
          description: 'Professional color grading and editing presets',
          price: 'TBD',
          status: 'Coming Soon',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none">
            Store
          </h1>
          <div className="luxury-divider"></div>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Where philosophy meets technology —
            <br className="hidden md:block" />
            products and tools that amplify human creativity
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 container-wide">
        <div className="space-y-24">
          {productCategories.map((category, categoryIndex) => (
            <div key={category.title} className="space-y-12">
              {/* Category Header */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-light font-serif">{category.title}</h2>
                <p className="text-white/60 max-w-2xl mx-auto">{category.description}</p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.products.map((product, productIndex) => (
                  <div
                    key={product.name}
                    className="group relative bg-white/5 border border-white/10 p-8 hover:border-white/30 transition-all duration-500"
                    style={{
                      animation: `fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${productIndex * 0.2}s forwards`,
                      opacity: 0,
                    }}
                  >
                    {/* Status Badge */}
                    {product.status && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-accent-gold text-black text-xs tracking-wider uppercase">
                        {product.status}
                      </div>
                    )}

                    {/* Product Content */}
                    <div className="space-y-4 mt-8">
                      <h3 className="text-2xl font-serif group-hover:text-accent-gold transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed min-h-[3rem]">
                        {product.description}
                      </p>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-lg font-light tracking-wider">{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate & Recommendations Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="luxury-divider"></div>
          <h2 className="text-3xl md:text-5xl font-light font-serif">Curated Recommendations</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Carefully selected products, books, and tools that inspire and enhance creative work
          </p>
          <div className="pt-8 text-white/40 text-sm">
            Coming Soon
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="pb-32 container-wide">
        <div className="max-w-2xl mx-auto text-center space-y-4 text-white/40 text-sm">
          <p>
            Products are currently in development. Sign up below to be notified when they launch.
          </p>
          <form className="flex gap-4 max-w-md mx-auto pt-8">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border-b border-white/20 py-2 px-0 text-white placeholder-white/30 focus:outline-none focus:border-white/60 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors tracking-wider uppercase text-xs"
            >
              Notify Me
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
