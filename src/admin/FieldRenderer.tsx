/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import RichText from "../components/RichText";
import type { Field } from "./api";

/**
 * Renders an editing form straight from site_schema.json.
 *
 * There is no hand-written form per page: adding a field to the schema makes
 * it appear here, and the same file is what the API validates against, so the
 * two cannot disagree.
 */

interface CommonProps {
  path: string;
  errors: Record<string, string>;
  onPickImage: (current: string, apply: (url: string) => void) => void;
}

const LABEL =
  "block font-mono text-[10px] uppercase tracking-widest text-brand-accent/80 mb-1.5";
const INPUT =
  "w-full bg-brand-card-dark border border-brand-border-dark text-brand-light px-3 py-2 text-sm focus:border-brand-accent transition-colors";

function Err({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 font-sans text-[11px] text-red-400">{message}</p>;
}

/* ------------------------------- rich text ------------------------------- */

/**
 * A plain input plus a toolbar and a live preview.
 *
 * Deliberately not a contenteditable: the stored format is a tiny markdown
 * subset, and round-tripping contenteditable HTML back into it reliably is far
 * more machinery than this needs. The buttons wrap the selection so the editor
 * never types a marker by hand, and the preview renders through the very same
 * <RichText> the site uses — so what they see is what ships.
 */
function RichTextField({
  field,
  value,
  onChange,
  error,
}: {
  field: Field;
  value: string;
  onChange: (next: string) => void;
  error?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const wrap = (marker: string) => {
    const input = ref.current;
    if (!input) return;
    const { selectionStart, selectionEnd } = input;
    const start = selectionStart ?? 0;
    const end = selectionEnd ?? 0;
    if (start === end) return;

    const selected = value.slice(start, end);
    onChange(value.slice(0, start) + marker + selected + marker + value.slice(end));

    // Keep the selection over the same words after the markers are added.
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + marker.length, end + marker.length);
    });
  };

  // The design golds a trailing period on most headings but not all, so the
  // escape has to be reachable without the editor knowing what `\.` means.
  const dotted = /\.\s*$/.test(value) && !/\\\.\s*$/.test(value);
  const toggleDot = () =>
    onChange(dotted ? value.replace(/\.(\s*)$/, "\\.$1") : value.replace(/\\\.(\s*)$/, ".$1"));
  const hasTrailingPeriod = /\\?\.\s*$/.test(value);

  return (
    <div>
      <span className={LABEL}>{field.label}</span>

      <div className="flex items-center gap-1 mb-1.5">
        <ToolbarButton onClick={() => wrap("*")} title="Italic (select text first)">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => wrap("**")} title="Gold (select text first)">
          <span className="text-brand-accent font-bold">A</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => wrap("***")} title="Gold italic (select text first)">
          <em className="text-brand-accent font-bold">A</em>
        </ToolbarButton>
        {hasTrailingPeriod && (
          <ToolbarButton
            onClick={toggleDot}
            title={dotted ? "Make the final period ordinary" : "Make the final period large and gold"}
            active={dotted}
          >
            <span className="text-lg leading-none">.</span>
          </ToolbarButton>
        )}
      </div>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />

      <div className="mt-2 px-3 py-2 border border-dashed border-brand-border-dark bg-brand-dark/40">
        <span className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-1">
          Preview
        </span>
        <span className="font-serif text-lg text-brand-accent">
          <RichText>{value}</RichText>
        </span>
      </div>

      <Err message={error} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  title,
  active,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-7 h-7 flex items-center justify-center border text-xs transition-colors ${
        active
          ? "border-brand-accent bg-brand-accent/20 text-brand-light"
          : "border-brand-border-dark text-gray-400 hover:border-brand-accent hover:text-brand-light"
      }`}
    >
      {children}
    </button>
  );
}

/* --------------------------------- image --------------------------------- */

function ImageField({
  field,
  value,
  onChange,
  error,
  onPickImage,
}: {
  field: Field;
  value: string;
  onChange: (next: string) => void;
  error?: string;
  onPickImage: CommonProps["onPickImage"];
}) {
  return (
    <div>
      <span className={LABEL}>{field.label}</span>
      <div className="flex items-center gap-3">
        <img
          src={value}
          alt=""
          className="w-24 h-16 object-cover border border-brand-border-dark bg-brand-card-dark"
        />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-gray-400 truncate">{value}</p>
          <button
            type="button"
            onClick={() => onPickImage(value, onChange)}
            className="mt-1.5 border border-brand-accent text-brand-light font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:bg-brand-accent hover:text-brand-dark transition-colors"
          >
            Replace
          </button>
        </div>
      </div>
      <Err message={error} />
    </div>
  );
}

/* ------------------------------- dispatcher ------------------------------ */

interface FieldProps extends CommonProps {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}

function OneField({ field, value, onChange, path, errors, onPickImage }: FieldProps) {
  const error = errors[path];

  if (field.type === "group") {
    return (
      <fieldset className="border border-brand-border-dark p-4 space-y-4">
        <legend className="px-2 font-mono text-[10px] uppercase tracking-widest text-brand-accent">
          {field.label}
        </legend>
        <FieldList
          fields={field.fields ?? []}
          value={(value ?? {}) as Record<string, unknown>}
          onChange={onChange as (next: Record<string, unknown>) => void}
          path={path}
          errors={errors}
          onPickImage={onPickImage}
        />
      </fieldset>
    );
  }

  if (field.type === "list") {
    const items = Array.isArray(value) ? value : [];
    // Equal bounds means the count is locked to what the layout was designed
    // for, so no add or remove controls are offered at all.
    const locked = field.min === field.max;

    return (
      <fieldset className="border border-brand-border-dark p-4 space-y-3">
        <legend className="px-2 font-mono text-[10px] uppercase tracking-widest text-brand-accent">
          {field.label}
          {locked && <span className="text-gray-500"> · {field.min} fixed</span>}
        </legend>

        {items.map((item, index) => (
          <div key={index} className="border-l-2 border-brand-accent/30 pl-3">
            <span className="block font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">
              {index + 1}
            </span>
            {field.item?.type === "group" ? (
              <FieldList
                fields={field.item.fields ?? []}
                value={(item ?? {}) as Record<string, unknown>}
                onChange={(next) => {
                  const copy = [...items];
                  copy[index] = next;
                  onChange(copy);
                }}
                path={`${path}[${index}]`}
                errors={errors}
                onPickImage={onPickImage}
              />
            ) : (
              <OneField
                field={{ ...field.item!, key: String(index), label: `Item ${index + 1}` }}
                value={item}
                onChange={(next) => {
                  const copy = [...items];
                  copy[index] = next;
                  onChange(copy);
                }}
                path={`${path}[${index}]`}
                errors={errors}
                onPickImage={onPickImage}
              />
            )}
          </div>
        ))}
        <Err message={error} />
      </fieldset>
    );
  }

  if (field.type === "image") {
    return (
      <ImageField
        field={field}
        value={String(value ?? "")}
        onChange={onChange}
        error={error}
        onPickImage={onPickImage}
      />
    );
  }

  if (field.type === "richtext") {
    return (
      <RichTextField
        field={field}
        value={String(value ?? "")}
        onChange={onChange}
        error={error}
      />
    );
  }

  if (field.type === "text") {
    return (
      <label className="block">
        <span className={LABEL}>{field.label}</span>
        <textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT} resize-y`}
        />
        <Err message={error} />
      </label>
    );
  }

  return (
    <label className="block">
      <span className={LABEL}>
        {field.label}
        {field.required === false && <span className="text-gray-600"> · optional</span>}
      </span>
      <input
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
      <Err message={error} />
    </label>
  );
}

export default function FieldList({
  fields,
  value,
  onChange,
  path,
  errors,
  onPickImage,
}: CommonProps & {
  fields: Field[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        // Optional fields that are genuinely absent stay absent: the warranty
        // card without a counter must not gain an empty one just by being
        // rendered, or validation will reject the save.
        if (!(field.key in value) && field.required === false) return null;

        return (
          <OneField
            key={field.key}
            field={field}
            value={value[field.key]}
            onChange={(next) => onChange({ ...value, [field.key]: next })}
            path={path ? `${path}.${field.key}` : field.key}
            errors={errors}
            onPickImage={onPickImage}
          />
        );
      })}
    </div>
  );
}
