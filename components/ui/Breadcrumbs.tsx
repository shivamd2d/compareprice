import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  crumbs: Crumb[];
};

export function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-indigo-600 transition">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-800 font-medium" aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
