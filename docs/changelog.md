# Changelog

Significant project changes only (architecture, conventions, decisions).

## 2026-08-28

- Animations are declarative: tag elements with `data-animate="<recipe>"` instead of writing GSAP in component scripts. Recipes live in `src/scripts/animations.ts`.
- `data-animate-delay` (seconds) staggers elements that are already in view on load; each tween is nested in a paused timeline so the delay is a timeline position rather than a tween delay.
- `initAnimations` runs on `astro:page-load` so animations survive `ClientRouter` navigations; a `gsap.matchMedia` context handles reduced-motion and per-page teardown.
- Dropped `scroll-behavior: smooth` from `global.css` (conflicted with Lenis) and imported `lenis/dist/lenis.css`.

## 2026-08-27

- Cursor rules are tracked in git (`.cursor/rules/`); other `.cursor/` files stay ignored.
- Slimmed `docs/` to architecture + index; dropped planned stub docs.
- Content lives at repo root (`content/`), loaded via `src/content.config.ts`.
