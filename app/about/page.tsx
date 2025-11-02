import { Instagram } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light font-serif leading-none">
            Brandon Mills
          </h1>
          <div className="luxury-divider"></div>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
            Model · Photographer · Creative · Technologist
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="pb-20 container-wide">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
            <p className="animate-fadeIn">
              A multifaceted creative exploring the intersection of art, technology, and human experience.
              My work spans modeling, photography, fashion design, and AI-powered innovation —
              each discipline informing and enriching the others.
            </p>

            <p className="animate-fadeIn" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Where therapeutic warmth meets renaissance sophistication. Not selling services,
              but showcasing the continuous evolution of creative expression across multiple mediums.
            </p>

            <p className="animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Currently building at the intersection of creativity and technology — developing AI systems
              that amplify human creativity rather than replace it. From automated content generation
              to intelligent training systems, the goal is to free creators to focus on what they do best:
              creating.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="pb-20 container-wide">
        <div className="max-w-3xl mx-auto">
          <div className="luxury-divider"></div>
          <blockquote className="text-2xl md:text-3xl font-light font-serif text-center text-white/90 leading-relaxed py-12 animate-fadeIn">
            "The multifaceted individual is not divided —
            <br className="hidden md:block" />
            they are complete."
          </blockquote>
          <div className="luxury-divider"></div
        </div>
      </section>

      {/* Instagram Section */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-light font-serif">Follow the Journey</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Daily insights, behind-the-scenes moments, and ongoing projects
          </p>
          <a
            href="https://www.instagram.com/mrbrandonmills/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 group"
          >
            <Instagram size={24} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-wider text-sm">@MRBRANDONMILLS</span>
          </a>
        </div>
      </section>

      {/* Skills/Focus Areas */}
      <section className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light font-serif text-center mb-16">Areas of Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: 'Visual Arts',
                areas: ['Fashion Modeling', 'Editorial Photography', 'Conceptual Art Direction', 'Fashion Design'],
              },
              {
                title: 'Technology',
                areas: ['AI Systems Development', 'Creative Automation', 'Web Development', 'SaaS Products'],
              },
              {
                title: 'Philosophy',
                areas: ['Aesthetics', 'Human Experience', 'Creative Process', 'Renaissance Thinking'],
              },
              {
                title: 'Entrepreneurship',
                areas: ['Digital Products', 'Creative Consulting', 'E-commerce', 'Brand Building'],
              },
            ].map((category, index) => (
              <div
                key={category.title}
                className="space-y-4 animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                }}
              >
                <h3 className="text-xl font-serif text-accent-gold">{category.title}</h3>
                <ul className="space-y-2 text-white/60">
                  {category.areas.map((area) => (
                    <li key={area} className="text-sm">• {area}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
