'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { X, Heart } from 'lucide-react'

interface GenesisPhoto {
  id: string
  src: string
  title: string
  story: string
  category: 'editorial' | 'campaign' | 'runway'
  brand?: string
}

const genesisPhotos: GenesisPhoto[] = [
  // EDITORIAL PHOTOS (28 photos)
  {
    id: 'e1',
    src: '/images/gallery/genesis/editorial/b.1.jpg',
    title: 'Urban Nights',
    story: 'Shot on the streets of New York, this editorial captured the raw energy of city life. The denim jacket became iconic in my early portfolio.',
    category: 'editorial'
  },
  {
    id: 'e2',
    src: '/images/gallery/genesis/editorial/B.2.jpg',
    title: 'Innovative Artists NY',
    story: 'My signature headshot for Innovative Artists. This image opened doors to major campaigns and taught me the power of a direct gaze.',
    category: 'editorial',
    brand: 'Innovative Artists'
  },
  {
    id: 'e3',
    src: '/images/gallery/genesis/editorial/B.3.jpg',
    title: 'TETU Magazine Cover',
    story: 'Landing this French magazine cover was a career milestone. Shot in Paris, this editorial explored modern masculinity and confidence.',
    category: 'editorial',
    brand: 'TETU Magazine'
  },
  {
    id: 'e11',
    src: '/images/gallery/genesis/editorial/B.11.jpg',
    title: 'Luxury Outerwear Editorial',
    story: 'This fur-lined jacket shoot pushed boundaries with its bold styling. The photographer said I brought an unexpected vulnerability to high fashion.',
    category: 'editorial'
  },
  {
    id: 'e12',
    src: '/images/gallery/genesis/editorial/B.12.jpg',
    title: 'Winter Collection',
    story: 'Shot during golden hour, this editorial showcased how light transforms a simple moment into cinematic storytelling.',
    category: 'editorial'
  },
  {
    id: 'e13',
    src: '/images/gallery/genesis/editorial/B.13.jpg',
    title: 'Athletic Elegance',
    story: 'Merging sportswear with high fashion, this shoot explored the intersection of strength and style in contemporary menswear.',
    category: 'editorial'
  },
  {
    id: 'e14',
    src: '/images/gallery/genesis/editorial/B.14.jpg',
    title: 'Architectural Lines',
    story: 'Using urban architecture as a backdrop, this editorial played with geometric shapes and modern minimalism.',
    category: 'editorial'
  },
  {
    id: 'e15',
    src: '/images/gallery/genesis/editorial/B.15.jpg',
    title: 'Rugged Sophistication',
    story: 'The fur-trimmed hood and intense expression captured a duality that became my signature—raw yet refined.',
    category: 'editorial'
  },
  {
    id: 'e16',
    src: '/images/gallery/genesis/editorial/B.16.jpg',
    title: 'Classic Menswear',
    story: 'This tailored look reminded me why timeless pieces never go out of style. Sometimes simplicity speaks loudest.',
    category: 'editorial'
  },
  {
    id: 'e17',
    src: '/images/gallery/genesis/editorial/B.17.jpg',
    title: 'Monochrome Mood',
    story: 'Shot in black and white to emphasize texture and emotion over color. The photographer taught me how shadows tell stories.',
    category: 'editorial'
  },
  {
    id: 'e18',
    src: '/images/gallery/genesis/editorial/B.18.jpg',
    title: 'Desert Editorial',
    story: 'Shooting in 110-degree heat in the Mojave Desert tested my endurance, but the dramatic landscape was worth every drop of sweat.',
    category: 'editorial'
  },
  {
    id: 'e20',
    src: '/images/gallery/genesis/editorial/B.20.jpg',
    title: 'Contemporary Casual',
    story: 'This relaxed editorial proved that modeling is not just about high fashion—authenticity resonates just as powerfully.',
    category: 'editorial'
  },
  {
    id: 'e21',
    src: '/images/gallery/genesis/editorial/B.21.jpg',
    title: 'Refined Rebellion',
    story: 'Mixing luxury pieces with street style, this shoot challenged conventional ideas about what makes a look "editorial."',
    category: 'editorial'
  },
  {
    id: 'e22',
    src: '/images/gallery/genesis/editorial/B.22.jpg',
    title: 'Natural Light Portrait',
    story: 'My favorite shoots use only natural light. This portrait captured a rare moment of stillness during a hectic fashion week.',
    category: 'editorial'
  },
  {
    id: 'e23',
    src: '/images/gallery/genesis/editorial/B.23.jpg',
    title: 'Editorial Intensity',
    story: 'The creative director wanted "dangerous elegance." We found it in the tension between formal wear and raw expression.',
    category: 'editorial'
  },
  {
    id: 'e24',
    src: '/images/gallery/genesis/editorial/B.24.jpg',
    title: 'Layered Textures',
    story: 'This editorial explored how different fabrics interact—leather, wool, cotton—each telling its own tactile story.',
    category: 'editorial'
  },
  {
    id: 'r1',
    src: '/images/gallery/genesis/runway/B.25.jpg',
    title: 'Runway Debut',
    story: 'Walking the runway with confidence and presence. This moment captured the power of movement and the energy of live fashion.',
    category: 'runway'
  },
  {
    id: 'e26',
    src: '/images/gallery/genesis/editorial/b.26.jpg',
    title: 'Dramatic Lighting',
    story: 'Working with a legendary photographer who taught me that great modeling is about finding light, not fighting it.',
    category: 'editorial'
  },
  {
    id: 'e27',
    src: '/images/gallery/genesis/editorial/B.27.jpg',
    title: 'Fashion Forward',
    story: 'This avant-garde editorial pushed my comfort zone. Sometimes the best work happens when you surrender to the creative vision.',
    category: 'editorial'
  },
  {
    id: 'e28',
    src: '/images/gallery/genesis/editorial/B.28.jpg',
    title: 'Casual Luxury',
    story: 'Proving that high-end fashion can feel effortless. This shoot taught me that confidence is the best accessory.',
    category: 'editorial'
  },
  {
    id: 'e29',
    src: '/images/gallery/genesis/editorial/B.29.jpg',
    title: 'Studio Simplicity',
    story: 'Sometimes a clean white background and great styling are all you need. Less truly can be more.',
    category: 'editorial'
  },
  {
    id: 'e30',
    src: '/images/gallery/genesis/editorial/b.30.jpg',
    title: 'Timeless Portrait',
    story: 'This portrait became one of my most requested comp card images. A reminder that one perfect frame can define a career.',
    category: 'editorial'
  },
  {
    id: 'e31',
    src: '/images/gallery/genesis/editorial/B.31.jpg',
    title: 'Street Style',
    story: 'Capturing the energy of urban fashion culture, this editorial blurred the line between runway and real life.',
    category: 'editorial'
  },
  {
    id: 'e32',
    src: '/images/gallery/genesis/editorial/B.32.jpg',
    title: 'Modern Minimalism',
    story: 'Clean lines, neutral tones, and strong composition. This shoot embodied the "less is more" philosophy.',
    category: 'editorial'
  },
  {
    id: 'e33',
    src: '/images/gallery/genesis/editorial/B.33.jpg',
    title: 'Artistic Expression',
    story: 'When fashion becomes art. This experimental editorial allowed complete creative freedom—the results spoke for themselves.',
    category: 'editorial'
  },
  {
    id: 'e34',
    src: '/images/gallery/genesis/editorial/B.34.jpg',
    title: 'Sophisticated Edge',
    story: 'Balancing refined tailoring with an edgy attitude. The stylist said this look captured "gentleman rebel" perfectly.',
    category: 'editorial'
  },
  {
    id: 'e35',
    src: '/images/gallery/genesis/editorial/B.35.jpg',
    title: 'Cinematic Moment',
    story: 'Shot like a film still, this editorial proved that every frame should tell a story beyond the clothes.',
    category: 'editorial'
  },
  {
    id: 'e36',
    src: '/images/gallery/genesis/editorial/B.36.jpg',
    title: 'Final Frame',
    story: 'The last shot of a 14-hour day. Sometimes exhaustion creates the most authentic moments on camera.',
    category: 'editorial'
  },

  // CAMPAIGN PHOTOS (22 photos)
  {
    id: 'c4',
    src: '/images/gallery/genesis/campaigns/B.4.jpg',
    title: 'Golden Hour Campaign',
    story: 'This campaign shoot captured the perfect light during magic hour. The soft, warm tones became the signature of the brand season.',
    category: 'campaign'
  },
  {
    id: 'c5',
    src: '/images/gallery/genesis/campaigns/B.5.jpg',
    title: 'Industrial Edge',
    story: 'Shot on location at an abandoned bridge, this campaign merged urban grit with high-fashion sensibility for a streetwear brand.',
    category: 'campaign'
  },
  {
    id: 'c6',
    src: '/images/gallery/genesis/campaigns/B.6.jpg',
    title: 'Red Pattern Campaign',
    story: 'Bold prints and dramatic lighting defined this memorable campaign. The red pattern became iconic for the season.',
    category: 'campaign'
  },
  {
    id: 'c7',
    src: '/images/gallery/genesis/campaigns/B.7.jpg',
    title: 'Luxury Sportswear',
    story: 'When athletic meets luxury. This campaign revolutionized how the brand approached casual elegance.',
    category: 'campaign'
  },
  {
    id: 'c8',
    src: '/images/gallery/genesis/campaigns/B.8.jpg',
    title: 'Premium Denim',
    story: 'A major denim campaign that ran in stores worldwide. Simple, powerful, and timeless—exactly what great advertising should be.',
    category: 'campaign'
  },
  {
    id: 'c9',
    src: '/images/gallery/genesis/campaigns/B.9.jpg',
    title: 'Heritage Collection',
    story: 'This campaign celebrated classic American style with a modern twist. Shot on film for authentic vintage aesthetics.',
    category: 'campaign'
  },
  {
    id: 'c10',
    src: '/images/gallery/genesis/campaigns/B.10.jpg',
    title: 'Fall Campaign',
    story: 'Layered looks for the fall season. The creative team wanted "approachable luxury"—we delivered exactly that.',
    category: 'campaign'
  },
  {
    id: 'c37',
    src: '/images/gallery/genesis/campaigns/B.37.jpg',
    title: 'Summer Resort Collection',
    story: 'Shot at a luxury resort overlooking the Mediterranean. This campaign embodied effortless summer sophistication.',
    category: 'campaign'
  },
  {
    id: 'c38',
    src: '/images/gallery/genesis/campaigns/B.38.jpg',
    title: 'Tailored Elegance',
    story: 'A suit campaign that proved formal wear can still feel modern and relevant. Every detail mattered in this precision shoot.',
    category: 'campaign'
  },
  {
    id: 'c39',
    src: '/images/gallery/genesis/campaigns/B.39.jpg',
    title: 'Lifestyle Brand',
    story: 'More than fashion—this campaign sold a lifestyle. We shot for three days capturing authentic moments of modern living.',
    category: 'campaign'
  },
  {
    id: 'c40',
    src: '/images/gallery/genesis/campaigns/B.40.jpg',
    title: 'Underwear Campaign',
    story: 'A major underwear campaign that required intense physical preparation and absolute confidence. The results spoke for themselves.',
    category: 'campaign'
  },
  {
    id: 'c41',
    src: '/images/gallery/genesis/campaigns/B.41.jpg',
    title: 'Activewear Line',
    story: 'Merging fitness with fashion, this campaign showcased how performance wear became everyday style.',
    category: 'campaign'
  },
  {
    id: 'c42',
    src: '/images/gallery/genesis/campaigns/B.42.jpg',
    title: 'Casual Weekend',
    story: 'This laid-back campaign resonated with audiences because it felt real. Great marketing should never feel like marketing.',
    category: 'campaign'
  },
  {
    id: 'c43',
    src: '/images/gallery/genesis/campaigns/B.43.jpg',
    title: 'Global Campaign',
    story: 'Shot for international markets, this campaign ran in over 30 countries. Seeing your face on billboards worldwide is surreal.',
    category: 'campaign'
  },
  {
    id: 'c44',
    src: '/images/gallery/genesis/campaigns/B.44.jpg',
    title: 'Accessory Focus',
    story: 'Sometimes it is about the watch, the shoes, the details. This campaign taught me how to make accessories the hero.',
    category: 'campaign'
  },
  {
    id: 'c45',
    src: '/images/gallery/genesis/campaigns/B.45.jpg',
    title: 'Coastal Living',
    story: 'Shot on the California coast, this campaign captured the aspirational lifestyle the brand represented.',
    category: 'campaign',
    brand: 'Luxury Resort Wear'
  },
  {
    id: 'c46',
    src: '/images/gallery/genesis/campaigns/B.46.jpg',
    title: 'Contemporary Menswear',
    story: 'A modern take on classic menswear. This campaign balanced tradition with innovation perfectly.',
    category: 'campaign'
  },
  {
    id: 'c47',
    src: '/images/gallery/genesis/campaigns/B.47.jpg',
    title: 'Seasonal Campaign',
    story: 'Every season brought new challenges and creative opportunities. This one remains a personal favorite.',
    category: 'campaign'
  },
  {
    id: 'c48',
    src: '/images/gallery/genesis/campaigns/B.48.jpg',
    title: 'Brand Ambassador',
    story: 'Becoming the face of a brand meant embodying their values in every frame. This campaign cemented that relationship.',
    category: 'campaign'
  },
  {
    id: 'c49',
    src: '/images/gallery/genesis/campaigns/B.49.jpg',
    title: 'Signature Look',
    story: 'Some campaigns define your career. This was one of them—the images that opened bigger doors.',
    category: 'campaign'
  },
  {
    id: 'c50',
    src: '/images/gallery/genesis/campaigns/B.50.jpg',
    title: 'Premium Campaign',
    story: 'Luxury brand work required a different energy—refined, controlled, but never cold. Finding that balance was key.',
    category: 'campaign'
  },
  {
    id: 'c51',
    src: '/images/gallery/genesis/campaigns/B.51.jpg',
    title: 'Career Defining',
    story: 'This campaign marked a turning point in my career. The moment when modeling became more than just poses—it became storytelling.',
    category: 'campaign'
  }
]

