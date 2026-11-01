# ADR 0001: Architectural Boundary Enforcement via Fallow

- **Status:** Accepted
- **Date:** 2026-10-31
- **Deciders:** João Pedro (@jaoppb), Agent Spike #7
- **Technical Story:** Issue [#7](https://github.com/jaoppb/portfolio/issues/7) (`spike: evaluate fallow for feature-first boundary enforcement`)
- **Parent Epic:** Issue [#3](https://github.com/jaoppb/portfolio/issues/3) (`Epic: Developer Platform & Architecture Governance`)

---

## Context and Problem Statement

The Portfolio repository follows a modular, **feature-first sliced architecture**. Under this paradigm:
1. Feature modules (`features/*`) must remain strictly isolated from one another to prevent high coupling and domain bleed.
2. Cross-module reuse is permitted only through shared primitives (`shared/*`) or reusable design system elements (`components/ui/*` or `packages/ui/*`).
3. Import cycles (circular dependencies) and dead exports must be eliminated before code reaches `main`.

Without automated static analysis, architectural boundaries deteriorate through human or agent oversight. We need a boundary enforcement and dead-code detection tool that delivers sub-second execution, zero-config feature discovery, and seamless TypeScript path alias resolution.

---

## Decision Drivers

- **Enforcement Precision:** Must strictly forbid cross-feature imports (e.g. `features/portfolio-showcase` importing `features/contact-form`) while allowing imports from `shared/*` and `components/ui/*`.
- **Zero-Config Slicing:** Dynamic feature discovery (via `autoDiscover`) so new feature slices added under `features/` are automatically bounded without editing configuration files.
- **Import Resolution:** Native support for both TypeScript path aliases (`@/...`) defined in `tsconfig.json` and relative paths (`../../...`).
- **Detection Breadth:** Capable of flagging boundary violations, circular import graphs, and dead/unused exports.
- **Performance:** Execution under 1 second to fit seamlessly into Lefthook `pre-push` git hooks without degrading developer velocity.
- **Developer Ergonomics:** Precompiled binary distribution (`@fallow-cli/linux-x64-gnu` via `pnpm dlx fallow` / `pnpm exec fallow`) with zero Rust compiler (`cargo`) requirement.

---

## Considered Options

### Option 1: Fallow (`github.com/fallow-rs/fallow`) — **Selected**
- **Pros:**
  - Rust-based native performance: analyzes module graphs, boundaries, and cycles in 20ms–40ms.
  - Native `boundaries.zones` with `autoDiscover` for feature-first folder slicing.
  - Parent rule inheritance: rules defined on `features` apply automatically to all discovered children.
  - Combines boundary enforcement, cycle detection (`fallow architecture`), and dead-code pruning (`fallow dead-code`) in a single binary.
  - Built-in TypeScript path alias resolution reads `tsconfig.json` without extra plugins.
  - Multi-platform precompiled npm binary wrappers; no compilation required.
- **Cons:**
  - Additional CLI tool in the repository stack.
  - Generates a local cache directory (`.fallow/`), though it automatically creates a self-contained `.gitignore` with `*`.

### Option 2: Biome (`noRestrictedImports` rule) — **Fallback**
- **Pros:**
  - Biome is already adopted in the repo for linting and formatting.
  - Zero new binary dependencies.
- **Cons:**
  - Static configuration only: does not support dynamic sibling-feature isolation (`autoDiscover`). Every feature slice would need manual path restriction rules in `biome.json`.
  - Does not construct full-project dependency graphs or detect circular dependencies across files.
  - Limited dead-code detection compared to specialized whole-graph analyzers.

### Option 3: Dependency Cruiser (`dependency-cruiser`)
- **Pros:**
  - Mature JavaScript/TypeScript ecosystem rule engine.
  - Highly expressive configuration for architectural constraints.
- **Cons:**
  - Node.js-based AST traversal is significantly slower (typically 2s–6s on medium monorepos), making pre-push gates sluggish.
  - Verbose regular expression configurations without native zero-config `autoDiscover`.

### Option 4: ESLint (`eslint-plugin-boundaries` / `import-x`)
- **Pros:**
  - Standard in legacy ESLint setups.
- **Cons:**
  - Strongly rejected: Repository decision in Issue #5 explicitly eliminated ESLint and Prettier in favor of high-performance tools. Reintroducing ESLint solely for boundary checks contradicts repo governance.

---

## Empirical Benchmarks & Verification

An empirical verification suite was implemented under [`docs/adr/fixtures/boundary-spike/`](./fixtures/boundary-spike/):
- **Slices created:**
  - `src/features/portfolio-showcase` (contains valid renders, deliberate circular imports `cycle-a.ts` <-> `cycle-b.ts`, and intentional boundary violation `illegal-cross-feature.ts`)
  - `src/features/contact-form` (clean feature slice consuming shared utilities and UI components)
  - `src/shared/utils/format.ts` (contains valid `formatDate` and deliberate unused dead export `unusedDeadHelper`)
  - `src/components/ui/button.ts` (reusable button primitive)
  - `tsconfig.json` with `@/*` mapped to `src/*`.

### Empirical Results

| Test Case | Target Checked | Fallow Command | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Cross-Feature Isolation** | `features/portfolio-showcase` importing sibling `features/contact-form` | `fallow architecture --boundaries` | Boundary violation flagged with exit code 1 | Detected `illegal-cross-feature.ts:5 (features/portfolio-showcase → features/contact-form)` in **0.02s** | **Pass** |
| **2. Allowed Shared Imports** | `features/*` importing `shared/*` and `components/ui/*` | `fallow architecture --boundaries` | Allowed; no false positives | Clean; allowed in **0.02s** | **Pass** |
| **3. Path Alias Resolution** | Imports using `@/components/ui/button` and cross-feature `@/features/...` | `fallow architecture --boundaries` | Resolved through `tsconfig.json` | Correctly identified physical zone from `@/` alias | **Pass** |
| **4. Circular Dependencies** | `cycle-a.ts` <-> `cycle-b.ts` | `fallow architecture --cycles` | Cycle detected with exit code 1 | Detected `cycle-a.ts → cycle-b.ts → cycle-a.ts` in **0.02s** | **Pass** |
| **5. Dead Code Detection** | Unused `unusedDeadHelper` export in `shared/utils` | `fallow dead-code` | Unused export flagged with exit code 1 | Detected `:8 unusedDeadHelper` in **0.03s** | **Pass** |
| **6. Zero-Config Slicing** | Dynamic zone expansion via `autoDiscover` | `fallow list --boundaries` | Auto-discovers child feature zones | Expanded `features` into `features/contact-form` and `features/portfolio-showcase` with inherited rules | **Pass** |

### Execution Performance Profile

- **`fallow architecture --boundaries`**: **0.02s** execution time.
- **`fallow architecture` (cycles + boundaries)**: **0.04s** execution time.
- **`fallow dead-code`**: **0.03s** execution time.
- **Cold run via `pnpm dlx`**: **~400ms**.
- **Memory footprint**: Peak RSS under 40 MB.

---

## Decision Outcome

**Verdict: Adopt Fallow.**

Fallow satisfies all 5 acceptance criteria established in the grill session with exceptional performance (< 50ms local analysis), zero false positives, native TS path alias awareness, and automatic feature zone discovery.

### Consequences

- **Positive:**
  - Architecture boundaries are mechanically enforced; sibling feature coupling is impossible to merge unnoticed.
  - Import cycles and dead code are detected in the same toolchain.
  - Sub-50ms execution ensures Lefthook pre-push hooks remain virtually instantaneous.
  - Zero maintenance burden as new feature folders are created.
- **Negative / Neutral:**
  - Adds a devDependency `fallow` in root `package.json`.
  - Cache folder `.fallow` is generated locally (automatically gitignored).

---

## Integration Blueprint (Follow-up Task)

To preserve the file boundaries of Task #7 (which strictly forbids modifying files owned by merged Task #5: `package.json`, `justfile`, `lefthook.yml`), the wiring will be executed in a dedicated follow-up chore:

### 1. Root `.fallowrc.jsonc` (Committed in Task #7)

```jsonc
{
	"$schema": "https://raw.githubusercontent.com/fallow-rs/fallow/main/schema.json",
	"entry": [
		"docs/adr/fixtures/boundary-spike/src/entry.ts",
		"apps/web/src/main.tsx",
		"apps/web/src/app/**"
	],
	"boundaries": {
		"zones": [
			{
				"name": "shared",
				"patterns": [
					"docs/adr/fixtures/boundary-spike/src/shared/**",
					"packages/shared/**",
					"apps/*/src/shared/**"
				]
			},
			{
				"name": "components-ui",
				"patterns": [
					"docs/adr/fixtures/boundary-spike/src/components/ui/**",
					"packages/ui/**",
					"apps/*/src/components/ui/**"
				]
			},
			{
				"name": "features",
				"autoDiscover": [
					"docs/adr/fixtures/boundary-spike/src/features",
					"apps/web/src/features"
				]
			}
		],
		"rules": [
			{
				"from": "features",
				"allow": ["shared", "components-ui"]
			}
		]
	}
}
```

### 2. Dependency (`package.json`)
```bash
pnpm add -D -w fallow
```

### 3. Justfile Recipes (`justfile`)
```justfile
# Check architectural boundaries and import cycles
architecture:
    pnpm exec fallow architecture

# Check for unused exports and dead code
dead-code:
    pnpm exec fallow dead-code
```

### 4. Git Pre-Push Hook (`lefthook.yml`)
```yaml
pre-push:
  commands:
    architecture:
      run: pnpm exec fallow architecture
    typecheck:
      run: pnpm -r --if-present typecheck
    test:
      run: pnpm -r --if-present test
```

### 5. CI Workflow (`.github/workflows/ci.yml`)
```yaml
- name: Architecture & Dead Code Quality Gate
  run: pnpm exec fallow architecture
```

---

## Follow-up Issues

1. **[`chore: wire fallow boundary enforcement into Lefthook and CI (#15)`](https://github.com/jaoppb/portfolio/issues/15)** (Milestone: `v0.1.0`, Parent Epic: `#3`, Priority: `P1`, Effort: `2`).
