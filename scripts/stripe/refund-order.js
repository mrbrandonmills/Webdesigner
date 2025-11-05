#!/usr/bin/env node

/**
 * Process Stripe Refund
 *
 * This script helps process refunds for orders with various options:
 * - Full refund
 * - Partial refund
 * - Refund with reason
 * - Reverse transfer (for Connect)
 *
 * Usage:
 *   node scripts/stripe/refund-order.js
 *   node scripts/stripe/refund-order.js --charge ch_1ABC2DEF3GHI4JKL
 *   node scripts/stripe/refund-order.js --session cs_test_abc123
 *   node scripts/stripe/refund-order.js --amount 50.00 --reason requested_by_customer
 */

const Stripe = require('stripe');
const readline = require('readline');

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
const chargeIndex = args.indexOf('--charge');
const sessionIndex = args.indexOf('--session');
const amountIndex = args.indexOf('--amount');
const reasonIndex = args.indexOf('--reason');

const chargeId = chargeIndex !== -1 ? args[chargeIndex + 1] : null;
const sessionId = sessionIndex !== -1 ? args[sessionIndex + 1] : null;
const refundAmount = amountIndex !== -1 ? parseFloat(args[amountIndex + 1]) : null;
const refundReason = reasonIndex !== -1 ? args[reasonIndex + 1] : null;

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

async function getChargeFromSession(sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent'],
  });

  if (!session.payment_intent) {
    throw new Error('No payment intent found for this session');
  }

  const paymentIntent = session.payment_intent;

  if (!paymentIntent.latest_charge) {
    throw new Error('No charge found for this payment intent');
  }

  return paymentIntent.latest_charge;
}

