import { randomBytes } from 'crypto'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import logger from './logger'

// Session storage configuration
const SESSIONS_DIR = path.join(process.cwd(), 'data', 'sessions')
const SESSIONS_FILE = path.join(SESSIONS_DIR, 'sessions.json')
const SESSION_DURATION_HOURS = 4
const SESSION_TOKEN_BYTES = 32 // 256-bit session token

interface Session {
  token: string
  createdAt: number
  expiresAt: number
}

interface SessionStore {
  sessions: Session[]
}

// Ensure sessions directory exists
async function ensureSessionsDir(): Promise<void> {
  try {
    await mkdir(SESSIONS_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

// Load sessions from filesystem
async function loadSessions(): Promise<SessionStore> {
  try {
    await ensureSessionsDir()
    const data = await readFile(SESSIONS_FILE, 'utf-8')
    return JSON.parse(data) as SessionStore
  } catch (error) {
    // File doesn't exist or is invalid, return empty store
    return { sessions: [] }
  }
}

// Save sessions to filesystem
async function saveSessions(store: SessionStore): Promise<void> {
  try {
    await ensureSessionsDir()
    await writeFile(SESSIONS_FILE, JSON.stringify(store, null, 2), 'utf-8')
  } catch (error) {
    logger.error('Failed to save sessions:', error)
    throw new Error('Failed to persist session')
  }
}

// Clean up expired sessions from the store
function cleanupExpiredSessions(store: SessionStore): SessionStore {
  const now = Date.now()
  const activeSessions = store.sessions.filter(session => session.expiresAt > now)

  if (activeSessions.length !== store.sessions.length) {
    logger.info(`Cleaned up ${store.sessions.length - activeSessions.length} expired session(s)`)
  }

  return { sessions: activeSessions }
}

/**
 * Generate a cryptographically secure random session token
 * @returns A hex-encoded session token
 */
export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString('hex')
}

/**
 * Create a new session and persist it to storage
 * @returns The session token
 */
export async function createSession(): Promise<string> {
  const token = generateSessionToken()
  const now = Date.now()
  const expiresAt = now + (SESSION_DURATION_HOURS * 60 * 60 * 1000)

  const newSession: Session = {
    token,
    createdAt: now,
    expiresAt
  }

  // Load existing sessions
  let store = await loadSessions()

  // Clean up expired sessions before adding new one
  store = cleanupExpiredSessions(store)

  // Add new session
  store.sessions.push(newSession)

  // Save to filesystem
  await saveSessions(store)

  logger.info(`Created new session, expires at ${new Date(expiresAt).toISOString()}`)

  return token
}

/**
 * Validate a session token
 * @param token The session token to validate
 * @returns true if the session is valid and not expired, false otherwise
 */
export async function validateSession(token: string): Promise<boolean> {
  if (!token) {
    return false
  }

  // Load sessions
  let store = await loadSessions()

  // Clean up expired sessions
  store = cleanupExpiredSessions(store)

  // Save cleaned store (removes expired sessions)
  await saveSessions(store)

  // Check if token exists and is not expired
  const now = Date.now()
  const session = store.sessions.find(s =>
    s.token === token && s.expiresAt > now
  )

  return session !== undefined
}

/**
 * Delete a session (for logout)
 * @param token The session token to delete
 */
export async function deleteSession(token: string): Promise<void> {
  if (!token) {
    return
  }

  // Load sessions
  const store = await loadSessions()

  // Remove the session
  const filteredSessions = store.sessions.filter(s => s.token !== token)

  if (filteredSessions.length !== store.sessions.length) {
    logger.info('Session deleted successfully')
  }

  // Save updated store
  await saveSessions({ sessions: filteredSessions })
}

/**
 * Clean up all expired sessions (can be called periodically)
 */
export async function cleanupSessions(): Promise<void> {
  const store = await loadSessions()
  const cleanedStore = cleanupExpiredSessions(store)
  await saveSessions(cleanedStore)
}

/**
 * Delete all sessions (for emergency logout)
 */
export async function deleteAllSessions(): Promise<void> {
  await saveSessions({ sessions: [] })
  logger.info('All sessions deleted')
}
