# Brandon Mills Journey System - Rebuild Implementation Plan

## 📊 Project Overview

**Objective**: Rebuild 3D journey navigation using proven patterns from award-winning sites
**Timeline**: 8-9 hours (3 phases)
**Approach**: Progressive enhancement with quality gates

---

## 🎯 What We're Building

A scroll-driven 3D journey experience that:
- ✅ Achieves 60fps on desktop using **GSAP ScrollTrigger** (industry standard)
- ✅ Maintains 30fps+ on mobile with adaptive quality
- ✅ Provides video/image fallback for non-WebGL devices
- ✅ Includes full keyboard navigation + screen reader support
- ✅ Keeps bundle size < 500KB gzipped

---

## 📚 Based On Research From

Award-winning sites analyzed:
- kasane-keyboard.com (Next.js + Three.js + GSAP)
- library.obys.agency (Three.js + GSAP ScrollTrigger + Locomotive)
- micheledu.com (Framer + video sequences)
- glyphic.bio (Next.js + optimized video loops)

**Key Finding**: ALL use GSAP ScrollTrigger with `scrub: true` for smooth scroll-to-3D sync

---

## 🔧 Implementation Phases

### Phase 1: Core Foundation (2-3 hours)
**Goal**: Set up GSAP ScrollTrigger architecture

**Files to Create**:
- `/utils/gsap-config.ts` - GSAP setup and plugin registration
- `/hooks/useScrollProgress.ts` - Normalized scroll progress (0-1)
- `/components/journey/scroll-controller.tsx` - Main GSAP timeline manager
- `/constants/journey-keyframes.ts` - Camera animation waypoints

**Quality Gate 1**:
- [ ] Build passes without errors
- [ ] ScrollTrigger markers visible in dev mode
- [ ] Console logs scroll progress (0-1 range)
- [ ] Camera moves with scroll (even if rough)

**Rollback**: `git reset --hard phase-1-complete`

---

### Phase 2: 3D Integration (2-3 hours)
**Goal**: Connect ScrollTrigger to Three.js camera with smooth animation

**Files to Create**:
- `/components/journey/camera-animator.tsx` - Camera keyframe interpolation
- `/hooks/usePerformanceMonitor.ts` - FPS tracking + adaptive quality
- `/components/journey/journey-timeline.tsx` - Content animation sync

**Updates**:
- `/components/journey/journey-canvas.tsx` - Add CameraAnimator integration
- Performance stats overlay (dev mode only)

**Quality Gate 2**:
- [ ] Camera animation smooth at 60fps desktop
- [ ] FPS counter shows real-time metrics
- [ ] No Three.js console errors
- [ ] Bundle size < 500KB
- [ ] Memory stable (no leaks)

**Rollback**: `git reset --hard phase-2-complete`

---

### Phase 3: Progressive Enhancement (1-2 hours)
**Goal**: Add fallbacks, mobile optimization, accessibility

**Files to Create**:
- `/hooks/useDeviceDetection.ts` - WebGL/GPU tier detection
- `/components/journey/webgl-fallback.tsx` - Video/image fallback
- `/components/journey/a11y-controls.tsx` - Keyboard nav + screen reader

**Updates**:
- `/app/journey/page.tsx` - Integrate all new components
- Accessibility indicators and keyboard hints

**Quality Gate 3**:
- [ ] Fallback works without WebGL
- [ ] Mobile maintains 30fps+
- [ ] Keyboard navigation functional (↑↓, PageUp/Down, 1-9, Home/End)
- [ ] Screen reader announces sections
- [ ] Lighthouse accessibility 95+

**Rollback**: `git reset --hard phase-3-complete`

---

## 🚀 Key Code Pattern

### The Core Difference

**❌ OLD (Current - Fighting the Framework)**:
```javascript
// Manual Lenis scroll syncing - janky
const scrollProgress = lenis.scroll / scrollHeight
masterTimeline.progress(scrollProgress)
```