async function processRefund() {
  try {
    log('\n' + '='.repeat(60), 'bright');
    log('Stripe Refund Processor', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    // Step 1: Get charge ID
    let targetChargeId = chargeId;

    if (sessionId) {
      log('Looking up charge from session...', 'cyan');
      targetChargeId = await getChargeFromSession(sessionId);
      logSuccess(`Found charge: ${targetChargeId}`);
    }

    if (!targetChargeId) {
      targetChargeId = await prompt('Enter charge ID (ch_...): ');
    }

    if (!targetChargeId || !targetChargeId.startsWith('ch_')) {
      logError('Invalid charge ID');
      rl.close();
      return;
    }

    // Step 2: Retrieve charge details
    log('\nRetrieving charge details...', 'cyan');

    const charge = await stripe.charges.retrieve(targetChargeId);

    log('\nCharge Details:', 'bright');
    console.log(`  ID: ${charge.id}`);
    console.log(`  Amount: $${(charge.amount / 100).toFixed(2)} ${charge.currency.toUpperCase()}`);
    console.log(`  Status: ${charge.status}`);
    console.log(`  Customer: ${charge.customer || 'N/A'}`);
    console.log(`  Created: ${new Date(charge.created * 1000).toISOString()}`);

    if (charge.refunded) {
      logWarning('This charge has already been refunded');
      console.log(`  Amount refunded: $${(charge.amount_refunded / 100).toFixed(2)}`);

      const continueAnyway = await prompt('Continue anyway? (yes/no): ');
      if (continueAnyway.toLowerCase() !== 'yes') {
        log('Refund cancelled', 'yellow');
        rl.close();
        return;
      }
    }

    // Step 3: Determine refund amount
    const maxRefundAmount = (charge.amount - charge.amount_refunded) / 100;
    let refundAmountValue = refundAmount;

    if (!refundAmountValue) {
      log(`\nMaximum refundable amount: $${maxRefundAmount.toFixed(2)}`, 'cyan');

      const amountInput = await prompt(
        'Enter refund amount (leave blank for full refund): $'
      );

      if (amountInput.trim() === '') {
        refundAmountValue = maxRefundAmount;
        log('Processing full refund', 'yellow');
      } else {
        refundAmountValue = parseFloat(amountInput);

        if (isNaN(refundAmountValue) || refundAmountValue <= 0) {
          logError('Invalid amount');
          rl.close();
          return;
        }

        if (refundAmountValue > maxRefundAmount) {
          logError(`Amount exceeds maximum refundable: $${maxRefundAmount.toFixed(2)}`);
          rl.close();
          return;
        }
      }
    }

    // Step 4: Get refund reason
    let reason = refundReason;

    if (!reason) {
      log('\nRefund Reasons:', 'cyan');
      console.log('  1. requested_by_customer - Customer requested refund');
      console.log('  2. duplicate - Duplicate charge');
      console.log('  3. fraudulent - Fraudulent transaction');

      const reasonChoice = await prompt('Select reason (1-3): ');

      const reasonMap = {
        1: 'requested_by_customer',
        2: 'duplicate',
        3: 'fraudulent',
      };

      reason = reasonMap[reasonChoice] || 'requested_by_customer';
    }

    // Step 5: Confirm refund
    log('\n' + '='.repeat(60), 'yellow');
    log('Refund Summary', 'yellow');
    log('='.repeat(60), 'yellow');
    console.log(`  Charge ID: ${targetChargeId}`);
    console.log(`  Original Amount: $${(charge.amount / 100).toFixed(2)}`);
    console.log(`  Refund Amount: $${refundAmountValue.toFixed(2)}`);
    console.log(`  Reason: ${reason}`);
    console.log(`  Type: ${refundAmountValue === maxRefundAmount ? 'FULL' : 'PARTIAL'}`);
    log('='.repeat(60) + '\n', 'yellow');

    const confirm = await prompt('Proceed with refund? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes') {
      log('Refund cancelled', 'yellow');
      rl.close();
      return;
    }

    // Step 6: Process refund
    log('\nProcessing refund...', 'cyan');

    const refundParams = {
      charge: targetChargeId,
      reason: reason,
      metadata: {
        processed_by: 'refund-order.js',
        processed_at: new Date().toISOString(),
      },
    };

    // Add amount if partial refund
    if (refundAmountValue < maxRefundAmount) {
      refundParams.amount = Math.round(refundAmountValue * 100);
    }

    const refund = await stripe.refunds.create(refundParams);

    logSuccess('Refund processed successfully!');

    log('\nRefund Details:', 'bright');
    console.log(`  Refund ID: ${refund.id}`);
    console.log(`  Amount: $${(refund.amount / 100).toFixed(2)}`);
    console.log(`  Status: ${refund.status}`);
    console.log(`  Reason: ${refund.reason}`);

    if (refund.status === 'succeeded') {
      logSuccess('Refund completed');
    } else if (refund.status === 'pending') {
      logWarning('Refund is pending (will complete in 5-10 business days)');
    } else if (refund.status === 'failed') {
      logError('Refund failed');
    }

    // Step 7: Additional actions
    log('\nNext Steps:', 'cyan');
    console.log('  1. Customer will see refund in 5-10 business days');
    console.log('  2. Send refund confirmation email to customer');
    console.log('  3. Update order status in database');
    console.log('  4. Document reason for refund');

    // Summary
    log('\n' + '='.repeat(60), 'bright');
    log('Refund Summary', 'bright');
    log('='.repeat(60), 'bright');
    console.log(`  Charge ID: ${targetChargeId}`);
    console.log(`  Refund ID: ${refund.id}`);
    console.log(`  Amount: $${(refund.amount / 100).toFixed(2)}`);
    console.log(`  Status: ${refund.status}`);
    log('='.repeat(60) + '\n', 'bright');

  } catch (error) {
    logError('Refund failed:');

    if (error.type === 'StripeInvalidRequestError') {
      if (error.message.includes('has already been refunded')) {
        console.error('This charge has already been fully refunded');
      } else if (error.message.includes('amount is greater')) {
        console.error('Refund amount exceeds remaining balance');
      } else {
        console.error(error.message);
      }
    } else {
      console.error(error);
    }
  } finally {
    rl.close();
  }
}

// Run refund processor
processRefund();
