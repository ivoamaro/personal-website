/** Class that reveals a preview layer; matches the styles in `src/pages/index.astro`. */
const ACTIVE_CLASS = "is-active";

/**
 * Crossfades a work preview over the profile image while the matching item in
 * the selected work list is hovered or focused, and clears it on the way out.
 *
 * Every preview is already in the DOM as a stacked, transparent layer, so this
 * only moves a class around: nothing is fetched on first hover.
 *
 * Expected markup:
 * - `[data-work-list]` — the list wrapper that receives the delegated listeners
 * - `[data-work-item="<index>"]` — a list item
 * - `[data-work-preview="<index>"]` — the layer revealed for that item
 *
 * Safe to call on every navigation. Listeners are bound to elements that
 * `ClientRouter` discards on swap, so no teardown is needed.
 */
export function initWorkPreview(): void {
  const list = document.querySelector<HTMLElement>("[data-work-list]");
  if (!list) return;

  const layers = new Map(
    Array.from(
      document.querySelectorAll<HTMLElement>("[data-work-preview]"),
      (layer) => [layer.dataset.workPreview, layer] as const,
    ),
  );
  if (layers.size === 0) return;

  // On touch, a tap would latch a preview open with no way to dismiss it.
  if (!window.matchMedia("(hover: hover)").matches) return;

  let active: HTMLElement | undefined;

  /** Reveals the layer for a work item, or clears the current one when passed nothing. */
  function show(index: string | undefined): void {
    const layer = index === undefined ? undefined : layers.get(index);
    if (layer === active) return;

    active?.classList.remove(ACTIVE_CLASS);
    layer?.classList.add(ACTIVE_CLASS);
    active = layer;
  }

  /** Resolves the work item index owning an event target, if any. */
  function itemIndex(target: EventTarget | null): string | undefined {
    if (!(target instanceof Element)) return undefined;
    return target.closest<HTMLElement>("[data-work-item]")?.dataset.workItem;
  }

  // pointerover/out bubble, so one pair of listeners covers every item; moving
  // between two items fires both, and the incoming `over` wins by ordering.
  list.addEventListener("pointerover", (event) => show(itemIndex(event.target)));
  list.addEventListener("pointerout", (event) => {
    if (itemIndex(event.relatedTarget) === undefined) show(undefined);
  });

  list.addEventListener("focusin", (event) => show(itemIndex(event.target)));
  list.addEventListener("focusout", (event) => {
    if (itemIndex(event.relatedTarget) === undefined) show(undefined);
  });
}
