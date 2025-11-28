import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Only show first/last 4 chars of sensitive values
  const maskValue = (value: string | undefined): string => {
    if (!value) return 'NOT SET'
    if (value.length <= 8) return '****'
    return `${value.slice(0, 4)}...${value.slice(-4)}`
  }

  return NextResponse.json({
    STRIPE_SECRET_KEY: maskValue(process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: maskValue(process.env.STRIPE_WEBHOOK_SECRET),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: maskValue(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  })
}
