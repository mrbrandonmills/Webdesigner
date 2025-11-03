import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Get all orders
 */
export async function GET() {
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
      totalRevenue: orders.reduce((sum: number, order: any) => sum + order.total, 0),
      pendingOrders: orders.filter((order: any) => order.status === 'pending' || order.status === 'paid').length,
    }

    return NextResponse.json({
      success: true,
      orders,
      stats,
    })
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
