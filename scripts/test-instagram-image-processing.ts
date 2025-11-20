#!/usr/bin/env tsx

/**
 * Test Instagram Image Processing
 * Tests the image preprocessing system without actually posting to Instagram
 */

import {
  getImageInfo,
  processImageForInstagram,
  downloadAndProcessForInstagram,
  isValidInstagramAspectRatio,
} from '../lib/instagram/image-processor';
import { logger } from '../lib/logger';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

// Test images with different aspect ratios
const testImages = [
  {
    name: 'Too Wide (Simulates Mug Image)',
    url: 'https://picsum.photos/2000/935', // 2.14:1 (same as mug)
    expectedIssue: 'Too wide (2.14:1)',
  },
  {
    name: 'Valid Square',
    url: 'https://picsum.photos/800/800', // 1:1
    expectedIssue: 'None - should be valid',
  },
  {
    name: 'Valid Portrait',
    url: 'https://picsum.photos/800/1000', // 4:5
    expectedIssue: 'None - should be valid',
  },
  {
    name: 'Too Tall',
    url: 'https://picsum.photos/400/800', // 1:2 (too tall)
    expectedIssue: 'Too tall',
  },
];

async function testImageInfo(url: string, name: string) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${name}`);
  console.log(`URL: ${url}`);
  console.log(`${'='.repeat(80)}`);

  try {
    const info = await getImageInfo(url);

    console.log(`\n📊 Image Information:`);
    console.log(`  Dimensions: ${info.width}x${info.height}`);
    console.log(`  Aspect Ratio: ${info.aspectRatio.toFixed(2)}:1`);
    console.log(`  Format: ${info.format}`);
    console.log(`  Valid for Instagram: ${info.isValidForInstagram ? '✅ YES' : '❌ NO'}`);

    if (!info.isValidForInstagram) {
      console.log(`\n⚠️  Image needs processing`);
      console.log(`  Instagram limits: 0.8:1 (portrait) to 1.91:1 (landscape)`);

      if (info.aspectRatio < 0.8) {
        console.log(`  Issue: Too tall (${info.aspectRatio.toFixed(2)}:1 < 0.8:1)`);
        console.log(`  Fix: Will crop/pad to 4:5 (0.8:1)`);
      } else if (info.aspectRatio > 1.91) {
        console.log(`  Issue: Too wide (${info.aspectRatio.toFixed(2)}:1 > 1.91:1)`);
        console.log(`  Fix: Will crop/pad to 1.91:1`);
      }
    }

    return info;
  } catch (error) {
    console.error(`❌ Error getting image info:`, error);
    throw error;
  }
}

async function testImageProcessing(url: string, name: string) {
  console.log(`\n🔧 Processing Image with CROP method...`);

  try {
    const result = await downloadAndProcessForInstagram(url, {
      preferredMethod: 'crop',
      quality: 90,
    });

    console.log(`\n✅ Processing Complete:`);
    console.log(`  Original: ${result.originalAspectRatio.toFixed(2)}:1`);
    console.log(`  Processed: ${result.processedAspectRatio.toFixed(2)}:1`);
    console.log(`  Dimensions: ${result.width}x${result.height}`);
    console.log(`  Method: ${result.method}`);
    console.log(`  Was Modified: ${result.wasModified ? 'Yes' : 'No'}`);
    console.log(`  Buffer Size: ${(result.buffer.length / 1024).toFixed(2)} KB`);

    // Verify the processed image is valid
    const isValid = isValidInstagramAspectRatio(result.processedAspectRatio);
    console.log(`  Valid for Instagram: ${isValid ? '✅ YES' : '❌ NO'}`);

    if (!isValid) {
      throw new Error('Processing failed to produce valid aspect ratio!');
    }

    return result;
  } catch (error) {
    console.error(`❌ Error processing image:`, error);
    throw error;
  }
}

async function testPaddingMethod(url: string, name: string) {
  console.log(`\n🔧 Processing Image with PAD method...`);

  try {
    const result = await downloadAndProcessForInstagram(url, {
      preferredMethod: 'pad',
      backgroundColor: '#FFFFFF',
      quality: 90,
    });

    console.log(`\n✅ Processing Complete (with padding):`);
    console.log(`  Original: ${result.originalAspectRatio.toFixed(2)}:1`);
    console.log(`  Processed: ${result.processedAspectRatio.toFixed(2)}:1`);
    console.log(`  Dimensions: ${result.width}x${result.height}`);
    console.log(`  Method: ${result.method}`);
    console.log(`  Was Modified: ${result.wasModified ? 'Yes' : 'No'}`);
    console.log(`  Buffer Size: ${(result.buffer.length / 1024).toFixed(2)} KB`);

    return result;
  } catch (error) {
    console.error(`❌ Error processing image with padding:`, error);
    throw error;
  }
}

async function saveProcessedImage(buffer: Buffer, filename: string) {
  const outputDir = path.join(process.cwd(), 'temp', 'instagram-processed');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, buffer);

  console.log(`\n💾 Processed image saved to: ${outputPath}`);
  return outputPath;
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║            Instagram Image Processing Test                                ║
║                                                                            ║
║  This script tests the automatic image preprocessing system that ensures  ║
║  all images meet Instagram's aspect ratio requirements before posting.    ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`);

  const args = process.argv.slice(2);
  const testUrl = args[0];
  const saveOutput = args.includes('--save');

  if (testUrl) {
    // Test a specific URL
    console.log(`\n🔍 Testing custom URL: ${testUrl}\n`);

    try {
      const info = await testImageInfo(testUrl, 'Custom URL');

      if (!info.isValidForInstagram) {
        const croppedResult = await testImageProcessing(testUrl, 'Custom URL');

        if (saveOutput) {
          await saveProcessedImage(croppedResult.buffer, 'custom-cropped.jpg');
        }

        const paddedResult = await testPaddingMethod(testUrl, 'Custom URL');

        if (saveOutput) {
          await saveProcessedImage(paddedResult.buffer, 'custom-padded.jpg');
        }
      }

      console.log(`\n✅ Test completed successfully!`);
    } catch (error) {
      console.error(`\n❌ Test failed:`, error);
      process.exit(1);
    }
  } else {
    // Test all predefined images
    console.log(`\n🧪 Running tests on multiple images...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const test of testImages) {
      try {
        await testImageInfo(test.url, test.name);

        const info = await getImageInfo(test.url);

        if (!info.isValidForInstagram) {
          await testImageProcessing(test.url, test.name);
        }

        successCount++;
        console.log(`\n✅ Test passed: ${test.name}`);
      } catch (error) {
        failCount++;
        console.error(`\n❌ Test failed: ${test.name}`, error);
      }

      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`\n📊 Test Results:`);
    console.log(`  ✅ Passed: ${successCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  Total: ${testImages.length}`);
    console.log(`\n${'='.repeat(80)}`);

    if (failCount > 0) {
      process.exit(1);
    }
  }

  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  ✅ Image processing system is working correctly!                         ║
║                                                                            ║
║  The system will automatically:                                           ║
║  1. Check aspect ratio before posting                                     ║
║  2. Download and process images that are out of bounds                    ║
║  3. Upload processed images to CDN (Vercel Blob/Cloudinary)               ║
║  4. Use the CDN URL for Instagram posting                                 ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
