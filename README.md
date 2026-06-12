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

## Data sources

All indicators are public and are joined on ISO 3166-1 alpha-3 country code. Vintages
reflect the most recent release available when the dataset was assembled.

| Pillar | Indicator(s) | Source | Vintage | File / column |
|---|---|---|---|---|
| Health & Longevity | Life expectancy at birth | UNDP, Human Development Report 2025 | 2023 ref. year | `HDR25_Composite_indices…csv` → `le_2023` |
| Material & Human Development | GNI per capita (PPP); expected & mean years of schooling | UNDP, HDR 2025 | 2023 | `gnipc_2023`, `eys_2023`, `mys_2023` |
| Freedom & Rights | Freedom in the World aggregate (political rights + civil liberties, 0–100); World Press Freedom Index (0–100) | Freedom House (via Our World in Data); Reporters Without Borders | 2025 | `freedom-score-fh.csv` → "Total democracy score"; RSF 2025 list |
| Power & Influence | Global Presence Index — overall value (economic + military + soft presence) | Real Instituto Elcano, Global Presence Index 2025 edition | 2024 data | `elcano_2024_all_.csv` → `GLOBAL` |
| Safety | Intentional homicide rate (per 100,000) | UNODC (via Our World in Data) | latest per country (mostly 2021–2023) | `homicide-rate-unodc.csv` |
| Governance & Integrity | Corruption Perceptions Index (0–100) | Transparency International (via Our World in Data) | 2024 | `ti-corruption-perception-index.csv` |

### Country matching & coverage

- The Our World in Data files and the HDR file carry ISO codes, so they join directly.
- RSF and Elcano publish by country **name** only, so they're matched through a
  normalized-name crosswalk — Unicode-folded to ASCII, lowercased, punctuation stripped,
  "&" → "and" — built from the ISO-bearing sources, plus a manual alias table for naming
  mismatches (e.g. "Czech Republic" → CZE, "United States of America" → USA,
  "Republic of Moldova" → MDA, "Congo DR" → COD).
- A country is included **only if it has complete data on every pillar** (life expectancy,
  schooling, GNI, homicide, CPI, Elcano, and at least one of Freedom House / RSF). Countries
  missing any pillar are **dropped, not imputed**, which yields the 112-country sample.
  Coverage is gated mainly by the homicide series.
## How the scores are computed

### 1. Per-indicator normalization

Every indicator is rescaled to a common **1–100** range by min–max across the sample:

```
scaled = 1 + 99 * (x - min) / (max - min)
```

so the sample minimum maps to 1 and the maximum to 100. The floor is 1 (not 0) so that the
geometric mean below never takes the log of zero. All scaling is therefore **relative to the
112-country sample**, not absolute.

Three indicators are transformed *before* scaling:

- **GNI per capita** — natural-log transformed (`ln(GNI)`) before min–max, reflecting the
  diminishing returns of income.
- **Elcano global presence** — natural-log transformed (`ln(max(value, 0.5))`) before
  min–max. The raw index is extremely top-heavy (the US and China are multiples of everyone
  else); the log keeps that superpower gap from swamping the pillar at equal weights. The
  `0.5` floor guards against the log of a near-zero value.
- **Homicide rate** — negated (`-rate`) before min–max, inverting it so fewer homicides →
  higher safety. This is a linear inversion, not a reciprocal.
Life expectancy, CPI, and the freedom composite are scaled directly with no pre-transform.

### 2. Building the six pillars

- **Health & Longevity** = scaled life expectancy.
- **Governance & Integrity** = scaled CPI.
- **Safety** = scaled (negated) homicide rate.
- **Power & Influence** = scaled `ln(Elcano global presence)`.
- **Freedom & Rights** — Freedom House and RSF are *both already on a 0–100 scale*, so they
  are **averaged first** (whichever are present; if only one, that one is used), and the
  average is then min–max scaled.
- **Material & Human Development** — built in stages so each input gets equal footing:
  1. scale `ln(GNI)` → income index;
  2. scale expected years and mean years of schooling **separately**, then average them →
     education index;
  3. average the income and education indices, then **min–max scale that average again** →
     development pillar.
Note the deliberate asymmetry between the two composites: the schooling sub-indicators are
scaled individually *before* averaging (they sit on different ranges), whereas Freedom House
and RSF are averaged on their *raw* values (they already share a 0–100 scale).

### 3. Composite score

The six pillar scores are combined with a **weighted geometric mean** (the default):

```
composite = exp( sum(w_k * ln(p_k)) / sum(w_k) )
```

with an **arithmetic-mean** option available in the UI for comparison:

```
composite = sum(w_k * p_k) / sum(w_k)
```

The geometric mean penalizes imbalance — a country can't offset a near-bottom pillar with a
stellar one — which is exactly why the 1-floor on every pillar matters. Weights `w_k` come
from the sliders and need not sum to anything; they're normalized by `sum(w_k)`. The default
is equal weights.

### 4. Rank-uncertainty bands

For each country the app draws **500 random weightings** (each pillar weight drawn from a
Uniform(0, 1)), recomputes the composite and the full ranking on every draw, and records
where the country lands. The band shows the 5th–95th percentile of those ranks, with the
median marked; it is recomputed when you switch between geometric and arithmetic. A short
band means the rank is robust to how you weigh the pillars; a long band means the rank is
largely an artifact of weighting.

### Reading it honestly

- Scores are **relative** to the 112-country sample, not absolute statements about a country.
- Each pillar leans on only one or two indicators — this is a deliberately legible index,
  not an exhaustive one.
- Gaps of a few ranks sit within the weighting noise; trust the uncertainty bands over the
  exact ordinal.
(This mirrors the in-app **Methodology** tab, in more technical detail.)

## Notes

- Single page, no client-side routing, so **no `_redirects` / SPA fallback** is needed.
- If the Cloudflare build ever complains about the Node version, the `.nvmrc` (Node 20)
  should handle it; otherwise set an environment variable `NODE_VERSION=20` in the Pages
  project settings.
- To update the data later: re-run your build pipeline, replace `src/App.jsx`, commit, push —
  Cloudflare rebuilds and redeploys on every push to `main`.

