/**
 * Automation Logger
 *
 * Centralized logging for all automation scripts
 * Logs to console and file with timestamps
 */

import * as fs from 'fs'
import * as path from 'path'
import { pathsConfig } from './config'

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS'

interface LogEntry {
  timestamp: string
  level: LogLevel
  platform: string
  message: string
  data?: any
}

class Logger {
  private logFile: string
  private logsDir: string

  constructor() {
    this.logsDir = pathsConfig.logsDir
    this.logFile = path.join(this.logsDir, 'automation.log')
    this.ensureLogDirectory()
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true })
    }
  }

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private getColorCode(level: LogLevel): string {
    switch (level) {
      case 'INFO': return '\x1b[36m' // Cyan
      case 'WARN': return '\x1b[33m' // Yellow
      case 'ERROR': return '\x1b[31m' // Red
      case 'DEBUG': return '\x1b[90m' // Gray
      case 'SUCCESS': return '\x1b[32m' // Green
      default: return '\x1b[0m' // Reset
    }
  }

  private getEmoji(level: LogLevel): string {
    switch (level) {
      case 'INFO': return 'i'
      case 'WARN': return '!'
      case 'ERROR': return 'x'
      case 'DEBUG': return '.'
      case 'SUCCESS': return '+'
      default: return '-'
    }
  }

  private log(level: LogLevel, platform: string, message: string, data?: any): void {
    const timestamp = this.formatTimestamp()
    const colorCode = this.getColorCode(level)
    const emoji = this.getEmoji(level)
    const reset = '\x1b[0m'

    // Console output with colors
    const consoleMessage = `${colorCode}[${emoji}]${reset} [${timestamp}] [${platform.toUpperCase()}] ${message}`
    console.log(consoleMessage)
    if (data && level === 'DEBUG') {
      console.log('    ', JSON.stringify(data, null, 2))
    }

    // File output (no colors)
    const logEntry: LogEntry = {
      timestamp,
      level,
      platform,
      message,
      data,
    }

    const fileMessage = `[${level}] [${timestamp}] [${platform.toUpperCase()}] ${message}${
      data ? `\n    Data: ${JSON.stringify(data)}` : ''
    }\n`

    fs.appendFileSync(this.logFile, fileMessage)
  }

  info(platform: string, message: string, data?: any): void {
    this.log('INFO', platform, message, data)
  }

  warn(platform: string, message: string, data?: any): void {
    this.log('WARN', platform, message, data)
  }

  error(platform: string, message: string, data?: any): void {
    this.log('ERROR', platform, message, data)
  }

  debug(platform: string, message: string, data?: any): void {
    this.log('DEBUG', platform, message, data)
  }

  success(platform: string, message: string, data?: any): void {
    this.log('SUCCESS', platform, message, data)
  }

  // Specialized logging methods
  postStarted(platform: string, details: string): void {
    this.info(platform, `Starting post: ${details}`)
  }

  postCompleted(platform: string, details: string, url?: string): void {
    this.success(platform, `Post completed: ${details}${url ? ` - URL: ${url}` : ''}`)
  }

  postFailed(platform: string, details: string, error: any): void {
    this.error(platform, `Post failed: ${details}`, { error: error.message || error })
  }

  rateLimited(platform: string, waitTime: number): void {
    this.warn(platform, `Rate limited, waiting ${waitTime / 1000} seconds`)
  }

  retrying(platform: string, attempt: number, maxAttempts: number): void {
    this.info(platform, `Retrying... (attempt ${attempt}/${maxAttempts})`)
  }

  schedulerStarted(): void {
    this.info('SCHEDULER', 'Automation scheduler started')
  }

  schedulerStopped(): void {
    this.info('SCHEDULER', 'Automation scheduler stopped')
  }

  taskScheduled(platform: string, time: string): void {
    this.info('SCHEDULER', `${platform} task scheduled for ${time}`)
  }

  // Get recent logs
  getRecentLogs(lines: number = 100): string[] {
    if (!fs.existsSync(this.logFile)) {
      return []
    }

    const content = fs.readFileSync(this.logFile, 'utf-8')
    const allLines = content.split('\n').filter(line => line.trim())
    return allLines.slice(-lines)
  }

  // Clear old logs
  clearOldLogs(daysToKeep: number = 30): void {
    const logFiles = fs.readdirSync(this.logsDir)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    logFiles.forEach(file => {
      const filePath = path.join(this.logsDir, file)
      const stats = fs.statSync(filePath)
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath)
        this.info('LOGGER', `Deleted old log file: ${file}`)
      }
    })
  }

  // Rotate logs if file gets too large
  rotateIfNeeded(maxSizeMB: number = 10): void {
    if (!fs.existsSync(this.logFile)) return

    const stats = fs.statSync(this.logFile)
    const sizeMB = stats.size / (1024 * 1024)

    if (sizeMB > maxSizeMB) {
      const timestamp = this.formatTimestamp().replace(/[:.]/g, '-')
      const archivePath = path.join(this.logsDir, `automation-${timestamp}.log`)
      fs.renameSync(this.logFile, archivePath)
      this.info('LOGGER', `Log rotated to: ${archivePath}`)
    }
  }
}

// Export singleton instance
export const logger = new Logger()
export default logger
