/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type RefObject } from "react";

export default function useTimelineFill(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const fill = root.querySelector<HTMLElement>("#ptimeline-fill");
    const track = root.querySelector("#ptimeline");
    if (!fill || !track) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            fill.style.width = "100%";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    obs.observe(track);
    return () => obs.disconnect();
  }, [ref]);
}
