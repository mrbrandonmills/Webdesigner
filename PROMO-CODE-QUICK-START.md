# Promo Code System - Quick Start Guide

## 🎯 For Your Co-Author (Block C Access - URGENT)

**Share this with your co-author:**

> **Read Block C for FREE tonight!**
>
> 1. Go to: https://brandonmills.com/writing/books/block-c
> 2. Click "Have a promo code?"
> 3. Enter code: **BLOCKC2024**
> 4. Enter your email when prompted
> 5. Full book unlocks instantly!

## 🎁 Pre-loaded Promo Codes

### BLOCKC2024
- **For**: Block C book
- **Discount**: FREE (100%)
- **Perfect for**: Your co-author
- **Expires**: Never

### COAUTHOR2024
- **For**: All meditations
- **Discount**: FREE (100%)
- **Perfect for**: Gift access to meditation library
- **Expires**: Never

### WELCOME10
- **For**: All content (meditations & books)
- **Discount**: 10% off
- **Perfect for**: General promotion
- **Expires**: Never

## 🔧 For You (Brandon)

### Create Custom Promo Codes

1. **Visit Admin Panel**
   ```
   http://localhost:3000/admin/promo-codes
   or
   https://brandonmills.com/admin/promo-codes
   ```

2. **Click "Create New Promo Code"**

3. **Fill in the form:**
   - **Code**: YOURCODE2024 (e.g., SUMMER2024, VIP50)
   - **Type**: Choose meditation, book, or all
   - **Discount**: 1-100% (100 = free)
   - **Target**: (optional) Specific meditation/book slug
   - **Max Uses**: (optional) Leave empty for unlimited
   - **Expires**: (optional) Set expiration date
   - **Description**: Internal notes

4. **Click "Create"**

5. **Copy and share the code!**

### Quick Examples

#### Give Someone Free Meditation Access
```
Code: GIFTFORJOHN
Type: Meditation
Discount: 100%
Target: (leave empty for all)
Max Uses: 1
```

#### Limited Time 20% Off Promotion
```
Code: HOLIDAY20
Type: All
Discount: 20%
Expires: 2024-12-31
Max Uses: 100
```

#### Free Access to Specific Meditation
```
Code: TRYMORNING
Type: Meditation
Target: morning-mindfulness
Discount: 100%
Max Uses: 50
```

## 📋 How Users Redeem Codes

### For Meditations
1. Visit any meditation page (e.g., `/meditations/morning-mindfulness`)
2. See unlock gate with $5 button
3. Click "Have a promo code?" button
4. Enter code
5. Enter email
6. Meditation unlocks instantly!

### For Books
1. Visit any book page (e.g., `/writing/books/block-c`)
2. See preview with unlock button
3. Click "Have a promo code?" button
4. Enter code
5. Enter email
6. Full book unlocks instantly!

## ⚙️ Admin Panel Features

- ✅ View all promo codes
- ✅ See usage statistics
- ✅ Copy codes to clipboard
- ✅ Create unlimited codes
- ✅ Delete old codes
- ✅ Track redemptions

## 🚨 Important Notes

### About Stripe Payment
The meditation checkout route exists at `/app/api/checkout/meditation/route.ts` but requires:
```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
```

**Until you add Stripe keys:**
- Payment button will show error
- Users can use promo codes instead
- No payment processing happens

**To enable payments:**
1. Get key from: https://dashboard.stripe.com/apikeys
2. Add to `.env.local`
3. Restart dev server

### Data Storage
Currently promo codes are stored **in-memory**:
- ✅ Works perfectly for testing
- ✅ Pre-loaded codes always available
- ⚠️ Custom codes reset on server restart

**For production:**
- Migrate to database (PostgreSQL/MongoDB)
- Or use persistent file storage

## 📁 Important Files

### Core System
- `/lib/promo-codes.ts` - All promo logic
- `/app/api/promo/validate/route.ts` - Validation
- `/app/api/promo/unlock/route.ts` - Free unlocks
- `/app/admin/promo-codes/page.tsx` - Admin UI

### Documentation
- `/docs/PROMO-CODE-SYSTEM.md` - Full documentation
- `/docs/BLOCKC2024-COAUTHOR-GUIDE.md` - Co-author guide
- `/docs/URGENT-FIXES-COMPLETED.md` - Technical details

## 🧪 Testing

Run the test script:
```bash
./test-promo-codes.sh
```

Or test manually:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/admin/promo-codes`
3. Visit: `http://localhost:3000/writing/books/block-c`
4. Test code: **BLOCKC2024**

## 🐛 Troubleshooting

### Code not working?
- Check spelling (case doesn't matter)
- Verify content type matches (meditation vs book)
- Check if code expired
- Check if max uses reached

### Admin panel not loading?
- Check URL: `/admin/promo-codes`
- Check browser console for errors
- Verify API endpoints are accessible

### Unlock not persisting?
- Check browser allows localStorage
- Try different browser
- Clear cache and retry

## 📞 Support

Questions? Issues? Contact support or check the full docs at `/docs/PROMO-CODE-SYSTEM.md`

---

**Status**: ✅ Ready to use!
**Pre-loaded codes**: ✅ BLOCKC2024, COAUTHOR2024, WELCOME10
**Co-author can read Block C**: ✅ Tonight with BLOCKC2024
