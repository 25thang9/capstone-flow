import { Suspense } from "react";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import { LecturerTopicsView } from "@/features/lecturer/components/lecturer-topics-view";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "Đề tài của tôi" };

export default function LecturerTopicsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ProtectedTopics />
    </Suspense>
  );
}

async function ProtectedTopics() {
  await requireRole("LECTURER");
  return <LecturerTopicsView />;
}
