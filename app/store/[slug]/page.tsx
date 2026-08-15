import { PlaceholderSection } from "@/components/PlaceholderSection";

type Props = { params: Promise<{ slug: string }> };

export default async function StorePage({ params }: Props) {
  const { slug } = await params;
  return <PlaceholderSection title={`Store: ${slug}`} body="Store performance metrics and live offers are shown here with sponsored labels." />;
}
