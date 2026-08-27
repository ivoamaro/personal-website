# Architecture

Astro site deployed to Cloudflare. Content lives at the repo root (`content/`) and is loaded via collections in `src/content.config.ts`. Pages are file-based under `src/pages/`.

## Directory Structure

```text
content/                  # CMS / markdown content (outside src)
├── work/
└── site-settings.json
src/
├── components/
│   ├── design-system/    # Header, ListItem, banners
│   ├── experiments/      # Exploratory / one-off visuals
│   ├── ui/               # Shared primitives (Button, Block, …)
│   ├── Navbar.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── exploratory.astro
│   └── work/
│       ├── index.astro
│       └── [slug].astro
├── styles/               # tokens, layout, global
├── scripts/
└── content.config.ts     # homepage + work collections
public/                   # static assets and uploads
```
