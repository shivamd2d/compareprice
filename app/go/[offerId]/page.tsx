import { notFound, redirect } from "next/navigation";
import { offers } from "@/lib/catalog";

type Props = {
  params: Promise<{ offerId: string }>;
};

export default async function GoPage({ params }: Props) {
  const { offerId } = await params;
  const offer = offers.find((item) => item.id === offerId);
  if (!offer) notFound();

  redirect(offer.affiliateUrl);
}
