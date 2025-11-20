/**
 * Browser-safe logger utility
 *
 * This wrapper provides consistent logging that works in both server and browser environments.
 * - Server-side: Uses the full logger utility
 * - Client-side: Uses console with production checks
 */

const isServer = typeof window === 'undefined'
const isDevelopment = process.env.NODE_ENV !== 'production'

export const clientLogger = {
  /**
   * Log informational messages
   */
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      if (data) {
        console.log(`[INFO] ${message}`, data)
      } else {
        console.log(`[INFO] ${message}`)
      }
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      if (data) {
        console.warn(`[WARN] ${message}`, data)
      } else {
        console.warn(`[WARN] ${message}`)
      }
    }
  },

  /**
   * Log error messages (always logged, even in production)
   */
  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error)
    } else {
      // In production, log without sensitive details
      console.error(`[ERROR] ${message}`)
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      if (data) {
        console.debug(`[DEBUG] ${message}`, data)
      } else {
        console.debug(`[DEBUG] ${message}`)
      }
    }
  }
}

// Export for client-side use
export default clientLogger
