import { logger } from '@/lib/logger'

/**
 * Prodigi Print API v4 Client
 * Documentation: https://www.prodigi.com/print-api/docs/
 *
 * Fine Art Trade Guild approved - museum-quality giclee printing
 * Premium substrates: cotton rag, aluminum dibond, acrylic glass, wood
 */

const PRODIGI_API_BASE = process.env.PRODIGI_SANDBOX === 'true'
  ? 'https://api.sandbox.prodigi.com/v4.0'
  : 'https://api.prodigi.com/v4.0'

// Premium Prodigi SKUs for fine art products
export const PRODIGI_SKUS = {
  // Fine Art Prints - Museum Quality Giclee
  FINE_ART_PRINT_12x16: 'GLOBAL-FAP-12x16',
  FINE_ART_PRINT_16x24: 'GLOBAL-FAP-16x24',
  FINE_ART_PRINT_24x36: 'GLOBAL-FAP-24x36',

  // Framed Prints - Classic Black Frame
  FRAMED_PRINT_12x12: 'GLOBAL-CFPM-12X12',
  FRAMED_PRINT_16x20: 'GLOBAL-CFPM-16X20',
  FRAMED_PRINT_18x24: 'GLOBAL-CFPM-18X24',

  // Canvas - Gallery Wrapped
  CANVAS_12x12: 'GLOBAL-CAN-12x12',
  CANVAS_16x20: 'GLOBAL-CAN-16x20',
  CANVAS_24x36: 'GLOBAL-CAN-24x36',

  // Metal Prints - Aluminum Dibond
  METAL_PRINT_12x12: 'GLOBAL-MET-12x12',
  METAL_PRINT_16x20: 'GLOBAL-MET-16x20',

  // Acrylic Prints - Premium Glass
  ACRYLIC_12x12: 'GLOBAL-ACR-12x12',
  ACRYLIC_16x20: 'GLOBAL-ACR-16x20',
} as const

export interface ProdigiOrderRecipient {
  name: string
  address: {
    line1: string
    line2?: string
    postalOrZipCode: string
    countryCode: string
    townOrCity: string
    stateOrCounty?: string
  }
  email?: string
}

export interface ProdigiOrderItem {
  sku: string
  copies: number
  sizing: 'fillPrintArea' | 'fitPrintArea' | 'stretchToPrintArea'
  assets: {
    printArea: string
    url: string
  }[]
  attributes?: Record<string, string>
}

export interface ProdigiOrder {
  merchantReference: string
  shippingMethod: 'Budget' | 'Standard' | 'Express' | 'Overnight'
  recipient: ProdigiOrderRecipient
  items: ProdigiOrderItem[]
  metadata?: Record<string, string>
}

export interface ProdigiOrderResponse {
  id: string
  created: string
  lastUpdated: string
  callbackUrl: string | null
  merchantReference: string
  shippingMethod: string
  idempotencyKey: string | null
  status: {
    stage: string
    issues: Array<{
      objectId: string
      errorCode: string
      description: string
    }>
  }
  charges: Array<{
    id: string
    prodigiInvoiceNumber: string | null
    totalCost: { amount: string; currency: string }
    items: Array<{ itemId: string; cost: { amount: string; currency: string } }>
  }>
  shipments: Array<{
    id: string
    carrier: { name: string; service: string }
    tracking: { number: string; url: string } | null
    dispatchDate: string
    items: Array<{ itemId: string }>
  }>
  recipient: ProdigiOrderRecipient
  items: Array<{
    id: string
    status: string
    sku: string
    copies: number
    sizing: string
    assets: Array<{ printArea: string; url: string; status: string }>
  }>
}

export interface ProdigiProductInfo {
  sku: string
  description: string
  productDimensions: {
    width: number
    height: number
    unit: string
  }
  printAreaSizes: Array<{
    printArea: string
    width: number
    height: number
    unit: string
  }>
  attributes: Array<{
    name: string
    values: string[]
  }>
  variants: Array<{
    sku: string
    attributes: Record<string, string>
  }>
  pricing: Array<{
    currency: string
    pricePerUnit: string
  }>
}

class ProdigiClient {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.PRODIGI_API_KEY || ''
    if (!this.apiKey) {
      logger.warn('PRODIGI_API_KEY not configured - Prodigi integration disabled')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('PRODIGI_API_KEY not configured')
    }

    const url = `${PRODIGI_API_BASE}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Prodigi API error', {
        status: response.status,
        endpoint,
        error: errorText,
      })
      throw new Error(`Prodigi API error: ${response.status} - ${errorText}`)
    }

    return response.json()
  }

  /**
   * Get product information including pricing
   */
  async getProduct(sku: string): Promise<ProdigiProductInfo> {
    return this.request<ProdigiProductInfo>(`/products/${sku}`)
  }

  /**
   * Create a new order
   */
  async createOrder(order: ProdigiOrder): Promise<{ outcome: string; order: ProdigiOrderResponse }> {
    return this.request<{ outcome: string; order: ProdigiOrderResponse }>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  /**
   * Get order status
   */
  async getOrder(orderId: string): Promise<ProdigiOrderResponse> {
    return this.request<ProdigiOrderResponse>(`/orders/${orderId}`)
  }

  /**
   * Cancel an order (if not yet in production)
   */
  async cancelOrder(orderId: string): Promise<{ outcome: string }> {
    return this.request<{ outcome: string }>(`/orders/${orderId}/actions/cancel`, {
      method: 'POST',
    })
  }

  /**
   * Get a quote for an order without creating it
   */
  async getQuote(order: Omit<ProdigiOrder, 'merchantReference'>): Promise<{
    outcome: string
    quotes: Array<{
      shipmentMethod: string
      costSummary: {
        items: { amount: string; currency: string }
        shipping: { amount: string; currency: string }
        total: { amount: string; currency: string }
      }
    }>
  }> {
    return this.request('/quotes', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  /**
   * Check if API is configured and working
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to get a product to verify API is working
      await this.getProduct('GLOBAL-FAP-16x24')
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if Prodigi is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }
}

// Export singleton instance
export const prodigiClient = new ProdigiClient()

// Export class for testing
export { ProdigiClient }
