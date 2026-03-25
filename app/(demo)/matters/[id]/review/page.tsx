import { notFound } from "next/navigation";
import { ReviewWorkspace } from "@/components/review/review-workspace";
import { seedMatter } from "@/lib/demo-data/matter";

interface MatterReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatterReviewPage({
  params,
}: MatterReviewPageProps) {
  const { id } = await params;

  if (id !== seedMatter.id) {
    notFound();
  }

  return <ReviewWorkspace matter={seedMatter} />;
}
