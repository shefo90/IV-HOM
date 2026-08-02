/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * A field people never see and bots reliably fill.
 *
 * Positioned off-screen rather than display:none — some bots skip hidden
 * inputs, and being absolutely positioned takes it out of flow, so it cannot
 * shift the layout of the forms around it. That matters: the contact page form
 * sits inside the pixel-diffed region of the visual suite.
 *
 * aria-hidden and tabIndex=-1 keep it away from screen readers and the tab
 * order; autoComplete="off" stops a browser helpfully filling it in.
 */
export default function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0 }}>
      <label htmlFor="iv-website">Website</label>
      <input
        id="iv-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
