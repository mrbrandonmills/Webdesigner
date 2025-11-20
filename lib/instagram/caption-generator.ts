/**
 * Instagram Caption Generator
 * Uses GPT-4 with anti-AI detection prompts (falls back to Google Gemini)
 * Brandon's voice: casual, lowercase sometimes, fragments, rare emojis
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../logger';

// Lazy initialization of AI clients
function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getGeminiModel() {
  if (!process.env.GOOGLE_AI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

interface ProductContext {
  name: string;
  category: string;
  colors?: string[];
  description?: string;
  price?: number;
  isNewArrival?: boolean;
}

interface CaptionOptions {
  product: ProductContext;
  contentType: 'product' | 'lifestyle' | 'bts' | 'casual';
  includeHashtags?: boolean;
  includeCTA?: boolean;
  personalContext?: string;
}

interface GeneratedCaption {
  caption: string;
  hasTypo: boolean;
  typoCorrection?: string;
  shouldEditLater?: boolean;
}

/**
 * Anti-AI detection system prompt
 * Makes captions sound human, not AI-generated
 */
const ANTI_AI_SYSTEM_PROMPT = `You are Brandon Mills, a photographer and fashion designer with a casual, authentic social media voice.

CRITICAL ANTI-AI RULES:
- NEVER use perfect grammar or polished corporate speak
- Use lowercase sometimes, especially for casual vibes
- Write in fragments. Not always complete sentences.
- Vary caption length wildly (30-300 chars)
- Use ONLY these emojis, rarely: 🔥 ✨
- NO other emojis EVER
- NO hashtag walls or marketing speak
- NO "elevate your style" or "must-have" clichés
- NO exclamation points in every sentence
- Sometimes forget punctuation
- Use "ngl" "tbh" "fr" naturally but sparingly

YOUR VOICE:
- "shot this in milan, lighting was insane"
- "been wearing this nonstop since i got back"
- "ok but the fit on this tho"
- "might delete later idk"
- "this color 🔥"
- "new drop. thats it thats the post"
- "actually obsessed with how this turned out"

NEVER sound like:
- "Elevate your wardrobe with this stunning piece!"
- "Introducing our latest collection! 🌟✨💫"
- "Who else loves this look? 💯🔥"
- "Link in bio to shop now! 👆"

Temperature: 0.9 for natural variance
Tone: authentic, unpolished, real`;

/**
 * Generate natural, human-sounding Instagram caption
 */
async function generateCaption(options: CaptionOptions): Promise<GeneratedCaption> {
  try {
    const { product, contentType, personalContext } = options;

    // Build context-specific prompt
    let userPrompt = buildUserPrompt(product, contentType, personalContext);

    // Decide if this caption should have a typo (20% chance)
    const hasTypo = Math.random() < 0.2;

    if (hasTypo) {
      userPrompt += '\n\nINCLUDE ONE SUBTLE TYPO (like "tho" instead of "though", "def" instead of "definitely", or a missing letter). Make it natural.';
    }

    let caption = '';

    // Try OpenAI first
    const openai = getOpenAI();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: ANTI_AI_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.9,
          max_tokens: 150,
          presence_penalty: 0.6,
          frequency_penalty: 0.8,
        });

        caption = completion.choices[0].message.content?.trim() || '';
        logger.info('Generated caption using OpenAI');
      } catch (error) {
        logger.warn('OpenAI failed, falling back to Gemini:', error);
      }
    }

    // Fall back to Gemini if OpenAI failed or not configured
    if (!caption) {
      const geminiModel = getGeminiModel();
      logger.info(`Attempting Gemini fallback. geminiModel exists: ${!!geminiModel}`);
      if (geminiModel) {
        try {
          const fullPrompt = `${ANTI_AI_SYSTEM_PROMPT}\n\n${userPrompt}`;
          logger.info('Calling Gemini API...');
          const result = await geminiModel.generateContent(fullPrompt);
          caption = result.response.text().trim();
          logger.info('Generated caption using Gemini');
        } catch (error) {
          logger.error('Gemini failed:', error);
        }
      } else {
        logger.error('Gemini model not initialized. GOOGLE_AI_API_KEY present:', !!process.env.GOOGLE_AI_API_KEY);
      }
    }

    if (!caption) {
      throw new Error('No AI provider available. Set OPENAI_API_KEY or GOOGLE_AI_API_KEY in .env.local');
    }

    // Remove quotes if AI added them
    caption = caption.replace(/^["']|["']$/g, '');

    // Decide if this should be "edited later" (10% chance)
    const shouldEditLater = hasTypo && Math.random() < 0.5;

    let typoCorrection: string | undefined;
    if (shouldEditLater) {
      // Generate the "fixed" version
      typoCorrection = await generateTypoCorrection(caption);
    }

    logger.info(`Generated caption: ${caption.substring(0, 50)}...`);

    return {
      caption,
      hasTypo,
      typoCorrection,
      shouldEditLater,
    };
  } catch (error) {
    logger.error('Error generating caption:', error);
    throw error;
  }
}

