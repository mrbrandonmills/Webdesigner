# Instagram Image Preprocessing System

## Overview

This system automatically ensures all images meet Instagram's aspect ratio requirements before posting. Instagram rejects images with aspect ratios outside their acceptable range, which was causing posting failures for product images with unusual dimensions (e.g., the Brandon Mills mug images at 2.14:1).

## Problem Statement

**Original Issue**: Instagram rejects images with aspect ratios outside these limits:
- Minimum (portrait): **4:5** (0.8:1)
- Maximum (landscape): **1.91:1**
- Standard (square): **1:1**

**Example**: Brandon Mills product images for mugs are 2.14:1 (too wide), causing Instagram API to reject posts.

## Solution

The system implements automatic image preprocessing with these capabilities:

### 1. **Aspect Ratio Detection** (`image-processor.ts`)
- Downloads image from URL
- Analyzes dimensions and aspect ratio
- Validates against Instagram limits
- Determines if processing is needed

### 2. **Image Processing**
Two methods available:

#### **Crop Method** (Default)
- Crops image from the center to meet Instagram limits
- Preserves original content within the cropped area
- Best for images where edges can be sacrificed
- Example: 2000x935 → 1786x935 (2.14:1 → 1.91:1)

#### **Pad Method**
- Adds background padding to meet Instagram limits
- Preserves entire original image
- Best for images where all content must be visible
- Configurable background color (default: white)
- Example: 2000x935 → 2000x1047 (2.14:1 → 1.91:1)

### 3. **CDN Upload** (`cdn-uploader.ts`)
- Uploads processed image to Vercel Blob (primary)
- Falls back to Cloudinary if configured
- Returns public URL for Instagram API
- Handles upload failures gracefully

### 4. **Automatic Integration** (`official-api.ts`)
- Seamlessly integrated into `InstagramGraphAPI.post()` method
- Checks aspect ratio before every post
- Processes only if needed
- Uses processed image URL automatically
- No changes needed in calling code

## File Structure

```
lib/instagram/
├── image-processor.ts      # Core image processing logic
├── cdn-uploader.ts         # CDN upload utilities
├── official-api.ts         # Instagram API wrapper (updated)
└── README-IMAGE-PROCESSING.md  # This file

scripts/
└── test-instagram-image-processing.ts  # Testing script
```

## Usage

### Automatic (Recommended)

The system works automatically when posting to Instagram:

```typescript
import InstagramGraphAPI from '@/lib/instagram/official-api';

const api = new InstagramGraphAPI();

// Just post as normal - preprocessing happens automatically
const result = await api.post(
  'https://example.com/too-wide-image.jpg',  // 2.14:1 ratio
  'Check out this awesome product!'
);

// Image is automatically:
// 1. Downloaded and checked
// 2. Processed if needed (cropped to 1.91:1)
// 3. Uploaded to CDN
// 4. Posted to Instagram with new URL
```

### Manual Processing

For advanced use cases, you can process images manually:

```typescript
import {
  getImageInfo,
  downloadAndProcessForInstagram,
  isValidInstagramAspectRatio
} from '@/lib/instagram/image-processor';
import { uploadImageToCDN } from '@/lib/instagram/cdn-uploader';

// Check if image needs processing
const info = await getImageInfo(imageUrl);
console.log(`Aspect ratio: ${info.aspectRatio}`);
console.log(`Valid: ${info.isValidForInstagram}`);

if (!info.isValidForInstagram) {
  // Process with custom options
  const processed = await downloadAndProcessForInstagram(imageUrl, {
    preferredMethod: 'pad',  // or 'crop'
    backgroundColor: '#000000',  // black background
    quality: 95
  });

  // Upload to CDN
  const upload = await uploadImageToCDN(
    processed.buffer,
    'my-image.jpg',
    false  // preferCloudinary
  );

  console.log(`Processed image URL: ${upload.url}`);
}
```

## Configuration Options

### Image Processing Options

```typescript
interface ImageProcessingOptions {
  preferredMethod?: 'crop' | 'pad';  // Default: 'crop'
  backgroundColor?: string;           // Default: '#FFFFFF' (white)
  quality?: number;                   // JPEG quality 1-100, Default: 90
}
```

### CDN Upload Options

The system tries **Vercel Blob** first (required dependency), then falls back to **Cloudinary** if:
- Vercel Blob fails
- Cloudinary is configured (optional)
- `preferCloudinary` parameter is true

Required environment variables:
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob (required)

Optional environment variables:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Testing

### Test Script

