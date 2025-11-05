/**
 * Browser automation for affiliate signup process
 * Uses Puppeteer for legal form-filling automation
 */

const puppeteer = require('puppeteer');
const { sleep } = require('./utils');

class BrowserAutomation {
  constructor(options = {}) {
    this.headless = options.headless !== false;
    this.slowMo = options.slowMo || 100;
    this.browser = null;
    this.page = null;
  }

  /**
   * Launch browser
   */
  async launch() {
    this.browser = await puppeteer.launch({
      headless: this.headless,
      slowMo: this.slowMo,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ],
      defaultViewport: {
        width: 1280,
        height: 720
      }
    });

    this.page = await this.browser.newPage();

    // Set realistic user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Remove automation detection
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      });
    });

    return this.page;
  }

  /**
   * Navigate to URL
   */
  async goto(url, waitOptions = {}) {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }

    await this.page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
      ...waitOptions
    });
  }

  /**
   * Auto-fill text input
   */
  async fillInput(selector, value, options = {}) {
    await this.page.waitForSelector(selector, { timeout: 10000 });

    if (options.clear) {
      await this.page.click(selector, { clickCount: 3 });
      await this.page.keyboard.press('Backspace');
    }

    // Type with human-like delay
    await this.page.type(selector, value, { delay: 50 + Math.random() * 50 });

    if (options.blur) {
      await this.page.evaluate((sel) => {
        document.querySelector(sel).blur();
      }, selector);
    }
  }

  /**
   * Select dropdown option
   */
  async selectOption(selector, value) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.select(selector, value);
  }

  /**
   * Click element
   */
  async click(selector, options = {}) {
    await this.page.waitForSelector(selector, { timeout: 10000 });

    if (options.scrollIntoView) {
      await this.page.evaluate((sel) => {
        document.querySelector(sel).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, selector);
      await sleep(500);
    }

    await this.page.click(selector);
  }

  /**
   * Check checkbox or radio button
   */
  async check(selector) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    const isChecked = await this.page.$eval(selector, el => el.checked);

    if (!isChecked) {
      await this.page.click(selector);
    }
  }

  /**
   * Wait for element
   */
  async waitFor(selector, options = {}) {
    await this.page.waitForSelector(selector, {
      timeout: 10000,
      ...options
    });
  }

  /**
   * Take screenshot
   */
  async screenshot(path, options = {}) {
    await this.page.screenshot({
      path,
      fullPage: true,
      ...options
    });
  }

  /**
   * Get current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Check if element exists
   */
  async elementExists(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get element text
   */
  async getText(selector) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    return this.page.$eval(selector, el => el.textContent.trim());
  }

  /**
   * Execute custom script
   */
  async evaluate(script, ...args) {
    return this.page.evaluate(script, ...args);
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(options = {}) {
    await this.page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: 30000,
      ...options
    });
  }

  /**
   * Handle alert/confirm dialogs
   */
  async handleDialog(accept = true, promptText = '') {
    this.page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt' && promptText) {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Auto-fill Amazon Associates form
   */
  async fillAmazonAssociatesForm(data) {
    try {
      // Fill basic info
      if (await this.elementExists('#name')) {
        await this.fillInput('#name', data.businessName);
      }

      if (await this.elementExists('#email')) {
        await this.fillInput('#email', data.email);
      }

      if (await this.elementExists('#password')) {
        await this.fillInput('#password', data.password);
      }

      if (await this.elementExists('#website')) {
        await this.fillInput('#website', data.website);
      }

      // Note: Actual selectors will vary - this is a template
      console.log('Amazon Associates form fields filled (template)');
      console.log('⚠️  Manual verification required at email step');

      return { success: true, requiresManualStep: 'email_verification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Auto-fill ShareASale form
   */
  async fillShareASaleForm(data) {
    try {
      // Template for ShareASale signup
      console.log('ShareASale form automation (template)');
      console.log('⚠️  Manual phone verification required');

      return { success: true, requiresManualStep: 'phone_verification' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generic form filler with field mapping
   */
  async fillForm(fieldMappings) {
    const results = [];

    for (const [selector, value] of Object.entries(fieldMappings)) {
      try {
        if (await this.elementExists(selector)) {
          await this.fillInput(selector, value);
          results.push({ selector, success: true });
        } else {
          results.push({ selector, success: false, reason: 'not_found' });
        }
      } catch (error) {
        results.push({ selector, success: false, reason: error.message });
      }
    }

    return results;
  }

  /**
   * Pause for manual intervention
   */
  async pauseForManualStep(message, timeoutSeconds = 300) {
    console.log('\n' + '='.repeat(60));
    console.log('⏸️  MANUAL STEP REQUIRED');
    console.log('='.repeat(60));
    console.log(message);
    console.log(`\nYou have ${timeoutSeconds} seconds to complete this step.`);
    console.log('Press Enter when done, or Ctrl+C to cancel...');
    console.log('='.repeat(60) + '\n');

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.log('\n⏱️  Timeout reached. Continuing...');
        process.stdin.removeAllListeners('data');
        resolve({ completed: false, timeout: true });
      }, timeoutSeconds * 1000);

      process.stdin.once('data', () => {
        clearTimeout(timeout);
        console.log('✓ Manual step completed. Continuing...\n');
        resolve({ completed: true, timeout: false });
      });
    });
  }

  /**
   * Save cookies for session persistence
   */
  async saveCookies(filePath) {
    const cookies = await this.page.cookies();
    const fs = require('fs').promises;
    await fs.writeFile(filePath, JSON.stringify(cookies, null, 2));
  }

  /**
   * Load cookies from file
   */
  async loadCookies(filePath) {
    const fs = require('fs').promises;
    try {
      const cookies = JSON.parse(await fs.readFile(filePath, 'utf8'));
      await this.page.setCookie(...cookies);
    } catch (error) {
      console.warn('Could not load cookies:', error.message);
    }
  }

  /**
   * Close browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

module.exports = BrowserAutomation;
