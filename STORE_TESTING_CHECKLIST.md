# Store Testing Checklist

## Pre-Launch Testing Guide

### 🎯 Product Detail Page (`/store/[productId]`)

#### Gallery Testing
- [ ] Images load correctly
- [ ] Thumbnails display and are clickable
- [ ] Main image updates when thumbnail clicked
- [ ] Hover zoom works on desktop
- [ ] Lightbox opens on click
- [ ] Keyboard navigation (arrows, escape) works
- [ ] Mobile swipe gestures work
- [ ] Image counter displays correctly
- [ ] Close button works in lightbox

#### Product Information
- [ ] Title displays correctly
- [ ] Brand/artist name shows
- [ ] Description renders properly
- [ ] Limited edition badge shows when applicable
- [ ] Specifications display
- [ ] Materials section renders
- [ ] Care instructions visible
- [ ] Trust signals display
- [ ] Shipping info shows
- [ ] Return policy displays

#### Variant Selection
- [ ] Size options render
- [ ] Color swatches work
- [ ] Material selector functions
- [ ] Selected variant highlights
- [ ] Out of stock variants are disabled
- [ ] Stock status updates
- [ ] Price updates based on selection
- [ ] Variant images update main gallery

#### Purchase Controls
- [ ] Quantity selector works
- [ ] Cannot go below 1
- [ ] Add to cart functions
- [ ] Success animation plays
- [ ] Cart opens after add
- [ ] Buy now button works
- [ ] Wishlist button toggles
- [ ] Price calculates correctly
- [ ] Total updates with quantity

#### Navigation
- [ ] Back to store button works
- [ ] Share button functions
- [ ] View count displays
- [ ] Related products load
- [ ] Related product links work

### 🛍️ Collection Pages (`/collections/[collectionId]`)

#### Hero Section
- [ ] Collection title displays
- [ ] Description renders
- [ ] Background effects show
- [ ] Back button works
- [ ] Metadata (location, date) shows

#### Product Grid
- [ ] Products load correctly
- [ ] Grid layout responsive
- [ ] List layout works
- [ ] View toggle functions
- [ ] Product images load
- [ ] Quick add works
- [ ] Product links work
- [ ] Hover effects smooth

#### Filtering & Sorting
- [ ] Product count accurate
- [ ] Sort dropdown works
- [ ] Price sorting accurate
- [ ] Title sorting works
- [ ] Filters apply correctly
- [ ] Results update immediately

#### Collection Story
- [ ] Creative process section shows
- [ ] Inspiration text displays
- [ ] Technical details render
- [ ] All sections properly formatted

### ❤️ Wishlist Page (`/wishlist`)

#### Empty State
- [ ] Empty message displays
- [ ] Icon shows correctly
- [ ] CTA button works
- [ ] Links to store

#### With Items
- [ ] Products display correctly
- [ ] Images load
- [ ] Prices show
- [ ] Added date displays
- [ ] Total value calculates

#### Actions
- [ ] Remove item works
- [ ] Move to cart functions
- [ ] Add all to cart works
- [ ] Share wishlist functions
- [ ] Link copies to clipboard

#### Recently Viewed
- [ ] Products show if available
- [ ] Links work
- [ ] Images load
- [ ] Prices display

### 🛒 Cart Sidebar (Enhanced)

#### Cart Display
- [ ] Cart opens/closes smoothly
- [ ] Backdrop clicks close cart
- [ ] Escape key closes cart
- [ ] Product images show
- [ ] Product details correct
- [ ] Prices display

#### Free Shipping Progress
- [ ] Progress bar shows when under threshold
- [ ] Amount needed displays
- [ ] Bar fills correctly
- [ ] Hides when threshold met

#### Quantity Controls
- [ ] Minus button works
- [ ] Plus button works
- [ ] Remove button functions
- [ ] Quantity updates cart
- [ ] Price updates correctly

#### Promo Codes
- [ ] Input field works
- [ ] Apply button functions
- [ ] Valid codes accepted
- [ ] Invalid codes show error
- [ ] Discount applies correctly
- [ ] Remove promo works
- [ ] Price updates with discount

Valid codes to test:
- `WELCOME10`
- `SAVE15`
- `LUXURY20`
- `FIRSTORDER`

#### Checkout
- [ ] Price breakdown correct
- [ ] Subtotal accurate
- [ ] Discount calculates
- [ ] Shipping displays
- [ ] Total calculates correctly
- [ ] Delivery estimate shows
- [ ] Checkout button works
- [ ] Loading state shows
- [ ] Redirects to Stripe

#### Recommendations
- [ ] Products load
- [ ] Images display
- [ ] Add button works
- [ ] Links function

### 📱 Mobile Testing

#### Responsive Design
- [ ] All pages fit screen
- [ ] Text readable
- [ ] Buttons touchable (44px min)
- [ ] Images scale correctly
- [ ] Modals full screen
- [ ] Navigation accessible

#### Touch Interactions
- [ ] Swipe on gallery works
- [ ] Touch scrolling smooth
- [ ] Buttons have touch feedback
- [ ] Pinch zoom works where intended
- [ ] No accidental triggers

#### Performance
- [ ] Pages load quickly
- [ ] Images optimized
- [ ] Animations smooth
- [ ] No layout shifts
- [ ] Scrolling performant

