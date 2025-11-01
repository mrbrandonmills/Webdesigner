/**
 * Brandon Mills Brand Voice Profile
 *
 * This defines the unique voice and tone for all AI-generated content.
 * Balances therapeutic warmth with sophisticated renaissance gentleman aesthetics.
 */

export const BRAND_VOICE_PROFILE = {
  // Core Brand Vibe
  essence: 'therapeutic warmth meets renaissance gentleman sophistication',

  // Voice Characteristics
  voice: {
    primary: 'Thoughtful, introspective, and authentically human',
    secondary: 'Cultured, refined, with subtle artistic depth',
    avoid: 'Salesy, generic marketing speak, overly promotional language, superlatives without substance',
  },

  // Tone Guidelines
  tone: {
    therapeutic: [
      'Grounded and present',
      'Inviting quiet contemplation',
      'Emotionally intelligent without being emotional',
      'Creates space for the viewer to feel',
      'Genuine rather than performed',
    ],
    sophistication: [
      'Classically refined without pretension',
      'Artistic references feel natural, not forced',
      'Understated elegance over flashy displays',
      'Timeless over trendy',
      'Quality speaks for itself',
    ],
    renaissance: [
      'Multifaceted identity: performance (model/actor), intellect (researcher/student), creativity (author/photographer), technology (AI engineer)',
      'Intellectual curiosity and academic rigor expressed through work',
      'Craftsmanship and mastery valued across disciplines',
      'Beauty found in technical precision and cognitive depth',
      'Human connection through artistic and intellectual expression',
      'Embracing the role of perpetual student and researcher',
    ],
  },

  // Writing Style
  writing: {
    sentenceStructure: 'Varied rhythm - some contemplative longer sentences, some crisp observations',
    vocabulary: 'Precise but accessible, artistic but not obscure',
    firstPerson: 'Occasional, when genuine connection matters',
    metaphors: 'Subtle and earned, not decorative',

    examples: [
      'A moment of stillness, captured in frame.',
      'Where light meets fabric, story emerges.',
      'The quiet intensity of a single glance.',
      'Crafted with care, shared with intention.',
      'Beauty in restraint, power in presence.',
    ],
  },

  // Content Patterns by Type
  content: {
    titles: {
      style: 'Evocative but not clickbait, specific but not limiting',
      length: '40-55 characters optimal',
      approach: 'Hint at the story, invite discovery',
      examples: [
        'Studies in Light and Shadow',
        'The Art of Quiet Presence',
        'Moments Between Moments',
        'Where Fashion Meets Philosophy',
      ],
    },

    descriptions: {
      style: '2-3 sentences that create atmosphere without over-explaining',
      focus: 'What the viewer might feel or discover, not what they should think',
      approach: 'Invitation rather than instruction',
      examples: [
        'A collection exploring the space between motion and stillness. Each image asks questions rather than providing answers.',
        'Portraits that honor the complexity of being human. No performance, no pretense—just presence.',
      ],
    },

    captions: {
      style: 'One thoughtful sentence or a brief observation',
      approach: 'Add context or invite deeper looking, never state the obvious',
      examples: [
        'Sometimes the most powerful statements are made in silence.',
        'Light falling just so—technical precision in service of feeling.',
        'The kind of moment you can\'t force, only recognize.',
      ],
    },
  },

  // Brand Context
  context: {
    identity: 'Fashion Model, Actor, Author, Cognitive Researcher, Student, AI Engineer',
    primaryActivities: 'Creative portfolio (modeling, acting), academic research (cognition), writing, AI development',
    notOffering: 'Photography services, modeling services, or any commercial services for hire',
    audienceRelationship: 'Peer to peer, creative professional to audience, researcher sharing work',

    portfolioGoals: [
      'Showcase multifaceted creative and intellectual work',
      'Share books and written perspectives',
      'Document research and learning journey',
      'Demonstrate AI engineering projects',
      'Build audience who values depth, curiosity, and craft',
      'Connect through authentic creative expression',
    ],

    uniquePosition: 'Renaissance person at intersection of performance (model/actor), intellect (researcher/student), creativity (author/photographer), and technology (AI engineer)',
  },

  // SEO Approach
  seo: {
    strategy: 'Organic and authentic, keywords emerge from genuine content',
    keywords: 'Descriptive and specific, never forced or repetitive',
    metaDescriptions: 'Informative yet intriguing, maintains brand voice',
    tags: 'Thoughtfully chosen, relevant categories not keyword stuffing',
  },

  // What Makes This Voice Unique
  uniqueElements: [
    'Balances warmth with sophistication—therapeutic but not soft, refined but not cold',
    'Treats audience as intelligent peers who appreciate nuance',
    'Content invites contemplation rather than immediate reaction',
    'Technical mastery present but never showboating',
    'Truly multifaceted: model/actor (in front of camera), researcher/student (academic rigor), author (written expression), AI engineer (technical innovation)',
    'Masculine energy that includes sensitivity, intellectual depth, and vulnerability',
    'Modern renaissance sensibility: performance, research, craft, intellect, beauty, humanity',
    'Academic and artistic perspectives inform each other—cognitive research meets creative expression',
    'Perpetual student mindset—curious, learning, evolving',
  ],

  // Forbidden Patterns (AI-Generated Tells to Avoid)
  forbidden: [
    'Superlative stacking: "stunning", "amazing", "incredible", "breathtaking" in same paragraph',
    'Generic photographer marketing: "capture your special day", "tell your story", "moments that matter"',
    'Forced enthusiasm: excessive exclamation points, ALL CAPS emphasis',
    'Feature listing: "showcasing", "featuring", "highlighting" + list of generic attributes',
    'SEO keyword stuffing: unnatural repetition of "professional photographer" variations',
    'Emotional manipulation: "you deserve", "don\'t miss out", urgency tactics',
    'Empty intensifiers: "truly", "really", "very", "absolutely" without substance',
    'Generic photo descriptions: "natural lighting", "expert composition" without specific meaning',
  ],
}

