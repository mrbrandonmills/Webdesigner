import { requireAuth } from '@/lib/auth'
import AdminHubClient from './admin-hub-client'

export default async function AdminHub() {
  // Server-side authentication check
  await requireAuth()

  return <AdminHubClient />
}
