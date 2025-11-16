# Promo Code System Documentation

## Overview

The promo code system allows Brandon to generate custom promo codes for meditations and books. Users can enter these codes to unlock content for free or at a discount.

## Features

- **Unified System**: Works for both meditations and books
- **Flexible Discounts**: Support any discount percentage (1-100%)
- **Free Access**: 100% discount codes unlock content without payment
- **Usage Tracking**: Track how many times each code is used
- **Expiration Dates**: Set optional expiration dates for codes
- **Usage Limits**: Set maximum number of uses per code
- **Target Specific Content**: Create codes for specific meditations/books or all content

## Pre-loaded Promo Codes

The system comes with these default codes:

### BLOCKC2024
- **Type**: Book
- **Target**: block-c
- **Discount**: 100% (Free)
- **Description**: Free access to Block C for co-author
- **Usage**: Unlimited
- **Expiration**: None

### COAUTHOR2024
- **Type**: Meditation
- **Target**: All meditations
- **Discount**: 100% (Free)
- **Description**: Free access to all meditations
- **Usage**: Unlimited
- **Expiration**: None

### WELCOME10
- **Type**: All (Meditations & Books)
- **Target**: All content
- **Discount**: 10%
- **Description**: Welcome discount
- **Usage**: Unlimited
- **Expiration**: None

## Admin Interface

### Accessing the Admin Panel

Navigate to: `/admin/promo-codes`

### Creating a New Promo Code

1. Click "Create New Promo Code" button
2. Fill in the form:
   - **Code** (required): Unique code name (e.g., "SUMMER2024")
   - **Type** (required): meditation, book, or all
   - **Target** (optional): Specific meditation slug or book ID
   - **Discount %** (required): 1-100 (100 = free)
   - **Max Uses** (optional): Leave empty for unlimited
   - **Expires At** (optional): Leave empty for no expiration
   - **Description** (optional): Internal notes

3. Click "Create Promo Code"

### Managing Promo Codes

- **Copy Code**: Click the copy icon to copy code to clipboard
- **Delete Code**: Click the trash icon to permanently delete a code
- **View Usage**: See usage count vs. max uses

## User Experience

### For Meditations

1. User visits meditation page (e.g., `/meditations/morning-mindfulness`)
2. Sees unlock gate with $5 unlock button
3. Clicks "Have a promo code?" button
4. Enters promo code (e.g., "COAUTHOR2024")
5. Enters email address when prompted
6. If valid, meditation unlocks immediately
7. User can now listen to meditation with all 4 voices

### For Books

1. User visits book page (e.g., `/writing/books/block-c`)
2. Sees preview with unlock button
3. Clicks "Have a promo code?" button
4. Enters promo code (e.g., "BLOCKC2024")
5. Enters email address when prompted
6. If valid, full book unlocks immediately
7. User can now read complete book

## API Endpoints

### Validate Promo Code
```
POST /api/promo/validate
Body: {
  code: "BLOCKC2024",
  contentType: "book",
  contentId: "block-c",
  email: "user@example.com"
}
```

### Unlock with Promo Code
```
POST /api/promo/unlock
Body: {
  code: "BLOCKC2024",
  contentType: "book",
  contentId: "block-c",
  email: "user@example.com"
}
```

### Admin: Get All Codes
```
GET /api/admin/promo-codes
```

### Admin: Create Code
```
POST /api/admin/promo-codes
Body: {
  code: "NEWCODE2024",
  type: "meditation",
  target: "morning-mindfulness",
  discount: 100,
  maxUses: 50,
  expiresAt: "2024-12-31",
  description: "Special promotion",
  createdBy: "admin"
}
```

### Admin: Delete Code
```
DELETE /api/admin/promo-codes?code=OLDCODE
```

## Technical Architecture

### Files Created/Modified

**New Files:**
- `/lib/promo-codes.ts` - Core promo code logic
- `/app/api/promo/validate/route.ts` - Validation API
- `/app/api/promo/unlock/route.ts` - Unlock API
- `/app/api/admin/promo-codes/route.ts` - Admin management API
- `/app/admin/promo-codes/page.tsx` - Admin UI

**Modified Files:**
- `/components/meditation-unlock-gate.tsx` - Added promo input
- `/components/book-reader.tsx` - Added promo input

### Data Storage

Currently using **in-memory storage** with Map. Promo code usage is tracked in:
- `/data/meditation-unlocks/` - For meditation unlocks
- `/data/book-unlocks/` - For book unlocks

**Note**: For production, consider migrating to:
- Database (PostgreSQL, MongoDB)
- Redis for faster lookups
- File-based persistence with encryption

### Security Considerations

1. **Email Required**: Prevents unlimited anonymous usage
2. **Server-side Validation**: All checks happen server-side
3. **Usage Tracking**: Prevents code abuse
4. **Admin Only**: Code creation requires admin access (TODO: add auth)

## Common Use Cases

### Give Co-Author Free Book Access
```
Code: BLOCKC2024 (already created)
Share with co-author
They enter code on book page
Instant free access
```

### Limited Time Promotion
```
Create code: SUMMER2024
Type: All
Discount: 20%
Expires: 2024-08-31
Max Uses: 100
```

### Specific Meditation Gift
```
Create code: GIFT-MORNING
Type: Meditation
Target: morning-mindfulness
Discount: 100%
Max Uses: 1
```

### Influencer Partnership
```
Create code: INFLUENCER10
Type: All
Discount: 10%
Max Uses: 500
Track usage for analytics
```

## Troubleshooting

### Code Not Working
1. Check code is entered correctly (case-insensitive)
2. Verify code hasn't expired
3. Check if max uses reached
4. Ensure code type matches content (meditation/book)
5. Verify target matches if specific

### Admin Panel Not Loading
1. Check you're at `/admin/promo-codes`
2. Check browser console for errors
3. Verify API endpoint is accessible

### Unlock Not Persisting
1. Check localStorage is enabled in browser
2. Verify email is being stored correctly
3. Check `/data/meditation-unlocks/by-email.json`

## Future Enhancements

1. **Database Integration**: Move from in-memory to persistent storage
2. **Admin Authentication**: Add proper admin login system
3. **Analytics Dashboard**: Track code performance
4. **Batch Code Creation**: Generate multiple codes at once
5. **User Dashboard**: Let users see their unlocked content
6. **Email Integration**: Send confirmation emails
7. **Code Templates**: Save common code configurations
8. **A/B Testing**: Test different discount amounts

## Support

For questions or issues with the promo code system, contact Brandon Mills.

---

**Last Updated**: November 16, 2025
**System Version**: 1.0.0
