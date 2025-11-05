import { requireAuth } from '@/lib/auth'
import GenerateProductsClient from './generate-products-client'

export default async function GenerateProductsPage() {
  // Server-side authentication check
  await requireAuth()

  return <GenerateProductsClient />
}