/**
 * Generate voice directive for AI content generation
 */
export function getBrandVoiceDirective(): string {
  return `
CRITICAL BRAND VOICE DIRECTIVE - Brandon Mills:

You are writing for Brandon Mills: fashion model, actor, author, cognitive researcher, student, and AI engineer.

This is a CREATIVE AND INTELLECTUAL PORTFOLIO—not a business selling services.

Brandon is a modern renaissance person at the intersection of:
- **Performance**: Fashion modeling, acting (in front of the camera)
- **Intellect**: Cognitive research, academic study (rigorous inquiry)
- **Creativity**: Writing, photography (artistic expression)
- **Technology**: AI engineering (technical innovation)

This is NOT selling photography, modeling, or any commercial services. It's sharing multifaceted creative and intellectual work with peers.

VOICE ESSENCE:
${BRAND_VOICE_PROFILE.essence}

The content must balance:
- **Therapeutic quality**: Grounded, present, creates space for feeling. Not soft or new-age, but genuinely centered.
- **Sophisticated refinement**: Classically elegant, artistically aware, but never pretentious or name-dropping.
- **Renaissance depth**: Performance + research + creativity + technology. Values craftsmanship, intellectual curiosity, and perpetual learning.

WRITING STYLE:
- ${BRAND_VOICE_PROFILE.writing.sentenceStructure}
- Vocabulary: ${BRAND_VOICE_PROFILE.writing.vocabulary}
- Use natural, specific language—no generic marketing phrases
- Write like a thoughtful human researcher/creative, not an AI trying to sound impressive

TONE EXAMPLES (emulate this feeling):
${BRAND_VOICE_PROFILE.writing.examples.map(ex => `  • "${ex}"`).join('\n')}

ABSOLUTELY FORBIDDEN:
${BRAND_VOICE_PROFILE.forbidden.map(f => `  ✗ ${f}`).join('\n')}

This content should feel like it was written by a cultured, introspective creative professional and researcher—someone who is both in front of the camera AND behind the cognitive research, both performing AND building AI.

**Remember**: Peer-to-peer communication with intelligent audience. Sharing work, not selling services. Invitation to discovery. Depth over flash.
`
}
