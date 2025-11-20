/**
 * Database Client for Vercel Postgres
 *
 * Provides connection management and query helpers for order storage
 */

import { sql } from '@vercel/postgres'
import { logger } from '@/lib/logger'
import {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderSummary,
  OrderFilters,
  OrderStats,
  PaginationParams,
  OrderStatus,
} from './types'

/**
 * Feature flag to toggle between database and filesystem
 * Set to false to use legacy filesystem storage
 */
export const USE_DATABASE = process.env.USE_DATABASE === 'true'

/**
 * Create a new order in the database
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  try {
    const result = await sql`
      INSERT INTO orders (
        id,
        stripe_session_id,
        stripe_payment_intent_id,
        customer_email,
        customer_name,
        shipping_address,
        billing_address,
        items,
        total_amount,
        currency,
        status,
        printful_status,
        metadata,
        created_at,
        updated_at
      ) VALUES (
        ${`order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
        ${input.stripeSessionId},
        ${input.stripePaymentIntent || null},
        ${input.customerEmail},
        ${input.customerName},
        ${input.shippingAddress ? JSON.stringify(input.shippingAddress) : null},
        ${input.billingAddress ? JSON.stringify(input.billingAddress) : null},
        ${JSON.stringify(input.items)},
        ${input.totalAmount},
        ${input.currency},
        ${input.status || 'paid'},
        ${input.printfulStatus || 'pending'},
        ${input.metadata ? JSON.stringify(input.metadata) : null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return mapRowToOrder(result.rows[0])
  } catch (error) {
    logger.error('Failed to create order in database:', error)
    throw new DatabaseError('Failed to create order', error)
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const result = await sql`
      SELECT * FROM orders
      WHERE id = ${orderId}
      LIMIT 1
    `

    if (result.rows.length === 0) {
      return null
    }

    return mapRowToOrder(result.rows[0])
  } catch (error) {
    logger.error('Failed to get order by ID:', error)
    throw new DatabaseError('Failed to retrieve order', error)
  }
}

/**
 * Get a single order by Stripe session ID
 */
export async function getOrderByStripeSessionId(
  sessionId: string
): Promise<Order | null> {
  try {
    const result = await sql`
      SELECT * FROM orders
      WHERE stripe_session_id = ${sessionId}
      LIMIT 1
    `

    if (result.rows.length === 0) {
      return null
    }

    return mapRowToOrder(result.rows[0])
  } catch (error) {
    logger.error('Failed to get order by session ID:', error)
    throw new DatabaseError('Failed to retrieve order', error)
  }
}

/**
 * Update an existing order
 */
export async function updateOrder(input: UpdateOrderInput): Promise<Order> {
  try {
    const updates: string[] = []
    const values: (string | Date | null)[] = []

    if (input.status !== undefined) {
      updates.push('status')
      values.push(input.status)
    }

    if (input.printfulStatus !== undefined) {
      updates.push('printful_status')
      values.push(input.printfulStatus)
    }

    if (input.printfulOrderId !== undefined) {
      updates.push('printful_order_id')
      values.push(input.printfulOrderId)
    }

    if (input.metadata !== undefined) {
      updates.push('metadata')
      values.push(JSON.stringify(input.metadata))
    }

    if (updates.length === 0) {
      throw new Error('No fields to update')
    }

    // Always update the updated_at timestamp
    updates.push('updated_at')
    values.push(new Date())

    // Build dynamic UPDATE query
    const setClauses = updates.map((field, index) => `${field} = $${index + 1}`)
    const query = `
      UPDATE orders
      SET ${setClauses.join(', ')}
      WHERE id = $${values.length + 1}
      RETURNING *
    `

    const result = await sql.query(query, [...values, input.id])

    if (result.rows.length === 0) {
      throw new Error(`Order not found: ${input.id}`)
    }

    return mapRowToOrder(result.rows[0])
  } catch (error) {
    logger.error('Failed to update order:', error)
    throw new DatabaseError('Failed to update order', error)
  }
}

/**
 * Get all orders with optional filtering and pagination
 */
export async function getOrders(
  filters?: OrderFilters,
  pagination?: PaginationParams
): Promise<Order[]> {
  try {
    const limit = pagination?.limit || 100
    const offset = pagination?.offset || 0

    let query = `SELECT * FROM orders WHERE 1=1`
    const values: (string | number | Date)[] = []
    let paramIndex = 1

    // Apply filters
    if (filters?.status) {
      query += ` AND status = $${paramIndex}`
      values.push(filters.status)
      paramIndex++
    }

    if (filters?.customerEmail) {
      query += ` AND customer_email ILIKE $${paramIndex}`
      values.push(`%${filters.customerEmail}%`)
      paramIndex++
    }

    if (filters?.startDate) {
      query += ` AND created_at >= $${paramIndex}`
      values.push(filters.startDate)
      paramIndex++
    }

    if (filters?.endDate) {
      query += ` AND created_at <= $${paramIndex}`
      values.push(filters.endDate)
      paramIndex++
    }

    // Order by most recent first
    query += ` ORDER BY created_at DESC`

    // Apply pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    values.push(limit, offset)

    const result = await sql.query(query, values)

    return result.rows.map(mapRowToOrder)
  } catch (error) {
    logger.error('Failed to get orders:', error)
    throw new DatabaseError('Failed to retrieve orders', error)
  }
}

