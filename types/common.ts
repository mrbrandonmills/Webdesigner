/**
 * Common type definitions shared across the application
 */

// ============================================
// Shipping Address Types
// ============================================

/**
 * Stripe shipping address format
 */
export interface StripeShippingAddress {
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  phone?: string | null
}

/**
 * Stripe shipping details from checkout session
 */
export interface StripeShippingDetails {
  address?: StripeShippingAddress | null
  name?: string | null
  carrier?: string | null
  phone?: string | null
  tracking_number?: string | null
}

// ============================================
// Order Types for Webhook Processing
// ============================================

/**
 * Cart item as stored in session metadata
 */
export interface CartItem {
  productId: number
  variantId: number
  productTitle: string
  variantName: string
  image: string
  price: string
  quantity: number
  type?: string
}

/**
 * Local order format used by the webhook handler
 */
export interface LocalOrder {
  id: string
  stripeSessionId: string
  stripePaymentIntent: string
  customerEmail: string
  customerName: string
  shippingAddress: StripeShippingAddress | null
  items: CartItem[]
  totalAmount: number
  currency: string
  status: string
  printfulStatus: string
  printfulOrderId?: number
  createdAt: string
  updatedAt: string
}

/**
 * Printful order item format
 */
export interface PrintfulOrderItem {
  source: 'catalog'
  catalog_variant_id: number
  quantity: number
  retail_price: string
  placements?: Array<{
    placement: string
    technique: string
    layers: Array<{
      type: 'file'
      url: string
    }>
  }>
}

// ============================================
// Product Types for Shop
// ============================================

/**
 * Raw Printful product from API/data
 */
export interface RawPrintfulProduct {
  id: number | string
  title: string
  description?: string
  basePrice?: string
  price?: string
  currency?: string
  image?: string
  images?: string[]
  variantCount?: number
  variants?: ProductVariantRaw[]
  syncProductId?: number
  syncVariantId?: number
  tags?: string[]
  type?: string
  category?: string
  productType?: string
  featured?: boolean
  source?: string
  inStock?: boolean
}

/**
 * Raw Amazon product from API/data
 */
export interface RawAmazonProduct {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  images?: string[]
  amazonUrl?: string
  rating?: number
  reviewCount?: number
  features?: string[]
  brand?: string
  category?: string
  featured?: boolean
  inStock?: boolean
}

/**
 * Raw product variant
 */
export interface ProductVariantRaw {
  id: number
  name: string
  size?: string
  color?: string
  price: string
  image?: string
  inStock?: boolean
}

// ============================================
// Printful Catalog Types
// ============================================

/**
 * Printful catalog variant for scripts
 */
export interface PrintfulCatalogVariant {
  id: number
  product_id: number
  name: string
  size: string
  color: string
  color_code: string
  color_code2: string | null
  image: string
  availability_status: string
}

// ============================================
// Shipping Rate Types
// ============================================

/**
 * Shipping rate response from Printful
 */
export interface ShippingRate {
  id: string
  name: string
  rate: string
  currency: string
  minDeliveryDays: number
  maxDeliveryDays: number
  minDeliveryDate?: string
  maxDeliveryDate?: string
}

// ============================================
// Mockup Task Types
// ============================================

/**
 * Mockup task response from Printful
 */
export interface MockupTaskResponse {
  task_key: string
  status: string
  error?: string
  mockups?: Array<{
    placement: string
    variant_ids: number[]
    mockup_url: string
  }>
  printfiles?: Array<{
    placement: string
    variant_ids: number[]
    printfile_url: string
  }>
  extra?: Array<{
    title: string
    url: string
  }>
}

// ============================================
// API Paging Types
// ============================================

/**
 * Paging information from Printful API
 */
export interface PrintfulPaging {
  total: number
  offset: number
  limit: number
}

// ============================================
// Database Row Types
// ============================================

/**
 * Database row type for order queries
 */
export interface OrderRow {
  id: string
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  customer_email: string
  customer_name: string
  shipping_address: string | StripeShippingAddress | null
  billing_address: string | StripeShippingAddress | null
  items: string | CartItem[]
  total_amount: string | number
  currency: string
  status: string
  printful_status: string
  printful_order_id: string | null
  metadata: string | Record<string, unknown> | null
  created_at: string | Date
  updated_at: string | Date
}

// ============================================
// Voice API Types (for scripts)
// ============================================

/**
 * Cartesia voice response
 */
export interface CartesiaVoice {
  id: string
  name: string
  language: string
  gender?: string
  description?: string
  is_public?: boolean
}

// ============================================
// Design File Types
// ============================================

/**
 * Design file for Printful sync
 */
export interface DesignFile {
  filename: string
  productType: string
  url?: string
  dimensions?: {
    width: number
    height: number
  }
}

/**
 * Design mapping for product sync
 */
export interface DesignMapping {
  productId: number
  variantId: number
  variants: Array<{
    id: number
    price: string
  }>
  placement: string
  technique: string
}

// ============================================
// Sync Result Types
// ============================================

/**
 * Result of a sync operation
 */
export interface SyncResult {
  success: boolean
  designName?: string
  productType?: string
  productId?: number
  error?: string
}

// ============================================
// Pinterest Types
// ============================================

/**
 * Pinterest board
 */
export interface PinterestBoard {
  id: string
  name: string
}

/**
 * Pinterest pin data
 */
export interface PinterestPinData {
  board_id: string
  media_source: {
    source_type: string
    url?: string
  }
  title: string
  description?: string
  link?: string
  alt_text?: string
}

// ============================================
// Social Media Types
// ============================================

/**
 * Twitter tweet data
 */
export interface TweetData {
  text: string
  media?: {
    media_ids: string[]
  }
  reply?: {
    in_reply_to_tweet_id: string
  }
}

/**
 * LinkedIn share content
 */
export interface LinkedInShareContent {
  author: string
  lifecycleState: string
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string
      }
      shareMediaCategory: string
      media?: Array<{
        status: string
        originalUrl?: string
        description?: {
          text: string
        }
        title?: {
          text: string
        }
      }>
    }
  }
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': string
  }
}

// ============================================
// Puppeteer Page Type
// ============================================

/**
 * Puppeteer page type for automation scripts
 */
export interface PuppeteerPage {
  goto(url: string, options?: object): Promise<void>
  click(selector: string): Promise<void>
  type(selector: string, text: string, options?: object): Promise<void>
  waitForSelector(selector: string, options?: object): Promise<unknown>
  waitForNavigation(options?: object): Promise<void>
  evaluate<T>(fn: (...args: unknown[]) => T, ...args: unknown[]): Promise<T>
  $$(selector: string): Promise<unknown[]>
  setViewport(viewport: { width: number; height: number }): Promise<void>
  screenshot(options?: object): Promise<Buffer>
  close(): Promise<void>
}

/**
 * Puppeteer browser context
 */
export interface PuppeteerContext {
  cookies(): Promise<unknown[]>
  addCookies(cookies: unknown[]): Promise<void>
  newPage(): Promise<PuppeteerPage>
  close(): Promise<void>
}

// ============================================
// Theme Types
// ============================================

/**
 * Theme definition for product generation
 */
export interface ThemeDefinition {
  name: string
  displayName: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts?: {
    heading: string
    body: string
  }
  keywords: string[]
  styles: Record<string, string>
}

// ============================================
// Window Extensions
// ============================================

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      eventName: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}
