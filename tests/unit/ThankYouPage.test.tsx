/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ThankYouPage from "../../src/pages/ThankYouPage";
import { THANK_YOU_ROUTE, THANK_YOU_STATE } from "../../src/lib/submissions";
import fallback from "../../src/content/fallback.json";

// The provider's own job — fetching /content.json and falling back — is not
// what these tests are about, so they read the baked copy directly. That also
// means the assertions below check the real shipped wording.
vi.mock("../../src/content/ContentProvider", () => ({
  useContent: () => fallback,
}));

const copy = fallback.thankyou;

/** Mounts the page at /thank-you with whatever history state is given. */
function show(state: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: THANK_YOU_ROUTE, state }]}>
      <Routes>
        <Route path={THANK_YOU_ROUTE} element={<ThankYouPage />} />
        <Route path="/" element={<p>the home page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("the thank you page", () => {
  it("confirms the submission when the form sent it here", () => {
    show(THANK_YOU_STATE);

    expect(screen.getByText(copy.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(copy.body)).toBeInTheDocument();
    expect(screen.getByText(copy.note)).toBeInTheDocument();

    // The heading is stored as restricted markdown, so it arrives split across
    // an <em> — match the rendered heading rather than the raw source.
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Thank you.");
  });

  it("offers a way back to the site", () => {
    show(THANK_YOU_STATE);

    expect(screen.getByRole("link", { name: copy.homeLabel })).toHaveAttribute(
      "href",
      copy.homeTo,
    );
  });

  it.each([
    ["no state at all", undefined],
    ["state from some other navigation", { from: "nav" }],
    ["a submitted flag that is not true", { submitted: "yes" }],
  ])("redirects home on a cold visit: %s", (_label, state) => {
    show(state);

    expect(screen.getByText("the home page")).toBeInTheDocument();
    expect(screen.queryByText(copy.eyebrow)).not.toBeInTheDocument();
  });
});
