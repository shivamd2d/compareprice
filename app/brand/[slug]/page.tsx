import { PlaceholderSection } from "@/components/PlaceholderSection";

type Props = { params: Promise<{ slug: string }> };

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  return <PlaceholderSection title={`Brand: ${slug}`} body="Brand landing with tracked products and deals will be rendered from Supabase-backed catalog data." />;
}
