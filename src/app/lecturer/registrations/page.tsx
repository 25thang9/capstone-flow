import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { LecturerRegistrationsView } from "@/features/lecturer/components/lecturer-registrations-view";
import { parseRegistrationFilters } from "@/features/lecturer/registrations/filters";
import {
  listMyTopicOptions, listRegistrationsForMyTopics,
} from "@/features/lecturer/registrations/queries";

export const metadata: Metadata = { title: "Sinh viên đăng ký" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function LecturerRegistrationsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <RegistrationsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function RegistrationsContent({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseRegistrationFilters(await searchParams);
  const [{ registrations, pagination }, topics] = await Promise.all([
    listRegistrationsForMyTopics(filters),
    listMyTopicOptions(),
  ]);
  return <LecturerRegistrationsView filters={filters} registrations={registrations} pagination={pagination} topics={topics} />;
}
