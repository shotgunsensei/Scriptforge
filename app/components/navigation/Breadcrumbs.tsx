"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  admin: "Admin",
  category: "Category",
  community: "Community",
  docs: "Documentation",
  modernization: "Modernization",
  operatoros: "OperatorOS",
  review: "Review",
  scripts: "Script Library",
  submit: "Submit",
  system: "System",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  const crumbs = buildCrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="border-b border-[#24304A] bg-[#0B1020]/75">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-3 text-sm sm:px-8 lg:px-10">
        <li>
          <Link className="font-semibold text-[#94A3B8] hover:text-[#F8FAFC]" href="/">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li className="flex items-center gap-2" key={crumb.href}>
            <span className="text-[#24304A]">/</span>
            <Link
              aria-current={index === crumbs.length - 1 ? "page" : undefined}
              className={index === crumbs.length - 1 ? "font-semibold text-[#F8FAFC]" : "font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"}
              href={crumb.href}
            >
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function buildCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "scripts" && segments.length === 4) {
    return [
      { href: "/scripts", label: "Script Library" },
      { href: `/scripts/${segments[1]}`, label: segmentLabels[segments[1]] ?? humanize(segments[1]) },
      { href: `/scripts/category/${segments[2]}`, label: humanize(segments[2]) },
      { href: pathname, label: humanize(segments[3]) },
    ];
  }

  if (segments[0] === "scripts" && segments[1] === "category" && segments[2]) {
    return [
      { href: "/scripts", label: "Script Library" },
      { href: "/scripts/categories", label: "Categories" },
      { href: pathname, label: humanize(segments[2]) },
    ];
  }

  if (segments[0] === "admin") {
    return segments.map((segment, index) => ({
      href: index === segments.length - 1 ? pathname : adminCrumbHref(segments, index),
      label: segmentLabels[segment] ?? humanize(segment),
    }));
  }

  if (segments[0] === "community") {
    return [{ href: pathname, label: segments[1] ? "Community Submit" : "Community" }];
  }

  return segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: segmentLabels[segment] ?? humanize(segment),
  }));
}

function adminCrumbHref(segments: string[], index: number) {
  if (index === 0) {
    return "/admin/system";
  }

  if (segments[index] === "scripts") {
    return "/admin/scripts/review";
  }

  return `/${segments.slice(0, index + 1).join("/")}`;
}

function humanize(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
