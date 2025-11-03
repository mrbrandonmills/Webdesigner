/**
 * Printful API Client
 * Documentation: https://developers.printful.com/
 */

const PRINTFUL_API_BASE = 'https://api.printful.com'

interface PrintfulProduct {
  id: number
  external_id: string
  name: string
  variants: number
  synced: number
  thumbnail_url: string
  is_ignored: boolean
}

interface PrintfulVariant {
  id: number
  external_id: string
  sync_product_id: number
  name: string
  synced: boolean
  variant_id: number
  retail_price: string
  currency: string
  is_ignored: boolean
  files: {
    preview_url: string
    thumbnail_url: string
  }[]
}

interface PrintfulProductDetails {
  sync_product: PrintfulProduct
  sync_variants: PrintfulVariant[]
}

class PrintfulClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${PRINTFUL_API_BASE}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Printful API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.result as T
  }

  /**
   * Get all store products
   */
  async getProducts(): Promise<PrintfulProduct[]> {
    return this.request<PrintfulProduct[]>('/store/products')
  }

  /**
   * Get product details with variants
   */
  async getProduct(productId: string): Promise<PrintfulProductDetails> {
    return this.request<PrintfulProductDetails>(`/store/products/${productId}`)
  }

  /**
   * Get available product catalog
   */
  async getCatalogProducts(): Promise<any[]> {
    return this.request<any[]>('/products')
  }

  /**
   * Get product variant details
   */
  async getCatalogVariant(productId: number, variantId: number): Promise<any> {
    return this.request<any>(`/products/${productId}/variants/${variantId}`)
  }

  /**
   * Create a new product
   */
  async createProduct(productData: {
    sync_product: {
      external_id?: string
      name: string
      thumbnail?: string
    }
    sync_variants: {
      variant_id: number
      retail_price: string
      files: {
        url: string
        type?: string
        position?: string
      }[]
    }[]
  }): Promise<PrintfulProductDetails> {
    return this.request<PrintfulProductDetails>('/store/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  /**
   * Calculate shipping rates
   */
  async calculateShipping(data: {
    recipient: {
      country_code: string
      state_code?: string
      city?: string
      zip?: string
    }
    items: {
      variant_id: number
      quantity: number
    }[]
    currency?: string
  }): Promise<any> {
    return this.request<any>('/shipping/rates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Create an order
   */
  async createOrder(orderData: {
    external_id?: string
    recipient: {
      name: string
      address1: string
      city: string
      state_code?: string
      country_code: string
      zip: string
      email?: string
      phone?: string
    }
    items: {
      variant_id: number
      quantity: number
      retail_price?: string
      files?: {
        url: string
      }[]
    }[]
    retail_costs?: {
      currency: string
      subtotal: string
      discount: string
      shipping: string
      tax: string
    }
  }): Promise<any> {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  /**
   * Confirm and submit order for fulfillment
   */
  async confirmOrder(orderId: string): Promise<any> {
    return this.request<any>(`/orders/${orderId}/confirm`, {
      method: 'POST',
    })
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<any> {
    return this.request<any>(`/orders/${orderId}`)
  }

  /**
   * Get all orders
   */
  async getOrders(params?: {
    status?: string
    offset?: number
    limit?: number
  }): Promise<any> {
    const queryParams = new URLSearchParams(params as any).toString()
    const endpoint = queryParams ? `/orders?${queryParams}` : '/orders'
    return this.request<any>(endpoint)
  }

  /**
   * Get product template
   */
  async getProductTemplate(productId: number): Promise<any> {
    return this.request<any>(`/mockup-generator/templates/${productId}`)
  }

  /**
   * Generate mockup
   */
  async generateMockup(data: {
    variant_ids: number[]
    format?: string
    files?: {
      placement: string
      image_url: string
    }[]
  }): Promise<any> {
    return this.request<any>('/mockup-generator/create-task', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get mockup task result
   */
  async getMockupTask(taskKey: string): Promise<any> {
    return this.request<any>(`/mockup-generator/task?task_key=${taskKey}`)
  }
}

// Export singleton instance
export const printfulClient = new PrintfulClient(process.env.PRINTFUL_API_KEY || '')

export default PrintfulClient
