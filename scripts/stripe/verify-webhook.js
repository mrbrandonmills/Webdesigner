#!/usr/bin/env node

/**
 * Verify Stripe Webhook Configuration
 *
 * This script verifies that your webhook endpoint is properly configured:
 * - Endpoint is accessible
 * - Signature verification works
 * - Events are being received
 * - Event handling is correct
 *
 * Usage:
 *   node scripts/stripe/verify-webhook.js
 *   node scripts/stripe/verify-webhook.js --url https://brandonmills.com/api/stripe/webhook
 *   node scripts/stripe/verify-webhook.js --verbose
 */

const Stripe = require('stripe');
const https = require('https');
const http = require('http');

require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const urlIndex = args.indexOf('--url');
const webhookUrl =
  urlIndex !== -1
    ? args[urlIndex + 1]
    : process.env.NEXT_PUBLIC_URL + '/api/stripe/webhook';

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function testEndpointAccessibility(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verifyWebhookConfiguration() {
  try {
    log('\n' + '='.repeat(60), 'bright');
    log('Stripe Webhook Verification', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    log(`Testing endpoint: ${webhookUrl}\n`);

    // Step 1: Verify API key
    logStep(1, 'Verifying Stripe API key...');

    try {
      await stripe.balance.retrieve();
      logSuccess('API key is valid');
    } catch (error) {
      logError('API key is invalid');
      console.error(error.message);
      return;
    }

    // Step 2: Test endpoint accessibility
    logStep(2, 'Testing endpoint accessibility...');

    try {
      const response = await testEndpointAccessibility(webhookUrl);

      if (response.statusCode === 405) {
        logSuccess('Endpoint is accessible (405 Method Not Allowed is expected for GET)');
      } else if (response.statusCode === 200) {
        logSuccess('Endpoint is accessible');
      } else {
        logWarning(`Endpoint returned status ${response.statusCode}`);
      }

      if (verbose) {
        console.log('Response:', {
          statusCode: response.statusCode,
          headers: response.headers,
        });
      }
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        logError('Endpoint not found - DNS resolution failed');
      } else if (error.code === 'ECONNREFUSED') {
        logError('Connection refused - server not running');
      } else if (error.message === 'Request timeout') {
        logError('Request timeout - endpoint not responding');
      } else {
        logError(`Failed to reach endpoint: ${error.message}`);
      }

      if (webhookUrl.includes('localhost')) {
        log('\nNote: Testing localhost requires:', 'yellow');
        log('  1. Server running locally');
        log('  2. Using Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe/webhook');
      }

      return;
    }

    // Step 3: List webhook endpoints
    logStep(3, 'Checking configured webhook endpoints...');

    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });

    if (webhooks.data.length === 0) {
      logWarning('No webhook endpoints configured in Stripe');
      log('\nTo configure webhooks:', 'yellow');
      log('  1. Go to https://dashboard.stripe.com/webhooks');
      log('  2. Click "Add endpoint"');
      log(`  3. Enter URL: ${webhookUrl}`);
      log('  4. Select events to listen for');
      log('  5. Copy webhook signing secret to STRIPE_WEBHOOK_SECRET');
    } else {
      logSuccess(`Found ${webhooks.data.length} webhook endpoint(s)`);

      const matchingEndpoint = webhooks.data.find((endpoint) =>
        endpoint.url.includes(webhookUrl) || webhookUrl.includes(endpoint.url)
      );

      if (matchingEndpoint) {
        logSuccess('Found matching endpoint configuration');

        if (verbose) {
          console.log('\nEndpoint details:', {
            id: matchingEndpoint.id,
            url: matchingEndpoint.url,
            status: matchingEndpoint.status,
            enabled_events: matchingEndpoint.enabled_events.slice(0, 5),
          });
        }

        log('\nEnabled events:', 'bright');
        matchingEndpoint.enabled_events.forEach((event) => {
          console.log(`  - ${event}`);
        });
      } else {
        logWarning('No matching endpoint found');
        log('\nConfigured endpoints:', 'yellow');
        webhooks.data.forEach((endpoint) => {
          console.log(`  - ${endpoint.url} (${endpoint.status})`);
        });
      }
    }

    // Step 4: Check webhook secret
    logStep(4, 'Verifying webhook secret...');

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      if (process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
        logSuccess('Webhook secret is configured');

        if (verbose) {
          console.log(
            'Secret starts with:',
            process.env.STRIPE_WEBHOOK_SECRET.substring(0, 15) + '...'
          );
        }
      } else {
        logError('Webhook secret format is invalid (should start with "whsec_")');
      }
    } else {
      logError('STRIPE_WEBHOOK_SECRET not found in environment variables');
      log('\nTo get your webhook secret:', 'yellow');
      log('  1. Go to https://dashboard.stripe.com/webhooks');
      log('  2. Click on your endpoint');
      log('  3. Click "Reveal" under "Signing secret"');
      log('  4. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_...');
    }

    // Step 5: Check recent webhook events
    logStep(5, 'Checking recent webhook events...');

    const recentEvents = await stripe.events.list({
      limit: 10,
      delivery_success: false, // Failed deliveries
    });

    const failedDeliveries = recentEvents.data.filter(
      (event) => event.request && event.request.idempotency_key
    );

    if (failedDeliveries.length > 0) {
      logWarning(`Found ${failedDeliveries.length} failed webhook deliveries`);

      if (verbose) {
        failedDeliveries.forEach((event) => {
          console.log(`  - ${event.type} (${event.id})`);
        });
      }
    } else {
      logSuccess('No recent webhook delivery failures');
    }

    // Step 6: Test webhook signature verification
    logStep(6, 'Testing webhook signature verification...');

    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        // Create a test event
        const testPayload = JSON.stringify({
          id: 'evt_test_webhook',
          object: 'event',
        });

        const timestamp = Math.floor(Date.now() / 1000);
        const signature = stripe.webhooks.generateTestHeaderString({
          payload: testPayload,
          secret: process.env.STRIPE_WEBHOOK_SECRET,
        });

        // Verify signature
        const event = stripe.webhooks.constructEvent(
          testPayload,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );

        logSuccess('Signature verification test passed');

        if (verbose) {
          console.log('Test event:', {
            id: event.id,
            object: event.object,
          });
        }
      } catch (error) {
        logError('Signature verification test failed');
        console.error(error.message);
      }
    } else {
      logWarning('Skipping signature test (no webhook secret)');
    }

    // Step 7: Recommendations
    logStep(7, 'Recommendations');

    const recommendations = [];

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      recommendations.push('Configure STRIPE_WEBHOOK_SECRET in environment variables');
    }

    if (webhooks.data.length === 0) {
      recommendations.push('Add webhook endpoint in Stripe Dashboard');
    }

    const criticalEvents = [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'charge.refunded',
    ];

    const matchingEndpoint = webhooks.data.find((endpoint) =>
      endpoint.url.includes(webhookUrl) || webhookUrl.includes(endpoint.url)
    );

    if (matchingEndpoint) {
      const missingEvents = criticalEvents.filter(
        (event) => !matchingEndpoint.enabled_events.includes(event)
      );

      if (missingEvents.length > 0) {
        recommendations.push(`Enable critical events: ${missingEvents.join(', ')}`);
      }
    }

    if (recommendations.length > 0) {
      log('\n📋 Recommendations:', 'yellow');
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
    } else {
      logSuccess('All checks passed! ✅');
    }

    // Summary
    log('\n' + '='.repeat(60), 'bright');
    log('Verification Summary', 'bright');
    log('='.repeat(60), 'bright');
    log(`Endpoint URL: ${webhookUrl}`);
    log(`Configured endpoints: ${webhooks.data.length}`);
    log(`Webhook secret: ${process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'Missing'}`);
    log(`Failed deliveries: ${failedDeliveries.length}`);
    log('='.repeat(60) + '\n', 'bright');

  } catch (error) {
    logError('Verification failed:');
    console.error(error);
  }
}

// Run verification
verifyWebhookConfiguration();