/**
 * Build user prompt based on content type
 */
function buildUserPrompt(
  product: ProductContext,
  contentType: string,
  personalContext?: string
): string {
  const baseContext = `Product: ${product.name}\nCategory: ${product.category}`;

  switch (contentType) {
    case 'product':
      return `${baseContext}

Write a short, casual Instagram caption announcing this product. Keep it real, not salesy. Maybe mention a detail you noticed about it. ${personalContext || 'No fake hype, just honest thoughts.'}

Length: 50-150 characters max.`;

    case 'lifestyle':
      return `${baseContext}

Write a lifestyle caption about wearing/using this. Share a real moment or feeling. Where were you? What were you doing? ${personalContext || ''}

Length: 80-200 characters.`;

    case 'bts':
      return `${baseContext}

Write a behind-the-scenes caption about creating or shooting this. Keep it casual and authentic. Share what was going through your mind. ${personalContext || ''}

Length: 60-180 characters.`;

    case 'casual':
      return `${baseContext}

Write a super casual, almost throwaway caption. Like you're just sharing with friends. Maybe just a fragment or observation. ${personalContext || ''}

Length: 30-100 characters.`;

    default:
      return `${baseContext}

Write a natural Instagram caption. Keep it real and casual. ${personalContext || ''}`;
  }
}

/**
 * Generate a "corrected" version of a caption with a typo
 */
