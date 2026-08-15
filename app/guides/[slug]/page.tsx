import { PlaceholderSection } from "@/components/PlaceholderSection";

type Props = { params: Promise<{ slug: string }> };

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  return <PlaceholderSection title={slug.replaceAll("-", " ")} body="SEO guide content rendered from CMS or markdown source." />;
}
