import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Recipe = (el: HTMLElement) => gsap.core.Tween;

/**
 * Named animation recipes, applied to elements via `data-animate` in markup.
 *
 * Recipes return an unpaused tween; the runner nests each one in a paused
 * timeline so ScrollTrigger owns playback. Recipes animate `opacity` rather
 * than `autoAlpha` because the runner manages `visibility` separately to
 * unhide the trigger element.
 */
const recipes = {
  fade: (el) =>
    gsap.from(el, {
      opacity: 0,
      duration: 0.6,
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    }),

  "fade-up": (el) =>
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    }),

  words: (el) =>
    gsap.from(SplitText.create(el, { type: "words" }).words, {
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    }),

  lines: (el) =>
    gsap.from(SplitText.create(el, { type: "lines" }).lines, {
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    }),

  children: (el) =>
    gsap.from(el.children, {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.6,
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    }),
} satisfies Record<string, Recipe>;

export type AnimationName = keyof typeof recipes;

let context: ReturnType<typeof gsap.matchMedia> | undefined;
let hasAnimated = false;

/**
 * Binds every `[data-animate]` element on the page to its named recipe,
 * reverting the previous page's animations first.
 *
 * Supported attributes:
 * - `data-animate` — recipe name, required
 * - `data-animate-delay` — seconds to wait before playing, honoured only when
 *   the element is already on screen at init; defaults to 0
 * - `data-animate-start` — ScrollTrigger start position, defaults to "top 85%"
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

      // Delays sequence the initial load; on elements revealed by scrolling
      // they only read as lag, so ignore them when off screen at init.
      const rect = el.getBoundingClientRect();
      const isVisibleOnLoad = rect.top < window.innerHeight && rect.bottom > 0;
      const delay = isVisibleOnLoad ? Number(el.dataset.animateDelay) || 0 : 0;

      ScrollTrigger.create({
        trigger: el,
        start: el.dataset.animateStart ?? "top 85%",
        once: true,
        // Nesting the tween in a timeline turns the delay into a timeline
        // position, which survives the pause/resume that a plain tween delay
        // would be discarded by.
        animation: gsap.timeline({ paused: true }).add(recipe(el), delay),
      });
    });
  });
}
