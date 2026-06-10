# SHS '76 — 50th reunion site

Next.js (App Router) + TypeScript + Tailwind single-page reunion site, deployed as static export for Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The first `npm run dev` (and every `npm run build`) runs `photos:build` automatically to generate optimized gallery images from `photos-source/`.

## Memory photos

Gallery originals live in [`photos-source/`](photos-source/) (committed). Build output goes to `public/photos/thumbs/` and `public/photos/display/` (gitignored, regenerated on each build).

**Adding a reunion photo:**

1. Drop the file into `photos-source/` (`.jpeg`, `.jpg`, or `.png`).
2. Add an entry to [`data/memory-photos.ts`](data/memory-photos.ts) with `id` (filename without extension), `alt`, and `caption`.
3. Run `npm run dev` or `npm run build` to regenerate web variants.
4. Commit the source file and metadata only — not the generated thumbs/display folders.

To rebuild photos manually:

```bash
npm run photos:build
```

## Production build/export

```bash
npm run build
```

With `output: 'export'`, this produces a static site in `out/`.

## Push to GitHub

From this folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Deploy on Cloudflare Pages

The site is static files in `out/` after `next build`.

1. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select your GitHub account and this repository.
3. Configure the build:

| Setting | Value |
|--------|--------|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `npm ci && npm run build` |
| **Build output directory** | `out` |
| **Root directory** | `/` (repository root) |

4. Use **Node.js** version **20** or newer (Pages → Settings → Environment variables → add `NODE_VERSION` = `20` if needed).

5. Deploy. Your site will be served from `out/`. The `public/_headers` file is copied into the export and applies cache hints for `/_next/static/*` and optimized gallery photos under `/photos/thumbs/*` and `/photos/display/*`.

### Custom domain

In the Pages project → **Custom domains**, attach your domain and follow Cloudflare DNS prompts.

Cloudflare Pages does not need a Node runtime for this deployment path.
