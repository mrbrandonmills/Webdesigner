export interface BlogPost {
  slug: string
  category: string
  title: string
  excerpt: string
  date: string
  coverImage: string
  readTime: string
  datePublished?: string // For sorting
}

export const blogPosts: BlogPost[] = [
  {
    slug: '/blog/deep-work-philosophy-2025',
    category: 'Philosophy',
    title: 'Deep Work in 2025: Why Focus Is The New Luxury',
    excerpt: 'In an age of infinite distraction, deep work has become the ultimate luxury. How I built a focus system that delivers 10x productivity without burning out.',
    date: 'November 2025',
    datePublished: '2025-11-23',
    coverImage: '/og-deep-work.jpg',
    readTime: '10 min read',
  },
  {
    slug: '/blog/braun-ipl-first-week',
    category: 'Personal Review',
    title: 'The Hairless Rabbit Diaries: My First Week With Braun IPL',
    excerpt: 'Real results from my first week using the Braun Silk Expert Pro 7. Honest review from a male model with photos. Is at-home IPL worth it?',
    date: 'November 2025',
    datePublished: '2025-11-17',
    coverImage: '/blog/braun-ipl/braun-ipl-results-1.jpg',
    readTime: '8 min read',
  },
  {
    slug: '/blog/best-noise-canceling-headphones-2025',
    category: 'Product Reviews',
    title: 'Best Noise Canceling Headphones 2025: AirPods Max vs Sony WH-1000XM5',
    excerpt: 'I tested both for 30 days to find the best noise canceling headphones for deep focus and work. Complete comparison with definitive recommendations.',
    date: 'January 2025',
    datePublished: '2025-01-15',
    coverImage: '/images/collaborations/am-reed-2024/IMG_0280.jpg', // Using placeholder until headphones image is added
    readTime: '9 min read',
  },
  {
    slug: '/blog/photographer-collaborations/am-reed-august-2024',
    category: 'Latest Work',
    title: 'Creative Chemistry: Working with AM Reed',
    excerpt: 'Behind the scenes of a 158-image photography session with AM Reed in Los Angeles. Exploring the creative chemistry that produces museum-quality work.',
    date: 'August 2025',
    datePublished: '2025-08-20',
    coverImage: '/images/collaborations/am-reed-2024/IMG_1205.jpg',
    readTime: '8 min read',
  },
]

// Sort posts by date (newest first)
export const getSortedPosts = () => {
  return [...blogPosts].sort((a, b) => {
    const dateA = new Date(a.datePublished || a.date)
    const dateB = new Date(b.datePublished || b.date)
    return dateB.getTime() - dateA.getTime()
  })
}

// Get post by slug
export const getPostBySlug = (slug: string) => {
  return blogPosts.find(post => post.slug === slug)
}

// Get posts by category
export const getPostsByCategory = (category: string) => {
  return blogPosts.filter(post => post.category === category)
}

// Get featured posts (can be customized)
export const getFeaturedPosts = () => {
  return getSortedPosts()
}
