# BEACON — Vite app for Cloudflare Pages

An interactive composite index of national flourishing. Static single-page React app,
built with Vite, deployed to Cloudflare Pages.

## What's in here

```
beacon/
  index.html        app shell — <head> has Typekit preconnect + Requiem preload + kit, title, lang, reset
  vite.config.js    Vite + React plugin
  package.json      React + Vite, scripts: dev / build / preview
  .gitignore        ignores node_modules and dist
  .nvmrc            pins Node 20 for the Cloudflare build
  src/
    main.jsx        React entry — mounts <App/>
    App.jsx         the BEACON component (the index itself)
  public/
    fonts/          >>> ADD YOUR TWO REQUIEM .woff2 FILES HERE <<<
```

## 1. Add the fonts (required)

Drop these two files into `public/fonts/` (they are NOT in this repo):

- `RequiemText-HTF-Roman.woff2`
- `RequiemText-HTF-Italic.woff2`

Anything in `public/` is served from the site root, so they land at
`/fonts/RequiemText-HTF-Roman.woff2` — which is what the `@font-face` rules in
`src/App.jsx` reference (with your byrnecreative.com URLs kept as a fallback).

## 2. Run locally

```bash
npm install
npm run dev        # open the printed localhost URL and verify it renders
npm run build      # produces the static site in dist/
npm run preview    # serve the built dist/ to sanity-check the production build
```

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "BEACON index"
git branch -M main
git remote add origin git@github.com:<you>/beacon.git
git push -u origin main
```

`node_modules` and `dist` are gitignored on purpose — Cloudflare builds `dist` itself.

## 4. Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
2. Build settings:
   - **Framework preset:** Vite  (or "None")
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. **Save and Deploy.** You'll get a `*.pages.dev` URL to test.
4. **Custom domain:** project → **Custom domains → Set up a custom domain →**
   `beacon.byrnecreative.com`. Since byrnecreative.com is on Cloudflare DNS, it adds the
   CNAME and provisions SSL automatically.

## 5. Fonts — the one easy-to-forget step

In **Adobe Fonts** (Typekit), open the web project for kit `jqp6jnv` and add your domains
to its allowed list, or Hypatia Sans Pro won't load on the live site:

- `beacon.byrnecreative.com`
- your `*.pages.dev` preview domain (for testing)

The self-hosted Requiem files load from `/fonts` on your own origin, so they need no extra config.

## Notes

- Single page, no client-side routing, so **no `_redirects` / SPA fallback** is needed.
- If the Cloudflare build ever complains about the Node version, the `.nvmrc` (Node 20)
  should handle it; otherwise set an environment variable `NODE_VERSION=20` in the Pages
  project settings.
- To update the data later: re-run your build pipeline, replace `src/App.jsx`, commit, push —
  Cloudflare rebuilds and redeploys on every push to `main`.