export default function GenesisGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<GenesisPhoto | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'editorial' | 'campaign' | 'runway'>('all')

  const filteredPhotos = activeTab === 'all'
    ? genesisPhotos
    : genesisPhotos.filter(photo => photo.category === activeTab)

  const editorialCount = genesisPhotos.filter(p => p.category === 'editorial').length
  const campaignCount = genesisPhotos.filter(p => p.category === 'campaign').length
  const runwayCount = genesisPhotos.filter(p => p.category === 'runway').length

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

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm tracking-[0.3em] uppercase text-accent-gold mb-4">
              The Archive
            </p>
            <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
              Genesis
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent mx-auto my-8" />
            <p className="text-xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              Where it all began. 50 photos from runway shows, campaigns, and editorials that shaped a career.
              From major luxury brands to groundbreaking magazine covers—each image tells a story of transformation and rebirth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Rebirth - Andrew Gerard Story */}
      <section className="pb-20 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="border border-accent-gold/30 bg-gradient-to-br from-accent-gold/10 to-transparent p-12 rounded-3xl">
            <div className="text-center mb-8">
              <Heart className="text-accent-gold mx-auto mb-4" size={40} fill="currentColor" />
              <h2 className="text-3xl md:text-4xl font-light font-serif text-white mb-4">
                The Rebirth
              </h2>
              <p className="text-accent-gold text-sm tracking-wider uppercase">
                Andrew Gerard — Vancouver
              </p>
            </div>

            <div className="space-y-6 text-white/80 leading-relaxed">
              <p className="text-xl font-light font-serif text-white text-center italic">
                "Cancer victim was my new identity."
              </p>

              <p>
                This archive includes my first modeling collaboration after being declared cancer-free. I was lost.
                The person I used to be felt like a ghost. Cancer had stripped away my identity, my confidence,
                my sense of self. All that remained was the label: <em>cancer survivor</em>.
              </p>

              <p>
                Andrew Gerard saw something in me that I couldn't see yet. He created space for me to play
                the <strong>bad guy</strong> — to embody strength, darkness, edge. Something opposite of
                the fragility I felt inside.
              </p>

              <p className="text-accent-gold italic text-center">
                "Like droplets of mercury coalescing..."
              </p>

              <p>
                That's how it felt. Each frame we shot, each character choice, each moment of embodied
                power — they were small pieces of myself coming back together. Not the old me. A new me.
                Stronger. Wiser. Reborn through fire.
              </p>

              <p>
                I am so grateful for Andrew working with me at a time when I couldn't yet see that I could
                get my career back. This collaboration wasn't just a photoshoot. It was the first step toward
                reclaiming my life. And now, the career is even stronger than before.
              </p>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Photographer</p>
                <a
                  href="https://www.instagram.com/andrewgerardphotography"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-serif text-accent-gold hover:text-accent-hover transition-colors inline-block"
                >
                  Andrew Gerard
                </a>
                <p className="text-white/60 mt-2">Director of Photography • Vancouver, Canada</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="pb-12 container-wide">
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 border transition-all ${
              activeTab === 'all'
                ? 'border-accent-gold text-accent-gold bg-accent-gold/10'
                : 'border-white/20 text-white/60 hover:border-accent-gold/50 hover:text-white'
            }`}
          >
            All ({genesisPhotos.length})
          </button>
          <button
            onClick={() => setActiveTab('runway')}
            className={`px-6 py-3 border transition-all ${
              activeTab === 'runway'
                ? 'border-accent-gold text-accent-gold bg-accent-gold/10'
                : 'border-white/20 text-white/60 hover:border-accent-gold/50 hover:text-white'
            }`}
          >
            Runway ({runwayCount})
          </button>
          <button
            onClick={() => setActiveTab('editorial')}
            className={`px-6 py-3 border transition-all ${
              activeTab === 'editorial'
                ? 'border-accent-gold text-accent-gold bg-accent-gold/10'
                : 'border-white/20 text-white/60 hover:border-accent-gold/50 hover:text-white'
            }`}
          >
            Editorial ({editorialCount})
          </button>
          <button
            onClick={() => setActiveTab('campaign')}
            className={`px-6 py-3 border transition-all ${
              activeTab === 'campaign'
                ? 'border-accent-gold text-accent-gold bg-accent-gold/10'
                : 'border-white/20 text-white/60 hover:border-accent-gold/50 hover:text-white'
            }`}
          >
            Campaigns ({campaignCount})
          </button>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="pb-32 container-wide">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="masonry-grid"
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="gallery-item-full cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-accent-gold text-xs tracking-[0.2em] uppercase mb-2">
                      {photo.category}
                    </p>
                    <h3 className="text-white text-xl font-serif mb-2">
                      {photo.title}
                    </h3>
                    {photo.brand && (
                      <p className="text-accent-gold/80 text-sm">
                        {photo.brand}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm border border-accent-gold/30 text-accent-gold text-xs tracking-wider uppercase">
                  {photo.category}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 md:top-8 right-4 md:right-8 text-white hover:text-accent-gold transition-colors z-10 p-2"
            aria-label="Close"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-6xl w-full grid md:grid-cols-2 gap-8 md:gap-12 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative flex items-center justify-center overflow-hidden">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                width={800}
                height={1200}
                className="w-full h-auto object-contain max-h-[80vh]"
                quality={100}
              />
            </div>

            {/* Story */}
            <div className="flex flex-col justify-center space-y-6 overflow-y-auto max-h-[80vh] pr-4">
              <div>
                <p className="text-accent-gold text-xs tracking-[0.3em] uppercase mb-2">
                  {selectedPhoto.category}
                </p>
                <h2 className="text-3xl md:text-4xl font-light font-serif text-white mb-4">
                  {selectedPhoto.title}
                </h2>
              </div>

              {selectedPhoto.brand && (
                <div>
                  <p className="text-accent-gold text-sm tracking-wider uppercase mb-1">Brand</p>
                  <p className="text-white/90 text-lg">{selectedPhoto.brand}</p>
                </div>
              )}

              <div className="w-24 h-px bg-gradient-to-r from-accent-gold to-transparent" />

              <div>
                <p className="text-accent-gold text-sm tracking-wider uppercase mb-3">The Story</p>
                <p className="text-white/70 text-lg leading-relaxed">
                  {selectedPhoto.story}
                </p>
              </div>

              <div className="pt-6">
                <p className="text-white/40 text-sm italic">
                  Genesis modeling archive • Part of Brandon&apos;s journey from model to entrepreneur
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
