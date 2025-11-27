/**
 * List of Amazon ASINs with verified working image URLs
 * Only these products will be displayed on the shop page
 * Updated: 2025-11-27
 */

export const WORKING_AMAZON_ASINS = [
  'B0CMVPMPZ8', // Braun IPL Pro 7
  'B0CM5JV268', // Product 2
  '0735211299', // Book 1
  '0812968255', // Book 2
  '0062316117', // Book 3
  '0140455116', // Book 4
  'B08PZHYWJS', // Product 8
  'B09XS7JWHH', // Product 9
  'B07L5GDTYY', // Product 10
  '8883701127', // Book 5
  'B071Y3MSRK', // Product 12
  'B0016BFD4K', // Product 13
  'B0009R16MA', // Product 14
  '080701429X', // Book 6
  '0380810336', // Book 7
  '1631060171', // Book 8
];

/**
 * Check if an ASIN has a working image URL
 */
export function hasWorkingImage(asin: string): boolean {
  return WORKING_AMAZON_ASINS.includes(asin);
}

/**
 * Extract ASIN from Amazon URL
 */
export function extractASIN(url: string): string | null {
  const match = url.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/);
  return match ? match[2] : null;
}
