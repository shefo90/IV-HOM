/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactFormSection from "../../src/components/ContactFormSection";
import ContactPage from "../../src/pages/ContactPage";
import { THANK_YOU_ROUTE } from "../../src/lib/submissions";
import fallback from "../../src/content/fallback.json";

vi.mock("../../src/content/ContentProvider", () => ({
  useContent: () => fallback,
}));

/**
 * Both public contact forms must leave for the confirmation route once the API
 * accepts a message, and must stay put and explain themselves when it does not.
 * The two forms are separate components with separate copy, so each is driven
 * end to end here rather than trusting the shared submit hook alone.
 */

const CONFIRMED = "confirmation route reached";

/** Stands in for the real page so the assertion is about arriving, not copy. */
function ThankYouProbe() {
  const { state } = useLocation();
  return (
    <p>
      {CONFIRMED}
      {(state as { submitted?: boolean } | null)?.submitted === true ? " with proof" : ""}
    </p>
  );
}

function mount(form: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={form} />
        <Route path={THANK_YOU_ROUTE} element={<ThankYouProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

const accepts = () => vi.fn().mockResolvedValue({ ok: true } as Response);
const refuses = () => vi.fn().mockRejectedValue(new Error("api down"));

beforeEach(() => {
  vi.stubGlobal("fetch", accepts());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the contact section on the home page", () => {
  const copy = fallback.site.contactForm;

  /** Fills only what the form marks required. */
  async function fillAndSend() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(copy.fullNameLabel), "Ali Hassan");
    await user.type(screen.getByLabelText(copy.emailLabel), "ali@example.com");
    await user.click(screen.getByRole("button", { name: copy.submitLabel }));
  }

  it("goes to the confirmation route, carrying proof of the submission", async () => {
    mount(<ContactFormSection />);
    await fillAndSend();

    expect(await screen.findByText(`${CONFIRMED} with proof`)).toBeInTheDocument();
  });

  it("posts the message before navigating", async () => {
    mount(<ContactFormSection />);
    await fillAndSend();
    await screen.findByText(/confirmation route reached/);

    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe("/api/submissions");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      kind: "contact",
      name: "Ali Hassan",
      email: "ali@example.com",
    });
  });

  it("stays on the form and shows the error when the API refuses", async () => {
    vi.stubGlobal("fetch", refuses());
    mount(<ContactFormSection />);
    await fillAndSend();

    expect(await screen.findByText(copy.errorMessage)).toBeInTheDocument();
    expect(screen.queryByText(/confirmation route reached/)).not.toBeInTheDocument();
  });
});

describe("the form on the contact page", () => {
  const copy = fallback.contact.form;

  /**
   * This form's labels are not wired to their inputs, so they are reached by
   * name. Worth fixing one day, but not by this change.
   */
  async function fillAndSend(container: HTMLElement) {
    const user = userEvent.setup();
    const field = (name: string) =>
      container.querySelector<HTMLInputElement>(`#contactForm [name="${name}"]`)!;

    await user.type(field("name"), "Ali Hassan");
    await user.type(field("email"), "ali@example.com");
    await user.click(screen.getByRole("button", { name: new RegExp(copy.submitLabel, "i") }));
  }

  it("goes to the confirmation route, carrying proof of the submission", async () => {
    const { container } = mount(<ContactPage />);
    await fillAndSend(container);

    expect(await screen.findByText(`${CONFIRMED} with proof`)).toBeInTheDocument();
  });

  it("stays on the form and shows the error when the API refuses", async () => {
    vi.stubGlobal("fetch", refuses());
    const { container } = mount(<ContactPage />);
    await fillAndSend(container);

    expect(await screen.findByText(copy.errorMessage)).toBeInTheDocument();
    expect(screen.queryByText(/confirmation route reached/)).not.toBeInTheDocument();
  });

  it("never shows a success message in place, since the page is the success", async () => {
    const { container } = mount(<ContactPage />);
    await fillAndSend(container);
    await screen.findByText(/confirmation route reached/);

    await waitFor(() =>
      expect(screen.queryByText(copy.successMessage)).not.toBeInTheDocument(),
    );
  });
});
