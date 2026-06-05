import Link from "next/link";

const footerGroups = [
  {
    title: "OperatorOS",
    links: [
      { label: "Home", href: "/" },
      { label: "Dashboard", href: "/admin/system" },
      { label: "Applications", href: "https://operatoros.net/apps" },
      { label: "Documentation", href: "/docs" },
      { label: "Contact", href: "mailto:scripts@operatoros.net" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Script Library", href: "/scripts" },
      { label: "Categories", href: "/scripts/categories" },
      { label: "Search", href: "/scripts" },
      { label: "API Docs", href: "/docs#api-docs" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "OperatorOS.net", href: "https://operatoros.net" },
      { label: "ShotgunNinjas.com", href: "https://shotgunninjas.com" },
      { label: "Shotgun Ninjas Productions", href: "https://shotgunninjas.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/docs#privacy" },
      { label: "Terms", href: "/docs#terms" },
      { label: "Copyright", href: "/docs#copyright" },
    ],
  },
];

export function GlobalFooter() {
  return (
    <footer className="border-t border-[#24304A] bg-[#0B1020] px-5 py-10 text-[#94A3B8] sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
        {footerGroups.map((group) => (
          <section key={group.title}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F8FAFC]">{group.title}</h2>
            <ul className="mt-4 grid gap-2 text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a className="hover:text-[#F8FAFC]" href={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                    </a>
                  ) : (
                    <Link className="hover:text-[#F8FAFC]" href={link.href}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-[#24304A] pt-5 text-sm md:flex-row md:items-center md:justify-between">
        <p>© 2026 OperatorOS</p>
        <p>
          Built by{" "}
          <a className="font-semibold text-[#F8FAFC] hover:text-[#E53935]" href="https://shotgunninjas.com" rel="noreferrer" target="_blank">
            Shotgun Ninjas Productions
          </a>
        </p>
      </div>
    </footer>
  );
}
