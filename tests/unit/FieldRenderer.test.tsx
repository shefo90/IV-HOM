/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FieldList from "../../src/admin/FieldRenderer";
import type { Field } from "../../src/admin/api";

/**
 * The add and remove controls, which only appear on a list whose bounds are not
 * equal. Every list in site_schema.json but one is locked, so the locked case
 * is the one that must stay visually untouched.
 */

const SPEC_ITEM = {
  type: "group" as const,
  fields: [
    { key: "label", label: "Label", type: "string" as const },
    { key: "value", label: "Value", type: "string" as const },
  ],
};

function specs(min: number, max: number): Field {
  return { key: "specs", label: "Specs", type: "list", min, max, item: SPEC_ITEM };
}

function renderList(field: Field, items: unknown[]) {
  const onChange = vi.fn();
  render(
    <FieldList
      fields={[field]}
      value={{ [field.key]: items }}
      onChange={onChange}
      path=""
      errors={{}}
      onPickImage={() => {}}
    />,
  );
  return onChange;
}

const entry = (label: string, value: string) => ({ label, value });

describe("a locked list", () => {
  it("offers no way to change the count", () => {
    renderList(specs(3, 3), [entry("Tolerance", "< 0.5 mm")]);

    expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
  });
});

describe("an unlocked list", () => {
  it("offers both controls between its bounds", () => {
    renderList(specs(1, 3), [entry("Bonding", "PU / EVA"), entry("Cycle", "Automated")]);

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(2);
  });

  it("hides remove at the minimum", () => {
    renderList(specs(1, 3), [entry("Tools", "AutoCAD")]);

    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
  });

  it("hides add at the maximum", () => {
    renderList(specs(1, 3), [entry("a", "1"), entry("b", "2"), entry("c", "3")]);

    expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(3);
  });

  it("removes the row that was clicked, not the last one", async () => {
    const onChange = renderList(specs(1, 3), [
      entry("a", "1"),
      entry("b", "2"),
      entry("c", "3"),
    ]);

    await userEvent.click(screen.getAllByRole("button", { name: /remove/i })[1]);

    expect(onChange).toHaveBeenCalledWith({ specs: [entry("a", "1"), entry("c", "3")] });
  });

  it("adds an entry shaped by the schema rather than an empty object", async () => {
    const onChange = renderList(specs(1, 3), [entry("Tools", "AutoCAD")]);

    await userEvent.click(screen.getByRole("button", { name: /add/i }));

    // Every key the form will render has to exist, or React is handed
    // undefined and flips the input from controlled to uncontrolled mid-edit.
    expect(onChange).toHaveBeenCalledWith({
      specs: [entry("Tools", "AutoCAD"), { label: "", value: "" }],
    });
  });
});
