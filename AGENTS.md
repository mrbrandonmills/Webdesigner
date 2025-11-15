# Repository Guidelines

## Project Structure & Module Organization
Next.js 15 drives the stack. `app/` holds the App Router tree and API routes (`app/api/{auth,ai,webflow,printful,...}`), `components/` contains UI building blocks, and shared copy/data/types live in `content/`, `data/`, and `types/`. Business logic and integrations (Cloudinary, Webflow, Stripe) live in `lib/`, automation scripts stay in `scripts/`, and the docs/research artifacts remain at the root.

## Build, Test, and Development Commands
- `npm install` — install deps (Node 22+ required for Stripe and Vercel Blob SDKs).
- `npm run dev` — dev server at http://localhost:3000 for AI upload and affiliate HQ flows.
- `npm run build && npm start` — production smoke test before Vercel deploys.
- `npm run lint` — enforce hooks rules, Tailwind ordering, and TypeScript strictness.
- `node scripts/test-security.js` — rate-limiting, env-leak, and auth regression suite.

## Coding Style & Naming Conventions
Use 2-space TypeScript, kebab-case filenames (`components/gallery/hero-banner.tsx`), PascalCase components, and add `'use client'` only when hooks/browser APIs demand it. Server-only utilities stay in `lib/*` modules without client directives. Keep Tailwind utilities ordered layout → spacing → color and extract repeated combos into helper components. Follow the `app/api/<domain>/<action>/route.ts` convention and define Zod schemas next to each handler for request/response validation.

## Testing Guidelines
Before raising a PR, run `npm run lint`, `node scripts/test-security.js`, and whichever automation scripts you touched (for example `node scripts/test-affiliate-system.js`). Manually walk through `STORE_TESTING_CHECKLIST.md`: upload ≥3 photos, attach a voice memo, confirm AI review/edit/publish, and create an affiliate credential via `scripts/affiliate-account-creator.js`. Capture console/network output for failures, summarize them in the checklist or PR, and when touching rate limiting or auth also run `test-rate-limiting.js` plus the `/api/debug-auth` routes in staging.

## Commit & Pull Request Guidelines
History mixes emoji-prefixed releases with standard `fix:` subjects; keep messages imperative (`Fix syntax error in debug-auth route`, `📊 Complete Revenue Strategy`). Use the body to note which surfaces changed (AI upload, affiliate automation, e-commerce) and the scripts/tests you ran. PRs need screenshots or short clips for UI work, callouts for new environment variables (OpenAI, Anthropic, Cloudinary, Webflow, Stripe, Printful), deployment notes (Vercel), and a passing local lint/build before review.

## Security & Data Handling
Keep `.env*`, API keys, Stripe secrets, Cloudinary credentials, Webflow tokens, and generated media/CSV exports (`products_*.csv`) out of Git. Use the sample config files, rotate keys via Vercel/Vault before demos, and scrub PII or client imagery from anything shared in docs or PRs.
