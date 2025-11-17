// Amazon Affiliate Products Database
// Tracking ID: brandonmills.com-20

export interface AffiliateProduct {
  id: string
  name: string
  slug: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  inStock: boolean
  amazonUrl: string
  images: string[]
  description: string
  features: string[]
  specs: Record<string, string>
  benefits: string[]
  forWhom: string[]
  featured?: boolean
}

const AFFILIATE_TAG = 'brandonmills.com-20'

export const affiliateProducts: AffiliateProduct[] = [
  // BEAUTY & SKINCARE
  {
    id: 'braun-ipl-pro-7',
    slug: 'braun-ipl-laser-hair-removal',
    name: 'Braun IPL at Home Laser Hair Removal for Women and Men, Silk Expert Pro 7',
    brand: 'Braun',
    category: 'Beauty & Personal Care',
    price: 499.99,
    originalPrice: 699.99,
    rating: 4.5,
    reviewCount: 12847,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Braun-i%C2%B7expert-Removal-Holiday-Trimmer/dp/B0CMVPMPZ8?tag=${AFFILIATE_TAG}`,
    images: [
      '/images/products/braun-ipl-1.jpg', // Will be populated with actual images
      '/images/products/braun-ipl-2.jpg',
      '/images/products/braun-ipl-3.jpg',
    ],
    description: `The Braun Silk Expert Pro 7 is the world's #1 IPL device, offering professional-grade at-home laser hair removal for both women and men. With advanced SensoAdapt technology and 400,000 flashes, achieve permanent visible hair reduction in just 4 weeks.`,
    features: [
      'SensoAdapt™ Technology - Continuously adapts to your skin tone for optimal efficacy and safety',
      '400,000 Flashes - Enough for over 22 years of full body treatments',
      '10 Intensity Levels - Customizable power for different body areas and skin sensitivities',
      'Ultra-Fast Treatment - Largest flash window (4cm²) covers more skin per flash',
      'Precision Head Included - Ideal for face, bikini line, and sensitive areas',
      'Cordless & Rechargeable - Freedom to treat anywhere without being tethered',
      'Dermatologist Recommended - Clinically tested for safety and effectiveness',
      'FDA Cleared - Meets strict medical device standards',
    ],
    specs: {
      'Flash Window Size': '4 cm²',
      'Total Flashes': '400,000',
      'Intensity Levels': '10 adjustable settings',
      'Power Source': 'Rechargeable battery',
      'Treatment Time': 'Full body in ~20 minutes',
      'Skin Tone Compatibility': 'Light to medium brown (Fitzpatrick I-V)',
      'Hair Color Compatibility': 'Dark blonde to black',
      'Warranty': '2 years manufacturer warranty',
      'Package Includes': 'Main device, precision head, Venus razor, storage pouch, power adapter',
    },
    benefits: [
      'Permanent Visible Hair Reduction - FDA-cleared IPL technology targets hair follicles',
      'Professional Results at Home - Save thousands vs salon laser treatments',
      'Safe for All Genders - Effective on face and body for both women and men',
      'Pain-Free Experience - Gentle flashes with minimal discomfort (rated 2/10 pain level)',
      'Long-Term Investment - Device lasts 22+ years with proper use',
      'Clinically Proven - 92% of users report significant hair reduction in 4 weeks',
      'Convenient & Private - Treat on your own schedule in the comfort of home',
      'Cost Effective - ~$500 vs $3,000+ for professional laser sessions',
    ],
    forWhom: [
      'Women seeking permanent hair removal for legs, arms, underarms, bikini line, and face',
      'Men wanting to reduce chest, back, shoulder, and facial hair',
      'Anyone tired of shaving, waxing, or threading every few days',
      'People with light to medium skin tones and dark hair (most effective)',
      'Those seeking professional results without salon appointments',
      'Busy professionals who value time-saving beauty routines',
      'Anyone looking for a one-time investment vs recurring salon costs',
    ],
    featured: true,
  },
  {
    id: 'la-mer-creme',
    slug: 'la-mer-moisturizing-cream',
    name: 'La Mer The Moisturizing Cream',
    brand: 'La Mer',
    category: 'Luxury Skincare',
    price: 380.00,
    originalPrice: 420.00,
    rating: 4.6,
    reviewCount: 3421,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Mer-Moisturizing-Cream-Ounce/dp/B000C1XWN0?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/la-mer-1.jpg'],
    description: 'The legendary Crème de la Mer. A transformative cream that renews skin with natural sea-sourced Miracle Broth™. The ultimate luxury in skincare.',
    features: [
      'Miracle Broth™ - Sea-sourced fermented ingredients for skin renewal',
      'Deep Hydration - 12-hour moisture barrier protection',
      'Reduces Fine Lines - Visibly smooths and firms skin texture',
      'Calms Inflammation - Soothes redness and irritation',
      'Lightweight Texture - Absorbs quickly without heaviness',
    ],
    specs: {
      'Size': '2 oz (60ml)',
      'Skin Type': 'All skin types',
      'Key Ingredients': 'Sea Kelp, Vitamins, Minerals',
      'Application': 'Morning and evening',
      'Origin': 'Made in USA',
    },
    benefits: [
      'Iconic luxury skincare trusted by celebrities and dermatologists',
      'Transformative results with visible skin renewal',
      'Long-lasting hydration for plump, dewy skin',
      'Investment piece - small amount goes a long way',
    ],
    forWhom: [
      'Skincare enthusiasts seeking the ultimate luxury',
      'Mature skin requiring intensive hydration',
      'Anyone wanting visible anti-aging results',
      'Those who appreciate premium, time-tested formulations',
    ],
    featured: true,
  },
  {
    id: 'skinceuticals-ce-ferulic',
    slug: 'skinceuticals-vitamin-c-serum',
    name: 'SkinCeuticals C E Ferulic Vitamin C Antioxidant Serum',
    brand: 'SkinCeuticals',
    category: 'Luxury Skincare',
    price: 182.00,
    rating: 4.7,
    reviewCount: 8934,
    inStock: true,
    amazonUrl: `https://www.amazon.com/SkinCeuticals-Ferulic-Vitamin-Antioxidant-Serum/dp/B00AA8D8U0?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/skinceuticals-1.jpg'],
    description: 'The gold standard in vitamin C serums. Clinically proven to reduce fine lines, firm skin, and brighten complexion with 15% pure vitamin C.',
    features: [
      '15% L-Ascorbic Acid - Pure vitamin C for maximum efficacy',
      '1% Vitamin E - Neutralizes free radicals',
      '0.5% Ferulic Acid - Boosts antioxidant protection',
      'Photoprotection - Shields skin from UV damage',
      'Clinically Proven - 8 years of research and testing',
    ],
    specs: {
      'Size': '1 oz (30ml)',
      'pH Level': '2.0-3.5',
      'Concentration': '15% L-Ascorbic Acid',
      'Application': 'Once daily in morning',
      'Shelf Life': '3-6 months after opening',
    },
    benefits: [
      'Dermatologist-recommended #1 vitamin C serum',
      'Reduces fine lines and wrinkles in 12 weeks',
      'Brightens and evens skin tone',
      'Provides advanced environmental protection',
    ],
    forWhom: [
      'Anyone serious about anti-aging skincare',
      'Those with sun damage or hyperpigmentation',
      'Skincare minimalists wanting one powerful product',
      'People seeking clinically-proven results',
    ],
    featured: true,
  },

  // TECH & ELECTRONICS
  {
    id: 'macbook-pro-16-m3-max',
    slug: 'macbook-pro-16-m3-max',
    name: 'Apple MacBook Pro 16-inch M3 Max Chip, 48GB RAM, 1TB SSD',
    brand: 'Apple',
    category: 'Technology',
    price: 3999.00,
    rating: 4.9,
    reviewCount: 2145,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Apple-MacBook-Laptop-12%E2%80%91core-30%E2%80%91core/dp/B0CM5JV268?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/macbook-pro-1.jpg'],
    description: 'The most powerful MacBook Pro ever. M3 Max chip delivers unprecedented performance for creative professionals. Stunning Liquid Retina XDR display.',
    features: [
      'M3 Max Chip - 16-core CPU, 40-core GPU for extreme performance',
      '48GB Unified Memory - Handle massive projects effortlessly',
      '1TB SSD Storage - Lightning-fast read/write speeds',
      '16.2" Liquid Retina XDR - ProMotion 120Hz, 1000 nits sustained brightness',
      '22-Hour Battery Life - All-day power for intensive work',
      'Advanced Connectivity - 3x Thunderbolt 4, HDMI, SDXC card slot',
    ],
    specs: {
      'Processor': 'Apple M3 Max (16-core CPU, 40-core GPU)',
      'RAM': '48GB unified memory',
      'Storage': '1TB SSD',
      'Display': '16.2" Liquid Retina XDR (3456x2234)',
      'Weight': '4.8 lbs',
      'Ports': '3x Thunderbolt 4, HDMI, MagSafe 3, headphone jack',
    },
    benefits: [
      'Professional-grade performance for video editing, 3D rendering, music production',
      'Industry-leading display for color-accurate work',
      'Future-proof investment with Apple Silicon architecture',
      'Seamless integration with iPhone, iPad, and Apple ecosystem',
    ],
    forWhom: [
      'Content creators and video editors',
      'Photographers and graphic designers',
      'Music producers and audio engineers',
      'Developers working on intensive projects',
      'Anyone demanding the absolute best performance',
    ],
    featured: true,
  },
  {
    id: 'iphone-16-pro-max',
    slug: 'iphone-16-pro-max',
    name: 'Apple iPhone 16 Pro Max, 512GB, Natural Titanium',
    brand: 'Apple',
    category: 'Technology',
    price: 1399.00,
    rating: 4.8,
    reviewCount: 12567,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Apple-iPhone-512GB-Natural-Titanium/dp/B0DGZR5G18?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/iphone-16-1.jpg'],
    description: 'The pinnacle of smartphone technology. A18 Pro chip, 48MP camera system, and titanium design. Pro-level photography and videography in your pocket.',
    features: [
      'A18 Pro Chip - Fastest smartphone processor ever',
      '48MP Main Camera - ProRAW, ProRes video, Spatial photos',
      'Titanium Design - Strongest, lightest iPhone ever',
      '6.9" Super Retina XDR - Always-On display, ProMotion 120Hz',
      '512GB Storage - Massive capacity for photos, videos, apps',
      'USB-C - Universal connectivity with 10Gbps transfer speeds',
    ],
    specs: {
      'Processor': 'A18 Pro chip',
      'Display': '6.9" Super Retina XDR OLED',
      'Camera': '48MP Main, 48MP Ultra Wide, 12MP Telephoto (5x optical zoom)',
      'Storage': '512GB',
      'Battery': 'Up to 29 hours video playback',
      'Materials': 'Titanium frame, Ceramic Shield front',
    },
    benefits: [
      'Pro-level photography and 4K ProRes video recording',
      'All-day battery life with fast charging',
      'Premium titanium build - lightweight and incredibly durable',
      'Future-proof with latest A18 Pro chip and iOS updates',
    ],
    forWhom: [
      'Mobile photographers and videographers',
      'Content creators who shoot on iPhone',
      'Power users needing maximum storage',
      'Anyone wanting the absolute best iPhone',
    ],
    featured: true,
  },

  // PHOTOGRAPHY & STUDIO
  {
    id: 'godox-sl60w',
    slug: 'godox-led-video-light',
    name: 'Godox SL60W LED Video Light, 60W 5600K Daylight Balanced',
    brand: 'Godox',
    category: 'Photo & Video',
    price: 119.00,
    rating: 4.6,
    reviewCount: 4231,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Godox-SL-60W-5600K-Bowens/dp/B01M0Z4H29?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/godox-1.jpg'],
    description: 'Professional continuous LED lighting for photography and videography. 60W output with Bowens mount for versatile light shaping.',
    features: [
      '60W LED Output - Powerful, consistent daylight-balanced light',
      'Bowens Mount - Compatible with thousands of light modifiers',
      'Quiet Cooling - Silent operation for video recording',
      'Remote Control - Wireless brightness adjustment',
      'CRI 95+ - Accurate color reproduction',
    ],
    specs: {
      'Power': '60W LED',
      'Color Temperature': '5600K ±300K',
      'CRI': '95+',
      'Dimming Range': '10%-100%',
      'Mount': 'Bowens S-type',
      'Power Supply': 'AC adapter included',
    },
    benefits: [
      'Professional studio-quality light at affordable price',
      'Perfect for portraits, product photography, YouTube videos',
      'Versatile with softboxes, reflectors, and modifiers',
      'Constant output - no flicker for video work',
    ],
    forWhom: [
      'YouTubers and content creators',
      'Portrait photographers',
      'Product photographers',
      'Anyone building a home studio',
    ],
    featured: true,
  },

  // BOOKS
  {
    id: 'atomic-habits',
    slug: 'atomic-habits-book',
    name: 'Atomic Habits by James Clear',
    brand: 'Avery',
    category: 'Books',
    price: 13.99,
    originalPrice: 27.00,
    rating: 4.8,
    reviewCount: 87432,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/atomic-habits-1.jpg'],
    description: 'Transform your life with tiny changes that deliver remarkable results. The definitive guide to habit formation from bestselling author James Clear.',
    features: [
      'Proven Framework - 4 Laws of Behavior Change',
      'Practical Strategies - Actionable steps for habit building',
      'Science-Backed - Research on habit psychology and neuroscience',
      'Real Examples - Stories from Olympic athletes, CEOs, artists',
    ],
    specs: {
      'Format': 'Hardcover',
      'Pages': '320 pages',
      'Publisher': 'Avery',
      'Language': 'English',
      'Dimensions': '6.4 x 1.1 x 9.6 inches',
    },
    benefits: [
      'Build good habits that stick and break bad ones',
      'Master tiny behaviors that lead to remarkable results',
      'Overcome lack of motivation and willpower',
      'Design your environment for success',
    ],
    forWhom: [
      'Anyone wanting to improve their habits',
      'Entrepreneurs and high performers',
      'People struggling with consistency',
      'Self-improvement enthusiasts',
    ],
    featured: true,
  },

  // PLANT CARE
  {
    id: 'spider-farmer-sf1000',
    slug: 'spider-farmer-led-grow-light',
    name: 'Spider Farmer SF1000 LED Grow Light, Full Spectrum for Indoor Plants',
    brand: 'Spider Farmer',
    category: 'Home & Garden',
    price: 109.99,
    rating: 4.7,
    reviewCount: 9234,
    inStock: true,
    amazonUrl: `https://www.amazon.com/Spider-Farmer-Compatible-Spectrum-Hydroponic/dp/B07TS82HX6?tag=${AFFILIATE_TAG}`,
    images: ['/images/products/spider-farmer-1.jpg'],
    description: 'Premium full-spectrum LED grow light for thriving indoor plants. Samsung LM301B diodes deliver optimal PAR output for all growth stages.',
    features: [
      'Samsung LM301B Diodes - Industry-leading efficiency',
      'Full Spectrum - 3000K, 5000K, 660nm, 760nm IR for all stages',
      'High Efficiency - 2.9 µmol/J PPE, lower energy costs',
      'Silent Operation - Fanless design, zero noise',
      'Dimmable - Adjust intensity for seedlings to flowering',
    ],
    specs: {
      'Power Draw': '100W',
      'PPF': '290 µmol/s',
      'Coverage': '2x2 ft (veg), 1.5x1.5 ft (flower)',
      'Diodes': '1016 Samsung LM301B LEDs',
      'Lifespan': '50,000+ hours',
      'Dimensions': '12.4 x 10.6 x 2.2 inches',
    },
    benefits: [
      'Year-round indoor gardening regardless of climate',
      'Healthier, faster-growing plants',
      '50% more energy efficient than HPS/MH lights',
      'Perfect for herbs, vegetables, succulents, flowers',
    ],
    forWhom: [
      'Indoor plant enthusiasts',
      'Urban gardeners with limited natural light',
      'Herb and vegetable growers',
      'Anyone serious about plant health',
    ],
    featured: true,
  },
]

export function getProductBySlug(slug: string): AffiliateProduct | undefined {
  return affiliateProducts.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): AffiliateProduct[] {
  return affiliateProducts.filter((p) => p.featured)
}

export function getProductsByCategory(category: string): AffiliateProduct[] {
  return affiliateProducts.filter((p) => p.category === category)
}

export function buildAffiliateUrl(baseUrl: string): string {
  const url = new URL(baseUrl)
  url.searchParams.set('tag', AFFILIATE_TAG)
  return url.toString()
}
