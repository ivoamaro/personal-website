# Changelog

Significant project changes only (architecture, conventions, decisions).

## 2026-08-30

- Motion has a token scale: `--motion-*` in `src/styles/tokens.css` for CSS transitions, mirrored by the `duration`/`stagger`/`ease`/`shift` consts at the top of `src/scripts/animations.ts` for GSAP. Change both together; recipes no longer hard-code durations.
- Eases must be GSAP ease names (`power2.out`, `back.out(1.4)`). CSS `cubic-bezier()` strings are unparseable by GSAP and were being silently replaced by its default ease, so no recipe had ever used its intended curve.
- Sequence elements with `data-animate-group="<name>"` instead of hand-computed `data-animate-delay` values; the runner spaces on-screen group members by document order. `data-animate-delay` remains as a per-element escape hatch.
- Elements already on screen share one load timeline rather than each owning a ScrollTrigger, and the on-load visibility test now derives from the same `TRIGGER_POSITION` constant as the default trigger start, so an element can no longer keep a delay while waiting for a scroll.

## 2026-08-28

- Animations are declarative: tag elements with `data-animate="<recipe>"` instead of writing GSAP in component scripts. Recipes live in `src/scripts/animations.ts`.
- `data-animate-delay` (seconds) staggers elements that are already in view on load; each tween is nested in a paused timeline so the delay is a timeline position rather than a tween delay.
- `initAnimations` runs on `astro:page-load` so animations survive `ClientRouter` navigations; a `gsap.matchMedia` context handles reduced-motion and per-page teardown.
- Dropped `scroll-behavior: smooth` from `global.css` (conflicted with Lenis) and imported `lenis/dist/lenis.css`.

## 2026-08-27

- Cursor rules are tracked in git (`.cursor/rules/`); other `.cursor/` files stay ignored.
- Slimmed `docs/` to architecture + index; dropped planned stub docs.
- Content lives at repo root (`content/`), loaded via `src/content.config.ts`.
