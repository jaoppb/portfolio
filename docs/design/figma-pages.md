# Figma page designs

Design record of the portfolio's pages and sections (issue #36, epic #34). **#38** (shell), **#39** (hero and about), **#40** (projects), **#41** (experience and skills), **#42** (contact) and **#44** (404) were implemented from the frames below; since the launch content shipped, the frames follow the code, and the code wins where they disagree. Variables, text styles and base components come from [figma-foundations.md](figma-foundations.md); no token was added. **#67** synced every frame with the shipped en and pt content (see [Content sync](#content-sync-67)).

- **Figma file:** <https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio>
- **Pages added:** `Pages` (page components plus every full-page frame) and `Annotations` (interactive states and rules). Existing pages: `Foundations`, `Components`, `Contrast`.
- **Verified against Figma on 2026-11-13** (all node ids in this document resolved by script after the last edit; #67 kept every existing id). **Node links** use the form `?node-id=<id with : replaced by ->`. A frame name is the stable handle if ids change.

## Decisions

- **Theme follows the OS** (`prefers-color-scheme`). There is **no manual theme toggle** in v0.2.0 (moved to #59). Light and Dark are both fully designed: every frame has an explicit `Color` mode (Light or Dark).
- **Single page per locale**, anchor navigation to `#about`, `#projects`, `#experience`, `#skills`, `#contact`. The nav has four links (About, Projects, Experience, Contact): `#skills` is an anchor without a nav link, and the Experience link scrolls to `#experience`. On mobile the nav links sit on a second header row and wrap; there is no menu button and no menu state.
- **Typographic only.** The hero has no portrait or illustration, and project cards have **no image**: the optional image field of #40's data model is intentionally absent from the design (annotated on `Annotations / Project card`).
- **Real content.** Every string in the frames is the shipped one, in en and pt: the dictionaries (`apps/web/src/shared/dictionaries/{en,pt}.ts`), the project list (`features/portfolio-showcase/projects.ts`) and the site config (email and profiles). When the code and a frame disagree, the frame follows the code (see [Content sync](#content-sync-67)).

## Viewports

| Name | Width | Notes |
|---|---|---|
| Mobile | 375 | Single column. Also checked at 320 (`Stress 320`, pt only). |
| Tablet | 768 | Header inline, two-column project and skills grids. |
| Desktop | 1280 | Fluid, side padding `space/16`; content is 1152 wide at 1280. Above 1280, centre the layout (no larger max width is designed). |

Breakpoints for #37/#38 (min-width): tablet 768 (`md`), desktop 1024 (`lg`). The 768 frame is the design for 768 to 1023, and the 1280 frame for 1024 and up (no frame exists at 1024; behaviour there follows the 1280 frame). The mobile layout applies fluidly from 320 to 767 (only 375 and the 320 stress check are drawn).

| Property | Mobile | Tablet | Desktop |
|---|---|---|---|
| Side padding | `space/5` (20) | `space/10` (40) | `space/16` (64) |
| Section vertical padding | `space/16` (64) | `space/20` (80) | `space/24` (96) |
| Gap heading to content | `space/6` (24) | `space/8` (32) | `space/10` (40) |
| Header vertical padding | `space/3` (12) | `space/4` (16) | `space/4` (16) |
| Hero headline | `text/3xl` | `text/4xl` | `text/5xl` |
| Section `h2` | `text/2xl` | `text/2xl` | `text/3xl` |
| Header layout | `Layout=stacked` | `Layout=inline` | `Layout=inline` |
| Experience entry | `Layout=stack` | `Layout=row` | `Layout=row` |
| Project grid | 1 column | 2 columns | 2 columns |
| Skills grid | 1 column | 2 columns | 3 columns |
| About | stacked | stacked | two columns (heading 320, text fill, gap `space/16` in place of the heading gap) |

Sections are separated by a single 1px `color/border` rule: the header owns the rule above `Hero` (its bottom edge, so `Hero` has no top rule), every other section has a top rule, and the footer has a top rule. The header and footer rules span the full width; the section rules are as wide as the content, because the sections sit inside the padded `Main` frame, as in the page; each `Timeline entry`, `Skill group` and `Contact row` also has its own 1px top rule (the first one included); there are no section background changes. Text measure is capped at 576 (about 60 to 70 characters at `text/base`) on the hero intro, About paragraphs, section leads and experience highlights (card summaries are narrower by construction); where a column is constrained the measure is below 55 (tablet highlights are 464 wide, mobile columns are narrower) and the design accepts that; wider columns hold shorter text; the hero headline is capped at 800 (desktop) or 700.

## Page components (page `Pages`)

All bind fills, strokes, padding, gaps and radius to variables, and text to text styles (except the `Nav link` label and the `Section heading` title, whose style is set per viewport in the frames), like the foundations components. They compose the foundations `Button`, `Link`, `Language switcher` and `Card` tokens. They are **page compositions**, not new design-system primitives.

| Figma component set | Node | Variants | Used by |
|---|---|---|---|
| `Nav link` | [13:10](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-10) | `State` = default / hover / focus | #38 header |
| `Header bar` | [13:99](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-99) | `Layout` = inline / stacked | #38 header |
| `Footer bar` | [13:114](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-114) | `Layout` = row / stack | #38 footer |
| `Section heading` | [13:14](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-14) | `Style` = default (title and lead; the lead is hidden in About, Experience and Skills) | #39 to #42 |
| `Project card` | [13:35](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-35) | `State` = default / hover, `Layout` = stack / row, `Live demo` (boolean, shows the second link) | #40 |
| `Timeline entry` | [13:52](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-52) | `Layout` = row / stack, `Highlight 2`, `Highlight 3`, `Highlight 4` (booleans; an entry has one to four highlights) | #41 |
| `Skill group` | [13:56](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-56) | `Style` = default | #41 |
| `Contact row` | [13:61](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-61) | `Layout` = row / stack (stack: label above the value, below 360px) | #42 |
| `CV action` | [58:2071](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=58-2071) | `Emphasis` = primary / outline (a `Button` and a `Link`) | #42 |

Foundations components used as instances: `Button` (primary, outline; md), `Link`, `Language switcher` (EN or PT active), `Skip link` (on `Annotations` only). The text inside the component sets themselves is generic sample text (`Project title`, `Role title`, `Company Name`, `2024 – Present`, `name@example.com`); only the frames carry content.

## Sections

Every home frame mirrors the page's landmarks: `Header`, `Main` and `Footer`, in this order. `Main` carries the side padding and contains `Hero`, `About`, `Projects`, `Experience`, `Skills` and `Contact`, in this order. A 404 frame contains `Header`, `Not found` and `Footer`. Use the section ids in [Frame index](#frame-index).

| Section | Issue | Structure | Responsive behaviour |
|---|---|---|---|
| `Header` | #38 | Wordmark (`text/lg`, link to top), nav of 4 `Nav link`s, `Language switcher`. Hairline below. | Mobile: wordmark and switcher on row 1, nav links on row 2 (wrap, so the fourth link drops to a third line at 320, in en and pt). |
| `Hero` | #39 | Mono eyebrow (the role only), `h1`, intro (`text/lg`, Regular, `muted`), actions: primary `Button` (View projects) and outline `Button` (Get in touch). | Headline steps down 5xl, 4xl, 3xl. Buttons wrap. |
| `About` | #39 | `Section heading` (title only) and two paragraphs. | Two columns on desktop, stacked below. |
| `Projects` | #40 | `Section heading` with lead, grid of 4 `Project card`s. Each card: a header row with the title left and the year (mono, tabular) right on the text baseline, the summary, then a footer under a 1px `color/border` hairline with the tech line (mono) and the text links: Repository on every card, Live demo only where the project has one (one of the four). | Rows keep equal card height (the tallest card sets the row, the others stretch) and the footer sits at the card bottom. `Layout=row` (1280, wide cards): tech left, links right on one row. `Layout=stack` (768 and 375, 320 stress): the links sit under the tech line. Link labels are longer in pt; the two links of the Portfolio card can wrap inside the card, and still fit on one row at every drawn width in the browser. |
| `Experience` | #41 | `Section heading` (title only), list of 2 `Timeline entry`, newest first: dates (mono, 200 wide in row layout), role, company, and four and one highlights. Dates are a short month and year (`Jul 2026`, `jul. de 2026`); the current role ends in `Present` / `o momento`. Each entry has a 1px top rule (including the first), no rail. | Dates move above the role on mobile. In pt the date range is wider than 200 and wraps to two lines at 768 and 1280 (#75). |
| `Skills` | #41 | `Section heading` (title only), 3 `Skill group`s: mono label and a plain list, one item per line (no pills, no bars). | 3, 2, then 1 columns. At 768 the third group sits alone on the second row, one column wide (#74). |
| `Contact` | #42 | `Section heading` with lead, 3 `Contact row`s (email, GitHub, LinkedIn; label 72 wide; the value is a `Link` that fills the row and wraps), two `CV action`s. A `CV action` is a `Button` labelled `View CV (PDF, <language>)`, which opens the PDF in a new tab, and a small `Download` text link next to it. The CV in the page's own language comes first and is primary; the other is outline. | Rows cap at 576 on tablet and desktop, fill on mobile, and use `Layout=stack` below 360 (the 320 frames). The LinkedIn address wraps to two lines at 375 and 320. The `CV action`s wrap (gap 24 by 12); at 320 one `Download` link drops under its button (the first in pt, the second in en). |
| `Footer` | #38 | Copyright, `Source code` and `Back to top` links. Hairline above. | Stacks below 640 (the 375 and 320 frames); a row from 640 up. |
| `404` | #44 | `Header`, `Not found` (mono eyebrow, `h1`, message, primary `Button` back to home), `Footer`. Frame heights are viewport-like (800, 1024, 812). | Headline `text/5xl` at 1280 and 768, `text/4xl` at 375. `Not found` vertical padding is `space/24` at 1280 and 768 and `space/16` at 375 (larger than the home sections at 768 because the page is a single block). |

## Frame index

### Desktop 1280 ([section](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-29))

| Section | Light / en | Light / pt | Dark / en | Dark / pt |
|---|---|---|---|---|
| **Full page** | [15:30](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-30) | [15:192](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-192) | [15:354](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-354) | [15:516](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-516) |
| `Header` | [15:31](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-31) | [15:193](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-193) | [15:355](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-355) | [15:517](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-517) |
| `Main` | [65:2062](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2062) | [65:2063](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2063) | [65:2064](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2064) | [65:2065](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2065) |
| `Hero` | [15:50](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-50) | [15:212](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-212) | [15:374](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-374) | [15:536](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-536) |
| `About` | [15:60](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-60) | [15:222](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-222) | [15:384](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-384) | [15:546](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-546) |
| `Projects` | [15:68](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-68) | [15:230](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-230) | [15:392](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-392) | [15:554](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-554) |
| `Experience` | [15:115](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-115) | [15:277](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-277) | [15:439](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-439) | [15:601](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-601) |
| `Skills` | [15:144](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-144) | [15:306](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-306) | [15:468](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-468) | [15:630](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-630) |
| `Contact` | [15:162](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-162) | [15:324](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-324) | [15:486](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-486) | [15:648](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-648) |
| `Footer` | [15:184](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-184) | [15:346](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-346) | [15:508](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-508) | [15:670](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-670) |

### Tablet 768 ([section](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-473))

| Section | Light / en | Light / pt | Dark / en | Dark / pt |
|---|---|---|---|---|
| **Full page** | [16:474](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-474) | [16:637](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-637) | [16:800](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-800) | [16:963](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-963) |
| `Header` | [16:475](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-475) | [16:638](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-638) | [16:801](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-801) | [16:964](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-964) |
| `Main` | [65:2066](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2066) | [65:2067](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2067) | [65:2068](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2068) | [65:2069](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2069) |
| `Hero` | [16:494](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-494) | [16:657](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-657) | [16:820](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-820) | [16:983](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-983) |
| `About` | [16:504](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-504) | [16:667](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-667) | [16:830](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-830) | [16:993](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-993) |
| `Projects` | [16:512](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-512) | [16:675](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-675) | [16:838](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-838) | [16:1001](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1001) |
| `Experience` | [16:559](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-559) | [16:722](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-722) | [16:885](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-885) | [16:1048](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1048) |
| `Skills` | [16:588](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-588) | [16:751](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-751) | [16:914](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-914) | [16:1077](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1077) |
| `Contact` | [16:607](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-607) | [16:770](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-770) | [16:933](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-933) | [16:1096](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1096) |
| `Footer` | [16:629](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-629) | [16:792](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-792) | [16:955](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-955) | [16:1118](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1118) |

### Mobile 375 ([section](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1126))

| Section | Light / en | Light / pt | Dark / en | Dark / pt |
|---|---|---|---|---|
| **Full page** | [16:1127](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1127) | [16:1294](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1294) | [16:1461](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1461) | [16:1628](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1628) |
| `Header` | [16:1128](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1128) | [16:1295](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1295) | [16:1462](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1462) | [16:1629](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1629) |
| `Main` | [65:2070](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2070) | [65:2071](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2071) | [65:2072](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2072) | [65:2073](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2073) |
| `Hero` | [16:1147](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1147) | [16:1314](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1314) | [16:1481](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1481) | [16:1648](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1648) |
| `About` | [16:1157](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1157) | [16:1324](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1324) | [16:1491](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1491) | [16:1658](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1658) |
| `Projects` | [16:1165](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1165) | [16:1332](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1332) | [16:1499](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1499) | [16:1666](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1666) |
| `Experience` | [16:1214](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1214) | [16:1381](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1381) | [16:1548](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1548) | [16:1715](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1715) |
| `Skills` | [16:1243](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1243) | [16:1410](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1410) | [16:1577](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1577) | [16:1744](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1744) |
| `Contact` | [16:1264](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1264) | [16:1431](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1431) | [16:1598](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1598) | [16:1765](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1765) |
| `Footer` | [16:1286](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1286) | [16:1453](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1453) | [16:1620](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1620) | [16:1787](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1787) |

### Stress 320 ([section](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1795))

| Section | Light / pt | Dark / pt |
|---|---|---|
| **Full page** | [16:1796](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1796) | [16:1963](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1963) |
| `Header` | [16:1797](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1797) | [16:1964](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1964) |
| `Main` | [65:2074](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2074) | [65:2075](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=65-2075) |
| `Hero` | [16:1816](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1816) | [16:1983](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1983) |
| `About` | [16:1826](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1826) | [16:1993](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1993) |
| `Projects` | [16:1834](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1834) | [16:2001](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2001) |
| `Experience` | [16:1883](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1883) | [16:2050](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2050) |
| `Skills` | [16:1912](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1912) | [16:2079](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2079) |
| `Contact` | [16:1933](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1933) | [16:2100](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2100) |
| `Footer` | [16:1955](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1955) | [16:2122](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2122) |

Frame names follow `Home / <viewport> / <Light|Dark> / <en|pt>`. The `Stress 320` frames exist only for pt (the longest strings) and only to verify that nothing overflows at 320. The six sections are children of `Main`; their ids did not change when `Main` was added.

### 404

| Viewport | Variant | Frame | `Header` | `Not found` | `Footer` |
|---|---|---|---|---|---|
| Desktop 1280 | Light / en | [17:1584](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1584) | [17:1585](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1585) | [17:1604](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1604) | [17:1611](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1611) |
| Desktop 1280 | Light / pt | [17:1619](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1619) | [17:1620](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1620) | [17:1639](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1639) | [17:1646](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1646) |
| Desktop 1280 | Dark / en | [17:1654](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1654) | [17:1655](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1655) | [17:1674](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1674) | [17:1681](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1681) |
| Desktop 1280 | Dark / pt | [17:1689](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1689) | [17:1690](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1690) | [17:1709](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1709) | [17:1716](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1716) |
| Tablet 768 | Light / en | [17:1724](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1724) | [17:1725](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1725) | [17:1744](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1744) | [17:1751](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1751) |
| Tablet 768 | Light / pt | [17:1759](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1759) | [17:1760](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1760) | [17:1779](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1779) | [17:1786](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1786) |
| Tablet 768 | Dark / en | [17:1794](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1794) | [17:1795](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1795) | [17:1814](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1814) | [17:1821](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1821) |
| Tablet 768 | Dark / pt | [17:1829](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1829) | [17:1830](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1830) | [17:1849](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1849) | [17:1856](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1856) |
| Mobile 375 | Light / en | [17:1864](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1864) | [17:1865](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1865) | [17:1884](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1884) | [17:1891](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1891) |
| Mobile 375 | Light / pt | [17:1899](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1899) | [17:1900](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1900) | [17:1919](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1919) | [17:1926](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1926) |
| Mobile 375 | Dark / en | [17:1934](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1934) | [17:1935](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1935) | [17:1954](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1954) | [17:1961](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1961) |
| Mobile 375 | Dark / pt | [17:1969](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1969) | [17:1970](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1970) | [17:1989](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1989) | [17:1996](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=17-1996) |

## Annotations (page `Annotations`)

| Frame | Node | Covers |
|---|---|---|
| `Annotations / Shell states` | [18:2](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-2) | Nav link default, hover, focus; language switcher; skip link. Light and Dark. |
| `Annotations / Hero, contact and 404 actions` | [18:78](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-78) | Primary and outline buttons and text links in default, hover and focus, and the two `CV action` variants. Light and Dark. |
| `Annotations / Project card` | [18:164](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-164) | Card default and hover (the Portfolio card, which has both links); why the card is not a link; the optional Live demo link; the header/footer layout and the stack/row rule; no image. |
| `Annotations / Rules` | [18:226](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-226) | Focus ring, focus order, hover, target size, motion, reduced motion, landmarks, language switcher, tabular figures, lists, content source. |

Summary for implementers:

- **Target size:** targets at least 24px high or spaced 24px apart (WCAG 2.2 SC 2.5.8); wrapped text-link rows (project card, footer) have a 4px row gap.
- **Focus:** `ring-2` in `color/focus-ring` with `ring-offset-2` in `color/background`, on every interactive element, keyboard focus only (`focus-visible`).
- **Project card layout:** `Layout=row` is used when the card content is at least about 448px wide, i.e. cards of about 498px or more; among the Figma frames only 1280 (cards 564 wide) reaches it, and every narrower card uses `Layout=stack`. In code this is a container query on the card (`@md`, 28rem), not a viewport breakpoint, so it holds at any grid width. The year is right-aligned on the title baseline, the footer is separated by a hairline and kept at the card bottom, and DOM order equals visual order (title, year, summary, tech, links).
- **Hover:** nav link and wordmark gain an underline; text links go from `accent` to `foreground` and stay underlined; project card border goes to `border-strong`. Active: links, nav links and the card look as on hover; the primary button returns to full opacity and the outline button keeps its hover fill while the whole button drops to 90% opacity. Disabled is not used on any page, so it is not annotated.
- **Motion:** only colour, background and border colour, only on hover, focus-visible and active; `duration/base` (160ms) with `cubic-bezier(0.16, 1, 0.3, 1)`. In-page anchor links scroll smoothly. Nothing continuous or on load.
- **Reduced motion:** the `Motion` `Reduced` mode (all durations 0), and in-page anchors scroll instantly. There is no other fallback.
- **Tabular figures** on years and date ranges (not representable in Figma text styles).

## 404 notes (#44)

Implemented by #44. #67 compared the 12 frames with the export: the copy is identical and the frames needed no content change (they pick up the shared `Header bar` and `Footer bar` spacing fixes listed in [Content sync](#content-sync-67)).

- **Copy (final, in the dictionaries).** The frames show these strings, verbatim:

  | Element | en | pt |
  |---|---|---|
  | Eyebrow | `Error 404` | `Erro 404` |
  | `h1` | `Page not found` | `Página não encontrada` |
  | Message | `The page you are looking for does not exist or has moved. Check the address, or go back to the home page.` | `A página que você procura não existe ou foi movida. Confira o endereço ou volte para a página inicial.` |
  | Button | `Back to home` | `Voltar para o início` |
  | Tab title (not drawn) | `Page not found — João Pedro` | `Página não encontrada — João Pedro` |

- **Locale.** The export has one 404 per locale (`/en/404.html`, `/pt/404.html`) and a root `404.html` in English. Cloudflare Pages answers an unknown path with the nearest `404.html` up the directory tree, so `/pt/...` gets the pt frame, and `/en/...` and every other path get the en frame. Nothing is decided in the browser.
- **Shell links.** On the 404 the wordmark and nav links go to the home page of that locale (`/<locale>#about`), and the button to `/<locale>`. The language switcher links to the two home pages; its active locale is marked as the current language, not the current page (`aria-current="true"`).
- **`Back to top`** is kept, as drawn, and is a same-page link on every page.
- **Typography.** The `h1` uses the `text/4xl` and `text/5xl` styles with their own tracking (-2.5% and -3%), as in the frames.

## Content notes

- All strings are the shipped ones in en and pt. pt is the length stress case (its strings are longer); the 320 stress frames are pt only, a deliberate narrowing of "en and pt on every frame" because pt is the worst case.
- Mono 12px (`text/mono/xs`) is used for secondary metadata (card year and tech line, skill group labels, contact labels, language switcher). This is a deliberate exception to the skill's `text-sm` for dense metadata: it is the foundations' mono scale, `muted` text on it is at least 7:1 (Light and Dark) and the content is never the only carrier of information.
- Focus rings in the Figma swatches are drawn tight, as in the foundations; the 2px offset is described in text only (`Annotations / Rules`), not drawn.
- Arrows in link labels (`↗`, `↑`) are text glyphs, not icons. No icon set is designed.
- In the card, the `Link` instances have their left padding set to 0 so link text aligns with the card text; in code the link's focus ring should still extend 2px beyond the text.
- Text without a bound text style on the pages: the `Nav link` labels (Inter Medium 14), hero `Intro` and 404 `Message` (the `text/lg` size, line height and tracking with the Regular weight; the style itself is Medium), the `Rule name` labels on `Annotations / Rules`, plus the labels inside the foundations components.
- Section `h2`s bind a different text style per viewport (`text/2xl` or `text/3xl`). Foundations allow weight overrides on text nodes.
- Missing in foundations, built here as page components (no new tokens): nav link, header and footer bars, section heading, timeline entry, skill group, contact row, CV action, project card. #59 (manual theme toggle) will need its own foundations component.

## Content sync (#67)

The frames were brought in line with the shipped page. The rule was that Figma follows the code; no code and no token changed.

- **Copy.** Every frame on `Pages` got the shipped strings, generated from the dictionaries, the project list and the site config, not retyped. The swatches on `Annotations` use real labels too, and the placeholder rule became a content source rule.
- **Structure that changed with the content.** `Experience` has two entries (four and one highlights) and `Skills` has three groups; neither has a lead. `Contact` uses two `CV action`s in place of two buttons, with the page's own language first. Project cards show Live demo only where a project has one. The six sections moved into a `Main` frame, which makes the section rules as wide as the content.
- **Component sets, extended in place (ids, names and variable bindings kept).** `Timeline entry`: four highlight slots and three booleans. `Project card`: `Live demo` boolean; the year hugs its line so it stays inside the header row. `Contact row`: `Style=default` became `Layout=row`, with a new `Layout=stack`; the value fills the row and wraps. `CV action` is new. `Header bar` (stacked): 4px between wrapped nav rows (`space/1`). `Footer bar` (stack): 4px between the copyright and the links (`space/1`, was `space/3`). No foundations component changed.
- **Spacing bound in the frames.** Hero `Actions`: row gap `space/3` (the gap between wrapped buttons, as in the code). `CV downloads`: gap `space/6`, row gap `space/3`. Wrapped swatch rows on `Annotations`: row gap `space/6`.
- **Annotations corrected against the code.** Focus order: below 768 the language switcher is drawn before the nav but focused after it (the header keeps the DOM order and moves the switcher with CSS `order`). Landmarks: the header is not sticky, so `scroll-margin-top` is `space/4`.

### Differences that remain between Figma and the browser

The first four come from the two renderers; the last two are places where the code departs from the foundations, which the frames keep. The text nodes hold the exact strings with no forced line break.

- **Headline line breaks.** The page balances the `h1` lines (`text-wrap: balance`); Figma breaks greedily. The line count is the same in every frame, the break point is not; body text can also break a word earlier or later with the same line count (for example `…focused / on architecture and cloud.` in the browser and `…focused on / architecture and cloud.` in Figma at 1280).
- **Two wraps at 320 in pt.** Figma measures Inter 1 to 3px wider per label than the browser. In `Home / Stress 320` the two hero buttons need 281 of 280 and stack (one row in the browser, section 672 against 620), and the two links of the Portfolio card need 232 of 230 and stack (one row in the browser, section 1413 against 1389). Nothing overflows in either renderer.
- **Wrapped link, second line.** A contact value that wraps starts its second line at the edge of the value column in the browser and 4px in (the link padding) in Figma.
- **Tabular figures.** `tabular-nums` cannot be drawn.
- **Letter spacing.** The frames use the tracking of the text styles; the code applies `tracking-tight` (-0.025em) to the same text. The wordmark, card titles and roles are -0.18px in Figma and -0.45px in the browser (the wordmark is 3px narrower there), the `h1` at 1280 is -1.44px against -1.2px, and the 24px `h2` (768 and below) is -0.48px against -0.6px. The 30px `h2` and the 404 `h1` agree. No line count changes. Tracked in #78.
- **Language switcher.** The foundations component has no space around the `/`; the code adds 4px on each side, 8px in all. Figma's mono text boxes are about 2px wider in total, so the switcher is about 6px wider in the browser and the inline nav sits about 5px further left. Tracked in #79.

### Shipped layouts to revisit in code

Drawn as shipped. The maintainer reviewed them on 2026-11-13. A copy slip found on the way, `Next.JS` in one pt highlight where every other string says `Next.js`, is #76; the frames show the shipped string until it is fixed.

| Case | Decision |
|---|---|
| `Skills` at 768: the third group is alone on the second row | #74 (three columns from 768); the tablet frames change when it ships |
| `Experience` dates in pt at 768 and 1280: the range wraps inside the 200 wide column | #75 (keep the range on one line); the frames change when it ships |
| `Contact` at 375: the LinkedIn address wraps to two lines | Accepted as shipped |
| `Contact` at 320 in pt: the first `Download` link drops under its button, the second does not | Accepted as shipped |
| Header below 768: the language switcher comes before the nav visually and after it in focus order | #77 (align the focus order with the visual order); recorded on `Annotations / Rules` until it ships |

## Verification

Run on 2026-11-13 against the static export built from `main` at `5e0a47c` (`pnpm --filter web build`, served from `apps/web/out`), in headless Chromium at 1280, 768, 375 and 320, en and pt, Light and Dark, for the home page and the 404. The scripts are throwaway and are not in the repository.

- **Text.** Every visible text node of the 14 home frames and 12 404 frames (1,468 text runs in 148 regions) equals the text the export renders in the same region, compared per region as the set of whitespace-normalised strings (a hash of the sorted list), and again in reading order by the reviews. The strings generated from the dictionaries equal the export's strings too (92 per locale on the home page).
- **Geometry.** Each region has the same height as in the browser (tolerance 1px) and each text run the same number of lines, except the two 320 wraps listed above. The 404 `Not found` frame fills the viewport-like frame, as the page's `main` does.
- **Layout.** Every visible node lies inside its parent's bounds and inside its frame, including the 320 frames. The browser has no horizontal scroll at any of the four widths.
- **Variables.** Every fill and stroke in the frames is solid and bound to a `color/*` variable, and every non-zero padding and gap to a `space/*` variable. Fonts are Inter (Regular, Medium, Bold) and JetBrains Mono (Regular, Medium) only.
- **Visual read.** Browser and Figma screenshots were compared side by side for `Home / Desktop 1280 / Light / en`, `Home / Tablet 768 / Light / pt`, `Home / Stress 320 / Dark / pt`, `404 / Desktop 1280 / Light / en` and the `Contact` section at 375, and by the review rounds for `Home / Desktop 1280 / Dark / pt`, `Home / Tablet 768 / Light / en`, `Home / Tablet 768 / Dark / pt`, `Home / Mobile 375 / Light / en`, `Home / Mobile 375 / Dark / pt`, `Home / Stress 320 / Light / pt`, `404 / Tablet 768 / Light / pt` and `404 / Mobile 375 / Dark / en`. The remaining frames were checked by the scripted comparison only. The Figma screenshot renderer substitutes fonts, so typography was not judged from screenshots.

## Design review against the `impeccable-design` checklist

Reviewed again on 2026-11-13 with the real content. Result: **pass**, with one item specified rather than drawn.

| Checklist item | Result | Evidence |
|---|---|---|
| Typography follows a clear hierarchy with proper leading and tracking | Pass | Only `text/*` styles from the foundations scale (leading and tracking come with the styles), apart from the weight overrides in [Content notes](#content-notes); one `h1` per page, `h2` per section, `h3` for card titles, roles and skill labels. The measure is capped at 576: the real paragraphs run about 58 (hero intro, `text/lg`) to 70 (`text/base`) characters per line at 1280 and 768. |
| Numbers, dates and metrics use tabular numerals | Specified | Years and date ranges are mono and annotated for `tabular-nums` (`Annotations / Rules`); Figma text styles cannot express it. |
| Colour contrast passes WCAG AA for both themes | Pass | The sync added no colour pairing: every text and UI pairing on the pages in the default, hover and focus states is one already computed in the foundations Contrast tables (ratios below are copied from there; recompute there if a primitive changes): `foreground`, `muted` and `accent` on `background` and `surface` (muted 7.13:1 and 7.58:1 Light, 11.73:1 and 10.59:1 Dark; accent 7.26:1 and 7.72:1 Light, 9.9:1 and 8.94:1 Dark), `accent-foreground` on `accent` (7.72:1, 9.9:1; the 90% opacity primary hover is the foundations additional pairing, 6.15:1 and 8.19:1), `border-strong` and `focus-ring` as UI. Disabled and `Tag` are not used. The pressed outline button at 90% opacity is not in those tables; computed for this review, its label is about 13.5:1 (Light) and 11.5:1 (Dark) and its border about 3.6:1 in both against the page. The `Download` link of a `CV action` is `accent` on `background`. |
| Interactive states (hover, focus-visible, active) are explicitly styled with accessible focus rings | Pass | `Annotations` frames show default, hover and focus for nav links, buttons and text links, and default and hover for the card (it is not focusable), in Light and Dark, and both `CV action` variants, which are built from the same `Button` and `Link`; the focus ring is `focus-ring` at 5.25:1 (Light) and 6.83:1 (Dark) on `background`. Ring offset is annotated (the Figma swatches draw it tight, as in the foundations). Active is styled: links, nav links and the card look as on hover, the primary button returns to full opacity and the outline button keeps its hover fill while the whole button drops to 90% opacity. Target size follows WCAG 2.2 SC 2.5.8 (24px, or spaced): the `Download` link is 20px high and sits 16px from its button and 8px below it when wrapped. |
| All transitions respect `prefers-reduced-motion` | Pass | Reduced-motion behaviour annotated (durations 0, instant anchor scroll); the only motion specified is colour change on hover, focus and active, and smooth in-page anchor scrolling. The sync added none. |
| No horizontal scrolling at 320 to 375 | Pass | Scripted bounds check on all 26 frames, including `Stress 320` in pt, Light and Dark, and no horizontal scroll in the browser at 320 and 375 in en and pt. The longest unbreakable string, the LinkedIn address, wraps inside its row; fixed width elements are the 72 wide contact label (a column from 360 up, stacked above the value below that) and, on desktop and tablet only, the 200 wide date column. |
| No forbidden AI-slop tropes | Pass | No gradients, glass, glow or shadows; solid surfaces with 1px hairlines; no pills or badges (`Tag` unused, radius `radius/sm` on controls and cards); skills and tech lines are plain text; one accent used only for the primary button, links and the active language. No continuous motion. |
