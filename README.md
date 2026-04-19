# SHS ’76 — 50th reunion site

Static landing page (Tailwind CSS) served locally by NestJS from `public/`, or deployed as **pure static files** (recommended for Cloudflare Pages).

## Local development

```bash
npm install
npm run build:css   # compile Tailwind → public/styles.css
npm run start:dev   # Nest + CSS watch (optional)
```

Open `http://localhost:3000`. To hack CSS only, you can open `public/index.html` in a browser after running `npm run build:css`.

## Push to GitHub

1. Create a **new empty repository** on GitHub (no README/license if you want a clean first push).

2. From this folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` / `YOUR_REPO` with your GitHub username and repository name.

## Deploy on Cloudflare Pages

The site is static files under `public/` after Tailwind builds.

1. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select your GitHub account and this repository.
3. Configure the build:

| Setting | Value |
|--------|--------|
| **Framework preset** | None |
| **Build command** | `npm ci && npm run build:css` |
| **Build output directory** | `public` |
| **Root directory** | `/` (repository root) |

4. Use **Node.js** version **20** or newer (Pages → Settings → Environment variables → add `NODE_VERSION` = `20` if needed).

5. Deploy. Your site will be served from the contents of `public/` (including `_headers` for cache hints on `/styles.css`).

### Custom domain

In the Pages project → **Custom domains**, attach your domain and follow Cloudflare DNS prompts.

---

The NestJS app (`npm run start:prod`) is optional for production; Cloudflare does not run Node for static Pages hosting.
