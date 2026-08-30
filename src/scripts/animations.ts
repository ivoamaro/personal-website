import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Motion scale for every entrance animation, in seconds.
 *
 * Mirrors the `--motion-*` custom properties in `src/styles/tokens.css`; change
 * both so CSS transitions and GSAP tweens keep the same rhythm.
 */
const duration = {
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
} as const;

/** Seconds between consecutive items inside a single recipe. */
const stagger = {
  tight: 0.05,
  base: 0.06,
  loose: 0.08,
} as const;

/**
 * Named GSAP eases. These must be GSAP ease names, never CSS `cubic-bezier()`
 * strings: GSAP cannot parse those and silently substitutes its default ease,
 * so the intended curve is lost without any warning.
 */
const ease = {
  standard: "power2.out",
  overshoot: "back.out(1.4)",
} as const;

/** Distance in px that elements travel on entry. */
const shift = {
  sm: 16,
  md: 24,
} as const;

/** Seconds between consecutive members of a `data-animate-group`. */
const SEQUENCE_STEP = stagger.loose;

/**
 * Fraction of the viewport height at which an element scrolled into view starts
 * animating. Shared by the default ScrollTrigger start and the on-load
 * visibility test so the two thresholds cannot disagree.
 */
const TRIGGER_POSITION = 0.85;
const DEFAULT_START = `top ${TRIGGER_POSITION * 100}%`;

type Recipe = (el: HTMLElement) => gsap.core.Tween;

/**
 * Named animation recipes, applied to elements via `data-animate` in markup.
 *
 * Recipes animate `opacity` rather than `autoAlpha` because the runner manages
 * `visibility` separately to unhide the trigger element.
 */
const recipes = {
  fade: (el) =>
    gsap.from(el, {
      opacity: 0,
      duration: duration.base,
      ease: ease.standard,
    }),

  "fade-up": (el) =>
    gsap.from(el, {
      opacity: 0,
      y: shift.md,
      duration: duration.base,
      ease: ease.overshoot,
    }),

  words: (el) =>
    gsap.from(SplitText.create(el, { type: "words" }).words, {
      opacity: 0,
      stagger: stagger.tight,
      duration: duration.fast,
      ease: ease.standard,
    }),

  // Line splitting measures the rendered text, so this recipe needs the webfont
  // in place; see the `document.fonts.ready` note in `initAnimations`.
  lines: (el) =>
    gsap.from(SplitText.create(el, { type: "lines" }).lines, {
      opacity: 0,
      stagger: stagger.base,
      duration: duration.slow,
      ease: ease.overshoot,
    }),

  children: (el) =>
    gsap.from(el.children, {
      opacity: 0,
      y: shift.sm,
      stagger: stagger.loose,
      duration: duration.base,
      ease: ease.standard,
    }),
} satisfies Record<string, Recipe>;

export type AnimationName = keyof typeof recipes;

let context: ReturnType<typeof gsap.matchMedia> | undefined;
let hasAnimated = false;

/**
 * Whether an element is close enough to the viewport to animate as part of the
 * initial paint rather than on scroll.
 *
 * Deliberately uses `TRIGGER_POSITION`, the same threshold as the default
 * ScrollTrigger start, so an element can never be treated as on screen while
 * its trigger is still waiting for a scroll.
 */
function isOnScreen(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * TRIGGER_POSITION && rect.bottom > 0;
}

/**
 * Resolves an element's position on the load timeline, in seconds.
 *
 * Prefers an explicit `data-animate-delay`, then the element's index within its
 * `data-animate-group` multiplied by a fixed step, so authors declare ordering
 * instead of hand-computing delays that have to be renumbered when the sequence
 * changes.
 *
 * @param groupIndices Running per-group counter, mutated as groups are walked.
 */
function sequencePosition(
  el: HTMLElement,
  groupIndices: Map<string, number>,
): number {
  const { animateDelay, animateGroup } = el.dataset;

  if (animateDelay !== undefined) return Number(animateDelay) || 0;
  if (!animateGroup) return 0;

  const index = groupIndices.get(animateGroup) ?? 0;
  groupIndices.set(animateGroup, index + 1);
  return index * SEQUENCE_STEP;
}

/**
 * Binds every `[data-animate]` element on the page to its named recipe,
 * reverting the previous page's animations first.
 *
 * Elements already on screen share a single load timeline so their sequencing is
 * a timeline position on one clock. Everything else gets a ScrollTrigger and
 * plays unsequenced, because a delay on a scrolled-to element only reads as lag.
 *
 * Supported attributes:
 * - `data-animate` — recipe name, required
 * - `data-animate-group` — sequences on-screen members in document order,
 *   replacing hand-written delays
 * - `data-animate-delay` — seconds, escape hatch that overrides group ordering;
 *   honoured only when the element is already on screen
 * - `data-animate-start` — ScrollTrigger start position, defaults to "top 85%";
 *   ignored for elements already on screen
 * - `data-animate-once` — play on the visitor's first page only, for chrome that
 *   is repeated on every page
 *
 * Safe to call on every navigation. All work happens inside a `matchMedia`
 * context, so nothing is created for users who prefer reduced motion and a
 * single revert tears down tweens, ScrollTriggers, splits and inline styles.
 */
export function initAnimations(): void {
  context?.revert();
  context = gsap.matchMedia();

  context.add("(prefers-reduced-motion: no-preference)", () => {
    const elements = document.querySelectorAll<HTMLElement>("[data-animate]");
    const isFirstRun = !hasAnimated;
    hasAnimated = true;

    const load = gsap.timeline();
    const groupIndices = new Map<string, number>();

    elements.forEach((el) => {
      const name = el.dataset.animate as AnimationName;
      const recipe = recipes[name];

      // Stylesheet pre-hides these elements to avoid a flash before this runs.
      gsap.set(el, { visibility: "visible" });

      if (!recipe) {
        console.warn(`Unknown data-animate value: "${name}"`, el);
        return;
      }

      // Chrome that is present on every page would otherwise replay its intro on
      // each navigation, so leave it in its revealed state after the first page.
      if (!isFirstRun && el.hasAttribute("data-animate-once")) return;

      if (isOnScreen(el)) {
        load.add(recipe(el), sequencePosition(el, groupIndices));
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        start: el.dataset.animateStart ?? DEFAULT_START,
        once: true,
        animation: recipe(el).pause(),
      });
    });

    // Webfonts land after this runs and reflow the page, which leaves the start
    // positions measured above stale.
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  });
}
