/**
 * Genesis Photo Stories Database
 *
 * Extended data structure for modeling photos with:
 * - Full backstories
 * - Lessons learned
 * - Behind-the-scenes details
 * - Can be used for throwback blog posts
 */

export interface GenesisStory {
  id: string
  src: string
  title: string
  category: 'editorial' | 'campaign' | 'runway'
  brand?: string
  year?: string
  location?: string

  // Quick story for gallery view
  story: string

  // Extended content for blog posts
  fullBackstory?: {
    setting: string // Where and when this happened
    challenge: string // What was difficult or unique
    breakthrough: string // The moment that made it special
    impact: string // How it shaped your career
  }

  lessonLearned?: string // Key takeaway or wisdom gained
  behindTheScenes?: string // Fun or interesting details

  // Blog post metadata (if this becomes a blog post)
  blogSlug?: string
  published?: boolean
  publishDate?: string

  // Tags for categorization
  tags?: string[]
}

/**
 * Example of a fully fleshed-out story
 * This is the template for how to document each photo
 */
export const exampleStory: GenesisStory = {
  id: 'c40',
  src: '/images/gallery/genesis/campaigns/B.40.jpg',
  title: 'Underwear Campaign',
  category: 'campaign',
  year: '2019',
  location: 'Los Angeles, CA',

  story: 'A major underwear campaign that required intense physical preparation and absolute confidence. The results spoke for themselves.',

  fullBackstory: {
    setting: `Los Angeles, 2019. The casting email said "athletic build required."
    I had 6 weeks to prepare. This wasn't just another shoot—it was the kind of
    campaign that could define how I was seen in the industry.`,

    challenge: `The vulnerability. Standing in your underwear in front of a dozen
    crew members requires a different kind of confidence than editorial fashion.
    Every imperfection is visible. Every insecurity amplified. I trained twice a day,
    cut carbs completely, and questioned myself constantly.`,

    breakthrough: `Day of the shoot, the photographer said something that changed
    everything: "Stop posing. Just be." I dropped the tension I'd been holding.
    Started moving naturally. The best frames came from moments when I forgot
    the camera was there.`,

    impact: `This campaign ran internationally. Billboards in Times Square, bus stops
    across Europe. More importantly—it taught me that vulnerability and strength
    aren't opposites. They're allies. The modeling industry rewards perfection, but
    what resonates with humans is authenticity.`
  },

  lessonLearned: `Confidence isn't the absence of insecurity—it's showing up anyway.
  The preparation mattered, but what made the campaign successful was letting go
  of the need to be perfect and just being present.`,

  behindTheScenes: `The AC broke mid-shoot. 90 degrees in the studio. Everyone
  was miserable—except me. The heat made my muscles more defined. Sometimes
  the universe throws you a gift disguised as a disaster.`,

  blogSlug: 'underwear-campaign-vulnerability-and-strength',
  published: false,

  tags: ['confidence', 'vulnerability', 'fitness', 'personal-growth', 'modeling']
}

/**
 * Stories that are ready to become blog posts
 * Start with 3-5 fully developed stories, then add more over time
 */
