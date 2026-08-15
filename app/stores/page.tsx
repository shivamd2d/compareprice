import Link from "next/link";
import { offers } from "@/lib/catalog";

export default function StoresPage() {
  const stores = [...new Set(offers.map((offer) => offer.retailerName))];

  return (
    <div>
      <h1 className="text-3xl font-bold">Stores</h1>
      <ul className="mt-4 space-y-2">
        {stores.map((store) => (
          <li key={store}>
            <Link href={`/store/${store.toLowerCase().replace(/\s+/g, "-")}`} className="text-indigo-600 hover:underline">
              {store}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
