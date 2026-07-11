"use client";

import Link from "next/link";

export function MobileNavigation({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <details className="group relative lg:hidden">
      <summary className="cursor-pointer list-none border border-line bg-panel px-3 py-2 text-sm font-semibold text-ink shadow-glow">
        Menu
      </summary>
      <nav
        aria-label="Mobile navigation"
        className="absolute right-0 top-12 z-50 grid min-w-72 gap-1 border border-line bg-panel/98 p-3 shadow-glow backdrop-blur-xl"
      >
        {links.map((link) => (
          <Link className="border border-transparent px-3 py-2 text-sm font-semibold text-ink hover:border-line hover:bg-canvas" href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
        <a
          className="mt-2 border border-secondary/60 bg-secondary/15 px-3 py-2 text-sm font-semibold text-ink"
          href="https://operatoros.net/apps"
          rel="noreferrer"
          target="_blank"
        >
          Part of the OperatorOS Ecosystem
        </a>
      </nav>
    </details>
  );
}
