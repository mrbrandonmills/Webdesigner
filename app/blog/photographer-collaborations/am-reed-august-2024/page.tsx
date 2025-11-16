import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Collaboration with AM Reed - August 2025 | Brandon Mills',
  description: 'Behind the scenes of a 158-image photography session with AM Reed in Los Angeles. Exploring the creative chemistry that produces museum-quality work.',
  openGraph: {
    title: 'Creative Chemistry: Working with AM Reed',
    description: '158 images, 7 series, one extraordinary collaboration',
    images: ['/images/collaborations/am-reed-2024/IMG_1205.jpg'],
  },
}

export default function AMReedBlogPost() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Image */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <Image
          src="/images/collaborations/am-reed-2024/IMG_1205.jpg"
          alt="Aqua Meditation - AM Reed collaboration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-accent-gold text-sm tracking-[0.3em] uppercase mb-4">
              Latest Work
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light font-serif mb-6">
              Creative Chemistry: Working with AM Reed
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              August 2025 · Los Angeles · 158 Images
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-20 container-wide">
        <div className="max-w-3xl mx-auto space-y-12 text-lg leading-relaxed">
          {/* Introduction */}
          <div className="space-y-6 text-white/80">
            <p className="text-2xl font-light text-white first-letter:text-5xl first-letter:font-serif first-letter:text-accent-gold first-letter:mr-2 first-letter:float-left">
              There's a moment in every photo shoot where you know if it's going to be good.
            </p>

            <p>
              Sometimes it's in the first five minutes. The photographer sets up a light, you find a pose, the camera clicks — and you both feel it. That invisible thing that happens when creative energy aligns.
            </p>

            <p>
              With AM Reed, that moment happened early. And it never stopped.
            </p>
          </div>

          {/* Image Break 1 */}
          <div className="my-16">
            <div className="relative aspect-[4/3] mb-4">
              <Image
                src="/images/collaborations/am-reed-2024/IMG_0280.jpg"
                alt="Tuxedo portrait by AM Reed"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-white/50 text-sm italic text-center">
              "The Weight of Elegance" — One of seven series from the session
            </p>
          </div>

          {/* Section: The Rarity of Creative Chemistry */}
          <div className="space-y-6 text-white/80">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pt-8">
              The Rarity of Creative Chemistry
            </h2>

            <p>
              Most photographers fall into one of three categories:
            </p>

            <ol className="space-y-4 pl-8 list-decimal text-white/70">
              <li>
                <strong className="text-white">Insecure.</strong> They need constant validation, second-guess their vision, rely on the model to carry the session.
              </li>
              <li>
                <strong className="text-white">Arrogant.</strong> Their vision is law. The model is a mannequin, not a collaborator.
              </li>
              <li>
                <strong className="text-white">Complacent.</strong> They've shot this a thousand times. It's a job, not art. Clock in, click, clock out.
              </li>
            </ol>

            <p>
              AM Reed is none of these.
            </p>

            <p>
              He arrives with a vision — clear, specific, technically precise. But he doesn't impose it. He proposes it. And then he watches what happens when you respond.
            </p>

            <p>
              That openness is rare. It requires confidence without ego. Technical mastery without rigidity. A willingness to let the work unfold instead of forcing it into pre-conceived boxes.
            </p>
          </div>

          {/* Image Break 2 */}
          <div className="my-16">
            <div className="relative aspect-[3/4] mb-4">
              <Image
                src="/images/collaborations/am-reed-2024/IMG_1124.jpg"
                alt="Chiaroscuro study with fire extinguisher"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-white/50 text-sm italic text-center">
              When a photographer says "grab that fire extinguisher" and it somehow becomes art
            </p>
          </div>

          {/* Section: The Session */}
          <div className="space-y-6 text-white/80">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pt-8">
              158 Images, 7 Series, One Day
            </h2>

            <p>
              We shot south of Los Angeles in AM's studio. Natural light pouring through industrial windows. A turquoise-painted room that would become the star of the session. Props that ranged from formal tuxedos to gas cans.
            </p>

            <p>
              The plan was loose: explore range. Formal to raw. Polished to gritty. Commercial to art.
            </p>

            <p>
              What emerged were seven distinct series, each telling a different story about masculinity, vulnerability, performance, and form:
            </p>

            <ul className="space-y-3 pl-8 list-disc text-white/70">
              <li><strong className="text-white">Suited Sophistication</strong> — Classic tuxedo portraits. Timeless elegance meets modern confidence.</li>
              <li><strong className="text-white">Aqua Dreams</strong> — The turquoise room series. Window light, white underwear, sculptural poses. This is where the session hit museum-quality.</li>
              <li><strong className="text-white">Chiaroscuro Masters</strong> — Black and white studies with dramatic lighting. Caravaggio meets contemporary male portraiture.</li>
              <li><strong className="text-white">Embodied Masculinity</strong> — Designer underwear editorial (Versace, D&G). Fashion meets vulnerability.</li>
              <li><strong className="text-white">Blue Collar Poetry</strong> — Industrial worker aesthetic. Tank top, work pants, gas can. Authentic labor, elevated to art.</li>
              <li><strong className="text-white">Raw Contemplation</strong> — Intimate window light studies. The private moments before the public mask.</li>
              <li><strong className="text-white">Pattern Play</strong> — Baroque shirts, bold patterns. Pure fashion fun.</li>
            </ul>

            <p>
              158 images. Every one intentional. Not a single throwaway.
            </p>
          </div>

          {/* Image Grid */}
          <div className="my-16 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/collaborations/am-reed-2024/IMG_0637.jpg"
                alt="Versace editorial"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/collaborations/am-reed-2024/IMG_0795.jpg"
                alt="Industrial worker series"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: What Makes This Work */}
          <div className="space-y-6 text-white/80">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pt-8">
              What Makes This Work
            </h2>

            <p>
              Good photography happens when a photographer has technical skill. Great photography happens when a photographer has vision.
            </p>

            <p>
              But extraordinary photography — the kind that makes you stop scrolling, that hangs in galleries, that collectors pay for — requires something else: <em className="text-accent-gold">creative trust</em>.
            </p>

            <p>
              AM Reed creates space for that trust. He doesn't direct poses — he suggests contexts and then watches what emerges. He doesn't chase trends — he studies light and form like a classical painter. He doesn't rush — he lets moments unfold.
            </p>

            <p>
              And most importantly, he allows for <strong>intellectual exchange</strong>.
            </p>

            <p>
              We talked between setups. About philosophy, performance, the relationship between body and identity, what makes an image timeless versus trendy. Those conversations informed the work. They created a feedback loop where ideas became images became new ideas.
            </p>

            <p>
              By the end of the session, I felt like I'd done a good day's work. Not just modeling — but creating. Collaborating. Making art.
            </p>

            <p>
              That feeling is rare. That's what makes AM Reed exceptional.
            </p>
          </div>

          {/* Final Image */}
          <div className="my-16">
            <div className="relative aspect-[3/4] mb-4">
              <Image
                src="/images/collaborations/am-reed-2024/IMG_1651.jpg"
                alt="D&G window light study"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Conclusion */}
          <div className="space-y-6 text-white/80">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pt-8">
              The Collaboration Continues
            </h2>

            <p>
              This won't be our last shoot. When you find a photographer who elevates your work, who challenges you to explore new dimensions of performance, who creates images that rival the masters — you hold onto that.
            </p>

            <p>
              Photography, at its best, is a conversation. AM Reed speaks the language fluently.
            </p>

            <p className="text-accent-gold italic text-xl font-light pt-8">
              "A lot of photographers carry insecurity, arrogance, or complacency. With AM Reed, I get to play, explore, and expand my craft — and feel like I've done a good day's work creating art."
            </p>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-16" />

          {/* Footer Links */}
          <div className="text-center space-y-6 pt-8">
            <p className="text-white/60">
              View the complete collection
            </p>
            <Link
              href="/gallery/collaborations/am-reed"
              className="inline-block px-8 py-4 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all duration-300 tracking-wider text-sm"
            >
              SEE ALL 20 IMAGES
            </Link>
          </div>

          {/* Credits */}
          <div className="text-center space-y-2 pt-16 pb-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Photography: AM Reed
            </p>
            <p className="text-white/60 text-sm">
              Model: Brandon Mills
            </p>
            <p className="text-white/60 text-sm">
              Location: South of Los Angeles, August 2025
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
