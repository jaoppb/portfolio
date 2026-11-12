# Figma page designs

Source of truth for the portfolio's page and section designs (issue #36, epic #34). Consumers: **#38** (shell), **#39** (hero and about), **#40** (projects), **#41** (experience and skills), **#42** (contact) and **#44** (404) implement from the frames below. Variables, text styles and base components come from [figma-foundations.md](figma-foundations.md); no token was added.

- **Figma file:** <https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio>
- **Pages added:** `Pages` (page components plus every full-page frame) and `Annotations` (interactive states and rules). Existing pages: `Foundations`, `Components`, `Contrast`.
- **Verified against Figma on 2026-11-07** (all node ids resolved by the review). **Node links** use the form `?node-id=<id with : replaced by ->`. A frame name is the stable handle if ids change.

## Decisions

- **Theme follows the OS** (`prefers-color-scheme`). There is **no manual theme toggle** in v0.2.0 (moved to #59). Light and Dark are both fully designed: every frame has an explicit `Color` mode (Light or Dark).
- **Single page per locale**, anchor navigation to `#about`, `#projects`, `#experience`, `#skills`, `#contact`. The nav has four links (About, Projects, Experience, Contact): `#skills` is an anchor without a nav link, and the Experience link scrolls to `#experience`. On mobile the nav links sit on a second header row and wrap; there is no menu button and no menu state.
- **Typographic only.** The hero has no portrait or illustration, and project cards have **no image**: the optional image field of #40's data model is intentionally absent from the design (annotated on `Annotations / Project card`).
- **Placeholder copy.** All strings, companies, project entries, links and the email address are placeholders until #39 to #42 supply real content (see [Content notes](#content-notes)).

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
| Skills grid | 1 column | 2 columns | 4 columns |
| About | stacked | stacked | two columns (heading 320, text fill) |

Sections are separated by a single 1px `color/border` rule: the header owns the rule above `Hero` (its bottom edge, so `Hero` has no top rule), every other section has a top rule, and the footer has a top rule; each `Timeline entry`, `Skill group` and `Contact row` also has its own 1px top rule (the first one included); there are no section background changes. Text measure is capped at 576 (about 60 to 70 characters at `text/base`) on the hero intro, About paragraphs, section leads and experience highlights (card summaries are narrower by construction); where a column is constrained the measure is below 55 (tablet highlights are 464 wide, mobile columns are narrower) and the design accepts that; wider columns hold shorter text; the hero headline is capped at 800 (desktop) or 700.

## Page components (page `Pages`)

All bind fills, strokes, padding, gaps and radius to variables, and text to text styles, like the foundations components. They compose the foundations `Button`, `Link`, `Language switcher` and `Card` tokens. They are **page compositions**, not new design-system primitives.

| Figma component set | Node | Variants | Used by |
|---|---|---|---|
| `Nav link` | [13:10](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-10) | `State` = default / hover / focus | #38 header |
| `Header bar` | [13:99](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-99) | `Layout` = inline / stacked | #38 header |
| `Footer bar` | [13:114](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-114) | `Layout` = row / stack | #38 footer |
| `Section heading` | [13:14](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-14) | `Style` = default (title and lead; the lead is hidden in About) | #39 to #42 |
| `Project card` | [13:35](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-35) | `State` = default / hover, `Layout` = stack / row | #40 |
| `Timeline entry` | [13:52](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-52) | `Layout` = row / stack | #41 |
| `Skill group` | [13:56](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-56) | `Style` = default | #41 |
| `Contact row` | [13:61](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=13-61) | `Style` = default | #42 |

Foundations components used as instances: `Button` (primary, outline; md), `Link`, `Language switcher` (EN or PT active), `Skip link` (on `Annotations` only).

## Sections

Every home frame contains the same child frames, in this order and with these names: `Header`, `Hero`, `About`, `Projects`, `Experience`, `Skills`, `Contact`, `Footer`. Use the section ids in [Frame index](#frame-index).

| Section | Issue | Structure | Responsive behaviour |
|---|---|---|---|
| `Header` | #38 | Wordmark (`text/lg`, link to top), nav of 4 `Nav link`s, `Language switcher`. Hairline below. | Mobile: wordmark and switcher on row 1, nav links on row 2 (wrap, so Portuguese `Experiência` and `Contato` can drop to a third line at 320). |
| `Hero` | #39 | Mono eyebrow, `h1`, intro (`text/lg`, Regular, `muted`), actions: primary `Button` (View projects) and outline `Button` (Get in touch). | Headline steps down 5xl, 4xl, 3xl. Buttons wrap. |
| `About` | #39 | `Section heading` (title only) and two paragraphs. | Two columns on desktop, stacked below. |
| `Projects` | #40 | `Section heading` with lead, grid of 4 `Project card`s. Each card: a header row with the title left and the year (mono, tabular) right on the text baseline, the summary, then a footer under a 1px `color/border` hairline with the tech line (mono) and two text links (Repository, Live demo). | Rows keep equal card height and the footer sits at the card bottom. `Layout=row` (1280, wide cards): tech left, links right on one row. `Layout=stack` (768 and 375, 320 stress): the links sit under the tech line. Link labels are longer in pt and wrap inside the card. |
| `Experience` | #41 | `Section heading`, list of 3 `Timeline entry`: dates (mono, 200 wide in row layout), role, company, two highlights. Each entry has a 1px top rule (including the first), no rail. | Dates move above the role on mobile. |
| `Skills` | #41 | `Section heading`, 4 `Skill group`s: mono label and a plain list, one item per line (no pills, no bars). | 4, 2, then 1 columns. |
| `Contact` | #42 | `Section heading` with lead, 3 `Contact row`s (email, GitHub, LinkedIn; label 72 wide), two CV buttons labelled with file type and language (primary and outline). | Rows cap at 576 on tablet and desktop, fill on mobile. CV buttons wrap. |
| `Footer` | #38 | Copyright, `Source code` and `Back to top` links. Hairline above. | Mobile stacks. |
| `404` | #44 | `Header`, `Not found` (mono eyebrow, `h1`, message, primary `Button` back to home), `Footer`. Frame heights are viewport-like (800, 1024, 812). | Headline `text/5xl` at 1280 and 768, `text/4xl` at 375. `Not found` vertical padding is `space/24` at 1280 and 768 and `space/16` at 375 (larger than the home sections at 768 because the page is a single block). |

## Frame index

### Desktop 1280 ([section](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-29))

| Section | Light / en | Light / pt | Dark / en | Dark / pt |
|---|---|---|---|---|
| **Full page** | [15:30](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-30) | [15:192](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-192) | [15:354](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-354) | [15:516](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-516) |
| `Header` | [15:31](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-31) | [15:193](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-193) | [15:355](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-355) | [15:517](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=15-517) |
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
| `Hero` | [16:1816](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1816) | [16:1983](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1983) |
| `About` | [16:1826](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1826) | [16:1993](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1993) |
| `Projects` | [16:1834](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1834) | [16:2001](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2001) |
| `Experience` | [16:1883](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1883) | [16:2050](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2050) |
| `Skills` | [16:1912](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1912) | [16:2079](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2079) |
| `Contact` | [16:1933](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1933) | [16:2100](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2100) |
| `Footer` | [16:1955](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-1955) | [16:2122](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=16-2122) |

Frame names follow `Home / <viewport> / <Light|Dark> / <en|pt>`. The `Stress 320` frames exist only for pt (the longest strings) and only to verify that nothing overflows at 320.

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
| `Annotations / Hero, contact and 404 actions` | [18:78](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-78) | Primary and outline buttons and text links in default, hover and focus. Light and Dark. |
| `Annotations / Project card` | [18:164](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-164) | Card default and hover; why the card is not a link; the header/footer layout and the stack/row rule; no image. |
| `Annotations / Rules` | [18:226](https://www.figma.com/design/ItCehqEVlGG8QTCbgHlDnG/Portfolio?node-id=18-226) | Focus ring, focus order, hover, target size, motion, reduced motion, landmarks, language switcher, tabular figures, lists, placeholder note. |

Summary for implementers:

- **Target size:** targets at least 24px high or spaced 24px apart (WCAG 2.2 SC 2.5.8); wrapped text-link rows (project card, footer) have a 4px row gap.
- **Focus:** `ring-2` in `color/focus-ring` with `ring-offset-2` in `color/background`, on every interactive element, keyboard focus only (`focus-visible`).
- **Project card layout:** `Layout=row` is used when the card content is at least about 448px wide (only the 1280 grid, where cards are 564 wide); every narrower card uses `Layout=stack`. In code this is a container query on the card (`@md`, 28rem), not a viewport breakpoint, so it holds at any grid width. The year is right-aligned on the title baseline, the footer is separated by a hairline and kept at the card bottom, and DOM order equals visual order (title, year, summary, tech, links).
- **Hover:** nav link gains an underline; text links go from `accent` to `foreground` and stay underlined; project card border goes to `border-strong`; active equals hover. Disabled is not used on any page, so it is not annotated.
- **Motion:** only colour, background and border colour, only on hover, focus-visible and active; `duration/base` (160ms) with `cubic-bezier(0.16, 1, 0.3, 1)`. Nothing continuous or on load.
- **Reduced motion:** the `Motion` `Reduced` mode (all durations 0), and in-page anchors scroll instantly. There is no other fallback.
- **Tabular figures** on years, date ranges and percentages (not representable in Figma text styles).

## 404 notes (for #44)

- The 404 reuses the shell, but its nav and footer links must be cross-page (for example `/<locale>/#about`), not same-page anchors. `Back to top` is shown for shell parity; #44 may drop it on a one-screen page.
- Both en and pt 404 frames are designed. How a static export picks the locale for the 404 page is an open question for #44 (the design does not decide it).

## Content notes

- Strings are placeholders in en and pt; pt is the length stress case (its strings are longer); the 320 stress frames are pt only, a deliberate narrowing of "en and pt on every frame" because pt is the worst case. Portuguese role titles and the about text use gender-neutral forms (for example "Engenharia de Software Sênior").
- Dates, years and the `40%` figure are illustrative.
- Mono 12px (`text/mono/xs`) is used for secondary metadata (card year and tech line, skill group labels, language switcher). This is a deliberate exception to the skill's `text-sm` for dense metadata: it is the foundations' mono scale, `muted` text on it is at least 7:1 (Light and Dark) and the content is never the only carrier of information. Revisit if real content needs it larger.
- Focus rings in the Figma swatches are drawn tight, as in the foundations; the 2px offset is described in text only (`Annotations / Rules`), not drawn.
- Arrows in link labels (`↗`, `↑`) are text glyphs, not icons. No icon set is designed.
- In the card, the `Link` instances have their left padding set to 0 so link text aligns with the card text; in code the link's focus ring should still extend 2px beyond the text.
- Text without a bound text style on the pages: the `Nav link` labels (Inter Medium 14), hero `Intro` and 404 `Message` (the `text/lg` size, line height and tracking with the Regular weight; the style itself is Medium), the `Rule name` labels on `Annotations / Rules`, plus the labels inside the foundations components.
- Section `h2`s bind a different text style per viewport (`text/2xl` or `text/3xl`). Foundations allow weight overrides on text nodes.
- Missing in foundations, built here as page components (no new tokens): nav link, header and footer bars, section heading, timeline entry, skill group, contact row, project card. #59 (manual theme toggle) will need its own foundations component.

## Verification

- Layout: every visible node of the 14 home frames and 12 404 frames lies inside its parent's bounds (scripted check on bounding boxes, run after the last edit), including the 320 stress frames in pt, Light and Dark. Parent-bounds clipping was checked too, not only the frame edge.
- Fonts used: Inter (Regular, Medium, Bold) and JetBrains Mono (Regular, Medium) only. Fills are solid only: no gradients, no images.
- Variables: every frame fill and stroke on `Pages` and `Annotations` is bound to a `color/*` variable (Figma sections that only organise frames are unbound); spacing and gaps are bound to `space/*`. Text uses `text/*` styles except the weight overrides above and the foundations components' own labels.
- The Figma screenshot renderer substitutes fonts, so typography was not judged from screenshots.

## Design review against the `impeccable-design` checklist

Result: **pass**, with one item specified rather than drawn.

| Checklist item | Result | Evidence |
|---|---|---|
| Typography follows a clear hierarchy with proper leading and tracking | Pass | Only `text/*` styles from the foundations scale (leading and tracking come with the styles); one `h1` per page, `h2` per section; measure capped at 576 (about 60 to 70 characters). |
| Numbers, dates and metrics use tabular numerals | Specified | Dates, years and percentages are mono or annotated for `tabular-nums` (`Annotations / Rules`); Figma text styles cannot express it. |
| Colour contrast passes WCAG AA for both themes | Pass | Every text and UI pairing on the pages is one already computed in the foundations Contrast tables (ratios below are copied from there; recompute there if a primitive changes): `foreground`, `muted` and `accent` on `background` and `surface` (muted 7.13:1 and 7.58:1 Light, 11.73:1 and 10.59:1 Dark; accent 7.26:1 and 7.72:1 Light, 9.9:1 and 8.94:1 Dark), `accent-foreground` on `accent` (7.72:1, 9.9:1; the 90% opacity primary hover is the foundations additional pairing, 6.15:1 and 8.19:1), `border-strong` and `focus-ring` as UI. Disabled and `Tag` are not used. No new pairing was introduced. |
| Interactive states (hover, focus-visible, active) are explicitly styled with accessible focus rings | Pass | `Annotations` frames show default, hover and focus for nav links, buttons, text links and the card in Light and Dark; the focus ring is `focus-ring` at 5.25:1 (Light) and 6.83:1 (Dark) on `background`. Ring offset is annotated (the Figma swatches draw it tight, as in the foundations). Active equals hover. Target size follows WCAG 2.2 SC 2.5.8 (24px, or spaced). |
| All transitions respect `prefers-reduced-motion` | Pass | Reduced-motion behaviour annotated (durations 0, instant anchor scroll); the only motion specified is colour change on hover, focus and active. |
| No horizontal scrolling at 320 to 375 | Pass | Scripted bounds check on all frames, including `Stress 320` in pt, Light and Dark; fixed width elements are the 72 wide contact label (all widths; long contact values wrap inside the row) and the 200 wide date column (desktop and tablet only). |
| No forbidden AI-slop tropes | Pass | No gradients, glass, glow or shadows; solid surfaces with 1px hairlines; no pills or badges (`Tag` unused, radius `radius/sm` on controls and cards); skills are a plain list; one accent used only for the primary button, links and the active language. No continuous motion. |

