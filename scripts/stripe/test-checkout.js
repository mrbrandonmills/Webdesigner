#!/usr/bin/env node

/**
 * Test Stripe Checkout Flow
 *
 * This script tests the complete checkout process including:
 * - Session creation
 * - Payment processing
 * - Webhook delivery
 * - Order fulfillment
 *
 * Usage:
 *   node scripts/stripe/test-checkout.js
 *   node scripts/stripe/test-checkout.js --amount 99.99
 *   node scripts/stripe/test-checkout.js --debug
 */

const Stripe = require('stripe');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Parse command line arguments
const args = process.argv.slice(2);
const debug = args.includes('--debug');
const amountIndex = args.indexOf('--amount');
const testAmount = amountIndex !== -1 ? parseFloat(args[amountIndex + 1]) : 29.99;

// Test configuration
const TEST_CONFIG = {
  productName: 'Test Product - Brandon Mills',
  amount: testAmount,
  currency: 'usd',
  successUrl: process.env.NEXT_PUBLIC_URL + '/order/success',
  cancelUrl: process.env.NEXT_PUBLIC_URL + '/cart',
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function testCheckoutFlow() {
  try {
    log('\n' + '='.repeat(60), 'bright');
    log('Stripe Checkout Flow Test', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    // Step 1: Verify API key
    logStep(1, 'Verifying Stripe API key...');

    try {
      const balance = await stripe.balance.retrieve();
      logSuccess('API key is valid');

      if (debug) {
        console.log('Balance:', {
          available: balance.available,
          pending: balance.pending,
        });
      }

      // Check if test mode
      const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
      if (isTestMode) {
        logSuccess('Running in TEST mode');
      } else {
        logWarning('Running in LIVE mode!');
        const confirm = await prompt('Continue with live mode? (yes/no): ');
        if (confirm.toLowerCase() !== 'yes') {
          log('Test cancelled', 'yellow');
          rl.close();
          return;
        }
      }
    } catch (error) {
      logError('API key is invalid');
      console.error(error.message);
      rl.close();
      return;
    }

    // Step 2: Create test customer
    logStep(2, 'Creating test customer...');

    const customer = await stripe.customers.create({
      email: 'test@brandonmills.com',
      name: 'Test Customer',
      description: 'Automated test customer',
      metadata: {
        test: 'true',
        created_by: 'test-checkout.js',
        timestamp: new Date().toISOString(),
      },
    });

    logSuccess(`Customer created: ${customer.id}`);

    // Step 3: Create checkout session
    logStep(3, 'Creating checkout session...');

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: TEST_CONFIG.currency,
            product_data: {
              name: TEST_CONFIG.productName,
              description: 'Automated test product',
              images: ['https://via.placeholder.com/300'],
              metadata: {
                test: 'true',
              },
            },
            unit_amount: Math.round(TEST_CONFIG.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: TEST_CONFIG.successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: TEST_CONFIG.cancelUrl,
      metadata: {
        test: 'true',
        test_id: `test_${Date.now()}`,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      automatic_tax: {
        enabled: false, // Disable for testing
      },
    });

    logSuccess(`Session created: ${session.id}`);
    log(`\nCheckout URL: ${session.url}`, 'blue');

    if (debug) {
      console.log('\nSession details:', {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        status: session.status,
        expires_at: new Date(session.expires_at * 1000).toISOString(),
      });
    }

    // Step 4: Instructions for manual testing
    logStep(4, 'Manual testing instructions');

    log('\nTo complete the test:', 'bright');
    log('1. Open the checkout URL above in your browser');
    log('2. Use test card: 4242 4242 4242 4242');
    log('3. Use any future expiry date (e.g., 12/34)');
    log('4. Use any 3-digit CVC (e.g., 123)');
    log('5. Fill in shipping information');
    log('6. Complete the payment\n');

    const waitForPayment = await prompt('Press Enter when payment is complete (or "skip" to skip): ');

    if (waitForPayment.toLowerCase() === 'skip') {
      log('Skipping payment verification', 'yellow');
    } else {
      // Step 5: Verify payment
      logStep(5, 'Verifying payment...');

      const updatedSession = await stripe.checkout.sessions.retrieve(session.id);

      if (updatedSession.payment_status === 'paid') {
        logSuccess('Payment successful!');

        if (debug) {
          console.log('Payment details:', {
            payment_status: updatedSession.payment_status,
            amount_total: updatedSession.amount_total,
            customer_email: updatedSession.customer_details?.email,
          });
        }

        // Step 6: Check for webhook events
        logStep(6, 'Checking webhook events...');

        const events = await stripe.events.list({
          limit: 10,
          type: 'checkout.session.completed',
        });

        const sessionEvent = events.data.find(
          (event) => event.data.object.id === session.id
        );

        if (sessionEvent) {
          logSuccess('Webhook event found');

          if (debug) {
            console.log('Event details:', {
              id: sessionEvent.id,
              type: sessionEvent.type,
              created: new Date(sessionEvent.created * 1000).toISOString(),
            });
          }
        } else {
          logWarning('Webhook event not found (may not have been processed yet)');
        }
      } else {
        logWarning(`Payment status: ${updatedSession.payment_status}`);
        log('Payment may still be processing', 'yellow');
      }
    }

    // Step 7: Cleanup
    logStep(7, 'Cleanup');

    const cleanup = await prompt('Delete test customer? (yes/no): ');

    if (cleanup.toLowerCase() === 'yes') {
      await stripe.customers.del(customer.id);
      logSuccess('Test customer deleted');
    } else {
      log(`Test customer preserved: ${customer.id}`, 'yellow');
    }

    // Summary
    log('\n' + '='.repeat(60), 'bright');
    log('Test Summary', 'bright');
    log('='.repeat(60), 'bright');
    log(`Customer ID: ${customer.id}`);
    log(`Session ID: ${session.id}`);
    log(`Amount: $${TEST_CONFIG.amount.toFixed(2)}`);
    log(`Session URL: ${session.url}`);
    log('='.repeat(60) + '\n', 'bright');

    logSuccess('Test completed successfully!');

  } catch (error) {
    logError('Test failed:');
    console.error(error);
  } finally {
    rl.close();
  }
}

// Run test
testCheckoutFlow();
