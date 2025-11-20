/**
 * Environment Variable Validation
 *
 * Validates all required environment variables at startup to fail fast
 * if critical configuration is missing.
 */

import { z } from 'zod'
import { logger } from '@/lib/logger'

// Define the complete environment schema
const envSchema = z.object({
  // Authentication (REQUIRED)
  ADMIN_USERNAME: z
    .string()
    .min(1, 'ADMIN_USERNAME is required')
    .describe('Admin username for authentication'),
  ADMIN_PASSWORD_HASH: z
    .string()
    .min(1, 'ADMIN_PASSWORD_HASH is required')
    .describe('Bcrypt hashed admin password'),

  // AI Services (REQUIRED for content generation)
  OPENAI_API_KEY: z
    .string()
    .min(1, 'OPENAI_API_KEY is required')
    .regex(/^sk-/, 'OPENAI_API_KEY must start with sk-')
    .describe('OpenAI API key for Whisper and DALL-E'),
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'ANTHROPIC_API_KEY is required')
    .regex(/^sk-ant-/, 'ANTHROPIC_API_KEY must start with sk-ant-')
    .describe('Anthropic API key for Claude'),

  // Vercel Blob Storage (REQUIRED)
  BLOB_READ_WRITE_TOKEN: z
    .string()
    .min(1, 'BLOB_READ_WRITE_TOKEN is required')
    .describe('Vercel Blob storage token'),

  // Stripe (REQUIRED for e-commerce)
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, 'STRIPE_SECRET_KEY is required')
    .regex(/^sk_(test|live)_/, 'STRIPE_SECRET_KEY must be a valid Stripe key')
    .describe('Stripe secret key for payments'),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, 'STRIPE_WEBHOOK_SECRET is required')
    .regex(/^whsec_/, 'STRIPE_WEBHOOK_SECRET must start with whsec_')
    .describe('Stripe webhook signing secret'),

  // Printful (REQUIRED for e-commerce)
  PRINTFUL_API_KEY: z
    .string()
    .min(1, 'PRINTFUL_API_KEY is required')
    .describe('Printful API key for product fulfillment'),
  PRINTFUL_STORE_ID: z
    .string()
    .min(1, 'PRINTFUL_STORE_ID is required')
    .describe('Printful store identifier'),

  // Database URLs (OPTIONAL - can use filesystem fallback)
  POSTGRES_URL: z.string().optional().describe('PostgreSQL connection URL'),
  POSTGRES_PRISMA_URL: z.string().optional().describe('PostgreSQL Prisma URL'),
  POSTGRES_URL_NON_POOLING: z
    .string()
    .optional()
    .describe('PostgreSQL non-pooling URL'),
  POSTGRES_USER: z.string().optional().describe('PostgreSQL username'),
  POSTGRES_HOST: z.string().optional().describe('PostgreSQL host'),
  POSTGRES_PASSWORD: z.string().optional().describe('PostgreSQL password'),
  POSTGRES_DATABASE: z.string().optional().describe('PostgreSQL database name'),
  USE_DATABASE: z
    .enum(['true', 'false'])
    .default('false')
    .describe('Feature flag for database vs filesystem storage'),

  // Webflow (OPTIONAL)
  WEBFLOW_API_TOKEN: z.string().optional().describe('Webflow API token'),
  WEBFLOW_SITE_ID: z.string().optional().describe('Webflow site ID'),
  WEBFLOW_COLLECTION_ID: z
    .string()
    .optional()
    .describe('Webflow collection ID'),

  // Cloudinary (OPTIONAL)
  CLOUDINARY_CLOUD_NAME: z.string().optional().describe('Cloudinary cloud name'),
  CLOUDINARY_API_KEY: z.string().optional().describe('Cloudinary API key'),
  CLOUDINARY_API_SECRET: z
    .string()
    .optional()
    .describe('Cloudinary API secret'),

  // Medium (OPTIONAL)
  MEDIUM_ACCESS_TOKEN: z.string().optional().describe('Medium integration token'),
  MEDIUM_AUTHOR_ID: z.string().optional().describe('Medium author ID'),

  // DataForSEO (OPTIONAL)
  DATAFORSEO_LOGIN: z.string().optional().describe('DataForSEO login'),
  DATAFORSEO_PASSWORD: z.string().optional().describe('DataForSEO password'),

  // Public URLs
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .url()
    .optional()
    .describe('Base URL for the application'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .regex(/^pk_(test|live)_/, 'Must be a valid Stripe publishable key')
    .optional()
    .describe('Stripe publishable key'),
  NEXT_PUBLIC_WEBFLOW_SITE_URL: z
    .string()
    .url()
    .optional()
    .describe('Webflow site URL'),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validate environment variables
 * Throws an error if validation fails with detailed error messages
 */
export function validateEnv(): Env {
  try {
    const parsed = envSchema.parse(process.env)
    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => {
          const field = err.path.join('.')
          const message = err.message
          return `  - ${field}: ${message}`
        })
        .join('\n')

      const errorMessage = `
❌ Environment Variable Validation Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following required environment variables are missing or invalid:

${missingVars}

Please check your .env.local file and ensure all required variables are set.
Refer to .env.example for the complete list of required variables.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
      logger.error('Environment validation failed', { message: errorMessage })
      throw new Error('Environment validation failed. See console for details.')
    }
    throw error
  }
}

/**
 * Get validated environment variables
 * Safe to use after validation
 */
export function getEnv(): Env {
  return process.env as unknown as Env
}

/**
 * Check if specific optional features are configured
 */
export const features = {
  hasDatabase: () => process.env.USE_DATABASE === 'true' && !!process.env.POSTGRES_URL,
  hasWebflow: () => !!(process.env.WEBFLOW_API_TOKEN && process.env.WEBFLOW_SITE_ID),
  hasCloudinary: () => !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ),
  hasMedium: () => !!(process.env.MEDIUM_ACCESS_TOKEN && process.env.MEDIUM_AUTHOR_ID),
  hasDataForSEO: () => !!(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD),
}

// Validate on module load (only in production)
// In development, we allow missing vars for easier local development
if (process.env.NODE_ENV === 'production') {
  try {
    validateEnv()
    logger.info('Environment variables validated successfully')
  } catch (error) {
    // Exit process in production if env validation fails
    process.exit(1)
  }
}
