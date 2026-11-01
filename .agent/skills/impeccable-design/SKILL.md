---
name: impeccable-design
description: "Frontend design director principles for João Pedro's portfolio. Guides visual hierarchy, typography, color systems, micro-motion, accessibility, and strict anti-slop rules. Trigger before proposing, writing, or reviewing UI, layout, styling, and animations."
---

# Impeccable Design: Frontend Design Director Principles

This skill defines the visual identity, craft standards, and design director guidelines for João Pedro's personal portfolio website and project showcase. It ensures every visual element feels intentional, engineered, and distinct—actively rejecting generic "AI slop".

## 1. Aesthetic Philosophy: Craft, Intentionality & Restraint

The portfolio reflects the work of a discerning software engineer. It prioritizes clarity, content density, and typographic discipline over superficial embellishment.

- **Editorial restraint**: Every border, line, color, and spacing increment must have a functional or semantic reason to exist. If an element does not clarify structure or aid comprehension, remove it.
- **Content-first structure**: The code showcases, technical writing, and projects are the hero. The design provides a quiet, high-precision frame for that work.
- **Tactile precision**: Interactions should feel crisp, responsive, and grounded in physical UI metaphors without feeling heavy or skeuomorphic.

---

## 2. Core Principles

### Typography & Hierarchy
- **Type scale**: Use a disciplined, proportional typographic scale. Avoid arbitrary font sizes.
- **Headings**: Headings should be tight (`tracking-tight` or `tracking-tighter`), confident, and distinctly weighted. Keep line height snug on large titles (`leading-tight` or `leading-none`).
- **Body copy**: Prioritize readability with comfortable measure (55–75 characters per line), balanced line height (`leading-relaxed`), and legible font sizes (`text-base` or `text-sm` for dense metadata).
- **Tabular figures**: Use `font-variant-numeric: tabular-nums` (or `tabular-nums` in Tailwind) for numbers, dates, timestamps, git commits, and benchmark metrics to prevent jitter and maintain alignment.
- **No font cacophony**: Limit font families to a maximum of two (a refined sans-serif for UI/body and an intentional monospace for code/metrics).

### Color & Contrast
- **Semantic tokens**: Use functional color tokens (background, foreground, muted, accent, border, destructive) rather than raw arbitrary hex codes.
- **High contrast baseline**: Text must strictly meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text) and strive for WCAG AAA (7:1) for primary content.
- **Neutral palette discipline**: Avoid muddy grays. Use warm, cool, or neutral undertones consistently. Avoid low-contrast washed-out text (e.g., `#888` on `#111`).
- **Single intentional accent**: Reserve accent colors for primary interactive targets, focus indicators, and meaningful state changes. Do not scatter secondary and tertiary vibrant colors across decorative backgrounds.

### Motion & Micro-interactions
- **Purpose-driven motion**: Animations exist solely to indicate state transitions, spatial relationships, or direct feedback from user action. Never use motion purely for visual distraction.
- **Snappy duration & spring physics**: Keep micro-interactions fast (100ms–250ms). Use natural easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`) or light spring transitions instead of linear or sluggish curves.
- **Mandatory reduced motion**: Every animated element must respect user accessibility settings via `@media (prefers-reduced-motion: reduce)` (Tailwind `motion-reduce:*`). When reduced motion is preferred, transitions must immediately jump to their end state or use a subtle crossfade.

### Layout, Spacing & Spatial Rhythm
- **Rhythm & grid**: Maintain a consistent 4px/8px spatial rhythm. Margins, padding, and gap sizes should derive from a uniform scale.
- **Zero horizontal scroll**: Layouts must be completely responsive across all viewports (from 320px mobile to 4K ultra-wide). Test and prevent overflow clipping or unintentional horizontal scrollbars.
- **Intentional whitespace**: Whitespace is an active structural element, not empty space waiting to be filled. Let sections breathe with generous padding between unrelated contexts.

---

## 3. Explicit Anti-Slop Rules (What to Avoid)

AI-generated web interfaces commonly suffer from repetitive visual clichés. The following tropes are strictly forbidden in this codebase:

1. **NO Gratuitous Neon & Purple Gradients**:
   - *Forbidden*: Vibrant purple-to-cyan or pink-to-indigo gradient text, borders, or glowing background blurs without semantic meaning.
   - *Instead*: Solid, high-contrast foreground typography and subtle, restrained borders.

2. **NO Ubiquitous Floating Glassmorphism**:
   - *Forbidden*: Applying `backdrop-blur` and semi-transparent white/black borders to every card, list item, or container.
   - *Instead*: Crisp solid surface colors with subtle 1px border separation (`border-neutral-200` / `border-neutral-800`). Reserve backdrop blur exclusively for fixed sticky headers or overlays.

3. **NO Pill-Badge Overload**:
   - *Forbidden*: Wrapping every word, technology name, or status in rounded pill badges (`rounded-full px-3 py-1 bg-neutral-100`).
   - *Instead*: Clean typographic lists, tabular metadata, or subtle bulleted lines. Badges are reserved exclusively for critical status tags (e.g., release status, git tags).

4. **NO Low-Contrast Washed-Out Text**:
   - *Forbidden*: Muted secondary text that fades into the background or fails accessibility contrast checks.
   - *Instead*: Legible secondary typography that remains clearly readable under various display calibrations.

5. **NO Unmotivated Continuous Motion**:
   - *Forbidden*: Infinite spinning borders, floating elements bobbing up and down, or shimmering skeleton animations running indefinitely.
   - *Instead*: Static, stable components that animate only upon deliberate user interaction (hover, active, focus).

---

## 4. Design Review Checklist

Before finalizing any UI, component, or layout turn, verify:
- [ ] Typography follows a clear hierarchy with proper leading and tracking.
- [ ] Numbers, dates, and metrics use tabular numerals.
- [ ] Color contrast passes WCAG AA guidelines for both light and dark themes.
- [ ] All interactive states (hover, focus-visible, active) are explicitly styled with accessible focus rings.
- [ ] All transitions respect `prefers-reduced-motion`.
- [ ] The layout does not cause horizontal scrolling on narrow viewports (320px–375px).
- [ ] No forbidden AI-slop tropes (neon gradient text, unnecessary glassmorphism, pill clutter) are present.
