#!/usr/bin/env tsx
/**
 * Watchdog - Monitors and restarts campaign daemon if it crashes
 * Ensures automation never stops, even across system restarts
 */

import { spawn, ChildProcess } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DAEMON_SCRIPT = join(process.cwd(), 'scripts/automation/campaign-daemon.ts');
const PID_FILE = join(process.cwd(), 'logs/watchdog.pid');
const LOG_FILE = join(process.cwd(), 'logs/watchdog.log');

class Watchdog {
  private daemonProcess: ChildProcess | null = null;
  private restartCount = 0;
  private maxRestarts = 10;
  private restartDelay = 5000; // 5 seconds

  constructor() {
    this.log('🐕 Watchdog initialized');
    this.savePid();
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());

    try {
      const fs = require('fs');
      fs.appendFileSync(LOG_FILE, logMessage);
    } catch (error) {
      console.error('Failed to write to log:', error);
    }
  }

  private savePid(): void {
    try {
      writeFileSync(PID_FILE, process.pid.toString());
      this.log(`📝 Watchdog PID: ${process.pid}`);
    } catch (error) {
      this.log(`❌ Failed to save PID: ${error}`);
    }
  }

  private startDaemon(): void {
    this.log('🚀 Starting campaign daemon...');

    this.daemonProcess = spawn('npx', ['tsx', DAEMON_SCRIPT, 'start'], {
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    this.daemonProcess.stdout?.on('data', (data) => {
      this.log(`[DAEMON] ${data.toString().trim()}`);
    });

    this.daemonProcess.stderr?.on('data', (data) => {
      this.log(`[DAEMON ERROR] ${data.toString().trim()}`);
    });

    this.daemonProcess.on('exit', (code, signal) => {
      this.log(`⚠️  Daemon exited with code ${code}, signal ${signal}`);
      this.handleDaemonCrash();
    });

    this.log('✅ Campaign daemon started');
  }

  private handleDaemonCrash(): void {
    this.restartCount++;

    if (this.restartCount > this.maxRestarts) {
      this.log(`❌ Max restart attempts (${this.maxRestarts}) exceeded. Giving up.`);
      this.log('🆘 Manual intervention required!');
      process.exit(1);
    }

    this.log(`🔄 Attempting restart ${this.restartCount}/${this.maxRestarts} in ${this.restartDelay/1000}s...`);

    setTimeout(() => {
      this.startDaemon();
    }, this.restartDelay);
  }

  private async healthCheck(): Promise<void> {
    // Every minute, verify daemon is responsive
    setInterval(() => {
      if (!this.daemonProcess || this.daemonProcess.killed) {
        this.log('⚠️  Daemon not running. Restarting...');
        this.handleDaemonCrash();
      } else {
        this.log('💚 Daemon health check: OK');
      }
    }, 60000); // 1 minute
  }

  public async start(): Promise<void> {
    this.log('🐕 Watchdog starting monitoring...');

    this.startDaemon();
    await this.healthCheck();

    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  public stop(): void {
    this.log('🛑 Stopping watchdog...');

    if (this.daemonProcess) {
      this.daemonProcess.kill('SIGTERM');
      this.log('✅ Daemon stopped');
    }

    try {
      const fs = require('fs');
      if (existsSync(PID_FILE)) {
        fs.unlinkSync(PID_FILE);
      }
    } catch (error) {
      this.log(`⚠️  Failed to remove PID file: ${error}`);
    }

    this.log('✅ Watchdog stopped gracefully');
    process.exit(0);
  }
}

// Start watchdog
const watchdog = new Watchdog();
watchdog.start();
