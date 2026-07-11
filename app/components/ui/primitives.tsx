import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex min-h-10 items-center justify-center gap-2 border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariants = {
  primary:
    "border-primary/80 bg-primary text-white shadow-glow-red hover:border-primary hover:bg-primary/90",
  secondary:
    "border-secondary/60 bg-secondary/15 text-ink shadow-glow-blue hover:border-secondary hover:bg-secondary/25",
  ghost:
    "border-line bg-canvas/70 text-muted hover:border-line-strong hover:bg-panel hover:text-ink",
  danger:
    "border-danger/70 bg-danger/15 text-red-100 hover:border-danger hover:bg-danger/25",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={cx(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function ButtonLink({
  className,
  href,
  variant = "ghost",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: ButtonVariant }) {
  const classNames = cx(buttonBase, buttonVariants[variant], className);

  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link className={classNames} href={href} {...props} />;
  }

  return <a className={classNames} href={href} {...props} />;
}

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <section
      className={cx(
        "border border-line bg-panel/88 shadow-glow backdrop-blur-sm",
        interactive && "transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-panel-2/80",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "primary" | "secondary" | "accent" | "warning" | "danger";
}) {
  const tones = {
    neutral: "border-line bg-canvas/70 text-muted",
    primary: "border-primary/70 bg-primary/15 text-red-100",
    secondary: "border-secondary/60 bg-secondary/15 text-blue-100",
    accent: "border-accent/60 bg-accent/10 text-emerald-100",
    warning: "border-warning/70 bg-warning/10 text-amber-100",
    danger: "border-danger/70 bg-danger/15 text-red-100",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "low" | "medium" | "high" | "critical" | string }) {
  const key = status.toLowerCase();
  const tone =
    key === "low" ? "accent" : key === "medium" ? "warning" : key === "high" ? "primary" : key === "critical" ? "danger" : "neutral";

  return <Badge tone={tone}>{status}</Badge>;
}

const fieldBase =
  "min-h-10 w-full border border-line bg-canvas/80 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-muted/55 focus:border-secondary focus:bg-canvas";

export function Field({
  className,
  inputClassName,
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { inputClassName?: string; label: string }) {
  return (
    <label className={cx("flex flex-col gap-2 text-sm font-medium text-ink", className)}>
      {label}
      <input className={cx(fieldBase, inputClassName)} {...props} />
    </label>
  );
}

export function TextArea({
  className,
  label,
  textareaClassName,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; textareaClassName?: string }) {
  return (
    <label className={cx("flex flex-col gap-2 text-sm font-medium text-ink", className)}>
      {label}
      <textarea className={cx(fieldBase, "min-h-28", textareaClassName)} {...props} />
    </label>
  );
}

export function SelectControl({
  children,
  className,
  label,
  selectClassName,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; selectClassName?: string }) {
  return (
    <label className={cx("flex flex-col gap-2 text-sm font-medium text-ink", className)}>
      {label}
      <select className={cx(fieldBase, selectClassName)} {...props}>
        {children}
      </select>
    </label>
  );
}

export function SectionHeader({
  action,
  eyebrow = "OperatorOS ScriptForge",
  title,
  description,
  className,
}: {
  action?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cx("border-b border-line pb-5", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ink md:text-4xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}
        </div>
        {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </header>
  );
}

export function CodeBlockShell({ children, title = "PowerShell" }: { children: ReactNode; title?: string }) {
  return (
    <div className="overflow-hidden border border-line bg-canvas shadow-glow">
      <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-danger" />
          <span className="h-2.5 w-2.5 bg-warning" />
          <span className="h-2.5 w-2.5 bg-accent" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{title}</span>
      </div>
      <div className="sf-terminal-scanline max-w-full overflow-auto">{children}</div>
    </div>
  );
}
