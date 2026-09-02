# Changelog

Significant project changes only (architecture, conventions, decisions).

## 2026-09-02

- Homepage hover previews live in `public/work/` and are served as plain `<img>` URLs, replacing the `src/assets/work/` glob from 2026-09-01. Each work item names its own file via `preview`; omitting it drops the preview, since a public path cannot be validated at build time. These images bypass Astro's image pipeline, so size and compress them before committing.

## 2026-09-01

- Never put `data-animate` on an element whose visibility is CSS-state-driven. The runner writes inline `opacity`/`visibility`, which outranks any stylesheet rule, so the element can no longer be opened or closed by CSS. The navbar's fade moved from `ul.menu` onto its `li` items for this reason.
- Spacing utilities (`space-y-*`, `space-b-*`, `space-t-*`) follow the same mobile-first prefixes as columns: base, `md:` at 768px, `lg:` at 1024px.
- Homepage work items carry a `slug`, and their hover preview is resolved by filename from `src/assets/work/` via `import.meta.glob`. Add a preview by dropping `<slug>.jpg` in that folder; an item with no matching file simply has no preview instead of failing the build.
- Previews render up front as stacked transparent layers over the profile image; `src/scripts/workPreview.ts` only toggles `is-active`, so hovering never triggers a fetch.

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
