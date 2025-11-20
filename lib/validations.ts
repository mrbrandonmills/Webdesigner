import { z } from 'zod'

// ========================================
// Common Validators
// ========================================

export const emailSchema = z.string().email('Invalid email address').max(255)

export const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be under 100 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

export const urlSchema = z.string().url('Invalid URL')

// ========================================
// Authentication Schemas
// ========================================

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  password: z.string().min(1, 'Password is required').max(100),
})

// ========================================
// Newsletter/Subscription Schemas
// ========================================

export const NewsletterSubscribeSchema = z.object({
  email: emailSchema,
  source: z.string().max(100).optional(),
})

export const SubscribeSchema = z.object({
  email: emailSchema,
  source: z.string().max(100).default('unknown'),
})

// ========================================
// Content Generation Schemas
// ========================================

export const GenerateContentSchema = z.object({
  transcription: z.string().max(10000).optional(),
  photoUrls: z.array(z.string().url()).min(1, 'At least one photo URL is required'),
  styleGuide: z.object({
    writingStyle: z.object({
      tone: z.string(),
      voice: z.string(),
      sentenceStructure: z.string(),
      vocabulary: z.array(z.string()),
      examplePhrases: z.array(z.string()),
    }),
    contentPatterns: z.object({
      titleStyle: z.string(),
      descriptionStyle: z.string(),
      captionStyle: z.string(),
      seoApproach: z.string(),
    }),
    brandPersonality: z.object({
      values: z.array(z.string()),
      targetAudience: z.string(),
      emotionalTone: z.string(),
      uniqueSellingPoints: z.array(z.string()),
    }),
    businessInfo: z.object({
      location: z.string(),
      specialties: z.array(z.string()),
    }),
  }).optional(),
})

// ========================================
// Stripe/Checkout Schemas
// ========================================

export const CreateCheckoutSchema = z.object({
  meditationId: z.string().min(1, 'Meditation ID is required'),
  slug: slugSchema,
  voice: z.string().min(1, 'Voice selection is required'),
})

export const BookUnlockSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  title: z.string().min(1, 'Title is required').max(200),
  price: z.number().positive('Price must be positive'),
})

export const MeditationCheckoutSchema = z.object({
  meditationSlug: slugSchema,
  customerEmail: emailSchema.optional(),
})

export const MeditationUnlockSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
})

// ========================================
// Promo Code Schemas
// ========================================

export const CreatePromoCodeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  type: z.enum(['meditation', 'book', 'all']),
  target: z.string().optional(),
  discount: z.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  maxUses: z.number().positive().optional(),
  expiresAt: z.string().optional(),
  description: z.string().max(500).optional(),
  createdBy: z.string().default('admin'),
})

export const UpdatePromoCodeSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  type: z.enum(['meditation', 'book', 'all']).optional(),
  target: z.string().optional(),
  discount: z.number().min(1).max(100).optional(),
  maxUses: z.number().positive().optional(),
  expiresAt: z.string().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
})

export const ValidatePromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
  contentType: z.enum(['meditation', 'book'], {
    errorMap: () => ({ message: 'Content type must be meditation or book' }),
  }),
  contentId: z.string().min(1, 'Content ID is required'),
  email: emailSchema.optional(),
})

export const UnlockPromoSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
  contentType: z.enum(['meditation', 'book']),
  contentId: z.string().min(1, 'Content ID is required'),
  email: emailSchema,
})

// ========================================
// Gemini AI Schemas
// ========================================

export const GeminiAnalyzeSchema = z.object({
  text: z.string()
    .min(50, 'Text must be at least 50 characters')
    .max(10000, 'Text must be under 10,000 characters'),
})

export const GeminiDreamSchema = z.object({
  dream: z.string()
    .min(20, 'Dream description must be at least 20 characters')
    .max(5000, 'Dream description must be under 5,000 characters'),
})

export const GeminiLifepathSchema = z.object({
  answers: z.object({
    values: z.string().max(2000).optional(),
    fears: z.string().max(2000).optional(),
    goals: z.string().max(2000).optional(),
    strengths: z.string().max(2000).optional(),
    relationships: z.string().max(2000).optional(),
    challenges: z.string().max(2000).optional(),
    dreams: z.string().max(2000).optional(),
    legacy: z.string().max(2000).optional(),
  }).refine(
    (answers) => {
      const fields = ['values', 'fears', 'goals', 'strengths', 'relationships', 'challenges', 'dreams', 'legacy']
      const provided = fields.filter(f => {
        const value = answers[f as keyof typeof answers]
        return value && value.trim().length > 0
      })
      return provided.length >= 5
    },
    { message: 'At least 5 quiz answers must be provided' }
  ),
})