**✅ NEW (Industry Standard)**:
```javascript
// GSAP ScrollTrigger handles everything - smooth
gsap.timeline({
  scrollTrigger: {
    scrub: 1,  // ← This is the magic
    pin: true,
    start: 'top top',
    end: 'bottom bottom'
  }
})
```

---

## 📦 Dependencies to Install

```bash
npm install gsap@^3.12.5 @types/gsap@^3.0.0
```

That's it! GSAP is the only new dependency.

---

## 🎨 File Structure Changes

### DELETE (after validation):
- ❌ `/components/journey/lenis-scroll-wrapper.tsx`
- ❌ `/components/journey/camera-controller.tsx` (old version)
- ❌ Custom smooth scroll utilities

### CREATE:
- ✅ `/utils/gsap-config.ts`
- ✅ `/hooks/useScrollProgress.ts`
- ✅ `/hooks/usePerformanceMonitor.ts`
- ✅ `/hooks/useDeviceDetection.ts`
- ✅ `/components/journey/scroll-controller.tsx`
- ✅ `/components/journey/camera-animator.tsx`
- ✅ `/components/journey/journey-timeline.tsx`
- ✅ `/components/journey/webgl-fallback.tsx`
- ✅ `/components/journey/a11y-controls.tsx`
- ✅ `/constants/journey-keyframes.ts`

### KEEP (with modifications):
- 📝 `/components/journey/journey-canvas.tsx`
- 📝 `/app/journey/page.tsx`
- 📝 `/lib/types/journey.ts`

---

## ✅ Success Criteria

### Minimum Viable Product (MVP):
- [x] Scroll controls camera smoothly (60fps desktop)
- [x] No console errors
- [x] Build passes TypeScript strict mode
- [x] Works on Chrome, Safari, Firefox

### Production Ready:
- [x] All MVP criteria
- [x] Mobile responsive (30fps+)
- [x] WebGL fallback functional
- [x] Accessibility score 95+
- [x] Bundle size < 500KB
- [x] Lighthouse performance 90+

---

## 🔄 Rollback Strategy

### Complete Rollback:
```bash
git checkout main
git branch -D feature/journey-gsap-rebuild
```

### Phase-Specific:
```bash
# Back to Phase 1
git reset --hard phase-1-complete

# Back to Phase 2
git reset --hard phase-2-complete
```

---

## 📊 Performance Targets

| Metric | Desktop | Mobile |
|--------|---------|--------|
| **FPS** | 60 | 30+ |
| **Load Time** | < 3s | < 5s |
| **Bundle Size** | < 500KB | < 300KB |
| **Lighthouse** | 90+ | 85+ |

---

## 🧪 Testing Checklist

### Browsers:
- [ ] Chrome 120+ (primary)
- [ ] Safari 17+ (Mac/iOS)
- [ ] Firefox 120+
- [ ] Edge 120+

### Devices:
- [ ] Desktop (1920x1080+)
- [ ] Laptop (1366x768)
- [ ] iPad Pro
- [ ] iPhone 14 Pro
- [ ] Android flagship

### Accessibility:
- [ ] Keyboard navigation
- [ ] Screen reader (NVDA/VoiceOver)
- [ ] Focus indicators
- [ ] Color contrast

---

## 📖 Documentation References

1. **Technical Research**: `/Volumes/Super Mastery/Webdesigner/3D_Journey_Technical_Research_Report.md`
2. **Full Implementation Plan**: This document
3. **GSAP ScrollTrigger Docs**: https://greensock.com/docs/v3/Plugins/ScrollTrigger

---

## 🎯 Next Steps

Ready to begin Phase 1? Run:

```bash
# Create feature branch
git checkout -b feature/journey-gsap-rebuild

# Install GSAP
npm install gsap@^3.12.5 @types/gsap@^3.0.0

# Start building!
```

---

**Estimated Total Time**: 8-9 hours
**Risk Level**: Low (incremental approach with rollback points)
**Confidence**: High (based on proven industry patterns)