export const fullyDevelopedStories: GenesisStory[] = [
  exampleStory,

  {
    id: 'e3',
    src: '/images/gallery/genesis/editorial/B.3.jpg',
    title: 'TETU Magazine Cover',
    category: 'editorial',
    brand: 'TETU Magazine',
    year: '2018',
    location: 'Paris, France',

    story: 'Landing this French magazine cover was a career milestone. Shot in Paris, this editorial explored modern masculinity and confidence.',

    fullBackstory: {
      setting: `Paris, 2018. My first international cover shoot. I'd been modeling
      for 3 years, mostly catalog work. This was different—a magazine known for
      pushing boundaries, shot by a photographer I'd admired for years.`,

      challenge: `Language barrier. Cultural differences. Imposter syndrome.
      I walked into that studio feeling like I didn't belong. The stylist spoke
      rapid-fire French. The makeup artist kept shaking their head. I thought
      I was bombing.`,

      breakthrough: `Turns out they were arguing about how to make me look MORE
      intense, not fixing mistakes. Through a translator, the photographer said:
      "You have the face of someone who's survived something. Don't hide it."
      That became the editorial's theme—masculine vulnerability.`,

      impact: `This cover changed how I saw myself. Before this, I tried to be
      whatever the client wanted. After this, I realized my value was bringing
      MY story, MY intensity, MY truth. The editorial ran with the headline:
      "The New Face of Masculine Confidence." That became my brand.`
    },

    lessonLearned: `Your scars are your currency. What you think makes you "less than"
    is often what makes you irreplaceable. The industry doesn't need more perfect
    faces—it needs real ones.`,

    behindTheScenes: `After the shoot, the photographer took me to a tiny bistro
    where Hemingway used to write. We drank wine until midnight talking about art,
    loss, and redemption. That conversation shaped my philosophy more than the shoot itself.`,

    blogSlug: 'tetu-magazine-paris-masculine-vulnerability',
    published: false,

    tags: ['paris', 'magazine-cover', 'vulnerability', 'international', 'breakthrough']
  },

  {
    id: 'rebirth',
    src: '/images/gallery/genesis/editorial/B.2.jpg',
    title: 'The Rebirth - First Shoot After Cancer',
    category: 'editorial',
    brand: 'Andrew Gerard Photography',
    year: '2017',
    location: 'Vancouver, Canada',

    story: "My first modeling collaboration after being declared cancer-free. A photographer saw something in me that I couldn't see yet.",

    fullBackstory: {
      setting: `Vancouver, 2017. Six months cancer-free. My body was different—
      thinner, paler, scarred. My confidence was gone. I'd been a working model
      before the diagnosis. Now I couldn't recognize myself in the mirror. I was
      ready to quit entirely.`,

      challenge: `"Cancer victim was my new identity." Everyone treated me fragile.
      Doctors, family, friends—they all spoke in soft voices, like I might break.
      The modeling industry had moved on. My agency dropped me. I thought my career
      was over before it really began.`,

      breakthrough: `Andrew Gerard reached out. He didn't want the model I used to be.
      He wanted to photograph "the bad guy"—dark, edgy, intense. He saw strength where
      I saw weakness. During the shoot, he kept saying "more anger, more power."
      Like droplets of mercury coalescing, pieces of myself started coming back together.`,

      impact: `These photos proved something crucial: I wasn't damaged goods. I was
      reborn. Different than before—but not less. Actually more. The cancer had stripped
      away the performative bullshit. What remained was raw, real, and powerful.
      These images launched the second act of my career—the one that actually mattered.`
    },

    lessonLearned: `Transformation isn't about going back to who you were before the
    crisis. It's about becoming someone new—someone forged by fire. The old me wouldn't
    have had the depth for the career I built after cancer. Sometimes losing everything
    is the prerequisite for gaining what you actually need.`,

    behindTheScenes: `I cried in the dressing room before the shoot. Andrew knew.
    He didn't say anything—just turned up the music louder and let me feel what I needed
    to feel. Best creative decision he could have made. That emotion is in every frame.`,

    blogSlug: 'rebirth-first-shoot-after-cancer',
    published: false,

    tags: ['cancer-survivor', 'rebirth', 'transformation', 'gratitude', 'andrew-gerard']
  }
]

/**
 * Get a story by ID
 */
export function getStoryById(id: string): GenesisStory | undefined {
  return fullyDevelopedStories.find(story => story.id === id)
}

/**
 * Get all published stories for blog
 */
export function getPublishedStories(): GenesisStory[] {
  return fullyDevelopedStories.filter(story => story.published === true)
}

/**
 * Get stories by tag
 */
export function getStoriesByTag(tag: string): GenesisStory[] {
  return fullyDevelopedStories.filter(story =>
    story.tags?.includes(tag)
  )
}
