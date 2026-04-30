# Design: npm Publishing & Storybook GitHub Pages Deployment

**Date:** 2026-04-30
**Scope:** Manual npm publish for `@itsmemyk/react-tree-grid` + manual Storybook deploy to GitHub Pages via `gh-pages`.

---

## npm Publishing

### package.json changes

- **`name`**: `@itsmemyk/react-tree-grid` (scoped to npm user `itsmemyk`)
- **`publishConfig`**: `{ "access": "public" }` — scoped packages default to private; this makes the publish public
- **`prepublishOnly` script**: `npm run build` — ensures `dist/` is rebuilt from source before every publish
- **`repository`**: `{ "type": "git", "url": "https://github.com/itsmemyk/react-tree-grid.git" }`
- **`homepage`**: `https://itsmemyk.github.io/react-tree-grid/`
- **`bugs`**: `{ "url": "https://github.com/itsmemyk/react-tree-grid/issues" }`

### Publish workflow

1. `npm login` (one-time, authenticates with npmjs.com)
2. `npm publish` — triggers `prepublishOnly` (build), then publishes `dist/` to the registry

---

## Storybook → GitHub Pages

### package.json changes

- Add `gh-pages` to `devDependencies`
- Add script: `"deploy-storybook": "storybook build && gh-pages -d storybook-static"`

### .storybook/main.ts change

In `viteFinal`, set `config.base = '/react-tree-grid/'`.

GitHub Pages serves the site at `https://itsmemyk.github.io/react-tree-grid/`. Without the base path, all asset URLs resolve relative to the domain root and 404.

### One-time GitHub repo setup

In the GitHub repo → Settings → Pages:
- Source: `Deploy from a branch`
- Branch: `gh-pages`, folder: `/ (root)`

### Deploy workflow

1. `npm run deploy-storybook` — builds Storybook then pushes `storybook-static/` to the `gh-pages` branch
2. GitHub Pages automatically serves the updated branch (typically within ~1 minute)

---

## Out of scope

- Automated CI/CD (GitHub Actions) for either npm or GitHub Pages
- Changelog generation or version bumping automation
- npm provenance or signed releases
