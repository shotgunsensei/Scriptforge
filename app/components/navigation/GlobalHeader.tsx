import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_SESSION_COOKIE, verifyUserSessionToken } from "../../../lib/scripts/admin-users";
import { Logo } from "../brand/Logo";
import { MobileNavigation } from "./MobileNavigation";

const primaryLinks = [
  { href: "/scripts", label: "Script Library" },
  { href: "/scripts/categories", label: "Categories" },
  { href: "/scripts", label: "Search" },
  { href: "/docs", label: "Documentation" },
];

export async function GlobalHeader() {
  const cookieStore = await cookies();
  const principal = await verifyUserSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  const links = principal ? [...primaryLinks, { href: "/admin/system", label: "Dashboard" }] : primaryLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-[#24304A] bg-[#0B1020]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
        <Logo />
        <nav aria-label="Primary navigation" className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              className="px-3 py-2 text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
              href={link.href}
              key={link.label}
            >
              {link.label}
            </Link>
          ))}
          <a
            className="border border-[#24304A] px-3 py-2 text-sm font-semibold text-[#F8FAFC] hover:border-[#E53935]"
            href="https://operatoros.net/apps"
            rel="noreferrer"
            target="_blank"
          >
            Part of the OperatorOS Ecosystem
          </a>
        </nav>
        <MobileNavigation links={links} />
      </div>
    </header>
  );
}
