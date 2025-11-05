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

// Sync Product Interfaces
interface SyncProduct {
  id: number
  external_id: string
  name: string
  synced: number
  thumbnail_url: string
  is_ignored: boolean
  sync_variants?: SyncVariant[]
}

interface SyncVariant {
  id: number
  external_id: string
  sync_product_id: number
  name: string
  synced: boolean
  variant_id: number
  product?: CatalogProduct
  files: SyncVariantFile[]
  options: SyncVariantOption[]
  is_ignored: boolean
  sku: string
  retail_price: string
  currency: string
}

interface SyncVariantFile {
  id: number
  type: string
  hash: string
  url: string
  filename: string
  mime_type: string
  size: number
  width: number
  height: number
  dpi: number
  status: string
  created: number
  thumbnail_url: string
  preview_url: string
  visible: boolean
  options?: FileOption[]
}

interface FileOption {
  id: string
  value: any
}

interface SyncVariantOption {
  id: string
  value: string | number
}

interface CreateSyncProductRequest {
  sync_product: {
    external_id: string
    name: string
    thumbnail?: string
  }
  sync_variants: CreateSyncVariantRequest[]
}

interface CreateSyncVariantRequest {
  external_id: string
  variant_id: number
  files: CreateSyncVariantFile[]
  options?: SyncVariantOption[]
  retail_price: string
  sku?: string
  is_ignored?: boolean
}

interface CreateSyncVariantFile {
  type?: string
  url?: string
  id?: number
  options?: FileOption[]
}

interface MockupGeneratorRequest {
  variant_ids: number[]
  format?: 'jpg' | 'png'
  width?: number
  files: MockupFile[]
  options?: string[]
  option_groups?: string[]
  technique?: string
}

interface MockupFile {
  placement: string
  image_url: string
  position?: {
    area_width: number
    area_height: number
    width: number
    height: number
    top: number
    left: number
  }
}

interface MockupGeneratorResponse {
  task_key: string
  status: string
}

interface MockupTaskResult {
  status: string
  code: number
  result: {
    task_key: string
    status: string
    mockups?: MockupResult[]
    printfiles?: PrintfileResult[]
    extra?: MockupResult[]
  }
}

interface MockupResult {
  placement: string
  variant_ids: number[]
  mockup_url: string
  extra?: Array<{
    title: string
    url: string
  }>
}

interface PrintfileResult {
  placement: string
  variant_ids: number[]
  printfile_url: string
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
      const errorText = await response.text()

      // Log detailed error server-side for debugging
      console.error(`Printful API Error [${response.status}]:`, {
        endpoint,
        status: response.status,
        error: errorText,
      })

