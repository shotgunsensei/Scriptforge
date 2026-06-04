"use client";

import Script from "next/script";
import { useEffect, useState, type FormEvent } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "loading"; message: string }
  | { status: "success"; message: string; folderPath?: string }
  | { status: "error"; message: string };

declare global {
  interface Window {
    onScriptForgeTurnstile?: (token: string) => void;
  }
}

export function CommunitySubmitForm({
  maxKb,
  captchaEnabled,
  turnstileSiteKey,
}: {
  maxKb: number;
  captchaEnabled: boolean;
  turnstileSiteKey: string;
}) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    window.onScriptForgeTurnstile = setCaptchaToken;

    return () => {
      delete window.onScriptForgeTurnstile;
    };
  }, []);

  async function submitScript(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading", message: "Uploading, scanning, and queueing for review..." });

    const form = event.currentTarget;
    const response = await fetch("/api/community/scripts/submit", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = await response.json();

    if (!response.ok) {
      setState({ status: "error", message: payload.error ?? "Submission failed." });
      return;
    }

    form.reset();
    setState({
      status: "success",
      message: `Submission ${payload.submission?.slug ?? ""} is pending review.`,
      folderPath: payload.folderPath,
    });
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" onSubmit={submitScript}>
      <div className="flex flex-col gap-6">
        <Panel title="Script Upload">
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
              Upload script file
              <input
                className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 file:mr-4 file:border-0 file:bg-slate-800 file:px-3 file:py-1 file:text-slate-100"
                name="script_file"
                type="file"
                accept=".ps1,.psm1"
              />
              <span className="text-xs text-slate-500">Paste a script or upload a .ps1/.psm1 file up to {maxKb} KB.</span>
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
              Optional filled template
              <input
                className="border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 file:mr-4 file:border-0 file:bg-slate-800 file:px-3 file:py-1 file:text-slate-100"
                name="metadata_file"
                type="file"
                accept=".json,.yaml,.yml"
              />
              <span className="text-xs text-slate-500">
                JSON/YAML metadata is merged with web form values. Web form values win.
              </span>
            </label>
          </div>
        </Panel>

        <Panel title="Submission Controls">
          <div className="grid gap-4">
            <input name="captcha_token" type="hidden" value={captchaToken} />
            {captchaEnabled ? (
              turnstileSiteKey ? (
                <div className="border border-slate-700 bg-slate-950/70 p-4">
                  <Script async defer src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
                  <div
                    className="cf-turnstile"
                    data-callback="onScriptForgeTurnstile"
                    data-sitekey={turnstileSiteKey}
                    data-theme="dark"
                  />
                </div>
              ) : (
                <div className="border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-100">
                  TURNSTILE_SITE_KEY is required when captcha is enabled.
                </div>
              )
            ) : (
              <div className="border border-dashed border-slate-700 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                Rate limiting runs server-side. Captcha is disabled in this environment.
              </div>
            )}
            <button className="border border-rose-500 bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500">
              Submit for Community Review
            </button>
            <StatusBlock state={state} />
          </div>
        </Panel>
      </div>

      <aside className="flex flex-col gap-6">
        <Panel title="Metadata">
          <div className="grid gap-4">
            <Field label="Title" name="title" required />
            <Field label="Slug" name="slug" placeholder="generated-from-title if blank" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Version" name="version" defaultValue="1.0.0" required />
              <Field label="Category" name="category" required />
            </div>
            <Field label="Subcategory" name="subcategory" />
            <Field label="Tags" name="tags" placeholder="powershell, windows, inventory" />
            <Field label="Summary" name="summary" required />
            <TextField label="Description" name="description" required />
            <TextField label="Use case" name="use_case" required />
          </div>
        </Panel>

        <Panel title="Author and Submitter">
          <div className="grid gap-4">
            <Field label="Author name" name="author_name" required />
            <Field label="Author email" name="author_email" type="email" />
            <Field label="Author organization" name="author_organization" />
            <Field label="Submitter name" name="submitter_name" required />
            <Field label="Submitter email" name="submitter_email" type="email" required />
            <Field label="Submitter organization" name="submitter_organization" />
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

        <Panel title="GitHub and Credibility">
          <div className="grid gap-4">
            <Field label="GitHub repo URL" name="github_repo_url" type="url" />
            <Field label="GitHub file URL" name="github_file_url" type="url" />
            <Field label="GitHub commit SHA" name="github_commit_sha" />
            <Field label="GitHub last synced at" name="github_last_synced_at" placeholder="2026-06-04T12:00:00.000Z" />
            <Field label="Last tested at" name="last_tested_at" placeholder="2026-06-04T12:00:00.000Z" />
            <Field
              label="PowerShell compatibility"
              name="powershell_compatibility"
              defaultValue="Windows PowerShell 5.1, PowerShell 7"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Safety score" name="safety_score" type="number" placeholder="0-100" />
              <Field label="Documentation score" name="documentation_score" type="number" placeholder="0-100" />
            </div>
          </div>
        </Panel>

        <Panel title="License">
          <div className="grid gap-4">
            <Field label="License" name="license" defaultValue="MIT" required />
            <label className="flex items-center gap-3 text-sm font-medium text-slate-200">
              <input name="attribution_required" type="checkbox" value="true" />
              Attribution required
            </label>
          </div>
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
    <div className={`border p-3 text-sm ${className}`}>
      <p>{state.message}</p>
      {state.status === "success" && state.folderPath ? (
        <p className="mt-2 font-mono text-xs text-slate-300">{state.folderPath}</p>
      ) : null}
    </div>
  );
}
