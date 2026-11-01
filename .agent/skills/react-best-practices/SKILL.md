---
name: react-best-practices
description: "Modern React and Next.js engineering principles adapted from Vercel best practices, tailored for Next.js App Router with static export (output: 'export'). Trigger before proposing, writing, or reviewing React components, hooks, state, and rendering architecture."
---

# React Best Practices: Static Export Architecture

This skill defines the technical standards, performance principles, and architecture rules for React and Next.js development in this portfolio. It adapts Vercel's React guidelines specifically for a purely static export target (`output: 'export'`) deployed to Cloudflare Pages.

## 1. Architectural Foundation: Next.js Static Export

The portfolio operates as a static site without a persistent Node.js or edge server runtime. Every route and page is pre-rendered to HTML and assets at build time.

- **Server vs. Client Components**:
  - Default to React Server Components (RSC) for all pages, layouts, and presentational containers. They generate zero client JavaScript bundle overhead.
  - Add `'use client'` only to leaf components that require interactivity (event listeners, state, browser APIs, or context).
  - Never place `'use client'` at the page or root layout level.
- **No Dynamic Server APIs**:
  - Avoid headers, cookies, runtime server query param inspection, or Server Actions.
  - Dynamic route parameters must be comprehensively declared using `generateStaticParams`.
- **Static Asset & Image Optimization**:
  - In `output: 'export'` mode, Next.js does not run the default on-demand image optimization server.
  - For `next/image`, either specify explicit width/height with `unoptimized: true` or configure a dedicated Cloudflare image loader when remote images are introduced.

---

## 2. Core React Engineering Principles

### Derived State Over `useEffect`
- **Calculate during render**: If a value can be computed from existing props or state, derive it inline during render.
- **Never sync props to state**: Do not duplicate props into local state or use `useEffect` to copy state on prop changes.
- **Keep effects for synchronization only**: Use `useEffect` strictly for synchronizing with external systems (e.g., subscribing to DOM events, setting up IntersectionObserver, interacting with browser storage).

```tsx
// ❌ Anti-pattern: Redundant state and effect synchronization
const [filteredProjects, setFilteredProjects] = useState([]);
useEffect(() => {
    setFilteredProjects(projects.filter(p => p.tag === activeTag));
}, [projects, activeTag]);

// ✅ Preferred: Pure derived state computed during render
const filteredProjects = useMemo(() => {
    return projects.filter(p => p.tag === activeTag);
}, [projects, activeTag]);
```

### Eliminate Waterfalls & Precompute Data
- **Build-time resolution**: Pre-render all content, metadata, and static data at build time rather than fetching on the client during component mount.
- **Avoid cascading client fetches**: If client fetching is ever necessary, parallelize requests (`Promise.all`) or hoist the data requirement to avoid parent-child fetch waterfalls.

### Component Composition over Prop Drilling
- **Favor composition**: Use `children` and component slots to pass UI down instead of passing deep props through intermediate layers.
- **Colocate state with leaves**: Keep state as close as possible to the component that uses it. Lifting state to a distant parent triggers unnecessary re-renders across the sub-tree.

### Hook Discipline & Render Purity
- **Render phase purity**: The render function must remain a pure calculation. Never initiate side effects, dispatch state updates, or mutate external variables during render.
- **Accurate dependency arrays**: Never omit dependencies from `useEffect`, `useCallback`, or `useMemo`. If a dependency triggers too frequently, restructure the function or hoist the state rather than suppressing the linter.
- **Sensible memoization**: Do not wrap every trivial function or primitive in `useCallback` or `useMemo`. Use them when:
  1. Passing callbacks to heavily optimized memoized child components (`React.memo`).
  2. The computation is genuinely expensive (e.g., filtering large collections).
  3. The reference is used as a dependency in another hook.

### Bundle Size & Tree-Shaking
- **Direct submodule imports**: Import icons and utility functions from their specific submodules (e.g., `lucide-react/dist/esm/icons/...` or verify package barrel tree-shaking) to avoid inflating client bundles.
- **Lazy load non-critical client UI**: Use `next/dynamic` for heavy client components (e.g., complex interactive visualizers or modals) that are not needed during initial page load.
- **Client-only browser guards**: When accessing `window`, `document`, or `localStorage`, ensure code runs inside `useEffect` or behind a mounted flag to prevent hydration mismatches.

### Hydration Safety & Accessibility
- **Deterministic markup**: Ensure the server-rendered HTML matches the initial client render exactly. Avoid client-only dates or random numbers during the initial render pass.
- **Stable IDs**: Use React's `useId()` hook for connecting input labels, ARIA controls, and form helpers.
- **Semantic HTML**: Use native semantic tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<button>`) instead of nested `<div>` and `<span>` elements with arbitrary click handlers.

---

## 3. Explicit Anti-Patterns

1. **`'use client'` at Page Roots**:
   - Marking entire page files as client components balloons client bundle size and forfeits build-time HTML pre-rendering benefits.
2. **`useEffect` for Event Handling**:
   - Executing logic in `useEffect` when it should have run in a direct user event handler (`onClick`, `onSubmit`).
3. **Hydration Mismatches via Browser Globals**:
   - Reading `window.innerWidth` or `localStorage` directly in component render bodies before mounting.
4. **Anonymous Callback Functions in Loops**:
   - Creating inline function references inside tight list rendering loops when passing to complex child components.
5. **Div-Soup Controls**:
   - Replacing `<button>` or `<a>` with `<div onClick={...}>` lacking keyboard focusability, ARIA roles, and standard accessibility affordances.

---

## 4. Component Review Checklist

Before finalizing any React component or hook, verify:
- [ ] Component is a Server Component unless interactive state or browser APIs strictly require `'use client'`.
- [ ] No `useEffect` is used for derived state or prop synchronization.
- [ ] No hydration mismatches occur when pre-rendering (no unguarded browser globals).
- [ ] All interactive elements are keyboard-navigable and semantically accessible.
- [ ] Dynamic routes supply static params via `generateStaticParams`.
- [ ] Imports are tree-shakeable and do not introduce bloated dependencies.
- [ ] Code passes all Biome linting, formatting, and type-checking rules.