      // Throw sanitized error without exposing internal details
      // The calling code should catch this and return a safe message to client
      throw new Error(`Printful API request failed with status ${response.status}`)
    }

    const result = await response.json()

    // Handle both v1 and v2 API response formats
    // v1 returns { code: 200, result: data }
    // v2 returns { data: data }
    if ('data' in result) {
      return result.data as T
    } else if ('result' in result) {
      return result as T // Return full response for v1 endpoints that need it
    }

    return result as T
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
      const errorText = await response.text()

      // Log detailed error server-side
      console.error(`Printful File Upload Error [${response.status}]:`, errorText)

      // Throw sanitized error
      throw new Error(`File upload failed with status ${response.status}`)
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

  // ============================================
  // SYNC PRODUCTS API (v1)
  // Note: These use v1 API as sync products aren't available in v2 yet
  // ============================================

  /**
   * Get all sync products
   */
  async getSyncProducts(params?: {
    offset?: number
    limit?: number
    category_id?: number
  }): Promise<SyncProduct[]> {
    const queryParams = new URLSearchParams()
    if (params?.offset) queryParams.set('offset', params.offset.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.category_id) queryParams.set('category_id', params.category_id.toString())

    const query = queryParams.toString()
    const endpoint = query ? `/sync/products?${query}` : '/sync/products'

    const response = await this.request<{ result: SyncProduct[]; paging: any }>(endpoint)
    return response.result || []
  }

  /**
   * Get specific sync product with variants
   */
  async getSyncProduct(id: number | string): Promise<SyncProduct> {
    const response = await this.request<{ result: { sync_product: SyncProduct; sync_variants: SyncVariant[] } }>(`/sync/products/${id}`)
    if (response.result) {
      response.result.sync_product.sync_variants = response.result.sync_variants
      return response.result.sync_product
    }
    throw new Error('Failed to get sync product')
  }

  /**
   * Create a new sync product
   */
  async createSyncProduct(data: CreateSyncProductRequest): Promise<SyncProduct> {
    const response = await this.request<{ result: SyncProduct }>('/sync/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.result
  }

  /**
   * Update sync product
   */
  async updateSyncProduct(id: number | string, data: Partial<CreateSyncProductRequest>): Promise<SyncProduct> {
    const response = await this.request<{ result: SyncProduct }>(`/sync/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.result
  }

  /**
   * Delete sync product
   */
  async deleteSyncProduct(id: number | string): Promise<boolean> {
    await this.request(`/sync/products/${id}`, {
      method: 'DELETE',
    })
    return true
  }

  /**
   * Create sync variant
   */
  async createSyncVariant(productId: number | string, data: CreateSyncVariantRequest): Promise<SyncVariant> {
    const response = await this.request<{ result: SyncVariant }>(`/sync/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.result
  }

  /**
   * Upload file to Printful (from URL)
   */
  async uploadFileFromUrl(imageUrl: string, filename?: string): Promise<FileUploadResponse> {
    const data = {
      url: imageUrl,
      filename: filename || 'design.png',
      type: 'default'
    }

    const response = await this.request<{ result: FileUploadResponse }>('/files', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.result
  }

  /**
   * Generate product mockups (v1 API)
   */
  async generateMockup(data: MockupGeneratorRequest): Promise<MockupGeneratorResponse> {
    const response = await this.request<{ result: MockupGeneratorResponse }>('/mockup-generator/create-task/1', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.result
  }

  /**
   * Get mockup generation result (v1 API)
   */
  async getMockupResult(taskKey: string): Promise<MockupTaskResult> {
    const maxAttempts = 30 // 30 seconds max wait
    let attempts = 0

    while (attempts < maxAttempts) {
      const response = await this.request<MockupTaskResult>(`/mockup-generator/task?task_key=${taskKey}`)

      if (response.result.status === 'completed') {
        return response
      }

      if (response.result.status === 'failed') {
        throw new Error('Mockup generation failed')
      }

      // Wait 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }

    throw new Error('Mockup generation timed out')
  }

  /**
   * Helper: Create sync product with AI design
   */
  async createProductWithDesign(params: {
    name: string
    designUrl: string
    productId: number // Printful catalog product ID
    variantId: number // Printful catalog variant ID
    retailPrice: string
    placement?: string
    externalId?: string
  }): Promise<{ product: SyncProduct; mockupUrl?: string }> {
    try {
      console.log('📦 Creating sync product with design:', params.name)

      // Step 1: Upload design file to Printful
      console.log('📤 Uploading design to Printful...')
      const uploadedFile = await this.uploadFileFromUrl(params.designUrl, `${params.externalId || Date.now()}-design.png`)
      console.log('✅ Design uploaded:', uploadedFile.id)

      // Step 2: Create sync product
      const syncProductData: CreateSyncProductRequest = {
        sync_product: {
          external_id: params.externalId || `ai-${Date.now()}`,
          name: params.name,
          thumbnail: uploadedFile.url
        },
        sync_variants: [
          {
            external_id: `${params.externalId || Date.now()}-variant`,
            variant_id: params.variantId,
            retail_price: params.retailPrice,
            files: [
              {
                id: parseInt(uploadedFile.id),
                type: params.placement || 'default'
              }
            ]
          }
        ]
      }

      console.log('📦 Creating sync product...')
      const syncProduct = await this.createSyncProduct(syncProductData)
      console.log('✅ Sync product created:', syncProduct.id)

      // Step 3: Generate mockup
      let mockupUrl: string | undefined
      try {
        console.log('🎨 Generating mockup...')
        const mockupTask = await this.generateMockup({
          variant_ids: [params.variantId],
          format: 'jpg',
          files: [
            {
              placement: params.placement || 'default',
              image_url: uploadedFile.url
            }
          ]
        })

        const mockupResult = await this.getMockupResult(mockupTask.task_key)
        mockupUrl = mockupResult.result.mockups?.[0]?.mockup_url
        console.log('✅ Mockup generated:', mockupUrl)
      } catch (error) {
        console.error('⚠️ Mockup generation failed, continuing without mockup:', error)
      }

      return { product: syncProduct, mockupUrl }
    } catch (error) {
      console.error('❌ Failed to create product with design:', error)
      throw error
    }
  }
}

// Export singleton instance
export const printfulClient = new PrintfulClient(
  process.env.PRINTFUL_API_KEY || '',
  process.env.PRINTFUL_STORE_ID || ''
)

export default PrintfulClient
