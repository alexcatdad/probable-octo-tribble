import { notFound } from "next/navigation";
import { seedMatter, seedReviewState } from "@/lib/demo-data/matter";
import { MatterOverviewShell } from "@/components/matter/matter-overview-shell";

interface MatterOverviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatterOverviewPage({
  params,
}: MatterOverviewPageProps) {
  const { id } = await params;

  if (id !== seedMatter.id) {
    notFound();
  }

  return (
    <MatterOverviewShell
      matter={seedMatter}
      initialReviewState={seedReviewState}
    />
  );
}
