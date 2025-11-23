/**
 * EXTERNAL Vercel Deployment Monitor
 *
 * Runs OUTSIDE Vercel to catch build failures
 * Should run on Railway/external server every 30 minutes
 *
 * ALERTS when:
 * - Build fails
 * - Deployment fails
 * - Cron jobs stop running
 * - No posts in last 6 hours
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface DeploymentStatus {
  url: string
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED'
  created: string
}

async function checkLatestDeployment(): Promise<DeploymentStatus | null> {
  try {
    const { stdout } = await execAsync('npx vercel ls --prod --token=$VERCEL_TOKEN')

    // Parse first deployment line
    const lines = stdout.split('\n')
    const deploymentLine = lines.find(l => l.includes('https://'))

    if (!deploymentLine) return null

    const match = deploymentLine.match(/(https:\/\/[^\s]+)\s+●\s+(Ready|Error|Building|Queued)/)
    if (!match) return null

    return {
      url: match[1],
      state: match[2].toUpperCase() as any,
      created: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to check deployment:', error)
    return null
  }
}

async function checkCronJobs(): Promise<{ working: boolean; lastPost: string }> {
  try {
    // Check automation state file
    const stateFile = '/path/to/data/automation-state.json'
    // TODO: Read state file and check last post time

    return {
      working: false,
      lastPost: 'Unknown'
    }
  } catch (error) {
    return {
      working: false,
      lastPost: 'Error checking'
    }
  }
}

async function sendAlert(message: string): Promise<void> {
  console.error('🚨 ALERT:', message)

  // TODO: Send to Discord/Slack/SMS
  // For now, just log
}

async function monitor(): Promise<void> {
  console.log('[Monitor] Checking Vercel deployment status...')

  const deployment = await checkLatestDeployment()

  if (!deployment) {
    await sendAlert('⚠️ Could not fetch deployment status')
    return
  }

  console.log(`[Monitor] Latest deployment: ${deployment.state}`)

  if (deployment.state === 'ERROR') {
    await sendAlert(`🔥 BUILD FAILED: ${deployment.url}
Your cron jobs are DOWN!
Check logs: vercel inspect ${deployment.url} --logs`)
  }

  if (deployment.state === 'READY') {
    // Check if cron jobs are actually running
    const cronStatus = await checkCronJobs()

    if (!cronStatus.working) {
      await sendAlert(`⚠️ Deployment successful but CRON JOBS NOT RUNNING
Last post: ${cronStatus.lastPost}
Manual trigger required?`)
    } else {
      console.log('✅ All systems operational')
    }
  }
}

// Run monitor
monitor()
  .then(() => {
    console.log('[Monitor] Check complete')
    process.exit(0)
  })
  .catch(error => {
    console.error('[Monitor] Fatal error:', error)
    process.exit(1)
  })