// ========================================
// Text-to-Speech Schemas
// ========================================

export const TextToSpeechSchema = z.object({
  contentId: z.string().optional(),
  text: z.string().min(1, 'Text content is required').max(10000, 'Text must be under 10,000 characters'),
  voice: z.enum(['male', 'female', 'male-indian', 'female-indian']).default('male'),
})

// ========================================
// Analytics Schemas
// ========================================

export const AnalyticsTrackSchema = z.object({
  event: z.string().min(1, 'Event name is required').max(100),
  data: z.record(z.unknown()).optional(),
  timestamp: z.string().optional(),
})

// ========================================
// Affiliate Schemas
// ========================================

export const CreateAffiliateProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  price: z.number().nonnegative().optional(),
  image: urlSchema.optional(),
  url: urlSchema,
  program: z.string().min(1, 'Program is required'),
  affiliateId: z.string().optional(),
  category: z.string().optional(),
  commission: z.number().nonnegative().optional(),
  featured: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const UpdateAffiliateProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().nonnegative().optional(),
  image: urlSchema.optional(),
  url: urlSchema.optional(),
  program: z.string().optional(),
  affiliateId: z.string().optional(),
  category: z.string().optional(),
  commission: z.number().nonnegative().optional(),
  featured: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const TrackAffiliateClickSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  program: z.string().min(1, 'Program is required'),
  referrer: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
})

// ========================================
// Admin Schemas
// ========================================

export const ReplicateProductsSchema = z.object({
  products: z.array(z.string().min(1))
    .min(1, 'At least one product ID is required'),
  variationsPerProduct: z.number()
    .int()
    .min(1, 'Must create at least 1 variation')
    .max(10, 'Cannot create more than 10 variations per product'),
})

// ========================================
// Query Parameter Schemas
// ========================================

export const AdminKeyQuerySchema = z.object({
  key: z.string().min(1, 'Admin key is required'),
})

export const PromoCodeQuerySchema = z.object({
  code: z.string().min(1, 'Code parameter is required'),
})

export const ProductIdQuerySchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
})

export const DaysQuerySchema = z.object({
  days: z.string().regex(/^\d+$/, 'Days must be a number').transform(Number).default('7'),
  program: z.string().optional(),
})

// ========================================
// Helper Functions
// ========================================

/**
 * Parse and validate request body with Zod schema
 * Returns validated data or throws ZodError
 */
export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  return schema.parse(data)
}

/**
 * Safe parse request body with Zod schema
 * Returns success/error result without throwing
 */
export function safeParseBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.SafeParseReturnType<z.input<T>, z.output<T>> {
  return schema.safeParse(data)
}

/**
 * Format Zod validation errors for API response
 */
export function formatZodErrors(error: z.ZodError): {
  error: string
  details: z.ZodIssue[]
} {
  return {
    error: 'Validation failed',
    details: error.errors,
  }
}

// Type exports for use in route handlers
export type LoginInput = z.infer<typeof LoginSchema>
export type NewsletterSubscribeInput = z.infer<typeof NewsletterSubscribeSchema>
export type SubscribeInput = z.infer<typeof SubscribeSchema>
export type GenerateContentInput = z.infer<typeof GenerateContentSchema>
export type CreateCheckoutInput = z.infer<typeof CreateCheckoutSchema>
export type BookUnlockInput = z.infer<typeof BookUnlockSchema>
export type CreatePromoCodeInput = z.infer<typeof CreatePromoCodeSchema>
export type UpdatePromoCodeInput = z.infer<typeof UpdatePromoCodeSchema>
export type ValidatePromoInput = z.infer<typeof ValidatePromoSchema>
export type UnlockPromoInput = z.infer<typeof UnlockPromoSchema>
export type GeminiAnalyzeInput = z.infer<typeof GeminiAnalyzeSchema>
export type GeminiDreamInput = z.infer<typeof GeminiDreamSchema>
export type GeminiLifepathInput = z.infer<typeof GeminiLifepathSchema>
export type TextToSpeechInput = z.infer<typeof TextToSpeechSchema>
export type AnalyticsTrackInput = z.infer<typeof AnalyticsTrackSchema>
export type CreateAffiliateProductInput = z.infer<typeof CreateAffiliateProductSchema>
export type UpdateAffiliateProductInput = z.infer<typeof UpdateAffiliateProductSchema>
export type TrackAffiliateClickInput = z.infer<typeof TrackAffiliateClickSchema>
export type ReplicateProductsInput = z.infer<typeof ReplicateProductsSchema>
export type MeditationCheckoutInput = z.infer<typeof MeditationCheckoutSchema>
export type MeditationUnlockInput = z.infer<typeof MeditationUnlockSchema>
