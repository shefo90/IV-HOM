/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { api, ApiError, type MediaItem } from "./api";

/**
 * Pick an existing image, or upload a new one.
 *
 * Uploads are resized and converted to WebP here, in the browser, before they
 * go over the wire — that is what stops a 12MB phone photo becoming a 12MB
 * page asset. The server re-encodes anyway and does not trust this, but doing
 * it client-side keeps the upload fast on a phone connection.
 */

const MAX_EDGE = 1600;

async function shrink(file: File): Promise<File> {
  // Anything already small enough goes as-is, so a hand-tuned PNG logo is not
  // needlessly re-encoded.
  if (file.size < 300 * 1024) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob || blob.size >= file.size) return file;

  const stem = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${stem}.webp`, { type: "image/webp" });
}

interface MediaLibraryProps {
  current: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function MediaLibrary({ current, onSelect, onClose }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.listMedia().then(setItems).catch((e: ApiError) => setError(e.message));
  }, []);

  const handleUpload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const uploaded = await api.uploadMedia(await shrink(file));
      setItems((prev) => [uploaded, ...(prev ?? [])]);
      onSelect(uploaded.url);
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-brand-dark border border-brand-accent/30 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl text-brand-light">Media library</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInput.current?.click()}
              className="bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-mono text-[10px] uppercase tracking-widest px-4 py-2 transition-colors disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Upload"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-brand-border-dark text-gray-400 font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:text-brand-light"
            >
              Close
            </button>
          </div>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />

        {error && <p className="mb-4 font-sans text-xs text-red-400">{error}</p>}

        {items === null ? (
          <p className="font-sans text-xs text-gray-500">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onSelect(item.url);
                  onClose();
                }}
                className={`group text-left border transition-colors ${
                  item.url === current
                    ? "border-brand-accent"
                    : "border-brand-border-dark hover:border-brand-accent/60"
                }`}
              >
                <img src={item.url} alt="" className="w-full h-24 object-cover" />
                <span className="block px-2 py-1.5 font-mono text-[9px] text-gray-400 truncate">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