### ⌨️ Keyboard Navigation

#### General
- [ ] Tab order logical
- [ ] Focus visible
- [ ] Enter activates buttons
- [ ] Escape closes modals
- [ ] No keyboard traps

#### Gallery
- [ ] Arrow keys navigate images
- [ ] Escape closes lightbox
- [ ] Enter opens lightbox
- [ ] Tab reaches all controls

#### Forms
- [ ] Tab moves through fields
- [ ] Enter submits
- [ ] Labels associated
- [ ] Errors announced

### ♿ Accessibility

#### Screen Reader
- [ ] All images have alt text
- [ ] Buttons have labels
- [ ] Links have context
- [ ] Headings in order
- [ ] Landmarks present

#### Visual
- [ ] Color contrast sufficient
- [ ] Text scalable
- [ ] No color-only indicators
- [ ] Focus indicators clear

#### Interactive
- [ ] All controls keyboard accessible
- [ ] Error messages clear
- [ ] Success states announced
- [ ] Loading states indicated

### ⚡ Performance

#### Load Times
- [ ] Store page < 3s
- [ ] Product page < 3s
- [ ] Images < 1s
- [ ] Cart opens < 0.5s

#### Interactions
- [ ] Buttons respond immediately
- [ ] Animations smooth (60fps)
- [ ] Scrolling smooth
- [ ] No jank or stuttering

#### Lighthouse Scores
- [ ] Performance > 90
- [ ] Accessibility > 95
- [ ] Best Practices > 90
- [ ] SEO > 90

### 🔄 State Management

#### Cart Persistence
- [ ] Cart saves to localStorage
- [ ] Cart persists on refresh
- [ ] Cart syncs across tabs
- [ ] Cart clears on logout

#### Wishlist
- [ ] Wishlist saves locally
- [ ] Items persist on refresh
- [ ] Can view on any page

#### Recently Viewed
- [ ] Products tracked
- [ ] List updates on view
- [ ] Limited to 20 items
- [ ] Displays on wishlist page

### 🔍 Edge Cases

#### Empty States
- [ ] No products message
- [ ] Empty cart message
- [ ] Empty wishlist message
- [ ] No search results

#### Error States
- [ ] Product not found
- [ ] Failed to load
- [ ] Network error
- [ ] Checkout error

#### Loading States
- [ ] Skeleton screens show
- [ ] Spinners appear
- [ ] Progress indicators work
- [ ] Timeout handled

#### Data Validation
- [ ] Invalid product ID
- [ ] Missing images
- [ ] No variants
- [ ] Invalid prices

### 🌐 Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 📊 Analytics

#### Tracking Events
- [ ] Product views tracked
- [ ] Add to cart tracked
- [ ] Checkout initiated tracked
- [ ] Wishlist additions tracked

#### Console
- [ ] No errors in console
- [ ] No warnings (or acceptable)
- [ ] API calls successful
- [ ] Data structure correct

### 🔒 Security

#### Input Validation
- [ ] XSS protection
- [ ] SQL injection safe
- [ ] CSRF tokens present
- [ ] Rate limiting works

#### Payment
- [ ] Stripe checkout secure
- [ ] No card data stored
- [ ] SSL certificate valid
- [ ] Webhooks verified

## 🎯 Critical Path Testing

### Purchase Flow
1. [ ] Browse store
2. [ ] View product
3. [ ] Select variant
4. [ ] Add to cart
5. [ ] View cart
6. [ ] Apply promo code
7. [ ] Proceed to checkout
8. [ ] Complete purchase

### Wishlist Flow
1. [ ] View product
2. [ ] Add to wishlist
3. [ ] View wishlist
4. [ ] Move to cart
5. [ ] Checkout

### Collection Flow
1. [ ] Browse collections
2. [ ] View collection
3. [ ] Filter products
4. [ ] Quick add to cart
5. [ ] View cart

## ✅ Pre-Launch Checklist

### Content
- [ ] All product images optimized
- [ ] Descriptions proofread
- [ ] Prices verified
- [ ] Inventory accurate

### Technical
- [ ] Build passes
- [ ] No TypeScript errors
- [ ] All tests pass
- [ ] Lighthouse scores good

### Business
- [ ] Stripe configured
- [ ] Shipping rates set
- [ ] Return policy clear
- [ ] Terms & conditions ready

### Legal
- [ ] Privacy policy posted
- [ ] Cookie consent configured
- [ ] GDPR compliant
- [ ] Terms accepted

## 🐛 Bug Report Template

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser:
- Device:
- OS:
- Screen size:

**Screenshots:**
[Attach if relevant]

**Console Errors:**
[Copy any errors]
```

## 📈 Post-Launch Monitoring

### Week 1
- [ ] Monitor error logs
- [ ] Track conversion rate
- [ ] Check cart abandonment
- [ ] Review page load times
- [ ] Analyze user flows

### Month 1
- [ ] Review analytics
- [ ] A/B test variations
- [ ] Optimize images
- [ ] Refine recommendations
- [ ] Improve SEO

---

**Test Status:** ⚪ Not Started | 🔵 In Progress | ✅ Complete | ❌ Failed

**Tested By:** _____________

**Date:** _____________

**Notes:**