async function generateTypoCorrection(originalCaption: string): Promise<string> {
  try {
    let corrected = '';

    // Try OpenAI first
    const openai = getOpenAI();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You fix subtle typos in Instagram captions while keeping the exact same tone and style. Only fix the typo, change nothing else.',
            },
            {
              role: 'user',
              content: `Fix any typos in this caption, keep everything else identical:\n\n${originalCaption}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 150,
        });

        corrected = completion.choices[0].message.content?.trim() || originalCaption;
      } catch (error) {
        logger.warn('OpenAI failed for typo correction, falling back to Gemini');
      }
    }

    // Fall back to Gemini
    if (!corrected) {
      const geminiModel = getGeminiModel();
      if (geminiModel) {
        const prompt = `You fix subtle typos in Instagram captions while keeping the exact same tone and style. Only fix the typo, change nothing else.\n\nFix any typos in this caption, keep everything else identical:\n\n${originalCaption}`;
        const result = await geminiModel.generateContent(prompt);
        corrected = result.response.text().trim();
      }
    }

    if (!corrected) {
      return originalCaption;
    }

    corrected = corrected.replace(/^["']|["']$/g, '');

    return corrected;
  } catch (error) {
    logger.error('Error generating typo correction:', error);
    return originalCaption;
  }
}

/**
 * Add natural-sounding hashtags
 * Brandon doesn't use hashtag walls, just 2-5 relevant ones
 */
function generateHashtags(product: ProductContext): string[] {
  const hashtags: string[] = [];

  // Category-based
  if (product.category.toLowerCase().includes('tee') || product.category.toLowerCase().includes('shirt')) {
    hashtags.push('streetwear', 'fashion');
  } else if (product.category.toLowerCase().includes('hoodie') || product.category.toLowerCase().includes('sweatshirt')) {
    hashtags.push('streetstyle', 'fashion');
  } else if (product.category.toLowerCase().includes('mug') || product.category.toLowerCase().includes('cup')) {
    hashtags.push('coffeetime', 'design');
  }

  // Add brand tag
  hashtags.push('brandonmills');

  // Randomly add 1-2 more relevant tags
  const bonusTags = ['photography', 'designer', 'minimal', 'aesthetic', 'creative'];
  const numBonus = Math.random() < 0.5 ? 1 : 2;

  for (let i = 0; i < numBonus; i++) {
    const randomTag = bonusTags[Math.floor(Math.random() * bonusTags.length)];
    if (!hashtags.includes(randomTag)) {
      hashtags.push(randomTag);
    }
  }

  return hashtags.slice(0, 5); // Max 5 hashtags
}

/**
 * Generate complete Instagram post caption
 */
async function generateInstagramCaption(options: CaptionOptions): Promise<string> {
  const generated = await generateCaption(options);
  let fullCaption = generated.caption;

  // Add hashtags if requested (30% of the time even if not requested)
  const shouldAddHashtags = options.includeHashtags || Math.random() < 0.3;

  if (shouldAddHashtags) {
    const hashtags = generateHashtags(options.product);
    fullCaption += '\n\n' + hashtags.map(tag => `#${tag}`).join(' ');
  }

  // Add CTA if requested (but make it natural, not salesy)
  if (options.includeCTA && Math.random() < 0.7) {
    const ctas = [
      '\n\nlink in bio',
      '\n\nshop: brandonmills.com',
      '', // Sometimes skip it
    ];
    fullCaption += ctas[Math.floor(Math.random() * ctas.length)];
  }

  return fullCaption;
}

/**
 * Generate engagement reply to a comment
 */
async function generateCommentReply(
  comment: string,
  context?: string
): Promise<string> {
  try {
    const systemPrompt = `You are Brandon Mills replying to Instagram comments. Keep it super casual and authentic.

RULES:
- Short replies (1-10 words usually)
- Use lowercase often
- Natural, friendly tone
- No corporate speak
- Emojis VERY rarely (only 🔥 or ✨)
- Examples: "appreciate it 🙏", "facts", "means a lot fr", "thank you!", "💯"`;

    const userPrompt = `Reply to this comment naturally:\n\n"${comment}"\n\n${context ? `Context: ${context}` : ''}`;

    let reply = '';

    // Try OpenAI first
    const openai = getOpenAI();
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 50,
        });

        reply = completion.choices[0].message.content?.trim() || '';
      } catch (error) {
        logger.warn('OpenAI failed for comment reply, falling back to Gemini');
      }
    }

    // Fall back to Gemini
    if (!reply) {
      const geminiModel = getGeminiModel();
      if (geminiModel) {
        const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
        const result = await geminiModel.generateContent(fullPrompt);
        reply = result.response.text().trim();
      }
    }

    if (!reply) {
      // Fallback replies
      const fallbacks = ['thanks!', 'appreciate it', '🙏', 'means a lot', 'thank you!'];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    reply = reply.replace(/^["']|["']$/g, '');

    return reply;
  } catch (error) {
    logger.error('Error generating comment reply:', error);
    // Fallback replies
    const fallbacks = ['thanks!', 'appreciate it', '🙏', 'means a lot', 'thank you!'];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export {
  generateCaption,
  generateInstagramCaption,
  generateCommentReply,
  generateHashtags,
};

export type { ProductContext, CaptionOptions, GeneratedCaption };
