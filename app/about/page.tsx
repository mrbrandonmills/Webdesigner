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
            Cognitive Science Researcher · Model · Actor · Self-Actualization Mentor
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="pb-20 container-wide">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
            <p className="animate-fadeIn">
              A cognitive science researcher investigating the embodied nature of human consciousness,
              where mind, body, and creativity converge into a unified expression of self.
              My work explores how physical experience informs cognition, how performance shapes understanding,
              and how self-actualization emerges from the synthesis of all dimensions of being.
            </p>

            <p className="animate-fadeIn" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Not compartmentalized, but integrated. Research informs performance. Modeling deepens
              understanding of embodiment. Acting reveals the performative nature of consciousness.
              Each facet illuminates the others in a continuous dance of discovery.
            </p>

            <p className="animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
              Building AI systems that amplify human potential across domains — from automated research
              synthesis to creative expression tools. The goal is to free humans to focus on what makes
              us uniquely human: the integrated experience of being conscious, embodied, and creative.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="pb-20 container-wide">
        <div className="max-w-3xl mx-auto">
          <div className="luxury-divider"></div>
          <blockquote className="text-2xl md:text-3xl font-light font-serif text-center text-white/90 leading-relaxed py-12 animate-fadeIn">
            "The integrated self is not fragmented —
            <br className="hidden md:block" />
            mind, body, and creativity emerge from a single source."
          </blockquote>
          <div className="luxury-divider"></div>
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
                title: 'Mind',
                areas: ['Cognitive Science Research', 'Consciousness Studies', 'Embodied Cognition', 'Psychology & Philosophy'],
              },
              {
                title: 'Body',
                areas: ['Fashion Modeling', 'Physical Performance', 'Embodiment Theory', 'Mind-Body Integration'],
              },
              {
                title: 'Creativity',
                areas: ['Acting & Performance', 'Creative Expression', 'Artistic Practice', 'Improvisational Art'],
              },
              {
                title: 'Synthesis',
                areas: ['Self-Actualization', 'AI Development', 'Systems Thinking', 'Personal Development'],
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
