/**
 * Google Analytics 4 Event Tracking
 *
 * This module provides helper functions to track user interactions
 * and conversions across the Brandon Mills website.
 */

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

/**
 * Track Amazon affiliate link clicks
 *
 * @param productName - Name of the product being promoted
 * @param price - Price of the product in USD
 * @param category - Product category (optional)
 */
export const trackAmazonClick = (
  productName: string,
  price: number,
  category?: string
) => {
  trackEvent('amazon_click', {
    product_name: productName,
    product_price: price,
    product_category: category,
    event_category: 'affiliate',
    event_label: 'amazon',
  })
}

/**
 * Track successful purchase/unlock of meditation content
 *
 * @param meditationName - Name of the meditation purchased
 * @param price - Price paid in USD
 * @param transactionId - Unique transaction identifier
 */
export const trackPurchase = (
  meditationName: string,
  price: number,
  transactionId?: string
) => {
  trackEvent('purchase', {
    transaction_id: transactionId || Date.now().toString(),
    value: price,
    currency: 'USD',
    items: [
      {
        item_name: meditationName,
        item_category: 'meditation',
        price: price,
        quantity: 1,
      },
    ],
  })
}

/**
 * Track book purchase
 *
 * @param bookTitle - Title of the book
 * @param price - Price paid in USD
 * @param transactionId - Unique transaction identifier
 */
export const trackBookPurchase = (
  bookTitle: string,
  price: number,
  transactionId?: string
) => {
  trackEvent('purchase', {
    transaction_id: transactionId || Date.now().toString(),
    value: price,
    currency: 'USD',
    items: [
      {
        item_name: bookTitle,
        item_category: 'book',
        price: price,
        quantity: 1,
      },
    ],
  })
}

/**
 * Track audio playback events
 *
 * @param contentType - Type of content (meditation, poetry, essay, etc.)
 * @param contentId - Unique identifier for the content
 * @param contentName - Human-readable name of the content
 */
export const trackAudioPlay = (
  contentType: string,
  contentId: string,
  contentName?: string
) => {
  trackEvent('audio_play', {
    content_type: contentType,
    content_id: contentId,
    content_name: contentName,
    event_category: 'engagement',
  })
}

/**
 * Track audio completion (when user finishes listening)
 *
 * @param contentType - Type of content
 * @param contentId - Unique identifier for the content
 * @param duration - Duration listened in seconds
 */
export const trackAudioComplete = (
  contentType: string,
  contentId: string,
  duration?: number
) => {
  trackEvent('audio_complete', {
    content_type: contentType,
    content_id: contentId,
    duration_seconds: duration,
    event_category: 'engagement',
  })
}

/**
 * Track "Add to Cart" events
 *
 * @param productName - Name of the product
 * @param price - Price of the product
 * @param productId - Product identifier
 */
export const trackAddToCart = (
  productName: string,
  price: number,
  productId: string
) => {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: price,
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: 1,
      },
    ],
  })
}

/**
 * Track checkout initiation
 *
 * @param value - Total cart value
 * @param items - Array of items in cart
 */
export const trackBeginCheckout = (value: number, items: any[]) => {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: value,
    items: items,
  })
}

/**
 * Track page views (manual tracking for SPAs)
 *
 * @param url - Page URL
 * @param title - Page title
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
      page_title: title,
    })
  }
}

/**
 * Track outbound link clicks
 *
 * @param url - Destination URL
 * @param label - Link label/description
 */
export const trackOutboundLink = (url: string, label?: string) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    transport_type: 'beacon',
    url: url,
  })
}

/**
 * Track social media interactions
 *
 * @param network - Social network name (instagram, linkedin, etc.)
 * @param action - Action taken (share, follow, click)
 */
export const trackSocialInteraction = (network: string, action: string) => {
  trackEvent('social_interaction', {
    social_network: network,
    social_action: action,
    event_category: 'social',
  })
}

/**
 * Track email newsletter signups
 *
 * @param location - Where the signup occurred
 */
export const trackNewsletterSignup = (location: string) => {
  trackEvent('sign_up', {
    method: 'email',
    event_category: 'engagement',
    event_label: location,
  })
}

/**
 * Track contact form submissions
 *
 * @param formType - Type of form (general, mentoring, collaboration)
 */
export const trackFormSubmission = (formType: string) => {
  trackEvent('form_submit', {
    form_type: formType,
    event_category: 'engagement',
  })
}

/**
 * Track video plays
 *
 * @param videoTitle - Title of the video
 * @param videoId - Video identifier
 */
export const trackVideoPlay = (videoTitle: string, videoId: string) => {
  trackEvent('video_start', {
    video_title: videoTitle,
    video_id: videoId,
    event_category: 'engagement',
  })
}

/**
 * Track gallery interactions
 *
 * @param action - Action taken (view, zoom, download)
 * @param imageId - Image identifier
 */
export const trackGalleryInteraction = (action: string, imageId: string) => {
  trackEvent('gallery_interaction', {
    interaction_type: action,
    image_id: imageId,
    event_category: 'engagement',
  })
}
