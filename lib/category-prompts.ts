/**
 * Category-Specific Voice Prompts
 * Different voice/tone for different content types
 */

export interface CategoryVoice {
  name: string
  focus: string
  tone: string
  vocabulary: string[]
  examples: string[]
  avoid: string[]
}

export const CATEGORY_VOICES: Record<string, CategoryVoice> = {
  Fashion: {
    name: 'Fashion & Modeling',
    focus: 'Performance, aesthetics, embodiment through clothing and presence',
    tone: 'Refined, sensorial, present. Focus on texture, movement, form. Less cerebral, more felt.',
    vocabulary: [
      'texture',
      'drape',
      'silhouette',
      'presence',
      'embodiment',
      'movement',
      'line',
      'form',
      'materiality',
      'gesture',
    ],
    examples: [
      'Where fabric meets form, intention becomes visible.',
      'The way light catches texture—a quiet conversation between surface and shadow.',
      'Presence without performance. Being, not posing.',
    ],
    avoid: [
      'trendy',
      'fashionable',
      'stylish',
      'chic',
      'on-trend',
      'fashion-forward',
    ],
  },

  Portrait: {
    name: 'Portrait & Personal Work',
    focus: 'Human presence, introspection, the space between performance and authenticity',
    tone: 'Contemplative, intimate, therapeutic. Honors complexity and depth.',
    vocabulary: [
      'presence',
      'introspection',
      'vulnerability',
      'authenticity',
      'complexity',
      'stillness',
      'depth',
      'quiet',
      'seeing',
      'being seen',
    ],
    examples: [
      'A moment of unguarded presence.',
      'The space between who we are and who we show.',
      'Stillness that speaks volumes.',
    ],
    avoid: [
      'candid',
      'natural smile',
      'genuine emotion',
      'real moment',
      'authentic expression',
    ],
  },

  Editorial: {
    name: 'Editorial & Creative Direction',
    focus: 'Concept, narrative, artistic vision meeting commercial context',
    tone: 'Sophisticated, conceptual, balances artistic and professional. Renaissance approach.',
    vocabulary: [
      'concept',
      'narrative',
      'composition',
      'vision',
      'direction',
      'intention',
      'exploration',
      'synthesis',
      'perspective',
      'craft',
    ],
    examples: [
      'Conceptual exploration of embodied aesthetics.',
      'Where artistic vision meets purposeful execution.',
      'A study in compositional restraint.',
    ],
    avoid: [
      'editorial shoot',
      'fashion story',
      'creative direction',
      'art direction',
    ],
  },

  'Fine Art': {
    name: 'Fine Art & Experimental',
    focus: 'Pure artistic exploration, pushing boundaries, research through image-making',
    tone: 'Intellectual, experimental, curious. Academic rigor meets creative freedom.',
    vocabulary: [
      'exploration',
      'inquiry',
      'experiment',
      'investigation',
      'methodology',
      'process',
      'iteration',
      'discovery',
      'hypothesis',
      'observation',
    ],
    examples: [
      'Visual research on perception and presence.',
      'An experimental approach to embodied inquiry.',
      'Process over product. Questions over answers.',
    ],
    avoid: [
      'artistic',
      'creative',
      'expressive',
      'unique vision',
      'artistic expression',
    ],
  },

  'Personal Work': {
    name: 'Personal Work & Documentation',
    focus: 'Personal documentation, learning, evolution, unfiltered creative process',
    tone: 'Honest, evolving, student mindset. Growth and curiosity emphasized.',
    vocabulary: [
      'learning',
      'exploration',
      'practice',
      'experiment',
      'document',
      'process',
      'evolution',
      'curiosity',
      'attempt',
      'discovery',
    ],
    examples: [
      'Personal experiments in seeing differently.',
      'Documenting the learning process.',
      'Practice makes visible what was previously hidden.',
    ],
    avoid: [
      'passion project',
      'personal vision',
      'artistic journey',
      'creative exploration',
    ],
  },

  Product: {
    name: 'Product & Commercial',
    focus: 'Object study, commercial aesthetics, precision and clarity',
    tone: 'Clean, precise, appreciative of craft. Technical meets aesthetic.',
    vocabulary: [
      'detail',
      'precision',
      'clarity',
      'craftsmanship',
      'materiality',
      'function',
      'design',
      'object',
      'quality',
      'refinement',
    ],
    examples: [
      'Attention to material detail and construction.',
      'Form and function made visible.',
      'The quiet elegance of purposeful design.',
    ],
    avoid: [
      'product photography',
      'commercial shoot',
      'lifestyle imagery',
      'brand photography',
    ],
  },

  Commercial: {
    name: 'Commercial Work',
    focus: 'Professional work for clients, balancing artistic and commercial needs',
    tone: 'Professional, sophisticated, purposeful. Quality without compromise.',
    vocabulary: [
      'collaboration',
      'vision',
      'execution',
      'professional',
      'refined',
      'intentional',
      'quality',
      'precision',
      'expertise',
      'craft',
    ],
    examples: [
      'Professional collaboration with thoughtful execution.',
      'Balancing artistic vision with commercial clarity.',
      'Refined work that serves purpose without sacrificing quality.',
    ],
    avoid: [
      'client work',
      'commercial photography',
      'professional services',
      'hire me',
    ],
  },
}

/**
 * Get category-specific voice directive
 */
export function getCategoryVoiceDirective(category: string): string {
  const voice = CATEGORY_VOICES[category] || CATEGORY_VOICES['Portrait'] // Default to Portrait

  return `
CATEGORY-SPECIFIC VOICE ADJUSTMENT for ${voice.name}:

Focus: ${voice.focus}

Tone: ${voice.tone}

Preferred Vocabulary:
${voice.vocabulary.map(v => `  • ${v}`).join('\n')}

Voice Examples (emulate this feeling):
${voice.examples.map(ex => `  • "${ex}"`).join('\n')}

AVOID for this category:
${voice.avoid.map(a => `  ✗ ${a}`).join('\n')}

CRITICAL: Maintain the core therapeutic + renaissance gentleman voice, but adjust emphasis and vocabulary for this specific category. The base voice profile still applies—this adds category-specific nuance.
`
}
