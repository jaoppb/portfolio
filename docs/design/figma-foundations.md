# Figma design foundations

Source of truth for the portfolio's visual design (issue #35, epic #34). Consumers: **#36** (page designs) reads the variables and components in Figma; **#37** (tokens in code) transcribes the names below into CSS custom properties / Tailwind `@theme`, including the font swap and the redesigned palette.

- **Figma file:** <https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio>
- **Font comparison board:** <https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=4-303> (page `Fonts`; chosen pair marked)
- **Pages:** `Foundations`, `Fonts`, `Components`, `Contrast`.

> **Font choice: Inter + JetBrains Mono** (picked by the owner on the font board; both SIL OFL 1.1). The text styles and the `font/sans` / `font/mono` variables hold them. IBM Plex and Geist remain on the board as the compared alternatives; switching later means changing the two string values in the `Type` collection. Loading in code (#37): `next/font/google` (`Inter`, `JetBrains_Mono`), self-hosted at build time and compatible with `output: 'export'`. The previous Adwaita Sans / Mono fonts (`apps/web/src/app/fonts.ts`) are **not** carried over; #37 replaces them.

## Naming rules (stable contract)

- Variable names are slash-separated and lowercase. The CSS name is derived mechanically and is also stored in each variable's WEB code syntax in Figma.
- Components bind **only** to semantic variables (`Color`, `Type`, `Spacing`, `Radius`, `Motion`), never to `Primitives`.
- Do not rename a variable once #36/#37 consume it; add new names instead.

## Collections

| Collection | Modes | Variables |
|---|---|---|
| `Primitives` | `Value` | `white`, `neutral/50..950`, `blue/50..950`, `red/300`, `red/700` (scopes hidden) |
| `Color` | `Light`, `Dark` | `color/<role>`, aliases to Primitives |
| `Type` | `Value` | `font/sans`, `font/mono`, `size/<step>`, `line-height/<step>` |
| `Spacing` | `Value` | `space/<n>` |
| `Radius` | `Value` | `radius/<name>` |
| `Motion` | `Standard`, `Reduced` | `duration/fast`, `duration/base`, `duration/slow` |

### Primitives (hex)

| Figma name | Hex | WEB syntax |
|---|---|---|
| `white` | `#FFFFFF` | `--white` |
| `neutral/50` | `#F7F8FA` | `--neutral-50` |
| `neutral/100` | `#EEF0F4` | `--neutral-100` |
| `neutral/200` | `#E0E3E9` | `--neutral-200` |
| `neutral/300` | `#C5CAD3` | `--neutral-300` |
| `neutral/400` | `#9CA3B0` | `--neutral-400` |
| `neutral/500` | `#6F7686` | `--neutral-500` |
| `neutral/600` | `#4D5465` | `--neutral-600` |
| `neutral/700` | `#363C4A` | `--neutral-700` |
| `neutral/800` | `#242934` | `--neutral-800` |
| `neutral/900` | `#161A22` | `--neutral-900` |
| `neutral/950` | `#0C0E13` | `--neutral-950` |
| `blue/50` | `#EFF5FF` | `--blue-50` |
| `blue/100` | `#DBE8FE` | `--blue-100` |
| `blue/200` | `#BFD6FE` | `--blue-200` |
| `blue/300` | `#93BBFD` | `--blue-300` |
| `blue/400` | `#6199F9` | `--blue-400` |
| `blue/500` | `#3B7BF2` | `--blue-500` |
| `blue/600` | `#2360DB` | `--blue-600` |
| `blue/700` | `#1B4BB5` | `--blue-700` |
| `blue/800` | `#1A3F8F` | `--blue-800` |
| `blue/900` | `#1B376F` | `--blue-900` |
| `blue/950` | `#12234A` | `--blue-950` |
| `red/300` | `#FF9E94` | `--red-300` |
| `red/700` | `#B42318` | `--red-700` |

### Color (semantic, per mode)

| Figma name | Light | Dark | WEB syntax |
|---|---|---|---|
| `color/background` | `neutral/50` (#F7F8FA) | `neutral/950` (#0C0E13) | `--color-background` |
| `color/surface` | `white` (#FFFFFF) | `neutral/900` (#161A22) | `--color-surface` |
| `color/foreground` | `neutral/950` (#0C0E13) | `neutral/50` (#F7F8FA) | `--color-foreground` |
| `color/muted` | `neutral/600` (#4D5465) | `neutral/300` (#C5CAD3) | `--color-muted` |
| `color/muted-bg` | `neutral/100` (#EEF0F4) | `neutral/800` (#242934) | `--color-muted-bg` |
| `color/border` | `neutral/200` (#E0E3E9) | `neutral/800` (#242934) | `--color-border` |
| `color/border-strong` | `neutral/500` (#6F7686) | `neutral/500` (#6F7686) | `--color-border-strong` |
| `color/accent` | `blue/700` (#1B4BB5) | `blue/300` (#93BBFD) | `--color-accent` |
| `color/accent-foreground` | `white` (#FFFFFF) | `neutral/950` (#0C0E13) | `--color-accent-foreground` |
| `color/focus-ring` | `blue/600` (#2360DB) | `blue/400` (#6199F9) | `--color-focus-ring` |
| `color/destructive` | `red/700` (#B42318) | `red/300` (#FF9E94) | `--color-destructive` |

Roles: `background` page, `surface` cards/raised areas, `foreground` primary text, `muted` secondary text, `muted-bg` subtle fills/code blocks, `border` decorative hairline, `border-strong` interactive control outline (3:1), `accent` single accent (links, primary fill), `accent-foreground` text on accent, `focus-ring` focus outline, `destructive` error/critical.

Mapping to the current `globals.css` tokens: `background`, `foreground`, `muted`, `muted-bg`, `border`, `accent`, `accent-foreground` keep their names; **values change** (the palette is redesigned). New: `surface`, `border-strong`, `focus-ring`, `destructive`.

### Type

`font/sans` = `Inter` and `font/mono` = `JetBrains Mono`. Steps are Tailwind-aligned; WEB syntax is `var(--text-<step>)` / `var(--text-<step>--line-height)`.

| Step | `size/*` px | `line-height/*` px | Tracking | Weight in text style |
|---|---|---|---|---|
| `2xs` | 11 | 16 | 0 | Regular |
| `xs` | 12 | 16 | 0 | Regular |
| `sm` | 14 | 20 | 0 | Regular |
| `base` | 16 | 24 | 0 | Regular |
| `lg` | 18 | 28 | -1% | Medium |
| `xl` | 20 | 28 | -1.5% | Medium |
| `2xl` | 24 | 32 | -2% | Bold |
| `3xl` | 30 | 36 | -2.5% | Bold |
| `4xl` | 36 | 40 | -2.5% | Bold |
| `5xl` | 48 | 48 | -3% | Bold |

Text styles: `text/<step>` (sans, all steps) and `text/mono/{2xs,xs,sm,base}` (mono, Regular, tracking 0). Styles bind `fontFamily`, `fontSize` and `lineHeight` to the variables. Only the weights Regular, Medium and Bold are used, so a font swap never needs a missing style name. Components that need a medium weight on a Regular style (button labels, links) override the weight on the text node. Use tabular figures (`font-variant-numeric: tabular-nums`) for numbers, dates and metrics (not representable in Figma styles). Body measure: 55-75 characters.

### Spacing (4px base)

`space/0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24` = `n x 4` px (`space/6` = 24px). WEB: `var(--spacing-<n>)`.

### Radius

`radius/none` 0, `radius/sm` 2, `radius/md` 4, `radius/lg` 8, `radius/full` 9999. Default for controls is `radius/sm`. No pills (`radius/full` only for circular elements).

### Motion

| Variable | `Standard` | `Reduced` |
|---|---|---|
| `duration/fast` | 100 ms | 0 |
| `duration/base` | 160 ms | 0 |
| `duration/slow` | 250 ms | 0 |

Easing (not a Figma variable): `cubic-bezier(0.16, 1, 0.3, 1)`. The `Reduced` mode is the `prefers-reduced-motion: reduce` equivalent: jump to the end state (or a subtle crossfade). Motion only on hover, focus-visible and active; no continuous animation.

## Components (page `Components`)

All bind fills, strokes, padding and radius to variables and text to text styles.

| Figma component | Variants | Code counterpart |
|---|---|---|
| `Button` | `Variant` = primary / secondary / outline / ghost x `State` = default / hover / focus / disabled (size md) | `components/ui/button.tsx` |
| `Button / Size` | `Size` = sm (32px) / md (40px) / lg (48px), primary | `components/ui/button.tsx` |
| `Link` | `State` = default / hover / focus | new |
| `Tag` | `Tone` = neutral / accent / destructive (outline, mono, no pill; critical status and git tags only) | new |
| `Card` | `State` = default / hover | new |
| `Language switcher` | `Active` = EN / PT | `components/ui/language-switcher.tsx` |
| `Skip link` | `State` = Focused (hidden until keyboard focus) | `components/ui/skip-link.tsx` |

Focus state: 2px `color/focus-ring` outline outside the element. Disabled: 50% opacity (exempt from contrast requirements per WCAG 1.4.3). A `Dark preview` frame on the page shows instances in Dark mode.

## Contrast (WCAG 2.x)

Ratios are computed from the hex values above with the WCAG relative-luminance formula, not estimated. Targets: primary text AAA (7:1), other text AA (4.5:1), UI components and the focus ring 3:1. `color/border` is a decorative hairline and exempt. The same table is on the Figma `Contrast` page.

| Mode | Pair | Kind | Ratio | Needs | Result |
|---|---|---|---|---|---|
| Light | `color/foreground` on `color/background` | text | 18.17:1 | 7 | AAA |
| Light | `color/foreground` on `color/surface` | text | 19.3:1 | 7 | AAA |
| Light | `color/foreground` on `color/muted-bg` | text | 16.92:1 | 7 | AAA |
| Light | `color/muted` on `color/background` | text | 7.13:1 | 4.5 | AAA |
| Light | `color/muted` on `color/surface` | text | 7.58:1 | 4.5 | AAA |
| Light | `color/muted` on `color/muted-bg` | text | 6.64:1 | 4.5 | AA |
| Light | `color/accent` on `color/background` | text | 7.26:1 | 4.5 | AAA |
| Light | `color/accent` on `color/surface` | text | 7.72:1 | 4.5 | AAA |
| Light | `color/accent` on `color/muted-bg` | text | 6.77:1 | 4.5 | AA |
| Light | `color/accent-foreground` on `color/accent` | text | 7.72:1 | 4.5 | AAA |
| Light | `color/destructive` on `color/background` | text | 6.19:1 | 4.5 | AA |
| Light | `color/destructive` on `color/surface` | text | 6.57:1 | 4.5 | AA |
| Light | `color/border-strong` on `color/background` | ui | 4.29:1 | 3 | AA |
| Light | `color/border-strong` on `color/surface` | ui | 4.55:1 | 3 | AA |
| Light | `color/focus-ring` on `color/background` | ui | 5.25:1 | 3 | AA |
| Light | `color/focus-ring` on `color/surface` | ui | 5.57:1 | 3 | AA |
| Light | `color/accent` on `color/background` | ui | 7.26:1 | 3 | AA |
| Light | `color/border` on `color/background` | decor | 1.21:1 | — | n/a |
| Dark | `color/foreground` on `color/background` | text | 18.17:1 | 7 | AAA |
| Dark | `color/foreground` on `color/surface` | text | 16.4:1 | 7 | AAA |
| Dark | `color/foreground` on `color/muted-bg` | text | 13.71:1 | 7 | AAA |
| Dark | `color/muted` on `color/background` | text | 11.73:1 | 4.5 | AAA |
| Dark | `color/muted` on `color/surface` | text | 10.59:1 | 4.5 | AAA |
| Dark | `color/muted` on `color/muted-bg` | text | 8.85:1 | 4.5 | AAA |
| Dark | `color/accent` on `color/background` | text | 9.9:1 | 4.5 | AAA |
| Dark | `color/accent` on `color/surface` | text | 8.94:1 | 4.5 | AAA |
| Dark | `color/accent` on `color/muted-bg` | text | 7.47:1 | 4.5 | AAA |
| Dark | `color/accent-foreground` on `color/accent` | text | 9.9:1 | 4.5 | AAA |
| Dark | `color/destructive` on `color/background` | text | 9.72:1 | 4.5 | AAA |
| Dark | `color/destructive` on `color/surface` | text | 8.77:1 | 4.5 | AAA |
| Dark | `color/border-strong` on `color/background` | ui | 4.24:1 | 3 | AA |
| Dark | `color/border-strong` on `color/surface` | ui | 3.83:1 | 3 | AA |
| Dark | `color/focus-ring` on `color/background` | ui | 6.83:1 | 3 | AA |
| Dark | `color/focus-ring` on `color/surface` | ui | 6.17:1 | 3 | AA |
| Dark | `color/accent` on `color/background` | ui | 9.9:1 | 3 | AA |
| Dark | `color/border` on `color/background` | decor | 1.33:1 | — | n/a |

## Checks before editing

Re-run the contrast computation whenever a Primitive or a semantic alias changes; every `text` row must stay >= 4.5:1 (primary text >= 7:1) and every `ui` row >= 3:1.
