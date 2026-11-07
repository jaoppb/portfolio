# Figma design foundations

Source of truth for the portfolio's visual design (issue #35, epic #34). Consumers: **#36** (page designs) reads the variables and components in Figma; **#37** (tokens in code) transcribes the names below into CSS custom properties / Tailwind `@theme`, including the font swap and the redesigned palette.

- **Figma file:** <https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio>
- **Pages:** `Foundations`, `Components`, `Contrast`.

> **Font choice: Inter + JetBrains Mono** (picked by the owner; both SIL OFL 1.1). The text styles and the `font/sans` / `font/mono` variables hold them. Switching later means changing the two string values in the `Type` collection. Loading in code (#37): `next/font/google` (`Inter`, `JetBrains_Mono`), self-hosted at build time and compatible with `output: 'export'`. The previous Adwaita Sans / Mono fonts (`apps/web/src/app/fonts.ts`) are **not** carried over; #37 replaces them.

## Naming rules (stable contract)

- Variable names are slash-separated and lowercase. The CSS custom property for every variable is listed in the table below and is also stored as each variable's WEB code syntax in Figma.

| Figma variable | CSS custom property |
|---|---|
| `<primitive>` e.g. `neutral/50`, `white` | `--neutral-50`, `--white` |
| `color/<role>` | `--color-<role>` |
| `font/sans`, `font/mono` | `--font-sans`, `--font-mono` |
| `size/<step>` | `--text-<step>` |
| (weight, per text style) | not tokenised; use font-weight utilities, or `--text-<step>--font-weight` if #37 wants it |
| `line-height/<step>` | `--text-<step>--line-height` (Figma stores px; emit as rem or a unitless ratio, consistently) |
| `space/<n>` | `--spacing-<n>` (Tailwind's own `--spacing` is a single 4px multiplier; recommendation for #37: rely on it and treat `space/*` as documentation, to avoid two sources of truth) |
| `radius/<name>` | `--radius-<name>` (`xs`/`sm`/`md`/`lg` override the Tailwind v4 defaults of the same name with identical values; `none`/`full` are new keys) |
| `duration/<name>` | `--duration-<name>` (custom, not a Tailwind theme namespace) |

Tracking is stored in the text styles as a percentage of the font size; in CSS use `em` (-1% = `-0.01em`, `--text-<step>--letter-spacing` in `@theme`). Light/Dark delivery in code is #37's call; the current `globals.css` approach (raw `--*` properties redefined under `@media (prefers-color-scheme: dark)`, aliased into `@theme`) keeps working with these names.
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

The primitive hex values below are the single source for every colour in this document. #37 emits only the primitives referenced by the Color mapping (not whole ramps). Only the steps referenced by the semantic mapping are used by components; the rest of each ramp is reserved for future hover/pressed states and must not be used directly.

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
| `color/border` | `neutral/200` (#E0E3E9) | `neutral/700` (#363C4A) | `--color-border` |
| `color/border-strong` | `neutral/500` (#6F7686) | `neutral/500` (#6F7686) | `--color-border-strong` |
| `color/accent` | `blue/700` (#1B4BB5) | `blue/300` (#93BBFD) | `--color-accent` |
| `color/accent-foreground` | `white` (#FFFFFF) | `neutral/950` (#0C0E13) | `--color-accent-foreground` |
| `color/focus-ring` | `blue/600` (#2360DB) | `blue/400` (#6199F9) | `--color-focus-ring` |
| `color/destructive` | `red/700` (#B42318) | `red/300` (#FF9E94) | `--color-destructive` |

Roles (hover fills must be perceptibly different from the default fill, not WCAG-mandated: Light steps are deliberately subtle, e.g. ghost/outline hover `muted-bg` on `background` is 1.07:1, secondary hover `border` on `muted-bg` is 1.13:1; Dark `border` is `neutral/700` and not `muted-bg`'s `neutral/800` so the hover and card hairline stay visible. Secondary and ghost buttons have no border and are identified by their label text, which is compliant with WCAG 1.4.11; only the outline button needs the 3:1 `border-strong`): `background` page, `surface` cards/raised areas, `foreground` primary text, `muted` secondary text, `muted-bg` subtle fills/code blocks, `border` decorative hairline, `border-strong` interactive control outline (3:1), `accent` single accent (links, primary fill), `accent-foreground` text on accent, `focus-ring` focus outline, `destructive` error/critical.

Mapping to the current `globals.css` tokens: `background`, `foreground`, `muted`, `muted-bg`, `border`, `accent`, `accent-foreground` keep their names; **values change** (the palette is redesigned). New: `surface`, `border-strong`, `focus-ring`, `destructive`.

Changes #37 must apply to the existing components: the outline button border moves from `border-border` (decorative, 1.21:1) to `border-strong`; focus rings move from `ring-foreground` to `ring-focus-ring` with `ring-offset-2` in `color/background` on every control, including the language switcher and skip link, which currently have no offset (it is essential on accent fills, where the ring against the fill is only about 1.4:1); `button.test.tsx` asserts `border-border` on the outline button and must be updated; the language switcher's active weight moves from `font-semibold` to Medium and its paddings (`px-1.5 py-0.5`) to `space/2` and `space/1`; transitions move from `duration-150 ease-out` to `duration/base` with the easing below; the skip link keeps `rounded-md` (6px); `system-status.tsx` uses `bg-emerald-500`, a colour with no role in this palette (no `success` role is defined, to keep a single accent): #37 should render that status as a `Tag`/text using existing roles.

### Type

`font/sans` = `Inter` and `font/mono` = `JetBrains Mono`. Steps are Tailwind-aligned except `2xs` (11px), which is custom and already exists in `globals.css`; `base` body copy is line-height 24 / size 16 = 1.5 (`leading-normal`), a deliberate deviation from the skill's `leading-relaxed` for denser content (#37 should reconcile the skill text or approve it); WEB syntax is `var(--text-<step>)` / `var(--text-<step>--line-height)`.

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

Text styles: `text/<step>` (sans, all steps) and `text/mono/{2xs,xs,sm,base}` (mono, Regular, tracking 0). Styles bind `fontFamily`, `fontSize` and `lineHeight` to the variables. Only the weights Regular, Medium and Bold are used (code's `font-semibold` becomes Medium or Bold), so a font swap never needs a missing style name. Components that need a medium weight on a Regular style (button labels, links) override the weight on the text node. Use tabular figures (`font-variant-numeric: tabular-nums`) for numbers, dates and metrics (not representable in Figma styles). Body measure: 55-75 characters.

### Spacing (4px base)

`space/0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24` = `n x 4` px (`space/6` = 24px). The scale is deliberately sparse (no 7, 9, 11, 13-15, 17-19, 21-23); the 8px rhythm uses the even steps. WEB: `var(--spacing-<n>)`.

### Radius

`radius/none` 0, `radius/xs` 2, `radius/sm` 4, `radius/md` 6, `radius/lg` 8, `radius/full` 9999. These deliberately equal Tailwind v4's default `--radius-*` values, so existing `rounded-sm` (button), `rounded` (language switcher) and `rounded-md` (skip link) keep rendering the same. Default for controls is `radius/sm`. No pills (`radius/full` only for circular elements).

### Motion

| Variable | `Standard` | `Reduced` |
|---|---|---|
| `duration/fast` | 100 ms | 0 |
| `duration/base` | 160 ms | 0 |
| `duration/slow` | 250 ms | 0 |

Easing (not a Figma variable; name it `--ease-standard` in CSS): `cubic-bezier(0.16, 1, 0.3, 1)`. The `Reduced` mode is the `prefers-reduced-motion: reduce` equivalent: jump to the end state (duration 0; a subtle crossfade is the only allowed alternative and is not designed here). In code: redefine `--duration-*` to `0ms` under `@media (prefers-reduced-motion: reduce)`; `duration/<name>` has no generated Tailwind utility, so use `duration-(--duration-base)` or plain CSS. Motion only on hover, focus-visible and active; no continuous animation.

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

Focus state: 2px `color/focus-ring` outline outside the element (drawn tight in Figma; implement as `ring-2` + `ring-offset-2` in `color/background`, always). Links are always underlined (WCAG 1.4.1: `accent` vs `foreground` is only 2.5:1 light / 1.8:1 dark, so colour alone does not identify a link); hover switches the colour to `foreground`. Active (pressed) is intentionally the same as hover (no separate variant); Disabled: 50% opacity (exempt from contrast requirements per WCAG 1.4.3; it is the only intentional low-contrast state, the label must stay legible and disabled must never be the sole carrier of information). A `Dark preview` frame on the page shows instances in Dark mode.

### Component to colour role

| Component | Fill | Text | Border / ring |
|---|---|---|---|
| Button primary | `accent` (hover: 90% opacity) | `accent-foreground` | focus: `focus-ring` |
| Button secondary | `muted-bg` (hover: `border`) | `foreground` | focus: `focus-ring` |
| Button outline | none (hover: `muted-bg`) | `foreground` | `border-strong`, focus: `focus-ring` |
| Button ghost | none (hover: `muted-bg`) | `foreground` | focus: `focus-ring` |
| Link | none | `accent` (hover: `foreground`), underlined | focus: `focus-ring` |
| Tag (11px mono, intentional: all tones pass AA, most AAA) | none | tone: `muted` / `accent` / `destructive` | 1px, same colour as the text |
| Card | `surface` | title `foreground`, body and meta `muted` | `border` (hover: `border-strong`) |
| Language switcher | active: `accent` | active: `accent-foreground`; inactive: `muted` (hover: `foreground`) | focus: `focus-ring` |
| Skip link | `accent` | `accent-foreground` | `focus-ring` |

## Contrast (WCAG 2.x)

Ratios are computed from the hex values above with the WCAG relative-luminance formula, not estimated. Targets: primary text AAA (7:1), other text AA (4.5:1), UI components and the focus ring 3:1. `color/border` is a decorative hairline and exempt. UI rows report `pass` (WCAG 1.4.11 has no AAA level). Both tables (main and additional pairings) are on the Figma `Contrast` page; the `accent` UI rows repeat the text rows' values and are kept only because the UI threshold is different.

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
| Light | `color/border-strong` on `color/background` | ui | 4.29:1 | 3 | pass |
| Light | `color/border-strong` on `color/surface` | ui | 4.55:1 | 3 | pass |
| Light | `color/focus-ring` on `color/background` | ui | 5.25:1 | 3 | pass |
| Light | `color/focus-ring` on `color/surface` | ui | 5.57:1 | 3 | pass |
| Light | `color/accent` on `color/background` | ui | 7.26:1 | 3 | pass |
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
| Dark | `color/border-strong` on `color/background` | ui | 4.24:1 | 3 | pass |
| Dark | `color/border-strong` on `color/surface` | ui | 3.83:1 | 3 | pass |
| Dark | `color/focus-ring` on `color/background` | ui | 6.83:1 | 3 | pass |
| Dark | `color/focus-ring` on `color/surface` | ui | 6.17:1 | 3 | pass |
| Dark | `color/accent` on `color/background` | ui | 9.9:1 | 3 | pass |
| Dark | `color/border` on `color/background` | decor | 1.75:1 | — | n/a |

Additional pairings (component states):

| Mode | Pair | Kind | Ratio | Needs | Result |
|---|---|---|---|---|---|
| Light | `color/foreground` on `color/border` | text | 15.01:1 | 4.5 | AAA |
| Light | `color/focus-ring` on `color/muted-bg` | ui | 4.89:1 | 3 | pass |
| Light | `color/border-strong` on `color/muted-bg` | ui | 3.99:1 | 3 | pass |
| Light | `color/destructive` on `color/muted-bg` | text | 5.76:1 | 4.5 | AA |
| Light | `color/border` on `color/surface` | decor | 1.29:1 | — | n/a |
| Light | `color/accent-foreground` at 90% opacity on `color/accent` at 90% opacity | text | 6.15:1 | 4.5 | AA |
| Dark | `color/foreground` on `color/border` | text | 10.39:1 | 4.5 | AAA |
| Dark | `color/focus-ring` on `color/muted-bg` | ui | 5.16:1 | 3 | pass |
| Dark | `color/border-strong` on `color/muted-bg` | ui | 3.2:1 | 3 | pass |
| Dark | `color/destructive` on `color/muted-bg` | text | 7.33:1 | 4.5 | AAA |
| Dark | `color/border` on `color/surface` | decor | 1.58:1 | — | n/a |
| Dark | `color/accent-foreground` at 90% opacity on `color/accent` at 90% opacity | text | 8.19:1 | 4.5 | AAA |

## Checks before editing

Contrast ratio = (L1 + 0.05) / (L2 + 0.05), with L the WCAG relative luminance of the sRGB hex value (linearised channels, weights 0.2126 / 0.7152 / 0.0722), L1 the lighter colour. For the 90% opacity pairing, blend each colour over `color/background` first. The Primitives table above is the only input; the hex in parentheses elsewhere is a copy. Re-run the computation whenever a Primitive or a semantic alias changes; every `text` row must stay >= 4.5:1 (primary text >= 7:1) and every `ui` row >= 3:1.
