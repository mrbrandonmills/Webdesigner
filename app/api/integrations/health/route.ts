import { NextResponse } from 'next/server'
import { runFullHealthCheck, HealthReport } from '@/lib/integration-health'

// Health check endpoint - called by cron every 15 minutes
// Industry standard: 5-15 min for critical services

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Store last report in memory (for dashboard display)
let lastReport: HealthReport | null = null
let alertsSent: Record<string, number> = {}

export async function GET(request: Request) {
  try {
    const report = await runFullHealthCheck()
    lastReport = report

    // Check if we need to send alerts
    const criticalServices = report.integrations.filter(i => i.status === 'down')
    const degradedServices = report.integrations.filter(i => i.status === 'degraded')

    // Log for monitoring
    console.log(`[Health Check] Status: ${report.overallStatus}`)
    console.log(`[Health Check] Down: ${criticalServices.map(s => s.name).join(', ') || 'none'}`)
    console.log(`[Health Check] Degraded: ${degradedServices.map(s => s.name).join(', ') || 'none'}`)

    // Send email alert for critical issues (once per hour per service)
    if (criticalServices.length > 0) {
      for (const service of criticalServices) {
        const lastAlert = alertsSent[service.name] || 0
        const hourAgo = Date.now() - 60 * 60 * 1000

        if (lastAlert < hourAgo) {
          await sendAlertEmail(service.name, service.errorMessage || 'Service is down')
          alertsSent[service.name] = Date.now()
        }
      }
    }

    return NextResponse.json({
      success: true,
      report,
      summary: {
        overall: report.overallStatus,
        healthy: report.integrations.filter(i => i.status === 'healthy').length,
        degraded: degradedServices.length,
        down: criticalServices.length,
        total: report.integrations.length
      }
    })
  } catch (error) {
    console.error('[Health Check] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Health check failed' },
      { status: 500 }
    )
  }
}

// Send alert email using Resend
async function sendAlertEmail(serviceName: string, error: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.log('[Health Check] No Resend API key - skipping alert email')
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: 'Brandon Mills <alerts@brandonmills.com>',
        to: ['brandon@brandonmills.com'],
        subject: `🚨 Integration Alert: ${serviceName} is DOWN`,
        html: `
          <h2>Integration Health Alert</h2>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Status:</strong> DOWN</p>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</p>
          <hr>
          <p>Check the health dashboard: <a href="https://brandonmills.com/admin/integrations">Admin Dashboard</a></p>
        `
      })
    })

    if (res.ok) {
      console.log(`[Health Check] Alert email sent for ${serviceName}`)
    }
  } catch (e) {
    console.error('[Health Check] Failed to send alert email:', e)
  }
}
