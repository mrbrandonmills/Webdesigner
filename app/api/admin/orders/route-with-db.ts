import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import {
  getOrderSummaries,
  getOrderStats,
  USE_DATABASE,
  isDatabaseAvailable,
} from '@/lib/db/client'
import type { OrderFilters, PaginationParams } from '@/lib/db/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Get all orders with optional filtering and pagination
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') as any
    const customerEmail = searchParams.get('email') || undefined
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined

    // Build filters and pagination
    const filters: OrderFilters = {
      status,
      customerEmail,
      startDate,
      endDate,
    }

    const pagination: PaginationParams = {
      limit,
      offset,
    }

    // Determine data source based on feature flag and database availability
    const shouldUseDatabase = USE_DATABASE && (await isDatabaseAvailable())

    if (shouldUseDatabase) {
      return await getOrdersFromDatabase(filters, pagination)
    }

    // Fallback to filesystem
    return await getOrdersFromFilesystem()
  } catch (error) {
    console.error('Failed to load orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load orders',
      },
      { status: 500 }
    )
  }
}

/**
 * Get orders from database
 */
async function getOrdersFromDatabase(
  filters: OrderFilters,
  pagination: PaginationParams
) {
  try {
    console.log('📊 Loading orders from database...')

    // Get orders and stats in parallel
    const [orders, stats] = await Promise.all([
      getOrderSummaries(filters, pagination),
      getOrderStats(filters),
    ])

    console.log(`✅ Loaded ${orders.length} orders from database`)

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        id: order.id,
        email: order.customer_email,
        total: order.total_amount,
        status: order.status,
        createdAt: order.created_at.toISOString(),
      })),
      stats: {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        pendingOrders: stats.pendingOrders,
        paidOrders: stats.paidOrders,
        fulfilledOrders: stats.fulfilledOrders,
        shippedOrders: stats.shippedOrders,
        averageOrderValue: stats.averageOrderValue,
      },
      pagination: {
        limit: pagination.limit,
        offset: pagination.offset,
        hasMore: orders.length === pagination.limit,
      },
      dataSource: 'database',
    })
  } catch (error) {
    console.error('❌ Database query failed, falling back to filesystem:', error)
    // Fallback to filesystem
    return await getOrdersFromFilesystem()
  }
}

/**
 * Get orders from filesystem (legacy method)
 */
async function getOrdersFromFilesystem() {
  try {
    console.log('📊 Loading orders from filesystem...')

    const indexFile = path.join(process.cwd(), 'data', 'orders', 'index.json')

    let orders = []
    try {
      const indexContent = await readFile(indexFile, 'utf-8')
      orders = JSON.parse(indexContent)
    } catch (error) {
      // No orders yet
      return NextResponse.json({
        success: true,
        orders: [],
        stats: {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
        },
        dataSource: 'filesystem',
      })
    }

    // Calculate stats
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
      pendingOrders: orders.filter((order: any) => order.status === 'pending' || order.status === 'paid').length,
    }

    console.log(`✅ Loaded ${orders.length} orders from filesystem`)

    return NextResponse.json({
      success: true,
      orders,
      stats,
      dataSource: 'filesystem',
    })
  } catch (error) {
    console.error('❌ Failed to load orders from filesystem:', error)
    throw error
  }
}
