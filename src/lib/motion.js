import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/*
 * Motion for the console — gsap.com/showcase as the bar, applied where an app
 * shell earns it: the navigation. Menus cascade rather than appear, drilling
 * into a section feels like moving through space rather than swapping a list,
 * and the page you arrive at announces itself with its title rising into place.
 *
 * Everything here is short. This is a tool someone uses all day; motion that
 * delights once and delays forever after is a regression, so nothing runs
 * longer than it takes the eye to get there.
 */

gsap.registerPlugin(useGSAP, SplitText);

export { gsap, SplitText, useGSAP };

export const EASE = 'expo.out';

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
 * A staggered entrance for a set of elements.
 *
 * The nav's items carry `transition: all` for their hover states. Left on, it
 * eases every frame GSAP writes, so a 0.6s cascade lags a beat behind itself
 * and lands soft. It is switched off only for the length of the tween and
 * handed straight back, so hover behaves exactly as it did.
 */
export function cascade(targets, { x = 0, y = 0, stagger = 0.03, delay = 0, duration = 0.6 } = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length || reducedMotion()) return null;
  return gsap.fromTo(
    els,
    { autoAlpha: 0, x, y, transition: 'none' },
    {
      autoAlpha: 1, x: 0, y: 0, duration, delay, stagger, ease: EASE,
      clearProps: 'transition,transform,opacity,visibility',
    },
  );
}

/*
 * Smooth scrolling for the page. The window scrolls, not a container, so Lenis
 * runs on the document; the sidebar owns its own scroll and is marked
 * data-lenis-prevent so a wheel over the nav scrolls the nav. Touch stays
 * native — Lenis's default.
 */
export function startSmoothScroll() {
  if (reducedMotion()) return () => {};
  const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
