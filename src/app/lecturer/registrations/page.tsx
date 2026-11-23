import { Suspense } from "react";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import { LecturerRegistrationsView } from "@/features/lecturer/components/lecturer-registrations-view";
import { normalizeRegistrationStatus } from "@/features/lecturer/ui-filters";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "Sinh viên đăng ký" };

export default function LecturerRegistrationsPage({ searchParams }: PageProps<"/lecturer/registrations">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ProtectedRegistrations searchParams={searchParams} />
    </Suspense>
  );
}

async function ProtectedRegistrations({
  searchParams,
}: Pick<PageProps<"/lecturer/registrations">, "searchParams">) {
  await requireRole("LECTURER");
  const params = await searchParams;
  const initialStatus = normalizeRegistrationStatus(
    typeof params.status === "string" ? params.status : "ALL",
  );
  return <LecturerRegistrationsView initialStatus={initialStatus} />;
}
