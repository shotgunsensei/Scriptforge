"use client";

import { useState, type FormEvent } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "success"; message: string; folderPath?: string }
  | { status: "error"; message: string };

export function AdminScriptSubmitForm({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [adminPassword, setAdminPassword] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

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

  async function submitScript(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "Scanning and saving script..." });

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (adminPassword) {
      formData.set("admin_password", adminPassword);
    }

    const response = await fetch("/api/admin/scripts/submit", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json();

    if (!response.ok) {
      setState({ status: "error", message: payload.error ?? "Submission failed." });
      return;
    }

    form.reset();
    setState({
      status: "success",
      message: `Saved ${payload.submission?.review_status ?? "submission"} script ${payload.submission?.slug ?? ""}.`,
      folderPath: payload.folderPath,
    });
  }

  if (!authenticated) {
    return (
      <section className="max-w-xl border border-slate-800 bg-slate-950/70 p-5 shadow-2xl shadow-black/30">
        <h2 className="text-xl font-semibold text-white">Unlock Admin Workflow</h2>
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
    <form className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" onSubmit={submitScript}>
      <div className="flex flex-col gap-6">
        <Panel title="Script Body">
          <div className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Paste PowerShell
              <textarea
                className="min-h-80 border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-rose-400"
                name="script_body"
                placeholder="param(...)&#10;# PowerShell script body"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Upload .ps1
              <input
                className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 file:mr-4 file:border-0 file:bg-slate-800 file:px-3 file:py-1 file:text-slate-100"
                name="script_file"
                type="file"
                accept=".ps1,text/plain"
              />
            </label>
          </div>
        </Panel>

        <Panel title="Review Decision">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Reviewed by" name="reviewed_by" defaultValue="OperatorOS Admin" required />
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Save state
              <select className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400" name="review_status">
                <option value="trusted_draft">Trusted draft</option>
                <option value="approved">Approved</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Approved scripts save under <code>content/scripts/operatoros/&lbrace;category&rbrace;/&lbrace;slug&rbrace;/</code>.
            Trusted drafts save under the private <code>_drafts</code> branch until promoted.
          </p>
        </Panel>
      </div>

      <aside className="flex flex-col gap-6">
        <Panel title="Metadata">
          <div className="grid gap-4">
            <Field label="Title" name="title" required />
            <Field label="Slug" name="slug" placeholder="generated-from-title if blank" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Version" name="version" defaultValue="1.0.0" required />
              <Field label="Category" name="category" defaultValue="endpoint" required />
            </div>
            <Field label="Subcategory" name="subcategory" defaultValue="inventory" />
            <Field label="Tags" name="tags" placeholder="powershell, windows, inventory" />
            <Field label="Summary" name="summary" required />
            <TextField label="Description" name="description" required />
            <TextField label="Use case" name="use_case" required />
          </div>
        </Panel>

        <Panel title="Author and Submitter">
          <div className="grid gap-4">
            <Field label="Author name" name="author_name" defaultValue="OperatorOS ScriptForge" required />
            <Field label="Author email" name="author_email" type="email" placeholder="scripts@operatoros.net" />
            <Field label="Author organization" name="author_organization" defaultValue="Shotgun Ninjas Productions" />
            <Field label="Submitter name" name="submitter_name" defaultValue="OperatorOS Admin" required />
            <Field label="Submitter email" name="submitter_email" type="email" defaultValue="admin@operatoros.net" required />
          </div>
        </Panel>

        <Panel title="Workflow Details">
          <div className="grid gap-4">
            <TextField label="Requirements" name="requirements" placeholder="One requirement per line" />
            <TextField label="Parameters" name="parameters" placeholder="One parameter per line" />
            <TextField label="Examples" name="examples" placeholder="One command per line" />
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Output format
              <select className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400" name="output_format">
                <option value="text">Text</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="html">HTML</option>
                <option value="none">None</option>
              </select>
            </label>
            <TextField label="Output description" name="output_description" />
            <TextField label="Documentation" name="documentation_readme" />
            <TextField label="Changelog" name="documentation_changelog" />
          </div>
        </Panel>

        <Panel title="Monetization and License">
          <div className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Monetization tier
              <select className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400" name="monetization_tier">
                <option value="free">Free</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="business">Business</option>
                <option value="operator">Operator</option>
                <option value="elite">Elite</option>
                <option value="addon">Add-on</option>
              </select>
            </label>
            <Field label="Add-on key" name="addon_key" />
            <label className="flex items-center gap-3 text-sm font-medium text-slate-200">
              <input name="entitlement_required" type="checkbox" value="true" />
              Entitlement required
            </label>
            <Field label="License" name="license" defaultValue="Proprietary" required />
            <label className="flex items-center gap-3 text-sm font-medium text-slate-200">
              <input name="attribution_required" type="checkbox" value="true" />
              Attribution required
            </label>
            <button
              className="border border-rose-500 bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
              type="submit"
              formNoValidate
            >
              Scan and Save Script
            </button>
          </div>
          <StatusBlock state={state} />
        </Panel>
      </aside>
    </form>
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
  type = "text",
  defaultValue,
  placeholder,
  required = false,
}: Readonly<{
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}>) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
      {label}
      <input
        className="border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function TextField({
  label,
  name,
  placeholder,
  required = false,
}: Readonly<{ label: string; name: string; placeholder?: string; required?: boolean }>) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
      {label}
      <textarea
        className="min-h-24 border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-rose-400"
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function StatusBlock({ state }: { state: SubmitState }) {
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
      <p>{state.message}</p>
      {state.status === "success" && state.folderPath ? (
        <p className="mt-2 font-mono text-xs text-slate-300">{state.folderPath}</p>
      ) : null}
    </div>
  );
}
