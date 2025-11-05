import { requireAuth } from '@/lib/auth'
import OrdersClient from './orders-client'

export default async function OrdersPage() {
  // Server-side authentication check
  await requireAuth()

  return <OrdersClient />
}
