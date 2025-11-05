/**
 * Printful V2 API Client
 * Documentation: https://developers.printful.com/
 *
 * SECURITY WARNING: Never hardcode API credentials in source code!
 * Configure these values in your environment variables (.env.local)
 */

const PRINTFUL_API_BASE = 'https://api.printful.com'

interface PrintfulResponse<T> {
  data: T
  paging?: {
    total: number
    offset: number
    limit: number
  }
}

interface CatalogProduct {
  id: number
  title: string
  brand: string
  model: string
  description: string
  type: string
  type_name: string
}

interface CatalogVariant {
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

interface VariantPrice {
  variant_id: number
  price: string
  currency: string
}

interface FileUploadResponse {
  id: string
  url: string
  filename: string
  mime_type: string
  size: number
  width: number
  height: number
  dpi: number
}

interface Order {
  id: number
  external_id?: string
  status: string
  shipping: string
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
  order_items: OrderItem[]
  retail_costs?: {
    currency: string
    subtotal: string
    shipping: string
    tax: string
    total: string
  }
}

interface OrderItem {
  source: 'catalog'
  catalog_variant_id: number
  quantity: number
  retail_price?: string
  placements: Placement[]
}

interface Placement {
  placement: string
  technique: string
  layers: Layer[]
}

interface Layer {
  type: 'file'
  url: string
}

class PrintfulClient {
  private apiKey: string
  private storeId: string

  constructor(apiKey: string, storeId: string) {
    this.apiKey = apiKey
    this.storeId = storeId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${PRINTFUL_API_BASE}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-PF-Store-Id': this.storeId,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Printful API error (${response.status}): ${error}`)
    }

    const result: PrintfulResponse<T> = await response.json()
    return result.data
  }

  /**
   * Get catalog products (all available products you can sell)
   */
  async getCatalogProducts(params?: {
    category_id?: number
    offset?: number
    limit?: number
  }): Promise<CatalogProduct[]> {
    const queryParams = new URLSearchParams()
    if (params?.category_id) queryParams.set('category_id', params.category_id.toString())
    if (params?.offset) queryParams.set('offset', params.offset.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())

    const query = queryParams.toString()
    const endpoint = query ? `/v2/catalog-products?${query}` : '/v2/catalog-products'

    return this.request<CatalogProduct[]>(endpoint)
  }

  /**
   * Get specific catalog product details
   */
  async getCatalogProduct(productId: number): Promise<CatalogProduct> {
    return this.request<CatalogProduct>(`/v2/catalog-products/${productId}`)
  }

  /**
   * Get all variants (sizes/colors) for a product
   */
  async getCatalogVariants(productId: number): Promise<CatalogVariant[]> {
    return this.request<CatalogVariant[]>(`/v2/catalog-products/${productId}/catalog-variants`)
  }

  /**
   * Get specific variant details
   */
  async getCatalogVariant(variantId: number): Promise<CatalogVariant> {
    return this.request<CatalogVariant>(`/v2/catalog-variants/${variantId}`)
  }

  /**
   * Get pricing for a variant
   */
  async getVariantPrice(variantId: number): Promise<VariantPrice> {
    return this.request<VariantPrice>(`/v2/catalog-variants/${variantId}/prices`)
  }

  /**
   * Upload a file (your portfolio image)
   */
  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${PRINTFUL_API_BASE}/v2/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-PF-Store-Id': this.storeId,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`File upload failed (${response.status}): ${error}`)
    }

    const result: PrintfulResponse<FileUploadResponse> = await response.json()
    return result.data
  }

  /**
   * Create an order (when customer buys)
   */
  async createOrder(orderData: Omit<Order, 'id' | 'status'>): Promise<Order> {
    return this.request<Order>('/v2/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  /**
   * Confirm order for fulfillment
   */
  async confirmOrder(orderId: number): Promise<Order> {
    return this.request<Order>(`/v2/orders/${orderId}/confirmation`, {
      method: 'POST',
    })
  }

  /**
   * Get order details
   */
  async getOrder(orderId: number): Promise<Order> {
    return this.request<Order>(`/v2/orders/${orderId}`)
  }

  /**
   * Get all orders
   */
  async getOrders(params?: {
    status?: string
    offset?: number
    limit?: number
  }): Promise<Order[]> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.set('status', params.status)
    if (params?.offset) queryParams.set('offset', params.offset.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())

    const query = queryParams.toString()
    const endpoint = query ? `/v2/orders?${query}` : '/v2/orders'

    return this.request<Order[]>(endpoint)
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
      catalog_variant_id: number
      quantity: number
    }[]
  }): Promise<any> {
    return this.request<any>('/v2/shipping-rates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Generate mockups
   */
  async createMockupTask(data: {
    variant_ids: number[]
    format?: string
    files?: {
      placement: string
      image_url: string
    }[]
  }): Promise<{ task_key: string; status: string }> {
    return this.request<{ task_key: string; status: string }>('/v2/mockup-tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Get mockup task result
   */
  async getMockupTask(taskKey: string): Promise<any> {
    return this.request<any>(`/v2/mockup-tasks?task_key=${taskKey}`)
  }
}

// Export singleton instance
export const printfulClient = new PrintfulClient(
  process.env.PRINTFUL_API_KEY || '',
  process.env.PRINTFUL_STORE_ID || ''
)

export default PrintfulClient
