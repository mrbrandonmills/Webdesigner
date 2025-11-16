# Promo Code System - Testing Checklist

## Pre-Testing Setup

- [ ] Dev server is running (`npm run dev`)
- [ ] Browser console is open (F12)
- [ ] Clear browser localStorage (if needed): `localStorage.clear()`

## Test 1: Block C Promo Code (URGENT - For Co-Author)

### Setup
- [ ] Open browser to `http://localhost:3000/writing/books/block-c`

### Steps
1. [ ] Page loads with book preview
2. [ ] See "Have a promo code?" button
3. [ ] Click the button
4. [ ] Input field appears
5. [ ] Enter: **BLOCKC2024**
6. [ ] Click "Apply"
7. [ ] Email prompt appears
8. [ ] Enter: `coauthor@example.com`
9. [ ] Success message shows
10. [ ] Full book content unlocks
11. [ ] Refresh page
12. [ ] Book remains unlocked

### Expected Results
- ✅ Promo code accepts
- ✅ No payment required
- ✅ Full book visible
- ✅ Unlock persists after refresh
- ✅ Success message: "Book unlocked with promo code!"

### If it fails:
- Check browser console for errors
- Verify API endpoint: `POST /api/promo/unlock`
- Check localStorage has `book-unlocked-block-c`
- Check `/data/book-unlocks/by-email.json` was created

---

## Test 2: Meditation Promo Code

### Setup
- [ ] Open browser to `http://localhost:3000/meditations/morning-mindfulness`

### Steps
1. [ ] Page loads with unlock gate
2. [ ] See "Have a promo code?" button
3. [ ] Click the button
4. [ ] Input field appears
5. [ ] Enter: **COAUTHOR2024**
6. [ ] Click "Apply"
7. [ ] Email prompt appears
8. [ ] Enter: `test@example.com`
9. [ ] Success message shows
10. [ ] Audio player appears
11. [ ] Voice selector shows 4 options
12. [ ] Can play meditation
13. [ ] Refresh page
14. [ ] Meditation remains unlocked

### Expected Results
- ✅ Promo code accepts
- ✅ No payment required
- ✅ Audio player visible
- ✅ All 4 voices available
- ✅ Unlock persists after refresh
- ✅ Success message: "Meditation unlocked with promo code!"

### If it fails:
- Check browser console for errors
- Verify API endpoint: `POST /api/promo/unlock`
- Check localStorage has meditation unlock
- Check `/data/meditation-unlocks/by-email.json` was created

---

## Test 3: Invalid Promo Code

### Setup
- [ ] Open any meditation or book page
- [ ] Click "Have a promo code?"

### Steps
1. [ ] Enter: **INVALIDCODE123**
2. [ ] Click "Apply"
3. [ ] Email prompt appears
4. [ ] Enter: `test@example.com`
5. [ ] Error message shows

### Expected Results
- ✅ Code is rejected
- ✅ Error message: "Invalid promo code"
- ✅ Content does NOT unlock
- ✅ Can try different code

---

## Test 4: Wrong Content Type

### Setup
- [ ] Open book page: `/writing/books/block-c`
- [ ] Click "Have a promo code?"

### Steps
1. [ ] Enter: **COAUTHOR2024** (meditation code)
2. [ ] Click "Apply"
3. [ ] Email prompt appears
4. [ ] Enter: `test@example.com`
5. [ ] Error message shows

### Expected Results
- ✅ Code is rejected
- ✅ Error message: "This code is only valid for meditations"
- ✅ Book does NOT unlock

---

## Test 5: Admin Panel - View Codes

### Setup
- [ ] Open `http://localhost:3000/admin/promo-codes`

### Steps
1. [ ] Page loads
2. [ ] See "Promo Codes" heading
3. [ ] See "Create New Promo Code" button
4. [ ] Pre-loaded codes are visible:
   - [ ] BLOCKC2024
   - [ ] COAUTHOR2024
   - [ ] WELCOME10
5. [ ] Each code shows details:
   - [ ] Code name
   - [ ] Type badge
   - [ ] Discount percentage
   - [ ] Usage count (if applicable)

### Expected Results
- ✅ Admin panel loads
- ✅ All 3 pre-loaded codes visible
- ✅ Details display correctly
- ✅ No errors in console

---

## Test 6: Admin Panel - Create Code

### Setup
- [ ] At `/admin/promo-codes`
- [ ] Click "Create New Promo Code"

### Steps
1. [ ] Form appears
2. [ ] Fill in:
   - Code: **TEST2024**
   - Type: Meditation
   - Discount: 50%
   - Max Uses: 10
   - Description: "Test code"
3. [ ] Click "Create Promo Code"
4. [ ] Success message shows
5. [ ] New code appears in list
6. [ ] Code shows 50% discount
7. [ ] Usage shows 0 / 10

### Expected Results
- ✅ Form validation works
- ✅ Code creates successfully
- ✅ Appears in list immediately
- ✅ Can copy code
- ✅ Can delete code

