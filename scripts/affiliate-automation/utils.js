/**
 * Utility functions for affiliate account automation
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const generator = require('generate-password');

// Encryption settings
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Generate encryption key from password
 */
function getEncryptionKey(password) {
  return crypto.scryptSync(password, 'salt', ENCRYPTION_KEY_LENGTH);
}

/**
 * Encrypt sensitive data
 */
function encrypt(text, password) {
  const key = getEncryptionKey(password);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt sensitive data
 */
function decrypt(encryptedData, password) {
  const key = getEncryptionKey(password);
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const authTag = Buffer.from(encryptedData.authTag, 'hex');

  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generate strong password
 */
function generatePassword(options = {}) {
  return generator.generate({
    length: options.length || 20,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    strict: true,
    excludeSimilarCharacters: true,
    ...options
  });
}

/**
 * Generate username from business name and platform
 */
function generateUsername(businessName, platform) {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const platformShort = platform.replace(/[^a-z0-9]/gi, '').slice(0, 8);
  const random = Math.random().toString(36).substring(2, 6);

  return `${base}_${random}`;
}

/**
 * Generate email with alias pattern
 */
function generateEmail(baseEmail, platform) {
  const [username, domain] = baseEmail.split('@');
  return `${username}+${platform}@${domain}`;
}

/**
 * Load JSON file
 */
async function loadJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Save JSON file
 */
async function saveJSON(filePath, data) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Copy to clipboard (cross-platform)
 */
async function copyToClipboard(text) {
  const platform = process.platform;
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  try {
    if (platform === 'darwin') {
      await execAsync(`echo "${text}" | pbcopy`);
    } else if (platform === 'linux') {
      await execAsync(`echo "${text}" | xclip -selection clipboard`);
    } else if (platform === 'win32') {
      await execAsync(`echo ${text} | clip`);
    }
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error.message);
    return false;
  }
}

/**
 * Format date for display
 */
function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Wait for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export credentials to 1Password CSV format
 */
function exportTo1Password(credentials) {
  const rows = [
    ['Title', 'Website', 'Username', 'Password', 'Notes']
  ];

  Object.entries(credentials.accounts).forEach(([key, account]) => {
    rows.push([
      account.platformName,
      account.platformUrl || '',
      account.username,
      '[ENCRYPTED - Decrypt first]',
      `Account ID: ${account.accountId || 'Pending'}\nStatus: ${account.status}\nCommission: ${account.commissionRate}`
    ]);
  });

  return rows.map(row =>
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
}

/**
 * Export credentials to LastPass CSV format
 */
function exportToLastPass(credentials) {
  const rows = [
    ['url', 'username', 'password', 'extra', 'name', 'grouping', 'fav']
  ];

  Object.entries(credentials.accounts).forEach(([key, account]) => {
    rows.push([
      account.platformUrl || '',
      account.username,
      '[ENCRYPTED - Decrypt first]',
      `Account ID: ${account.accountId || 'Pending'}\nStatus: ${account.status}`,
      account.platformName,
      'Affiliate Accounts',
      '0'
    ]);
  });

  return rows.map(row => row.join(',')).join('\n');
}

/**
 * Validate platform configuration
 */
function validatePlatformConfig(platform) {
  const required = ['id', 'name', 'signupUrl', 'priority', 'fields'];
  const missing = required.filter(field => !platform[field]);

  if (missing.length > 0) {
    throw new Error(`Platform config missing required fields: ${missing.join(', ')}`);
  }

  if (!isValidUrl(platform.signupUrl)) {
    throw new Error(`Invalid signup URL for ${platform.name}`);
  }

  return true;
}

/**
 * Get platform status summary
 */
function getPlatformStatusSummary(credentials) {
  const summary = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0
  };

  Object.values(credentials.accounts).forEach(account => {
    summary.total++;
    summary[account.status]++;
  });

  return summary;
}

/**
 * Calculate approval rate
 */
function calculateApprovalRate(credentials) {
  const summary = getPlatformStatusSummary(credentials);
  const total = summary.approved + summary.rejected;

  if (total === 0) return 0;

  return ((summary.approved / total) * 100).toFixed(1);
}

module.exports = {
  encrypt,
  decrypt,
  generatePassword,
  generateUsername,
  generateEmail,
  loadJSON,
  saveJSON,
  copyToClipboard,
  formatDate,
  sleep,
  isValidEmail,
  isValidUrl,
  exportTo1Password,
  exportToLastPass,
  validatePlatformConfig,
  getPlatformStatusSummary,
  calculateApprovalRate
};
