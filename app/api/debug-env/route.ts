import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasUsername: !!process.env.ADMIN_USERNAME,
    username: process.env.ADMIN_USERNAME,
    hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    passwordHashStart: process.env.ADMIN_PASSWORD_HASH?.substring(0, 10),
    passwordHashLength: process.env.ADMIN_PASSWORD_HASH?.length,
    nodeEnv: process.env.NODE_ENV,
  })
}
