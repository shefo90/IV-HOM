/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

function countUp(el: HTMLElement, target: number, duration: number) {
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(ease * target));
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = String(target);
  };
  requestAnimationFrame(step);
}

export default function useWarrantyCards(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const grid = root.querySelector<HTMLElement>(".warranty-cards-grid");
    if (!grid) return;
    const quote = root.querySelector<HTMLElement>(".wquote-block");
    const timers: number[] = [];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;

          grid.querySelectorAll(".wcard").forEach((card) => card.classList.add("wcard-in"));

          grid.querySelectorAll<HTMLElement>(".wcount").forEach((el) => {
            const target = parseInt(el.dataset.target ?? "0", 10);
            const card = el.closest(".wcard");
            const delay =
              (card ? parseFloat(getComputedStyle(card).transitionDelay) : 0) * 1000 + 400;
            timers.push(window.setTimeout(() => countUp(el, target, 1200), delay));
          });

          if (quote) timers.push(window.setTimeout(() => quote.classList.add("wquote-in"), 600));
          obs.disconnect();
        });
      },
      { threshold: 0.25 }
    );

    obs.observe(grid);
    return () => {
      obs.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [ref]);
}
