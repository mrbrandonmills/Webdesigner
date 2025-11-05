#!/usr/bin/env node

/**
 * Monitor Stripe Disputes
 *
 * This script monitors and reports on disputes (chargebacks):
 * - List active disputes
 * - Check evidence deadlines
 * - Display dispute details
 * - Alert on urgent disputes
 * - Generate dispute report
 *
 * Usage:
 *   node scripts/stripe/check-disputes.js
 *   node scripts/stripe/check-disputes.js --status warning_needs_response
 *   node scripts/stripe/check-disputes.js --urgent
 *   node scripts/stripe/check-disputes.js --export disputes.json
 */

const Stripe = require('stripe');
const fs = require('fs');

require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Parse command line arguments
const args = process.argv.slice(2);
const statusIndex = args.indexOf('--status');
const urgentOnly = args.includes('--urgent');
const exportIndex = args.indexOf('--export');

const filterStatus = statusIndex !== -1 ? args[statusIndex + 1] : null;
const exportFile = exportIndex !== -1 ? args[exportIndex + 1] : null;

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
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

function getDisputeStatusColor(status) {
  if (status.includes('needs_response')) return 'red';
  if (status.includes('under_review')) return 'yellow';
  if (status === 'won') return 'green';
  if (status === 'lost') return 'red';
  return 'reset';
}

function getDisputeStatusIcon(status) {
  if (status.includes('needs_response')) return '🚨';
  if (status.includes('under_review')) return '⏳';
  if (status === 'won') return '✅';
  if (status === 'lost') return '❌';
  if (status === 'charge_refunded') return '💰';
  return '📋';
}

function getDaysUntilDue(timestamp) {
  if (!timestamp) return null;
  const now = Math.floor(Date.now() / 1000);
  const secondsUntilDue = timestamp - now;
  return Math.ceil(secondsUntilDue / (24 * 60 * 60));
}

