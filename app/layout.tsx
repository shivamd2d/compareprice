import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DealWise — Compare. Understand. Decide.",
    template: "%s | DealWise",
  },
  description:
    "Compare prices, specifications, reviews and price history before you buy. The easiest way to find the right product at the right price in India.",
  keywords: ["price comparison", "best deals", "product reviews", "buy online India", "DealWise"],
  openGraph: {
    siteName: "DealWise",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

const primaryNav = [
  { href: "/category/laptops", label: "Laptops" },
  { href: "/category/smartphones", label: "Smartphones" },
  { href: "/category/televisions", label: "TVs" },
  { href: "/category/headphones", label: "Headphones" },
  { href: "/deals", label: "Deals 🔥" },
  { href: "/rankings", label: "Rankings" },
  { href: "/guides/best-laptops-under-70000", label: "Buying Guides" },
];

const footerLinks = [
  {
    title: "Discover",
    links: [
      { href: "/deals", label: "Today's Deals" },
      { href: "/rankings", label: "Rankings" },
      { href: "/category/laptops", label: "Laptops" },
      { href: "/category/smartphones", label: "Smartphones" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/compare", label: "Compare Products" },
      { href: "/alerts", label: "Price Alerts" },
      { href: "/favorites", label: "My Favorites" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/guides/best-laptops-under-70000", label: "Best Laptops Under ₹70K" },
      { href: "/guides/best-smartphones-under-30000", label: "Best Phones Under ₹30K" },
      { href: "/how-we-score", label: "How We Score" },
      { href: "/how-we-track-prices", label: "Price Tracking" },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* Top row */}
            <div className="flex h-16 items-center gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="DealWise home">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm"
                  aria-hidden="true"
                >
                  D
                </span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  Deal<span className="text-indigo-600">Wise</span>
                </span>
              </Link>

              {/* Center search */}
              <form action="/search" className="flex-1 max-w-2xl mx-auto hidden md:flex" role="search">
                <div className="relative w-full">
                  <span
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"
                    aria-hidden="true"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    id="header-search"
                    name="q"
                    type="search"
                    placeholder="Search products, brands or model numbers…"
                    className="w-full rounded-full border border-slate-300 bg-slate-50 pl-10 pr-4 py-2 text-sm transition hover:border-indigo-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    aria-label="Search products"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-1 right-1 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Right actions */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto md:ml-0">
                <Link
                  href="/compare"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition"
                  title="Compare products"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden lg:inline">Compare</span>
                </Link>
                <Link
                  href="/favorites"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-rose-500 transition"
                  title="My favorites"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="hidden lg:inline">Favorites</span>
                </Link>
                <Link
                  href="/alerts"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-amber-500 transition"
                  title="Price alerts"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="hidden lg:inline">Alerts</span>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </div>
            </div>

            {/* Mobile search */}
            <div className="pb-3 md:hidden">
              <form action="/search" role="search">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden="true">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    name="q"
                    type="search"
                    placeholder="Search products…"
                    className="w-full rounded-full border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    aria-label="Search products"
                  />
                </div>
              </form>
            </div>

            {/* Secondary nav */}
            <nav
              className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto"
              aria-label="Product categories and features"
            >
              {primaryNav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">D</span>
                  <span className="text-lg font-bold">Deal<span className="text-indigo-600">Wise</span></span>
                </Link>
                <p className="mt-3 text-sm text-slate-500 max-w-xs">
                  Compare prices, understand real value, and decide with confidence. India&apos;s smartest price intelligence platform.
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  Prices are updated regularly. We may earn a commission on purchases made through our links.
                </p>
              </div>

              {/* Nav links */}
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                  <ul className="mt-3 space-y-2">
                    {section.links.map(({ href, label }) => (
                      <li key={href}>
                        <Link href={href} className="text-sm text-slate-500 hover:text-indigo-600 transition">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400">© 2026 DealWise. All rights reserved.</p>
              <div className="flex gap-4 text-xs text-slate-400">
                <Link href="/how-we-score" className="hover:text-indigo-600 transition">How We Score</Link>
                <Link href="/how-we-track-prices" className="hover:text-indigo-600 transition">Price Tracking</Link>
                <Link href="/admin" className="hover:text-indigo-600 transition">Admin</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
