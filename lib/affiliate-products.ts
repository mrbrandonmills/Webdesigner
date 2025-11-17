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
