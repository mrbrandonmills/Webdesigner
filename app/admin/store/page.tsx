import { requireAuth } from '@/lib/auth'
import StoreAdminClient from './store-admin-client'

export default async function StoreAdminDashboard() {
  // Server-side authentication check
  await requireAuth()

  return <StoreAdminClient />
}
