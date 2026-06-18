# Changelog

## 4.0.0

Modernized release. **Breaking changes** — review before upgrading.

### Breaking
- Now built on **[inversify-props](https://github.com/CKGrafico/inversify-props) 3** (inversify 8). Requires `inversify-props@^3`.
- **ESM-first** with a dual ESM + CommonJS build and an `exports` map. Bundlers need no change; consuming via `require()` from plain CommonJS Node needs **Node 20.19+ or 22+**.
- `react` moved to **`peerDependencies`** (`>=16.8`) — it uses your app's React instead of bundling one.
- `reflect-metadata` is no longer required (inversify 8 bundles it) — drop the separate install and the `import 'reflect-metadata'` line.

### Changed
- TypeScript 5; tests migrated to **vitest** (run against React 19).
- The example app rebuilt on **Vite** (was Create React App).

### Added
- GitHub Actions CI and an [agent skill](skills/inversify-hooks/SKILL.md) (`npx skills add CKGrafico/inversify-hooks`).
- Rewritten README.

### Notes
- The API is unchanged: `useInject` plus the re-exported `container`, `cid`, `@inject`, `injectable`, `mock*`, etc.
- Keep `useDefineForClassFields: false` and ensure your minifier preserves class names (`keepNames`).
