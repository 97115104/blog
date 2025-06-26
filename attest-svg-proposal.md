# Proposal: Add SVG Badge Support to attest.ink

## Problem
Currently, attest.ink only serves PNG badges. Many developers prefer SVG badges because they:
- Scale perfectly at any size (retina displays, zooming)
- Have smaller file sizes
- Can be styled with CSS
- Are the standard for documentation badges (shields.io, etc.)

## Proposed Solution
Add SVG endpoints alongside the existing PNG badges:

### URL Structure
```
# Current PNG endpoint:
https://attest.ink/badges/{platform}-{style}-{size}.png

# Proposed SVG endpoint:
https://attest.ink/badges/{platform}-{style}-{size}.svg
```

### Implementation Examples

1. **Claude Glass Medium Badge**
   - PNG: `https://attest.ink/badges/claude-glass-medium.png`
   - SVG: `https://attest.ink/badges/claude-glass-medium.svg`

2. **Human Generated Badge**
   - PNG: `https://attest.ink/badges/human-glass-medium.png`
   - SVG: `https://attest.ink/badges/human-glass-medium.svg`

### Example SVG Code
Here's an example of what the SVG badges could look like:

```svg
<svg width="120" height="32" viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
    <filter id="glass">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
      <feComposite in="blur" in2="SourceGraphic" operator="over" />
    </filter>
  </defs>
  
  <rect width="120" height="32" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(139,92,246,0.3)" stroke-width="1" filter="url(#glass)"/>
  <rect width="120" height="32" rx="6" fill="url(#gradient)" opacity="0.15"/>
  
  <!-- Icon and text here -->
</svg>
```

### Benefits for Users
1. **Better Quality**: SVGs remain crisp at any size
2. **Smaller Files**: ~2KB vs ~5-10KB for PNGs
3. **Customizable**: Users can modify colors via CSS
4. **Accessibility**: Better for screen readers with proper ARIA labels
5. **Industry Standard**: Most badge services offer SVG

### Implementation Suggestions
1. Generate SVGs server-side using a template system
2. Set proper MIME type: `Content-Type: image/svg+xml`
3. Add caching headers for performance
4. Consider adding a "Copy SVG URL" button in the badge generator

### Quick Win
Even just providing static SVG files for the most common badge combinations would help many users:
- `/badges/claude-glass-medium.svg`
- `/badges/chatgpt-glass-medium.svg`
- `/badges/human-glass-medium.svg`
- `/badges/ai-glass-medium.svg`

This would make attest.ink more developer-friendly and align with modern web standards!