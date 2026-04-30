# npm Publishing & GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure `react-tree-grid` for manual npm publishing as `@itsmemyk/react-tree-grid` and manual Storybook deployment to GitHub Pages via the `gh-pages` package.

**Architecture:** Two independent config changes — `package.json` gets npm metadata + `gh-pages` tooling, and `.storybook/main.ts` gets a base path so Storybook assets resolve correctly under the GitHub Pages subpath.

**Tech Stack:** npm (registry publishing), `gh-pages` npm package, Storybook, GitHub Pages

---

## File Map

| File | Change |
|------|--------|
| `package.json` | Rename to scoped name, add `publishConfig`, `prepublishOnly`, `repository`, `homepage`, `bugs`, `gh-pages` devDep, `deploy-storybook` script |
| `.storybook/main.ts` | Add `config.base = '/react-tree-grid/'` in `viteFinal` |

---

### Task 1: Update package.json for npm publishing

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update `name`, `publishConfig`, metadata fields, and `prepublishOnly` script**

Open `package.json` and apply these changes:

```json
{
  "name": "@itsmemyk/react-tree-grid",
  "version": "0.1.0",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/itsmemyk/react-tree-grid.git"
  },
  "homepage": "https://itsmemyk.github.io/react-tree-grid/",
  "bugs": {
    "url": "https://github.com/itsmemyk/react-tree-grid/issues"
  },
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

Merge these into the existing `package.json` — do not remove existing fields. The `scripts` block should have `prepublishOnly` added alongside the existing scripts.

- [ ] **Step 2: Verify the build still passes**

```bash
npm run build
```

Expected output: TypeScript compiler reports no errors, Vite produces files in `dist/`. Last line should be something like `✓ built in Xs`.

- [ ] **Step 3: Verify npm pack output (dry run)**

```bash
npm pack --dry-run
```

Expected: lists only files under `dist/` plus `package.json`, `README.md`. Confirm the package name shown is `@itsmemyk/react-tree-grid`. No `node_modules`, `src`, or `stories` files should appear.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: configure package for npm publishing as @itsmemyk/react-tree-grid"
```

---

### Task 2: Add gh-pages deploy tooling

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `gh-pages`**

```bash
npm install --save-dev gh-pages
```

Expected: `gh-pages` appears in `devDependencies` in `package.json` and `package-lock.json` is updated.

- [ ] **Step 2: Add `deploy-storybook` script to `package.json`**

In the `scripts` block, add:

```json
"deploy-storybook": "storybook build && gh-pages -d storybook-static"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gh-pages deploy script for Storybook"
```

---

### Task 3: Fix Storybook base path for GitHub Pages

**Files:**
- Modify: `.storybook/main.ts`

- [ ] **Step 1: Add `config.base` in `viteFinal`**

Open `.storybook/main.ts`. The current `viteFinal` function looks like:

```typescript
viteFinal(config) {
  config.resolve ??= {}
  config.resolve.alias = {
    ...config.resolve.alias,
    '@core': resolve(__dirname, '../src/core'),
  }
  return config
},
```

Update it to:

```typescript
viteFinal(config) {
  config.resolve ??= {}
  config.resolve.alias = {
    ...config.resolve.alias,
    '@core': resolve(__dirname, '../src/core'),
  }
  config.base = '/react-tree-grid/'
  return config
},
```

- [ ] **Step 2: Build Storybook and verify base path in output**

```bash
npm run build-storybook
```

Expected: builds without errors into `storybook-static/`. Then inspect the generated HTML:

```bash
grep 'base\|/react-tree-grid/' storybook-static/index.html | head -5
```

Expected: asset `<script>` and `<link>` tags reference `/react-tree-grid/` as the path prefix (e.g. `src="/react-tree-grid/sb-preview/..."`).

- [ ] **Step 3: Commit**

```bash
git add .storybook/main.ts
git commit -m "chore: set Storybook base path for GitHub Pages deployment"
```

---

### Task 4: Deploy Storybook to GitHub Pages (one-time setup + first deploy)

> This task requires the GitHub repo to have Pages enabled. Complete the GitHub setup in Step 1 before running the deploy command.

- [ ] **Step 1: Enable GitHub Pages in the repo settings**

1. Go to `https://github.com/itsmemyk/react-tree-grid/settings/pages`
2. Under **Source**, select `Deploy from a branch`
3. Set **Branch** to `gh-pages`, folder to `/ (root)`
4. Click **Save**

If the `gh-pages` branch does not exist yet, it will be created automatically by the next step.

- [ ] **Step 2: Run the deploy**

```bash
npm run deploy-storybook
```

Expected output:
```
...Storybook build output...
Published
```

The `gh-pages` package pushes `storybook-static/` to the `gh-pages` branch on the remote.

- [ ] **Step 3: Verify the deployment**

Wait ~1 minute, then open `https://itsmemyk.github.io/react-tree-grid/` in a browser. The Storybook UI should load with stories visible. If it shows a blank page or 404, check that the base path in `storybook-static/index.html` starts with `/react-tree-grid/`.

---

## npm Publish Cheat Sheet (for future use)

When ready to publish a release:

```bash
# One-time: authenticate with npm
npm login

# Bump version in package.json first, e.g.:
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0
npm version major   # 0.1.0 → 1.0.0

# Publish (triggers prepublishOnly → npm run build automatically)
npm publish
```

The package will be available at `https://www.npmjs.com/package/@itsmemyk/react-tree-grid`.
