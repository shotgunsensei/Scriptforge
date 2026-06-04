import Link from "next/link";

export function CategoryCard({ title, href, icon }: { title: string; href: string; icon: string }) {
  return (
    <Link className="group border border-[#24304A] bg-[#121A2E] p-4 transition hover:-translate-y-0.5 hover:border-[#E53935] hover:shadow-lg hover:shadow-[#E53935]/10" href={href}>
      <img alt="" className="h-9 w-9" src={icon} />
      <h3 className="mt-4 text-base font-semibold text-[#F8FAFC]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#94A3B8]">Browse approved automation for {title}.</p>
    </Link>
  );
}
