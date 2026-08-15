import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const nav = [
  ["/search", "Search"],
  ["/deals", "Deals"],
  ["/compare", "Compare"],
  ["/assistant", "Assistant"],
  ["/favorites", "Favorites"],
] as const;

export const metadata: Metadata = {
  title: "DealMatrix — ComparePrice",
  description: "AI-first price intelligence platform for India.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">DealMatrix</Link>
            <nav className="flex items-center gap-4 text-sm">
              {nav.map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-indigo-600">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-65px)] w-full max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
