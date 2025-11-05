#!/usr/bin/env node

/**
 * Export Stripe Transactions
 *
 * This script exports transaction data for financial reporting:
 * - Export to CSV
 * - Export to JSON
 * - Filter by date range
 * - Filter by status
 * - Include refunds and disputes
 *
 * Usage:
 *   node scripts/stripe/export-transactions.js
 *   node scripts/stripe/export-transactions.js --days 30
 *   node scripts/stripe/export-transactions.js --start 2025-10-01 --end 2025-10-31
 *   node scripts/stripe/export-transactions.js --format csv --output transactions.csv
 */

const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

// Parse command line arguments
const args = process.argv.slice(2);
const daysIndex = args.indexOf('--days');
const startIndex = args.indexOf('--start');
const endIndex = args.indexOf('--end');
const formatIndex = args.indexOf('--format');
const outputIndex = args.indexOf('--output');

const days = daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : 30;
const startDate = startIndex !== -1 ? new Date(args[startIndex + 1]) : null;
const endDate = endIndex !== -1 ? new Date(args[endIndex + 1]) : null;
const format = formatIndex !== -1 ? args[formatIndex + 1] : 'csv';
const outputFile =
  outputIndex !== -1
    ? args[outputIndex + 1]
    : `stripe-transactions-${Date.now()}.${format}`;

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

