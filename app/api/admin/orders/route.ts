import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { logger } from '@/lib/logger'
import { isAuthenticated } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Order summary from index file
 */
interface OrderSummary {
  id: string
  email: string
  total: number
  status: string
  createdAt: string
}

/**
 * Get all orders - REQUIRES AUTHENTICATION
 */
export async function GET(request: Request) {
  // CRITICAL: Verify authentication before exposing order data
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    logger.warn('Unauthorized access attempt to /api/admin/orders')
    return NextResponse.json(
      { success: false, error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  try {
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
      })
    }

    // Calculate stats
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: OrderSummary) => sum + order.total, 0),
      pendingOrders: orders.filter((order: OrderSummary) => order.status === 'pending' || order.status === 'paid').length,
    }

    return NextResponse.json({
      success: true,
      orders,
      stats,
    })
  } catch (error) {
    logger.error('Failed to load orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load orders',
      },
      { status: 500 }
    )
  }
}