/**
 * Get order summaries (lightweight list view)
 */
export async function getOrderSummaries(
  filters?: OrderFilters,
  pagination?: PaginationParams
): Promise<OrderSummary[]> {
  try {
    const limit = pagination?.limit || 100
    const offset = pagination?.offset || 0

    let query = `
      SELECT id, customer_email, total_amount, status, created_at
      FROM orders
      WHERE 1=1
    `
    const values: (string | number | Date)[] = []
    let paramIndex = 1

    // Apply filters (same as getOrders)
    if (filters?.status) {
      query += ` AND status = $${paramIndex}`
      values.push(filters.status)
      paramIndex++
    }

    if (filters?.customerEmail) {
      query += ` AND customer_email ILIKE $${paramIndex}`
      values.push(`%${filters.customerEmail}%`)
      paramIndex++
    }

    if (filters?.startDate) {
      query += ` AND created_at >= $${paramIndex}`
      values.push(filters.startDate)
      paramIndex++
    }

    if (filters?.endDate) {
      query += ` AND created_at <= $${paramIndex}`
      values.push(filters.endDate)
      paramIndex++
    }

    query += ` ORDER BY created_at DESC`
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    values.push(limit, offset)

    const result = await sql.query(query, values)

    return result.rows as OrderSummary[]
  } catch (error) {
    logger.error('Failed to get order summaries:', error)
    throw new DatabaseError('Failed to retrieve order summaries', error)
  }
}

/**
 * Get order statistics
 */
export async function getOrderStats(filters?: OrderFilters): Promise<OrderStats> {
  try {
    let query = `
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_orders,
        COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) as fulfilled_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM orders
      WHERE 1=1
    `
    const values: (string | Date)[] = []
    let paramIndex = 1

    // Apply filters
    if (filters?.status) {
      query += ` AND status = $${paramIndex}`
      values.push(filters.status)
      paramIndex++
    }

    if (filters?.startDate) {
      query += ` AND created_at >= $${paramIndex}`
      values.push(filters.startDate)
      paramIndex++
    }

    if (filters?.endDate) {
      query += ` AND created_at <= $${paramIndex}`
      values.push(filters.endDate)
      paramIndex++
    }

    const result = await sql.query(query, values)
    const row = result.rows[0]

    return {
      totalOrders: parseInt(row.total_orders),
      totalRevenue: parseFloat(row.total_revenue),
      pendingOrders: parseInt(row.pending_orders),
      paidOrders: parseInt(row.paid_orders),
      fulfilledOrders: parseInt(row.fulfilled_orders),
      shippedOrders: parseInt(row.shipped_orders),
      averageOrderValue: parseFloat(row.average_order_value),
    }
  } catch (error) {
    logger.error('Failed to get order stats:', error)
    throw new DatabaseError('Failed to retrieve order statistics', error)
  }
}

/**
 * Delete an order (soft delete by setting status to cancelled)
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await sql`
      UPDATE orders
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${orderId}
    `
  } catch (error) {
    logger.error('Failed to delete order:', error)
    throw new DatabaseError('Failed to delete order', error)
  }
}

/**
 * Database row structure from SQL query
 */
interface OrderDatabaseRow {
  id: string
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  customer_email: string
  customer_name: string
  shipping_address: string | object | null
  billing_address: string | object | null
  items: string | object[]
  total_amount: string | number
  currency: string
  status: string
  printful_status: string
  printful_order_id: string | null
  metadata: string | object | null
  created_at: string | Date
  updated_at: string | Date
}

/**
 * Map database row to Order interface
 */
function mapRowToOrder(row: OrderDatabaseRow): Order {
  return {
    id: row.id,
    stripe_session_id: row.stripe_session_id,
    stripe_payment_intent_id: row.stripe_payment_intent_id,
    customer_email: row.customer_email,
    customer_name: row.customer_name,
    shipping_address:
      typeof row.shipping_address === 'string'
        ? JSON.parse(row.shipping_address)
        : row.shipping_address,
    billing_address:
      typeof row.billing_address === 'string'
        ? JSON.parse(row.billing_address)
        : row.billing_address,
    items:
      typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    total_amount: parseFloat(row.total_amount),
    currency: row.currency,
    status: row.status as OrderStatus,
    printful_status: row.printful_status,
    printful_order_id: row.printful_order_id,
    metadata:
      typeof row.metadata === 'string'
        ? JSON.parse(row.metadata)
        : row.metadata,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
  }
}

/**
 * Custom error class for database operations
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Check if database is configured and available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    logger.error('Database connection check failed:', error)
    return false
  }
}
