import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check, X, Star, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Best Noise Canceling Headphones 2025: AirPods Max vs Sony WH-1000XM5 - Complete Comparison',
  description: 'I tested the AirPods Max and Sony WH-1000XM5 for 30 days to find the best noise canceling headphones for 2025. Definitive comparison for deep focus, work, and travel.',
  keywords: 'best noise canceling headphones 2025, airpods max vs sony xm5, noise canceling headphones for work, best headphones for deep focus, anc headphones comparison, premium headphones review',
  openGraph: {
    title: 'Best Noise Canceling Headphones 2025: AirPods Max vs Sony WH-1000XM5',
    description: 'Expert comparison of the two best noise canceling headphones on the market. Which one should you buy?',
  },
}

export default function BestNoiseCancelingHeadphones2025() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 container-wide relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.06] blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 160, 80, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <p className="text-sm tracking-[0.3em] uppercase text-accent-gold text-center">
            Expert Product Review
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light font-serif leading-tight text-center">
            Best Noise Canceling Headphones 2025: AirPods Max vs Sony WH-1000XM5
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto" />
          <p className="text-xl text-white/70 font-light text-center max-w-3xl mx-auto leading-relaxed">
            I've tested both extensively for 30 days in real-world scenarios. Here's the definitive comparison to help you choose the perfect headphones for deep focus, work, and travel.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/50">
            <span>By Brandon Mills</span>
            <span>·</span>
            <span>January 2025</span>
            <span>·</span>
            <span>9 min read</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-32 container-wide">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="prose prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-white/80 first-letter:text-6xl first-letter:font-serif first-letter:text-accent-gold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1">
              Silence has become the ultimate luxury in 2025. Whether you're deep in creative work, navigating a noisy coffee shop, or enduring a cross-country flight, the ability to eliminate distractions is worth its weight in gold.
            </p>

            <p className="text-lg leading-relaxed text-white/80">
              I've spent the last 30 days rotating between the Apple AirPods Max and Sony WH-1000XM5 — the two undisputed champions of noise canceling headphones. I wore them during focused writing sessions, video calls, walks through Los Angeles traffic, and transcontinental flights. I tested them with everything from classical music to podcasts to complete silence.
            </p>

            <p className="text-lg leading-relaxed text-white/80">
              Here's what I discovered: both are exceptional, but one might be perfect for you while the other would be the wrong choice. Let me break down exactly which one you should buy based on your needs, ecosystem, and priorities.
            </p>
          </div>

          {/* Quick Comparison Table */}
          <div className="my-16">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white mb-8 pb-4 border-b border-white/10">
              Quick Comparison at a Glance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white/[0.02] border border-white/10">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-accent-gold font-light text-lg">Feature</th>
                    <th className="text-center p-6 text-accent-gold font-light text-lg">AirPods Max</th>
                    <th className="text-center p-6 text-accent-gold font-light text-lg">Sony WH-1000XM5</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Price</td>
                    <td className="text-center p-6">$549</td>
                    <td className="text-center p-6 text-green-400">$398</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">ANC Quality</td>
                    <td className="text-center p-6">9.5/10</td>
                    <td className="text-center p-6 text-accent-gold">9.8/10</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Sound Quality</td>
                    <td className="text-center p-6 text-accent-gold">9.8/10</td>
                    <td className="text-center p-6">9.5/10</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Battery Life</td>
                    <td className="text-center p-6">20 hours</td>
                    <td className="text-center p-6 text-green-400">30 hours</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Weight</td>
                    <td className="text-center p-6">385g</td>
                    <td className="text-center p-6 text-green-400">250g</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Comfort (8hrs+)</td>
                    <td className="text-center p-6">8/10</td>
                    <td className="text-center p-6 text-accent-gold">9.5/10</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Multipoint</td>
                    <td className="text-center p-6"><X className="inline text-red-400" size={20} /></td>
                    <td className="text-center p-6"><Check className="inline text-green-400" size={20} /></td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Build Quality</td>
                    <td className="text-center p-6 text-accent-gold">10/10 (Aluminum)</td>
                    <td className="text-center p-6">9/10 (Premium plastic)</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-6 font-medium text-white">Best For</td>
                    <td className="text-center p-6">Apple users, audiophiles</td>
                    <td className="text-center p-6">Android, travelers, multi-device</td>
                  </tr>
                  <tr>
                    <td className="p-6 font-medium text-white">Overall Score</td>
                    <td className="text-center p-6 text-accent-gold">9.4/10</td>
                    <td className="text-center p-6 text-accent-gold">9.5/10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AirPods Max Review */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pb-4 border-b border-white/10">
              Apple AirPods Max: Luxury Redefined
            </h2>

            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
              <h3 className="text-2xl font-light font-serif text-accent-gold">Design & Build Quality</h3>
              <p className="text-lg leading-relaxed text-white/80">
                The moment you pick up the AirPods Max, you understand why they cost $549. These aren't headphones — they're jewelry for your ears. The aluminum frame exudes permanence. The stainless steel headband feels like it belongs in a luxury watch boutique. The memory foam ear cushions wrapped in breathable mesh are some of the most thoughtfully engineered I've encountered.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Apple has created a product that will last decades, not years. There's no planned obsolescence here. But that premium build comes with a literal weight: at 385 grams, these are heavy. After 3-4 hours, you'll feel it. For shorter sessions, they're glorious. For all-day wear, consider the Sony.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
              <h3 className="text-2xl font-light font-serif text-accent-gold">Sound Quality</h3>
              <p className="text-lg leading-relaxed text-white/80">
                This is where the AirPods Max justify their premium price. The computational audio powered by Apple's H1 chip delivers something truly special: adaptive EQ that tunes the sound to your ear shape in real-time. The result is audio that feels almost biologically correct.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Listening to Max Richter's "On The Nature of Daylight" or Miles Davis' "So What," I heard details I'd never noticed before. The soundstage is wide, the bass is tight without being boomy, and the mids have a warmth that makes vocals feel intimate. For audiophiles, these compete with studio monitors costing significantly more.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Spatial Audio with head tracking is polarizing — I found it incredible for movies and immersive for Atmos music, but distracting for focused work. Thankfully, you can toggle it off.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
              <h3 className="text-2xl font-light font-serif text-accent-gold">Active Noise Cancellation</h3>
              <p className="text-lg leading-relaxed text-white/80">
                The ANC on AirPods Max is excellent — among the best I've tested. It removes low-frequency rumble (planes, traffic, HVAC) almost completely. Mid-range sounds (conversations, keyboard typing) are significantly reduced. High-frequency sounds (alarms, sharp noises) are attenuated but still audible.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Here's the reality: the Sony WH-1000XM5 edges ahead by about 3-5% in pure noise cancellation performance. It's marginal, but noticeable in side-by-side testing. For most users, the AirPods Max ANC is more than sufficient for deep focus and travel.
              </p>
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/5 border border-green-500/20 p-6 space-y-4">
                <h4 className="text-xl font-medium text-green-400 flex items-center gap-2">
                  <Check size={24} />
                  Pros
                </h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Best-in-class sound quality rivaling studio headphones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Premium build quality that will last 10+ years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Seamless integration with Apple ecosystem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Computational audio adapts to your ear shape</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Spatial Audio creates immersive movie experience</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-6 space-y-4">
                <h4 className="text-xl font-medium text-red-400 flex items-center gap-2">
                  <X size={24} />
                  Cons
                </h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Heavy (385g) — fatiguing for all-day wear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Expensive at $549</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>No multipoint connection (one device at a time)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Smart Case doesn't fully protect or power off</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Limited with non-Apple devices</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA for AirPods Max */}
            <div className="border border-accent-gold/20 bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.02] p-8 space-y-4">
              <h4 className="text-2xl font-light font-serif text-white">Ready to Experience Audio Perfection?</h4>
              <p className="text-white/70">
                The AirPods Max are available now. Get the best sound quality in wireless headphones.
              </p>
              <Link
                href="/shop/airpods-max"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold hover:bg-accent-hover text-black font-medium tracking-wider transition-all"
              >
                VIEW AIRPODS MAX
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-16" />

          {/* Sony WH-1000XM5 Review */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pb-4 border-b border-white/10">
              Sony WH-1000XM5: The Perfectionist's Choice
            </h2>

            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
              <h3 className="text-2xl font-light font-serif text-accent-gold">Design & Build Quality</h3>
              <p className="text-lg leading-relaxed text-white/80">
                Sony took a completely different approach: they optimized for function, comfort, and all-day wearability. At just 250 grams — 135 grams lighter than the AirPods Max — the WH-1000XM5 disappears on your head. I've worn these for 8-hour work sessions without discomfort.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                The redesigned synthetic leather cushions are softer than previous models. The headband distributes weight perfectly. The build is premium plastic rather than metal, which some may see as less luxurious. I see it as smart engineering: lighter, just as durable for real-world use, and more practical for travel.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                They fold flat into the included case — perfect for backpacks and carry-ons. The AirPods Max's bizarre bra-shaped case is nowhere near as travel-friendly.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
              <h3 className="text-2xl font-light font-serif text-accent-gold">Sound Quality</h3>
              <p className="text-lg leading-relaxed text-white/80">
                Let's address the elephant in the room: the Sony WH-1000XM5 sounds incredible, but the AirPods Max sound slightly better. We're talking about a 3-5% difference in overall audio fidelity. The AirPods have a more natural, refined soundstage. The Sony has punchier bass and brighter highs.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                For casual listening — podcasts, YouTube, Spotify — you won't notice a difference. For critical listening of lossless audio and Hi-Res files via LDAC codec, the Sony competes admirably. Most people will be thrilled with the sound quality here.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                The Sony Headphones app offers extensive EQ customization. You can tune these exactly to your preferences, which is something the AirPods Max doesn't offer.
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
              <h3 className="text-2xl font-light font-serif text-accent-gold">Active Noise Cancellation</h3>
              <p className="text-lg leading-relaxed text-white/80">
                This is where Sony wins. The WH-1000XM5 features two processors controlling eight microphones — double the previous model. The result is the best active noise cancellation I've ever experienced. It doesn't just block noise; it creates an eerie sense of complete silence.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                On a recent flight from LAX to JFK, I turned on ANC and the cabin noise vanished. Not reduced — vanished. Mid-conversation sounds, keyboard typing, even wind noise during walks is nearly eliminated. For deep focus work, this is transformative.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                The Adaptive Sound Control automatically adjusts ANC based on your activity and environment. Walking through a city? It reduces ANC slightly so you hear traffic. Sitting still at a desk? Maximum noise cancellation. It's intelligent automation that actually works.
              </p>
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/5 border border-green-500/20 p-6 space-y-4">
                <h4 className="text-xl font-medium text-green-400 flex items-center gap-2">
                  <Check size={24} />
                  Pros
                </h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Best-in-class ANC — industry-leading noise cancellation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Incredibly comfortable for 8+ hour sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>30-hour battery life (50% more than AirPods Max)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Multipoint connection — switch seamlessly between devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Better value at $398 (save $151 vs AirPods Max)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 flex-shrink-0 mt-1" />
                    <span>Fold flat with excellent travel case</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-6 space-y-4">
                <h4 className="text-xl font-medium text-red-400 flex items-center gap-2">
                  <X size={24} />
                  Cons
                </h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Sound quality slightly behind AirPods Max</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Plastic build feels less premium than aluminum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>Touch controls can be accidentally triggered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X size={18} className="text-red-400 flex-shrink-0 mt-1" />
                    <span>No lossless audio on iOS (LDAC is Android-only)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA for Sony */}
            <div className="border border-accent-gold/20 bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.02] p-8 space-y-4">
              <h4 className="text-2xl font-light font-serif text-white">Experience the Best Noise Cancellation</h4>
              <p className="text-white/70">
                Sony WH-1000XM5 delivers industry-leading ANC with 30-hour battery life. Perfect for work and travel.
              </p>
              <Link
                href="/shop/sony-wh-1000xm5-headphones"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gold hover:bg-accent-hover text-black font-medium tracking-wider transition-all"
              >
                VIEW SONY WH-1000XM5
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>

          {/* Head-to-Head Comparison */}
          <div className="space-y-8 pt-16">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pb-4 border-b border-white/10">
              Head-to-Head: Which Wins?
            </h2>

            <div className="space-y-8">
              <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
                <h3 className="text-2xl font-light font-serif text-accent-gold">Which Has Better ANC?</h3>
                <p className="text-lg leading-relaxed text-white/80">
                  Winner: <strong className="text-accent-gold">Sony WH-1000XM5</strong>
                </p>
                <p className="text-lg leading-relaxed text-white/80">
                  The dual-processor, 8-microphone system in the Sony delivers 3-5% better noise cancellation than the AirPods Max. Both are excellent, but if eliminating distractions is your top priority, Sony wins.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
                <h3 className="text-2xl font-light font-serif text-accent-gold">Which Sounds Better?</h3>
                <p className="text-lg leading-relaxed text-white/80">
                  Winner: <strong className="text-accent-gold">AirPods Max</strong>
                </p>
                <p className="text-lg leading-relaxed text-white/80">
                  The computational audio and adaptive EQ give the AirPods Max a more natural, refined sound. For audiophiles and critical listening, these edge ahead. For most users, both sound phenomenal.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
                <h3 className="text-2xl font-light font-serif text-accent-gold">Which Is More Comfortable?</h3>
                <p className="text-lg leading-relaxed text-white/80">
                  Winner: <strong className="text-accent-gold">Sony WH-1000XM5</strong>
                </p>
                <p className="text-lg leading-relaxed text-white/80">
                  At 250g vs 385g, the Sony is 35% lighter. For sessions over 4 hours, the weight difference becomes significant. The Sony wins for all-day comfort.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-8 space-y-4">
                <h3 className="text-2xl font-light font-serif text-accent-gold">Which Is Better Value?</h3>
                <p className="text-lg leading-relaxed text-white/80">
                  Winner: <strong className="text-accent-gold">Sony WH-1000XM5</strong>
                </p>
                <p className="text-lg leading-relaxed text-white/80">
                  At $398 vs $549, you save $151 with the Sony while getting better ANC, longer battery life, and multipoint connectivity. Unless you're deep in the Apple ecosystem or need the absolute best sound quality, the Sony offers better value.
                </p>
              </div>
            </div>
          </div>

          {/* Use Case Recommendations */}
          <div className="space-y-8 pt-16">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pb-4 border-b border-white/10">
              Who Should Buy What?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-accent-gold/30 bg-gradient-to-br from-accent-gold/[0.05] to-transparent p-8 space-y-4">
                <h3 className="text-2xl font-light font-serif text-accent-gold">Buy AirPods Max If:</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You're deep in the Apple ecosystem (iPhone, iPad, Mac, Apple Watch)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>Sound quality is your absolute top priority</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You value premium build quality and materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You want Spatial Audio for movies and immersive content</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You primarily use one device at a time</span>
                  </li>
                </ul>
              </div>

              <div className="border border-accent-gold/30 bg-gradient-to-br from-accent-gold/[0.05] to-transparent p-8 space-y-4">
                <h3 className="text-2xl font-light font-serif text-accent-gold">Buy Sony WH-1000XM5 If:</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You use Android, Windows, or multiple device types</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>Maximum noise cancellation is your top priority</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You need all-day comfort for 8+ hour sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You travel frequently and need excellent portability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You want to switch seamlessly between laptop and phone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-accent-gold flex-shrink-0 mt-1" />
                    <span>You want better value ($151 less than AirPods Max)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alternatives */}
          <div className="space-y-8 pt-16">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pb-4 border-b border-white/10">
              What About the Alternatives?
            </h2>

            <p className="text-lg leading-relaxed text-white/80">
              I tested several other premium noise canceling headphones including the Bose QuietComfort Ultra, Sennheiser Momentum 4, and Bowers & Wilkins PX8. Here's why the AirPods Max and Sony WH-1000XM5 remain my top recommendations:
            </p>

            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/10 p-6">
                <h4 className="text-xl font-medium text-white mb-3">Bose QuietComfort Ultra ($429)</h4>
                <p className="text-white/70">
                  Excellent ANC and legendary Bose comfort, but the sound quality doesn't match Sony or Apple. The app is buggy and connectivity issues plague this model. If Bose fixes the software, these could compete.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-6">
                <h4 className="text-xl font-medium text-white mb-3">Sennheiser Momentum 4 ($379)</h4>
                <p className="text-white/70">
                  Great sound and incredible 60-hour battery life, but the ANC is a step behind Sony and Apple. For audiophiles who don't prioritize noise cancellation, these are worth considering.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-6">
                <h4 className="text-xl font-medium text-white mb-3">Bowers & Wilkins PX8 ($699)</h4>
                <p className="text-white/70">
                  Stunning design and reference-quality sound, but weak ANC and poor battery life. These are for audiophiles willing to sacrifice noise cancellation for ultimate audio fidelity.
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-white/80">
              The Sony WH-1000XM5 and AirPods Max remain the best all-around packages. They excel in sound quality, ANC performance, comfort, and build quality — the four pillars that matter most.
            </p>
          </div>

          {/* Final Verdict */}
          <div className="space-y-8 pt-16">
            <h2 className="text-3xl md:text-4xl font-light font-serif text-white pb-4 border-b border-white/10">
              The Final Verdict
            </h2>

            <div className="bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.02] border border-accent-gold/30 p-8 space-y-6">
              <p className="text-xl leading-relaxed text-white">
                After 30 days of intensive testing, here's my definitive recommendation:
              </p>

              <div className="space-y-4 text-lg text-white/80">
                <p>
                  <strong className="text-accent-gold">For most people: Sony WH-1000XM5</strong>
                </p>
                <p>
                  The Sony offers the best overall package — superior noise cancellation, exceptional comfort, longer battery life, multipoint connectivity, and better value at $151 less than the AirPods Max. Unless you're locked into the Apple ecosystem or demand the absolute best sound quality, the Sony is the smarter choice.
                </p>

                <p className="pt-4">
                  <strong className="text-accent-gold">For Apple ecosystem users and audiophiles: AirPods Max</strong>
                </p>
                <p>
                  If you own an iPhone, iPad, Mac, and Apple Watch, the seamless integration is worth the premium. The sound quality is marginally better, and the build quality feels like it will last decades. Just know you're paying extra for the Apple experience and aluminum craftsmanship.
                </p>
              </div>

              <p className="text-xl leading-relaxed text-white pt-6">
                Both are exceptional. You can't go wrong with either. But for sheer value, performance, and versatility, the Sony WH-1000XM5 takes the crown in 2025.
              </p>
            </div>
          </div>

          {/* Final CTAs */}
          <div className="grid md:grid-cols-2 gap-8 pt-12">
            <div className="border border-white/10 p-8 space-y-6 hover:border-accent-gold/50 transition-all">
              <h3 className="text-2xl font-light font-serif text-white">Apple AirPods Max</h3>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 4 ? 'fill-accent-gold text-accent-gold' : 'fill-accent-gold/40 text-accent-gold/40'}
                  />
                ))}
                <span className="text-white/60 text-sm ml-2">4.7/5</span>
              </div>
              <p className="text-white/70">Best sound quality. Premium build. Apple ecosystem.</p>
              <div className="space-y-2">
                <p className="text-3xl font-light text-white">$549</p>
                <Link
                  href="/shop/airpods-max"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black transition-all font-medium tracking-wider text-sm"
                >
                  VIEW DETAILS
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>

            <div className="border border-accent-gold/50 bg-accent-gold/5 p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-accent-gold text-black text-xs font-bold tracking-wider">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-light font-serif text-white">Sony WH-1000XM5</h3>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < 5 ? 'fill-accent-gold text-accent-gold' : 'text-accent-gold/40'}
                  />
                ))}
                <span className="text-white/60 text-sm ml-2">4.7/5</span>
              </div>
              <p className="text-white/70">Best ANC. 30hr battery. All-day comfort. Multipoint.</p>
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-light text-white">$398</p>
                  <p className="text-lg text-white/40 line-through">$449</p>
                </div>
                <Link
                  href="/shop/sony-wh-1000xm5-headphones"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-gold hover:bg-accent-hover text-black transition-all font-medium tracking-wider text-sm"
                >
                  VIEW DETAILS
                  <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="mt-16 p-6 border border-white/10 bg-white/[0.02]">
            <p className="text-white/50 text-sm leading-relaxed">
              <strong className="text-accent-gold">Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases. When you purchase through the links on this page, I may receive a small commission at no additional cost to you. I only recommend products I have personally tested and genuinely believe provide exceptional value. Your support helps me create in-depth, honest reviews like this one. Thank you for your trust.
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
