import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  return NextResponse.json({
    stripeSecretKey: {
      exists: !!stripeKey,
      isLive: stripeKey?.startsWith('sk_live_') || false,
      isTest: stripeKey?.startsWith('sk_test_') || false,
      length: stripeKey?.length || 0,
      prefix: stripeKey?.substring(0, 15) || 'NOT_SET',
    },
    webhookSecret: {
      exists: !!webhookSecret,
      isValid: webhookSecret?.startsWith('whsec_') || false,
      length: webhookSecret?.length || 0,
    },
    publishableKey: {
      exists: !!publishableKey,
      isLive: publishableKey?.startsWith('pk_live_') || false,
      isTest: publishableKey?.startsWith('pk_test_') || false,
    },
    baseUrl: {
      exists: !!baseUrl,
      value: baseUrl || 'NOT_SET',
    },
  })
}