async function exportTransactions() {
  try {
    log('\n' + '='.repeat(60), 'bright');
    log('Stripe Transaction Exporter', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    // Calculate date range
    let startTimestamp, endTimestamp;

    if (startDate && endDate) {
      startTimestamp = Math.floor(startDate.getTime() / 1000);
      endTimestamp = Math.floor(endDate.getTime() / 1000);
    } else {
      endTimestamp = Math.floor(Date.now() / 1000);
      startTimestamp = endTimestamp - days * 24 * 60 * 60;
    }

    const startDateStr = new Date(startTimestamp * 1000).toISOString().split('T')[0];
    const endDateStr = new Date(endTimestamp * 1000).toISOString().split('T')[0];

    log(`Exporting transactions from ${startDateStr} to ${endDateStr}`, 'cyan');

    // Fetch all charges
    log('\nFetching charges...', 'cyan');

    const charges = [];
    let hasMore = true;
    let startingAfter = undefined;

    while (hasMore) {
      const response = await stripe.charges.list({
        limit: 100,
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        ...(startingAfter && { starting_after: startingAfter }),
      });

      charges.push(...response.data);
      hasMore = response.has_more;

      if (hasMore) {
        startingAfter = response.data[response.data.length - 1].id;
        process.stdout.write(`\rFetched ${charges.length} charges...`);
      }
    }

    console.log('');
    logSuccess(`Fetched ${charges.length} charges`);

    // Fetch all refunds
    log('\nFetching refunds...', 'cyan');

    const refunds = [];
    hasMore = true;
    startingAfter = undefined;

    while (hasMore) {
      const response = await stripe.refunds.list({
        limit: 100,
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        ...(startingAfter && { starting_after: startingAfter }),
      });

      refunds.push(...response.data);
      hasMore = response.has_more;

      if (hasMore) {
        startingAfter = response.data[response.data.length - 1].id;
        process.stdout.write(`\rFetched ${refunds.length} refunds...`);
      }
    }

    console.log('');
    logSuccess(`Fetched ${refunds.length} refunds`);

    // Process transactions
    log('\nProcessing transaction data...', 'cyan');

    const transactions = charges.map((charge) => {
      const refundsForCharge = refunds.filter((r) => r.charge === charge.id);
      const totalRefunded = refundsForCharge.reduce((sum, r) => sum + r.amount, 0);

      return {
        id: charge.id,
        date: new Date(charge.created * 1000).toISOString(),
        type: 'charge',
        status: charge.status,
        amount: charge.amount / 100,
        fee: charge.balance_transaction
          ? (charge.balance_transaction.fee / 100).toFixed(2)
          : 0,
        net: charge.balance_transaction
          ? (charge.balance_transaction.net / 100).toFixed(2)
          : (charge.amount / 100).toFixed(2),
        currency: charge.currency.toUpperCase(),
        customer: charge.customer || 'N/A',
        description: charge.description || 'N/A',
        refunded: charge.refunded,
        refund_amount: totalRefunded / 100,
        dispute: charge.dispute ? 'Yes' : 'No',
        payment_method: charge.payment_method_details?.type || 'N/A',
        card_brand: charge.payment_method_details?.card?.brand || 'N/A',
        card_last4: charge.payment_method_details?.card?.last4 || 'N/A',
        receipt_url: charge.receipt_url || 'N/A',
      };
    });

    // Add refund transactions
    refunds.forEach((refund) => {
      transactions.push({
        id: refund.id,
        date: new Date(refund.created * 1000).toISOString(),
        type: 'refund',
        status: refund.status,
        amount: -(refund.amount / 100),
        fee: 0,
        net: -(refund.amount / 100),
        currency: refund.currency.toUpperCase(),
        customer: 'N/A',
        description: `Refund for ${refund.charge}`,
        refunded: false,
        refund_amount: 0,
        dispute: 'No',
        payment_method: 'N/A',
        card_brand: 'N/A',
        card_last4: 'N/A',
        receipt_url: 'N/A',
      });
    });

    // Sort by date
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate summary
    const summary = {
      total_charges: charges.length,
      total_refunds: refunds.length,
      gross_revenue: charges.reduce((sum, c) => sum + c.amount, 0) / 100,
      total_refunded: refunds.reduce((sum, r) => sum + r.amount, 0) / 100,
      net_revenue: 0,
      total_fees: 0,
    };

    charges.forEach((charge) => {
      if (charge.balance_transaction) {
        summary.total_fees += charge.balance_transaction.fee / 100;
        summary.net_revenue += charge.balance_transaction.net / 100;
      }
    });

    summary.net_revenue -= summary.total_refunded;

    // Export data
    log('\nExporting data...', 'cyan');

    if (format === 'csv') {
      // Generate CSV
      const headers = Object.keys(transactions[0] || {}).join(',');
      const rows = transactions.map((t) => Object.values(t).join(','));
      const csv = [headers, ...rows].join('\n');

      fs.writeFileSync(outputFile, csv);
      logSuccess(`Exported to CSV: ${outputFile}`);
    } else if (format === 'json') {
      // Generate JSON
      const json = JSON.stringify(
        {
          summary,
          transactions,
          metadata: {
            start_date: startDateStr,
            end_date: endDateStr,
            exported_at: new Date().toISOString(),
            total_transactions: transactions.length,
          },
        },
        null,
        2
      );

      fs.writeFileSync(outputFile, json);
      logSuccess(`Exported to JSON: ${outputFile}`);
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    // Display summary
    log('\n' + '='.repeat(60), 'bright');
    log('Transaction Summary', 'bright');
    log('='.repeat(60), 'bright');
    console.log(`  Period: ${startDateStr} to ${endDateStr}`);
    console.log(`  Total Charges: ${summary.total_charges}`);
    console.log(`  Total Refunds: ${summary.total_refunds}`);
    console.log(`  Gross Revenue: $${summary.gross_revenue.toFixed(2)}`);
    console.log(`  Total Refunded: -$${summary.total_refunded.toFixed(2)}`);
    console.log(`  Total Fees: -$${summary.total_fees.toFixed(2)}`);
    console.log(
      `  Net Revenue: $${summary.net_revenue.toFixed(2)}`,
      'green'
    );
    log('='.repeat(60) + '\n', 'bright');

    // Top customers
    const customerRevenue = {};
    charges.forEach((charge) => {
      if (charge.customer) {
        customerRevenue[charge.customer] =
          (customerRevenue[charge.customer] || 0) + charge.amount / 100;
      }
    });

    const topCustomers = Object.entries(customerRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (topCustomers.length > 0) {
      log('Top 5 Customers:', 'cyan');
      topCustomers.forEach(([customer, revenue], index) => {
        console.log(`  ${index + 1}. ${customer}: $${revenue.toFixed(2)}`);
      });
      console.log('');
    }

    // File info
    const stats = fs.statSync(outputFile);
    log(`File size: ${(stats.size / 1024).toFixed(2)} KB`, 'cyan');
    log(`File location: ${path.resolve(outputFile)}`, 'cyan');

  } catch (error) {
    console.error('\n✗ Export failed:', error);
  }
}

// Run export
exportTransactions();
