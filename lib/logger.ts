/**
 * Simple logger utility that respects NODE_ENV
 *
 * Security considerations:
 * - Never log sensitive data (passwords, API keys, personal info)
 * - In production, logs should be sent to a secure logging service
 * - Consider using structured logging (JSON) for better parsing
 */

const isDevelopment = process.env.NODE_ENV !== 'production'

export const logger = {
  /**
   * Log informational messages
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args)
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },

  /**
   * Log error messages (always logged even in production)
   * In production, these should go to an error tracking service
   */
  error: (message: string, error?: unknown) => {
    const errorMessage = `[ERROR] ${message}`

    if (isDevelopment) {
      console.error(errorMessage, error)
    } else {
      // In production, you'd send to a service like Sentry or LogRocket
      // For now, just log the message without sensitive details
      console.error(errorMessage)
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment && process.env.DEBUG === 'true') {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },

  /**
   * Log success messages
   */
  success: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`[SUCCESS] ${message}`, ...args)
    }
  },

  /**
   * Log API requests (sanitized)
   */
  api: (method: string, endpoint: string, status?: number) => {
    if (isDevelopment) {
      const message = status
        ? `[API] ${method} ${endpoint} - ${status}`
        : `[API] ${method} ${endpoint}`
      console.log(message)
    }
  },

  /**
   * Log performance metrics
   */
  performance: (operation: string, duration: number) => {
    if (isDevelopment) {
      console.log(`[PERF] ${operation}: ${duration}ms`)
    }
  },

  /**
   * Sanitize sensitive data before logging
   * Use this to remove passwords, tokens, etc. from objects
   */
  sanitize: (obj: Record<string, unknown>): Record<string, unknown> => {
    if (!obj || typeof obj !== 'object') return obj

    const sensitiveKeys = [
      'password',
      'token',
      'api_key',
      'apiKey',
      'secret',
      'authorization',
      'cookie',
      'session',
      'stripe',
      'printful'
    ]

    const sanitized = { ...obj }

    Object.keys(sanitized).forEach(key => {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = logger.sanitize(sanitized[key] as Record<string, unknown>)
      }
    })

    return sanitized
  }
}

// Export a default logger instance
export default logger