async function checkDisputes() {
  try {
    log('\n' + '='.repeat(60), 'bright');
    log('Stripe Dispute Monitor', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    // Fetch all disputes
    log('Fetching disputes...', 'cyan');

    const disputes = [];
    let hasMore = true;
    let startingAfter = undefined;

    while (hasMore) {
      const response = await stripe.disputes.list({
        limit: 100,
        ...(startingAfter && { starting_after: startingAfter }),
      });

      disputes.push(...response.data);
      hasMore = response.has_more;

      if (hasMore) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    logSuccess(`Fetched ${disputes.length} total disputes`);

    // Filter disputes
    let filteredDisputes = disputes;

    if (filterStatus) {
      filteredDisputes = disputes.filter((d) => d.status === filterStatus);
      log(`Filtered to ${filteredDisputes.length} disputes with status: ${filterStatus}`, 'cyan');
    }

    if (urgentOnly) {
      filteredDisputes = filteredDisputes.filter((d) => {
        if (!d.evidence_details?.due_by) return false;
        const daysUntilDue = getDaysUntilDue(d.evidence_details.due_by);
        return daysUntilDue <= 3;
      });
      logWarning(`Filtered to ${filteredDisputes.length} urgent disputes (due within 3 days)`);
    }

    if (filteredDisputes.length === 0) {
      logSuccess('No disputes found! 🎉');
      return;
    }

    // Display disputes
    log('\n' + '='.repeat(60), 'bright');
    log('Dispute List', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    const urgentDisputes = [];
    const activeDisputes = [];
    const closedDisputes = [];

    filteredDisputes.forEach((dispute) => {
      const daysUntilDue = getDaysUntilDue(dispute.evidence_details?.due_by);
      const isUrgent = daysUntilDue !== null && daysUntilDue <= 3;

      if (isUrgent) {
        urgentDisputes.push(dispute);
      } else if (['warning_needs_response', 'needs_response', 'under_review'].includes(dispute.status)) {
        activeDisputes.push(dispute);
      } else {
        closedDisputes.push(dispute);
      }
    });

    // Display urgent disputes first
    if (urgentDisputes.length > 0) {
      log('🚨 URGENT DISPUTES (Action Required):', 'red');
      log('─'.repeat(60) + '\n', 'dim');

      urgentDisputes.forEach((dispute, index) => {
        displayDisputeDetails(dispute, index + 1);
      });
    }

    // Display active disputes
    if (activeDisputes.length > 0) {
      log('\n⏳ ACTIVE DISPUTES:', 'yellow');
      log('─'.repeat(60) + '\n', 'dim');

      activeDisputes.forEach((dispute, index) => {
        displayDisputeDetails(dispute, index + 1);
      });
    }

    // Display closed disputes
    if (closedDisputes.length > 0) {
      log('\n📋 CLOSED DISPUTES:', 'reset');
      log('─'.repeat(60) + '\n', 'dim');

      closedDisputes.forEach((dispute, index) => {
        displayDisputeDetails(dispute, index + 1);
      });
    }

    // Summary
    log('\n' + '='.repeat(60), 'bright');
    log('Dispute Summary', 'bright');
    log('='.repeat(60), 'bright');

    const summary = {
      total: filteredDisputes.length,
      urgent: urgentDisputes.length,
      needs_response: filteredDisputes.filter((d) => d.status.includes('needs_response')).length,
      under_review: filteredDisputes.filter((d) => d.status.includes('under_review')).length,
      won: filteredDisputes.filter((d) => d.status === 'won').length,
      lost: filteredDisputes.filter((d) => d.status === 'lost').length,
      total_amount: filteredDisputes.reduce((sum, d) => sum + d.amount, 0) / 100,
    };

    console.log(`  Total Disputes: ${summary.total}`);
    if (summary.urgent > 0) {
      logError(`  🚨 Urgent: ${summary.urgent} (due within 3 days)`);
    }
    if (summary.needs_response > 0) {
      logWarning(`  ⚠️  Needs Response: ${summary.needs_response}`);
    }
    console.log(`  ⏳ Under Review: ${summary.under_review}`);
    console.log(`  ✅ Won: ${summary.won}`);
    console.log(`  ❌ Lost: ${summary.lost}`);
    console.log(`  💰 Total Amount: $${summary.total_amount.toFixed(2)}`);
    log('='.repeat(60) + '\n', 'bright');

    // Recommendations
    if (urgentDisputes.length > 0) {
      log('📋 IMMEDIATE ACTIONS REQUIRED:', 'red');
      urgentDisputes.forEach((dispute, index) => {
        const daysUntilDue = getDaysUntilDue(dispute.evidence_details.due_by);
        console.log(
          `  ${index + 1}. Submit evidence for ${dispute.id} (${daysUntilDue} days remaining)`
        );
      });
      console.log('');
    }

    // Export if requested
    if (exportFile) {
      log('Exporting dispute data...', 'cyan');

      const exportData = {
        summary,
        disputes: filteredDisputes.map((dispute) => ({
          id: dispute.id,
          amount: dispute.amount / 100,
          currency: dispute.currency,
          status: dispute.status,
          reason: dispute.reason,
          charge: dispute.charge,
          created: new Date(dispute.created * 1000).toISOString(),
          evidence_due_by: dispute.evidence_details?.due_by
            ? new Date(dispute.evidence_details.due_by * 1000).toISOString()
            : null,
          days_until_due: getDaysUntilDue(dispute.evidence_details?.due_by),
        })),
        exported_at: new Date().toISOString(),
      };

      fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
      logSuccess(`Exported to: ${exportFile}`);
    }

  } catch (error) {
    logError('Dispute check failed:');
    console.error(error);
  }
}

function displayDisputeDetails(dispute, index) {
  const icon = getDisputeStatusIcon(dispute.status);
  const statusColor = getDisputeStatusColor(dispute.status);
  const daysUntilDue = getDaysUntilDue(dispute.evidence_details?.due_by);

  console.log(`${icon} Dispute #${index}`);
  log(`   ID: ${dispute.id}`, 'bright');
  log(`   Status: ${dispute.status}`, statusColor);
  console.log(`   Reason: ${dispute.reason}`);
  console.log(`   Amount: $${(dispute.amount / 100).toFixed(2)} ${dispute.currency.toUpperCase()}`);
  console.log(`   Charge: ${dispute.charge}`);
  console.log(`   Created: ${new Date(dispute.created * 1000).toISOString()}`);

  if (dispute.evidence_details?.due_by) {
    const dueDate = new Date(dispute.evidence_details.due_by * 1000).toISOString();
    const daysColor = daysUntilDue <= 3 ? 'red' : daysUntilDue <= 7 ? 'yellow' : 'reset';

    console.log(`   Evidence Due: ${dueDate}`);
    log(`   Days Remaining: ${daysUntilDue}`, daysColor);
  }

  if (dispute.evidence_details?.submission_count > 0) {
    console.log(`   Evidence Submitted: Yes (${dispute.evidence_details.submission_count} times)`);
  } else {
    logWarning('   Evidence Submitted: No');
  }

  console.log('');
}

// Run dispute check
checkDisputes();
