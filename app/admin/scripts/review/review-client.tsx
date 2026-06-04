"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Safety = {
  risk_level: string;
  scan_status: string;
  risk_flags: string[];
  notes?: string;
};

type Submission = {
  title: string;
  slug: string;
  version: string;
  category: string;
  subcategory?: string;
  tags: string[];
  summary: string;
  description: string;
  use_case: string;
  safety: Safety;
  source_type: string;
  review_status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitter: {
    name: string;
    email: string;
    organization?: string;
  };
  license: string;
  attribution_required: boolean;
};

type ReviewScript = {
  slug: string;
  folderPath: string;
  scriptBody: string;
  submission: Submission;
  approvedVersion?: {
    source: "community" | "operatoros";
    scriptBody: string;
    submission: Submission;
    scriptBodyChanged: boolean;
    metadataChanged: boolean;
  };
};

type LoadState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function AdminScriptReviewClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [adminPassword, setAdminPassword] = useState("");
  const [scripts, setScripts] = useState<ReviewScript[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selected, setSelected] = useState<ReviewScript | null>(null);
  const [state, setState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    if (authenticated) {
      void loadQueue();
    }
  }, [authenticated]);

  useEffect(() => {
    const next = scripts.find((script) => script.slug === selectedSlug) ?? scripts[0] ?? null;
    setSelected(next);
    setSelectedSlug(next?.slug ?? "");
  }, [scripts, selectedSlug]);

  const safetyFlags = useMemo(() => selected?.submission.safety.risk_flags.join(", ") || "none", [selected]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "Checking admin password..." });

    const formData = new FormData(event.currentTarget);
    formData.set("action", "authenticate");

    const response = await fetch("/api/admin/scripts/submit", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();

    if (!response.ok) {
      setState({ status: "error", message: payload.error ?? "Authentication failed." });
      return;
    }

    setAuthenticated(true);
    setState({ status: "success", message: "Admin session unlocked." });
  }

  async function loadQueue() {
    setState({ status: "loading", message: "Loading pending community scripts..." });
    const response = await fetch("/api/admin/scripts/review", { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      setState({ status: "error", message: payload.error ?? "Unable to load queue." });
      return;
    }

    setScripts(payload.scripts ?? []);
    setState({ status: "success", message: `Loaded ${(payload.scripts ?? []).length} script(s).` });
  }

  async function saveEdits(form: HTMLFormElement) {
    if (!selected) {
      return null;
    }

    const body = buildReviewPayload(form, selected.slug);
    const response = await fetch("/api/admin/scripts/review", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to save edits.");
    }

    return payload.script as ReviewScript;
  }

  async function saveOnly(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "Saving review edits..." });

    try {
      const updated = await saveEdits(event.currentTarget);
      await loadQueue();
      setSelectedSlug(updated?.slug ?? selectedSlug);
      setState({ status: "success", message: "Review edits saved and safety scan refreshed." });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Unable to save edits." });
    }
  }

  async function runAction(endpoint: string, form: HTMLFormElement, label: string) {
    if (!selected) {
      return;
    }

    setState({ status: "loading", message: `${label}...` });

    try {
      const body = buildReviewPayload(form, selected.slug);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? `${label} failed.`);
      }

      await loadQueue();
      setState({ status: "success", message: payload.result?.folderPath ?? `${label} complete.` });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : `${label} failed.` });
    }
  }

  if (!authenticated) {
    return (
      <section className="max-w-xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl shadow-black/30">
        <h2 className="text-xl font-semibold text-white">Unlock Review Queue</h2>
        <form className="mt-5 flex flex-col gap-4" onSubmit={authenticate}>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
            Admin password
            <input
              className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
              name="admin_password"
              type="password"
              autoComplete="current-password"
              required
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
            />
          </label>
          <button className="w-fit border border-rose-500 bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500">
            Unlock
          </button>
        </form>
        <StatusBlock state={state} />
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="border border-slate-800 bg-slate-950/72 p-5 shadow-2xl shadow-black/25">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Pending Queue</h2>
          <button className="border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-100" onClick={loadQueue}>
            Refresh
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {scripts.length === 0 ? (
            <div className="border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
              No pending community scripts found.
            </div>
          ) : (
            scripts.map((script) => (
              <button
                className={`border p-3 text-left text-sm ${
                  selected?.slug === script.slug
                    ? "border-rose-500 bg-rose-950/30 text-white"
                    : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600"
                }`}
                key={script.slug}
                onClick={() => setSelectedSlug(script.slug)}
                type="button"
              >
                <span className="block font-semibold">{script.submission.title}</span>
                <span className="mt-1 block font-mono text-xs text-slate-500">{script.slug}</span>
                <span className="mt-2 block text-xs text-slate-400">{script.submission.review_status}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {selected ? (
        <form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]" onSubmit={saveOnly}>
          <div className="flex flex-col gap-6">
            <Panel title="Script Body">
              <textarea
                className="min-h-[34rem] w-full border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-rose-400"
                name="script_body"
                defaultValue={selected.scriptBody}
              />
            </Panel>

            <Panel title="Safety Scan Results">
              <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                <Metric label="Risk" value={selected.submission.safety.risk_level} />
                <Metric label="Status" value={selected.submission.safety.scan_status} />
                <Metric label="Flags" value={safetyFlags} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{selected.submission.safety.notes}</p>
            </Panel>

            {selected.approvedVersion ? (
              <Panel title="Approved Version">
                <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <Metric label="Current source" value={selected.approvedVersion.source} />
                  <Metric
                    label="Script body"
                    value={selected.approvedVersion.scriptBodyChanged ? "changed" : "unchanged"}
                  />
                  <Metric
                    label="Metadata"
                    value={selected.approvedVersion.metadataChanged ? "changed" : "unchanged"}
                  />
                </div>
                <pre className="mt-4 max-h-72 overflow-auto border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300">
                  {selected.approvedVersion.scriptBody}
                </pre>
              </Panel>
            ) : null}
          </div>

          <aside className="flex flex-col gap-6">
            <Panel title="Metadata">
              <div className="grid gap-4">
                <Field label="Title" name="title" defaultValue={selected.submission.title} required />
                <Field label="Version" name="version" defaultValue={selected.submission.version} required />
                <Field label="Category" name="category" defaultValue={selected.submission.category} required />
                <Field label="Subcategory" name="subcategory" defaultValue={selected.submission.subcategory ?? ""} />
                <Field label="Tags" name="tags" defaultValue={selected.submission.tags.join(", ")} />
                <Field label="Summary" name="summary" defaultValue={selected.submission.summary} required />
                <TextField label="Description" name="description" defaultValue={selected.submission.description} required />
                <TextField label="Use case" name="use_case" defaultValue={selected.submission.use_case} required />
                <Field label="License" name="license" defaultValue={selected.submission.license} required />
                <label className="flex items-center gap-3 text-sm font-medium text-slate-200">
                  <input
                    name="attribution_required"
                    type="checkbox"
                    value="true"
                    defaultChecked={selected.submission.attribution_required}
                  />
                  Attribution required
                </label>
                <Field label="Reviewed by" name="reviewed_by" defaultValue="OperatorOS Admin" required />
                <TextField label="Reviewer notes" name="reviewer_notes" />
              </div>
            </Panel>

            <Panel title="Submitter">
              <div className="space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Name:</span> {selected.submission.submitter.name}
                </p>
                <p>
                  <span className="text-slate-500">Email:</span> {selected.submission.submitter.email}
                </p>
                <p>
                  <span className="text-slate-500">Org:</span> {selected.submission.submitter.organization ?? "none"}
                </p>
              </div>
            </Panel>

            <Panel title="Actions">
              <div className="grid gap-3">
                <button className="border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white" type="submit">
                  Save Edits
                </button>
                <ActionButton endpoint="/api/admin/scripts/approve" label="Approve Community" onAction={runAction} />
                <ActionButton endpoint="/api/admin/scripts/promote" label="Promote to OperatorOS" onAction={runAction} />
                <ActionButton endpoint="/api/admin/scripts/needs-changes" label="Needs Changes" onAction={runAction} />
                <ActionButton endpoint="/api/admin/scripts/reject" label="Reject" onAction={runAction} />
              </div>
              <StatusBlock state={state} />
            </Panel>
          </aside>
        </form>
      ) : (
        <section className="border border-slate-800 bg-slate-950/72 p-5 text-sm text-slate-400">
          Select a pending script to review.
          <StatusBlock state={state} />
        </section>
      )}
    </section>
  );
}

function buildReviewPayload(form: HTMLFormElement, slug: string) {
  const data = new FormData(form);

  return {
    slug,
    reviewed_by: readString(data, "reviewed_by") || "OperatorOS Admin",
    reviewer_notes: readString(data, "reviewer_notes") || undefined,
    script_body: readString(data, "script_body"),
    metadata: {
      title: readString(data, "title"),
      version: readString(data, "version"),
      category: readString(data, "category"),
      subcategory: readString(data, "subcategory") || undefined,
      tags: splitTags(readString(data, "tags")),
      summary: readString(data, "summary"),
      description: readString(data, "description"),
      use_case: readString(data, "use_case"),
      license: readString(data, "license"),
      attribution_required: data.get("attribution_required") === "true",
    },
  };
}

function readString(data: FormData, key: string): string {
  const value = data.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function splitTags(value: string): string[] {
  return value
    .split(/[\r\n,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function ActionButton({
  endpoint,
  label,
  onAction,
}: {
  endpoint: string;
  label: string;
  onAction: (endpoint: string, form: HTMLFormElement, label: string) => Promise<void>;
}) {
  return (
    <button
      className="border border-rose-500 bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
      onClick={(event) => {
        event.preventDefault();
        void onAction(endpoint, event.currentTarget.form as HTMLFormElement, label);
      }}
      type="button"
    >
      {label}
    </button>
  );
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="border border-slate-800 bg-slate-950/72 p-5 shadow-2xl shadow-black/25">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required = false,
}: Readonly<{ label: string; name: string; defaultValue?: string; required?: boolean }>) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
      {label}
      <input
        className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </label>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  required = false,
}: Readonly<{ label: string; name: string; defaultValue?: string; required?: boolean }>) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
      {label}
      <textarea
        className="min-h-24 border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 break-words font-semibold text-white">{value}</p>
    </div>
  );
}

function StatusBlock({ state }: { state: LoadState }) {
  if (state.status === "idle") {
    return null;
  }

  const className =
    state.status === "error"
      ? "border-rose-800 bg-rose-950/40 text-rose-100"
      : state.status === "success"
        ? "border-emerald-800 bg-emerald-950/40 text-emerald-100"
        : "border-slate-700 bg-slate-900 text-slate-100";

  return (
    <div className={`mt-4 border p-3 text-sm ${className}`}>
      <p className="break-words">{state.message}</p>
    </div>
  );
}
