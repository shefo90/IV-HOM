/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HistoryPanel from "../../src/admin/HistoryPanel";
import { api, type Commit } from "../../src/admin/api";

vi.mock("../../src/admin/api", async () => {
  const actual = await vi.importActual<typeof import("../../src/admin/api")>(
    "../../src/admin/api",
  );
  return {
    ...actual,
    api: {
      history: vi.fn(),
      restore: vi.fn(),
      eraseVersion: vi.fn(),
      purgeHistory: vi.fn(),
    },
  };
});

const mocked = vi.mocked(api);

function commit(sha: string, author = "Ali"): Commit {
  return { sha, author, email: "a@b.c", when: "2026-08-02T12:44:00Z", message: "Update home" };
}

/** Newest first, exactly as the API returns it. */
const THREE = [commit("aaaaaaaa1"), commit("bbbbbbbb2"), commit("cccccccc3", "IV CMS")];

function show(isAdmin: boolean) {
  render(<HistoryPanel slug="home" isAdmin={isAdmin} onRestored={() => {}} />);
  return screen.findByText("IV CMS");
}

beforeEach(() => {
  mocked.history.mockResolvedValue(THREE);
  mocked.eraseVersion.mockResolvedValue({ erased: [], head: "z", backupUpdated: true });
  mocked.purgeHistory.mockResolvedValue({ erased: [], head: "z", backupUpdated: true });
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("an editor", () => {
  it("is offered no way to erase anything", async () => {
    await show(false);

    expect(screen.queryByRole("button", { name: /erase/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /clear older/i })).not.toBeInTheDocument();
  });
});

describe("an admin", () => {
  it("cannot erase the current or the original version", async () => {
    await show(true);

    // Three entries, but only the middle one may go: the first is the live page
    // and the last is the permanent floor.
    expect(screen.getAllByRole("button", { name: /erase/i })).toHaveLength(1);
  });

  it("erases the middle version and refetches, because the other shas are now stale", async () => {
    await show(true);
    mocked.history.mockResolvedValue([THREE[0], THREE[2]]);

    await userEvent.click(screen.getByRole("button", { name: /erase/i }));

    expect(mocked.eraseVersion).toHaveBeenCalledWith("home", "bbbbbbbb2");
    await waitFor(() => expect(mocked.history).toHaveBeenCalledTimes(2));
  });

  it("does not erase anything when the confirmation is dismissed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    await show(true);

    await userEvent.click(screen.getByRole("button", { name: /erase/i }));

    expect(mocked.eraseVersion).not.toHaveBeenCalled();
  });

  it("counts only the erasable versions in the clear-older button", async () => {
    await show(true);

    expect(screen.getByRole("button", { name: /clear older · 1/i })).toBeInTheDocument();
  });

  it("says so when the offsite backup could not be updated", async () => {
    mocked.purgeHistory.mockResolvedValue({ erased: ["x"], head: "z", backupUpdated: false });
    await show(true);

    await userEvent.click(screen.getByRole("button", { name: /clear older/i }));

    expect(await screen.findByText(/offsite backup could not be updated/i)).toBeInTheDocument();
  });

  it("reports a failed erase instead of silently leaving the list alone", async () => {
    mocked.eraseVersion.mockRejectedValue(new Error("boom"));
    await show(true);

    await userEvent.click(screen.getByRole("button", { name: /erase/i }));

    expect(await screen.findByText(/could not erase/i)).toBeInTheDocument();
  });
});