Test the image processing system without posting to Instagram:

```bash
# Test a specific URL
npx tsx scripts/test-instagram-image-processing.ts "https://example.com/image.jpg"

# Save processed images to disk
npx tsx scripts/test-instagram-image-processing.ts "https://example.com/image.jpg" --save

# Run all built-in tests
npx tsx scripts/test-instagram-image-processing.ts
```

### Test Images

The test script includes several test cases:
- Too wide (2.14:1) - Brandon Mills mug scenario
- Valid square (1:1)
- Valid portrait (4:5)
- Too tall (1:2)

## Instagram Aspect Ratio Limits

| Type | Ratio | Decimal | Notes |
|------|-------|---------|-------|
| Maximum Landscape | 1.91:1 | 1.91 | Widest allowed |
| Square | 1:1 | 1.0 | Classic Instagram |
| Portrait | 4:5 | 0.8 | Maximum height |

**Tolerance**: The system includes a ±0.01 tolerance for floating point precision issues.

## How It Works

### Processing Flow

```
1. User calls api.post(imageUrl, caption)
   ↓
2. System downloads and checks aspect ratio
   ↓
3. Is aspect ratio valid? (0.8 ≤ ratio ≤ 1.91)
   ├─ YES → Use original URL
   └─ NO  → Process image
       ↓
   4. Determine target ratio
      • Too wide (>1.91) → Crop/pad to 1.91:1
      • Too tall (<0.8)  → Crop/pad to 0.8:1
       ↓
   5. Apply processing method
      • Crop: Remove edges from center
      • Pad: Add background padding
       ↓
   6. Upload to CDN
      • Try Vercel Blob
      • Fallback to Cloudinary
       ↓
   7. Get public URL
       ↓
8. Post to Instagram with final URL
```

### Example: Mug Image (2.14:1)

**Original**: 2000×935 pixels (2.14:1 ratio)

**Problem**: 2.14:1 > 1.91:1 (too wide)

**Solution**:

#### Crop Method (Default)
```
New dimensions: 1786×935 pixels
New ratio: 1.91:1
Lost pixels: 214px from sides (107px each side)
✅ Valid for Instagram
```

#### Pad Method
```
New dimensions: 2000×1047 pixels
New ratio: 1.91:1
Added: 112px white padding (56px top, 56px bottom)
✅ Valid for Instagram
```

## Performance

- **Image Download**: ~100-300ms (depends on image size and network)
- **Processing**: ~50-200ms (depends on image size and method)
- **CDN Upload**: ~200-500ms (depends on CDN and network)
- **Total Overhead**: ~350-1000ms per invalid image

**Note**: Only invalid images incur this overhead. Valid images are posted directly.

## Error Handling

The system includes comprehensive error handling:

1. **Download Failures**: Clear error messages with URL and status code
2. **Processing Failures**: Catches Sharp library errors
3. **Upload Failures**: Automatic fallback to secondary CDN
4. **Validation Failures**: Should never happen, but includes safety checks

All errors are logged with the `logger` utility and include context for debugging.

## Future Enhancements

Potential improvements:

1. **Caching**: Cache processed images to avoid re-processing
2. **Batch Processing**: Process multiple images in parallel
3. **Smart Cropping**: Use AI to detect focal points for better crops
4. **Format Support**: Support for PNG, WebP, and other formats
5. **Size Optimization**: Automatically resize oversized images
6. **Preview**: Generate preview images before posting

## Dependencies

- **sharp** (v0.34.5+): Image processing library
- **@vercel/blob**: Primary CDN (required)
- **cloudinary**: Secondary CDN (optional)

## Troubleshooting

### "Failed to download image: 404"
- Check that the image URL is publicly accessible
- Verify the URL is correct and not expired

### "Failed to upload to CDN"
- Check `BLOB_READ_WRITE_TOKEN` environment variable
- Verify Vercel Blob is configured correctly
- Check Cloudinary credentials if using fallback

### "Processing failed to produce valid aspect ratio"
- This should never happen after the tolerance fix
- Check Sharp library version (should be 0.34.5+)
- Report as a bug if it occurs

### Image looks wrong after processing
- Try switching from 'crop' to 'pad' method
- Adjust backgroundColor for pad method
- Consider using custom processing with manual crop coordinates

## Support

For issues or questions:
1. Check the test script output for detailed diagnostics
2. Review the logger output in the console
3. Verify environment variables are set correctly
4. Test with the provided test images first

## License

Part of the Brandon Mills AI Photography Automation system.
