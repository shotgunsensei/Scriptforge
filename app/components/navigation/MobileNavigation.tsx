"use client";

import Link from "next/link";

export function MobileNavigation({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <details className="group relative lg:hidden">
      <summary className="cursor-pointer list-none border border-[#24304A] px-3 py-2 text-sm font-semibold text-[#F8FAFC]">
        Menu
      </summary>
      <nav
        aria-label="Mobile navigation"
        className="absolute right-0 top-11 z-50 grid min-w-64 gap-1 border border-[#24304A] bg-[#121A2E] p-3 shadow-2xl shadow-black/40"
      >
        {links.map((link) => (
          <Link className="px-3 py-2 text-sm font-semibold text-[#F8FAFC] hover:bg-[#0B1020]" href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
        <a
          className="mt-2 border border-[#24304A] px-3 py-2 text-sm font-semibold text-[#F8FAFC]"
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
