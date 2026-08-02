/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Typed client for the admin API.
 *
 * The session is an httpOnly cookie, so there is no token to attach here —
 * `credentials: "same-origin"` is the whole auth story on this side, and
 * script on the page cannot read or leak it.
 */

export type FieldType = "string" | "text" | "richtext" | "image" | "group" | "list";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Present when type is "group". */
  fields?: Field[];
  /** Present when type is "list". Equal min and max means a locked count. */
  min?: number;
  max?: number;
  item?: { type: FieldType; fields?: Field[] };
}

export interface DocumentSchema {
  slug: string;
  label: string;
  fields: Field[];
}

export interface SiteSchema {
  documents: DocumentSchema[];
}

export interface Session {
  email: string;
  name: string;
  role: "admin" | "editor";
}

export interface MediaItem {
  name: string;
  url: string;
  bytes: number;
}

export interface Commit {
  sha: string;
  author: string;
  email: string;
  when: string;
  message: string;
}

export interface EraseResult {
  erased: string[];
  head: string;
  /**
   * False when the forced push failed, so the backup's history still contains
   * the erased version. True only means the backup no longer references it —
   * the remote prunes the objects on its own schedule.
   */
  backupUpdated: boolean;
}

export type SubmissionKind = "contact" | "proposal" | "tour";

export interface SubmissionSummary {
  id: number;
  kind: SubmissionKind;
  name: string;
  email: string;
  phone: string;
  status: "unread" | "read" | "handled";
  createdAt: string;
  deletedAt: string | null;
}

export interface SubmissionDetail extends SubmissionSummary {
  payload: Record<string, string>;
  ip: string | null;
  userAgent: string | null;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Field-level messages from the content validator, when present. */
    readonly errors: string[] = [],
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...init,
    headers:
      init.body instanceof FormData
        ? init.headers
        : { "Content-Type": "application/json", ...init.headers },
  });

  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = body?.detail;
    if (detail && typeof detail === "object" && Array.isArray(detail.errors)) {
      throw new ApiError(response.status, detail.message ?? "Request failed", detail.errors);
    }
    const message =
      typeof detail === "string" ? detail : `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return body as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<Session>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  me: () => request<Session>("/api/auth/me"),

  schema: () => request<SiteSchema>("/api/schema"),
  getPage: (slug: string) => request<Record<string, unknown>>(`/api/admin/content/${slug}`),
  putPage: (slug: string, payload: unknown) =>
    request<{ sha: string | null; changed: boolean }>(`/api/admin/content/${slug}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  history: (slug: string) => request<Commit[]>(`/api/admin/content/${slug}/history`),
  pageAt: (slug: string, sha: string) =>
    request<Record<string, unknown>>(`/api/admin/content/${slug}/at/${sha}`),
  restore: (slug: string, sha: string) =>
    request<{ sha: string }>(`/api/admin/content/${slug}/restore`, {
      method: "POST",
      body: JSON.stringify({ sha }),
    }),
  // Admin only, and irreversible. A rewrite renumbers every later commit, so
  // callers must refetch the history rather than patch their copy of it.
  eraseVersion: (slug: string, sha: string) =>
    request<EraseResult>(`/api/admin/content/${slug}/history/${sha}`, { method: "DELETE" }),
  purgeHistory: (slug: string) =>
    request<EraseResult>(`/api/admin/content/${slug}/history/purge`, { method: "POST" }),

  listMedia: () => request<MediaItem[]>("/api/admin/media"),
  uploadMedia: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<MediaItem>("/api/admin/media", { method: "POST", body: form });
  },

  listSubmissions: (params: Record<string, string>) =>
    request<{ items: SubmissionSummary[]; unread: number }>(
      `/api/admin/submissions?${new URLSearchParams(params)}`,
    ),
  getSubmission: (id: number) => request<SubmissionDetail>(`/api/admin/submissions/${id}`),
  setSubmissionStatus: (id: number, status: string) =>
    request<void>(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteSubmission: (id: number) =>
    request<void>(`/api/admin/submissions/${id}`, { method: "DELETE" }),
  restoreSubmission: (id: number) =>
    request<void>(`/api/admin/submissions/${id}/restore`, { method: "POST" }),
};
