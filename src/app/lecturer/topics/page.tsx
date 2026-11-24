import { Suspense } from "react";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import { LecturerTopicsView } from "@/features/lecturer/components/lecturer-topics-view";
import { parseLecturerTopicFilters, type SearchParams } from "@/features/lecturer/topics/filters";
import { listMyTopics } from "@/features/lecturer/topics/queries";

export const metadata: Metadata = { title: "Đề tài của tôi" };

export default function LecturerTopicsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <MyTopics searchParams={searchParams} />
    </Suspense>
  );
}

async function MyTopics({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Truy vấn đọc session, tìm đúng đề tài của giảng viên và được bọc Suspense
  // để không gây lỗi prerender khi bật Cache Components trong Next.js 16.
  const filters = parseLecturerTopicFilters(await searchParams);
  const { topics, pagination } = await listMyTopics(filters);
  return <LecturerTopicsView filters={filters} topics={topics} pagination={pagination} />;
}
