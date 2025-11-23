# Dynamic Island Music Player - Usage Guide

## Overview

The Dynamic Island Music Player is a draggable, iPhone-style music control component that provides an elegant way to control background audio on your website.

**File Location:** `/Volumes/Super Mastery/Webdesigner/components/dynamic-island-music.tsx`

## Features

### Core Functionality
- **Draggable**: Move the player anywhere on screen using mouse or touch
- **Play/Pause Control**: Working audio control with proper state synchronization
- **Expandable View**: Click to expand for full controls and visualization
- **Auto-Looping**: Background music loops automatically
- **Visual Feedback**: Animated waveform visualization when playing

### Technical Details
- Built with **Framer Motion** for smooth drag interactions
- **TypeScript** for type safety
- **Touch and Mouse** support (works on mobile and desktop)
- **Accessible** with proper ARIA labels
- **Performance Optimized** with proper event cleanup

## Recent Fixes (2025-11-22)

### 1. Fixed Pause Button
**Issue**: Audio wouldn't stop when clicking pause button

**Solution**:
- Added event listeners to sync React state with HTML Audio element
- Changed from `isPlaying` check to `audioRef.current.paused` check
- Added proper event cleanup in useEffect

```typescript
// Before: State could be out of sync
if (isPlaying) {
  audioRef.current.pause()
}

// After: Check actual audio state
if (audioRef.current.paused) {
  await audioRef.current.play()
} else {
  audioRef.current.pause()
}
```

### 2. Made Component Draggable
**Implementation**: Used Framer Motion's drag functionality

**Key Features**:
- `drag` prop enables dragging
- `dragConstraints` keeps it within viewport bounds
- `dragMomentum={false}` prevents sliding after release
- `isDragging` state prevents click events during drag
- Visual cursor changes (`cursor-grab` / `cursor-grabbing`)
- Drag handle indicator (grip icon)

```typescript
<motion.div
  drag
  dragMomentum={false}
  dragElastic={0.1}
  dragConstraints={{
    top: 0,
    left: -window.innerWidth / 2 + (isExpanded ? 160 : 80),
    right: window.innerWidth / 2 - (isExpanded ? 160 : 80),
    bottom: window.innerHeight - (isExpanded ? 128 : 48) - 24,
  }}
  onDragStart={() => setIsDragging(true)}
  onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
>
```

## Usage

### Basic Implementation

```tsx
import { DynamicIslandMusic } from '@/components/dynamic-island-music'

export default function Page() {
  return (
    <main>
      <DynamicIslandMusic />
      {/* Your page content */}
    </main>
  )
}
```

### Audio File Requirement

Place your audio file at: `/public/audio/dakhabrakha-sonnet.mp3`

Or modify the component to use your own audio:

```typescript
// Line 27 in dynamic-island-music.tsx
audioRef.current = new Audio('/audio/your-audio-file.mp3')
```

## Interaction Flow

1. **Initial State**: Shows "Set the Vibe" prompt
2. **First Click**: Starts playing music
3. **Subsequent Clicks**: Toggles between collapsed/expanded view
4. **Drag**: Move the player anywhere on screen
5. **Pause Button** (in expanded view): Stops/starts audio
6. **Click Outside** (when expanded): Collapses back to pill shape

## Styling

### Design Tokens
- **Background**: Black gradient with blur (`rgba(0, 0, 0, 0.95)`)
- **Accent Color**: Amber/Orange gradient (`#F59E0B` to `#FB923C`)
- **Border Radius**:
  - Collapsed: `rounded-full` (9999px)
  - Expanded: `rounded-3xl` (24px)
- **Dimensions**:
  - Collapsed: 160px × 48px
  - Expanded: 320px × 128px

### Animations
- **Waveform**: Pulse animation with staggered delays
- **Glow Effect**: Radial gradient blur when playing
- **Hover**: Subtle scale (1.02)
- **Tap**: Scale down (0.98)
- **Expansion**: 500ms ease-out transition

## Accessibility

- **Keyboard Navigation**: Full support (coming soon)
- **ARIA Labels**: Proper labels on play/pause button
- **Screen Reader**: Announces current state
- **Touch Targets**: 48px minimum (WCAG compliant)

## Mobile Optimization

- **Touch Events**: Native touch support via Framer Motion
- **Responsive Design**: Works on all screen sizes
- **Touch Action**: `touchAction: 'none'` prevents scroll conflicts
- **Drag Constraints**: Adapts to viewport size

## Performance Considerations

1. **Event Cleanup**: Audio element properly cleaned up on unmount
2. **Drag Optimization**: `dragMomentum={false}` reduces calculations
3. **Pointer Events**: `pointer-events-none` on non-interactive elements
4. **Animation**: CSS transforms for 60fps performance

## Troubleshooting

### Audio Won't Play
- Check audio file exists at `/public/audio/dakhabrakha-sonnet.mp3`
- Check browser autoplay policies (requires user interaction)
- Check console for error messages

### Can't Drag on Mobile
- Ensure `touchAction: 'none'` is present
- Check for conflicting touch event handlers
- Verify Framer Motion is installed (`npm list framer-motion`)

### Drag Goes Outside Screen
- Constraints are calculated based on `window.innerWidth/Height`
- Ensure component renders after window is defined (client-side only)
- Check that `'use client'` directive is at top of file

## Future Enhancements

- [ ] Volume control slider
- [ ] Track scrubbing/seeking
- [ ] Playlist support
- [ ] Persist position to localStorage
- [ ] Minimize/maximize animations
- [ ] Keyboard shortcuts (Space for play/pause)
- [ ] Multiple song support
- [ ] Audio fade in/out

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Mobile**: iOS Safari, Chrome Android

## Dependencies

```json
{
  "framer-motion": "^12.23.24",
  "lucide-react": "^0.468.0",
  "react": "^19.0.0"
}
```

## Example Customization

### Change Colors

```typescript
// Amber to Purple gradient
className="from-purple-500 to-pink-500"
```

### Adjust Volume

```typescript
// Line 29
audioRef.current.volume = 0.3 // 30% volume
```

### Change Initial Position

```typescript
// Line 100
initial={{ x: 0, y: 24 }} // Top left instead of center
```

## Credits

- **Design Inspiration**: Apple Dynamic Island (iPhone 14 Pro+)
- **Music**: DakhaBrakha - Sonnet (Pluribus Edit)
- **Animation Library**: Framer Motion
- **Icons**: Lucide React

---

**Last Updated**: November 22, 2025
**Maintained By**: Visual Designer (Agent 3)