---

## Test 7: Admin Panel - Delete Code

### Setup
- [ ] At `/admin/promo-codes`
- [ ] Have test code created (TEST2024)

### Steps
1. [ ] Find TEST2024 code
2. [ ] Click trash icon
3. [ ] Confirm deletion
4. [ ] Code disappears from list

### Expected Results
- ✅ Deletion requires confirmation
- ✅ Code removes from list
- ✅ Code no longer works on pages

---

## Test 8: Promo Code with Max Uses

### Setup
- [ ] Create code with Max Uses: 1
- [ ] Code: **ONETIME**
- [ ] Type: Meditation
- [ ] Discount: 100%

### Steps
1. [ ] Use code on meditation page
2. [ ] Verify it works (1st use)
3. [ ] Clear localStorage
4. [ ] Try to use same code again
5. [ ] Should see error: "Usage limit reached"

### Expected Results
- ✅ First use succeeds
- ✅ Second use fails
- ✅ Error message is clear
- ✅ Usage count updates (1/1)

---

## Test 9: Promo Code with Expiration

### Setup
- [ ] Create code with past expiration date
- [ ] Code: **EXPIRED2023**
- [ ] Expires: 2023-12-31

### Steps
1. [ ] Try to use code
2. [ ] See error message

### Expected Results
- ✅ Code is rejected
- ✅ Error: "This promo code has expired"
- ✅ Content does NOT unlock

---

## Test 10: Copy Code to Clipboard

### Setup
- [ ] At `/admin/promo-codes`

### Steps
1. [ ] Find BLOCKC2024
2. [ ] Click copy icon
3. [ ] Icon changes to checkmark
4. [ ] Paste in another app
5. [ ] Verify copied text: "BLOCKC2024"

### Expected Results
- ✅ Copy works
- ✅ Visual feedback (checkmark)
- ✅ Exact code copied

---

## Test 11: Unlock Persistence

### Setup
- [ ] Unlock content with promo code
- [ ] Note email used

### Steps
1. [ ] Close browser tab
2. [ ] Open new tab
3. [ ] Visit same content page
4. [ ] Content is still unlocked

### Expected Results
- ✅ Unlock persists across tabs
- ✅ Unlock persists after browser restart
- ✅ localStorage maintains unlock

---

## Test 12: Multiple Content Unlocks

### Setup
- [ ] Use COAUTHOR2024 for one meditation

### Steps
1. [ ] Unlock "Morning Mindfulness"
2. [ ] Visit "Deep Sleep" meditation
3. [ ] Use same COAUTHOR2024 code
4. [ ] Both meditations unlocked

### Expected Results
- ✅ Code works for multiple meditations
- ✅ All meditations unlock with same code
- ✅ Usage count accurate

---

## Test 13: API Validation Endpoint

### Using Curl
```bash
curl -X POST http://localhost:3000/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BLOCKC2024",
    "contentType": "book",
    "contentId": "block-c",
    "email": "test@example.com"
  }'
```

### Expected Response
```json
{
  "valid": true,
  "discount": 100,
  "message": "Free access!",
  "isFree": true
}
```

---

## Test 14: API Unlock Endpoint

### Using Curl
```bash
curl -X POST http://localhost:3000/api/promo/unlock \
  -H "Content-Type: application/json" \
  -d '{
    "code": "BLOCKC2024",
    "contentType": "book",
    "contentId": "block-c",
    "email": "coauthor@example.com"
  }'
```

### Expected Response
```json
{
  "success": true,
  "unlocked": true,
  "contentType": "book",
  "contentId": "block-c",
  "unlockToken": "...",
  "message": "Content unlocked successfully with promo code!"
}
```

---

## Test 15: Error Handling

### Test various error scenarios:

- [ ] Empty promo code field
  - Expected: "Please enter a promo code"

- [ ] Invalid email format
  - Expected: "Please enter a valid email address"

- [ ] Cancel email prompt
  - Expected: No error, form remains

- [ ] Network error (server down)
  - Expected: "Unable to process promo code. Please try again."

---

## Final Verification Checklist

- [ ] All pre-loaded codes work
- [ ] Can create custom codes
- [ ] Can delete codes
- [ ] Unlocks persist across sessions
- [ ] Admin panel accessible
- [ ] No console errors
- [ ] Data files created in `/data/`
- [ ] Email tracking works
- [ ] Usage limits enforced
- [ ] Expiration dates work
- [ ] Copy functionality works
- [ ] Error messages are clear

---

## Known Issues to Fix

- [ ] Add admin authentication
- [ ] Persist custom codes to database
- [ ] Add email verification
- [ ] Add analytics dashboard
- [ ] Add bulk code generation
- [ ] Add code templates

---

## Success Criteria

All tests pass?
- ✅ **System is production-ready!**
- ✅ **Co-author can use BLOCKC2024 tonight!**
- ✅ **Brandon can create unlimited custom codes!**

---

**Last Updated**: November 16, 2025
**Test Status**: Ready for testing
