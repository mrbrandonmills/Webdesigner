import Link from 'next/link'

export default function WorkPage() {
  const categories = [
    {
      title: 'Modeling',
      subtitle: 'Fashion & Editorial',
      description: 'High-fashion editorial, commercial campaigns, and brand partnerships showcasing aesthetic presence and creative direction',
      link: '/gallery',
      icon: '💫',
      color: 'from-pink-500/20 to-rose-500/20',
    },
    {
      title: 'Acting',
      subtitle: 'Performance & Character',
      description: 'Theatrical work, on-camera performance, and character-driven storytelling exploring the depths of human emotion and expression',
      link: '/work/acting',
      icon: '🎭',
      color: 'from-amber-500/20 to-orange-500/20',
    },
    {
      title: 'Research',
      subtitle: 'Embodied Cognition',
      description: 'Exploring how physical experience shapes consciousness, perception, and creative expression through cognitive science',
      link: '/work/research',
      icon: '🧠',
      color: 'from-blue-500/20 to-purple-500/20',
    },
    {
      title: 'Creative Tech',
      subtitle: 'AI & Innovation',
      description: 'Building AI systems that amplify creative potential — automation tools for artists, writers, and performers',
      link: '/work/tech',
      icon: '✨',
      color: 'from-emerald-500/20 to-teal-500/20',
    },
  ]

  const featuredWork = [
    {
      category: 'Modeling',
      title: 'Editorial Fashion Portfolio',
      description: 'High-fashion editorial and commercial campaigns',
      status: 'View Gallery',
      link: '/gallery',
    },
    {
      category: 'Acting',
      title: 'Character Studies & Performance',
      description: 'Theatrical work and on-camera character performances',
      status: 'Coming Soon',
    },
    {
      category: 'Research',
      title: 'Embodied Cognition Studies',
      description: 'Exploring how physical performance informs consciousness',
      status: 'In Progress',
    },
    {
      category: 'Creative Tech',
      title: 'AI Content Automation Platform',
      description: 'Voice-to-essay system and creative workflow tools',
      status: 'In Development',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none">
            Portfolio & Work
          </h1>
          <div className="luxury-divider"></div>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Modeling, acting, and creative expression —
            <br className="hidden md:block" />
            where presence meets performance
          </p>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="pb-20 container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              href={category.link}
              className="group relative bg-white/5 border border-white/10 p-8 md:p-12 overflow-hidden hover:border-white/30 transition-all duration-500"
              style={{
                animation: `fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s forwards`,
                opacity: 0,
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative space-y-4">
                <div className="text-4xl md:text-5xl mb-4">{category.icon}</div>
                <h3 className="text-3xl md:text-4xl font-light font-serif">
                  {category.title}
                </h3>
                <p className="text-white/60 text-sm tracking-wider uppercase">
                  {category.subtitle}
                </p>
                <p className="text-white/70 leading-relaxed">
                  {category.description}
                </p>
                <div className="pt-4 text-sm tracking-widest uppercase text-white/50 group-hover:text-white/80 transition-colors">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Work */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light font-serif text-center mb-16">
            Featured Work
          </h2>
          <div className="space-y-6">
            {featuredWork.map((work, index) => (
              <div
                key={work.title}
                className="bg-white/5 border border-white/10 p-6 md:p-8 hover:border-white/30 transition-all duration-300"
                style={{
                  animation: `fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs tracking-wider uppercase text-accent-gold">
                        {work.category}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif mb-2">
                      {work.title}
                    </h3>
                    <p className="text-white/60 text-sm md:text-base">
                      {work.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {work.link ? (
                      <Link
                        href={work.link}
                        className="inline-block px-6 py-3 bg-accent-gold text-black hover:bg-accent-hover transition-colors text-sm tracking-wider uppercase"
                      >
                        {work.status}
                      </Link>
                    ) : (
                      <span className="inline-block px-6 py-3 bg-white/5 border border-white/10 text-white/40 text-sm tracking-wider uppercase">
                        {work.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="pb-32 container-wide">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="luxury-divider"></div>
          <blockquote className="text-2xl md:text-3xl font-light font-serif text-white/90 leading-relaxed py-8">
            "Performance is the art of presence —
            <br className="hidden md:block" />
            where the body becomes the medium
            <br className="hidden md:block" />
            and expression becomes truth."
          </blockquote>
          <div className="luxury-divider"></div>
        </div>
      </section>
    </div>
  )
}
