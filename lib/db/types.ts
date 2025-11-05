/**
 * Database Types for Order Management System
 *
 * Type-safe interfaces for all database operations
 */

export interface Address {
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  variantId?: string
  imageUrl?: string
  printfulProductId?: string
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled'
export type PrintfulStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Complete order object as stored in database
 */
export interface Order {
  id: string
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  customer_email: string
  customer_name: string
  shipping_address: Address | null
  billing_address: Address | null
  items: OrderItem[]
  total_amount: number
  currency: string
  status: OrderStatus
  printful_status: PrintfulStatus
  printful_order_id: string | null
  metadata: Record<string, any> | null
  created_at: Date
  updated_at: Date
}

/**
 * Data required to create a new order
 */
export interface CreateOrderInput {
  stripeSessionId: string
  stripePaymentIntent?: string | null
  customerEmail: string
  customerName: string
  shippingAddress?: Address | null
  billingAddress?: Address | null
  items: OrderItem[]
  totalAmount: number
  currency: string
  status?: OrderStatus
  printfulStatus?: PrintfulStatus
  metadata?: Record<string, any> | null
}

/**
 * Data for updating an existing order
 */
export interface UpdateOrderInput {
  id: string
  status?: OrderStatus
  printfulStatus?: PrintfulStatus
  printfulOrderId?: string | null
  metadata?: Record<string, any> | null
}

/**
 * Summary view of an order (for lists and indexes)
 */
export interface OrderSummary {
  id: string
  customer_email: string
  total_amount: number
  status: OrderStatus
  created_at: Date
}

/**
 * Pagination parameters for order queries
 */
export interface PaginationParams {
  limit?: number
  offset?: number
}

/**
 * Filter parameters for order queries
 */
export interface OrderFilters {
  status?: OrderStatus
  customerEmail?: string
  startDate?: Date
  endDate?: Date
}

/**
 * Statistics about orders
 */
export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  paidOrders: number
  fulfilledOrders: number
  shippedOrders: number
  averageOrderValue: number
}
