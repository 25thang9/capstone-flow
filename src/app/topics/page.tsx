import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchXIcon, XIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { Button } from "@/components/ui/button";
import { TopicFilterForm, TopicFilterSkeleton } from "@/features/topics/components/topic-filter-form";
import { TopicList, TopicListSkeleton } from "@/features/topics/components/topic-list";
import {
  type SearchParams,
  type TopicFilters,
  hasActiveFilters,
  parseTopicFilters,
  topicFilterParams,
} from "@/features/topics/filters";
import { listPublicTopics, listTopicFilterOptions } from "@/features/topics/queries";
import { buildHref } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Kho đề tài",
  description: "Tìm kiếm và lọc đề tài đồ án theo bộ môn, thẻ công nghệ và trạng thái nhận sinh viên.",
};

const STATUS_FILTER_LABEL = {
  OPEN: "Đang nhận",
  CLOSED: "Đã đóng",
  ALL: "Tất cả",
} as const;

export default function TopicsPage({ searchParams }: PageProps<"/topics">) {
  return (
    <div className="container-page py-10">
      <PageHeader
        title="Kho đề tài"
        description="Lọc theo bộ môn, thẻ hoặc từ khoá. Bấm vào tên đề tài để xem chi tiết và gửi đăng ký."
        crumbs={[{ label: "Trang chủ", href: "/" }, { label: "Kho đề tài" }]}
      />
      <Suspense
        fallback={
          <>
            <TopicFilterSkeleton />
            <div className="mt-8">
              <TopicListSkeleton count={5} />
            </div>
          </>
        }
      >
        <TopicResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TopicResults({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const filters = parseTopicFilters(await searchParams);
  const [{ topics, pagination }, { departments, tags }] = await Promise.all([
    listPublicTopics(filters),
    listTopicFilterOptions(),
  ]);

  return (
    <>
      <TopicFilterForm filters={filters} departments={departments} tags={tags} />

      <ActiveFilterChips filters={filters} departments={departments} tags={tags} />

      <p className="mt-6 mb-3 text-sm text-muted-foreground tabular-nums" role="status">
        {pagination.total === 0
          ? "Không có đề tài nào khớp bộ lọc."
          : `Tìm thấy ${pagination.total} đề tài · Trang ${pagination.page}/${pagination.totalPages}`}
      </p>

      {topics.length > 0 ? (
        <TopicList topics={topics} headingLevel={2} />
      ) : (
        <EmptyState
          icon={SearchXIcon}
          title="Không tìm thấy đề tài phù hợp"
          description={
            hasActiveFilters(filters)
              ? "Thử bỏ bớt điều kiện lọc hoặc dùng từ khoá ngắn hơn."
              : "Hiện chưa có đề tài nào đang nhận sinh viên."
          }
          action={
            hasActiveFilters(filters) ? (
              <Button asChild variant="outline">
                <Link href="/topics">Xoá toàn bộ bộ lọc</Link>
              </Button>
            ) : undefined
          }
        />
      )}

      <PaginationNav pagination={pagination} pathname="/topics" params={topicFilterParams(filters)} />
    </>
  );
}

function ActiveFilterChips({
  filters,
  departments,
  tags,
}: {
  filters: TopicFilters;
  departments: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
}) {
  if (!hasActiveFilters(filters)) return null;

  const chips: { key: string; label: string; removeLabel: string; href: string }[] = [];

  if (filters.q) {
    chips.push({
      key: "q",
      label: `Từ khoá: “${filters.q}”`,
      removeLabel: `Bỏ lọc từ khoá ${filters.q}`,
      href: buildHref("/topics", topicFilterParams({ ...filters, q: "" }, 1)),
    });
  }

  if (filters.department) {
    const name = departments.find((item) => item.slug === filters.department)?.name ?? filters.department;
    chips.push({
      key: "department",
      label: `Bộ môn: ${name}`,
      removeLabel: `Bỏ lọc bộ môn ${name}`,
      href: buildHref("/topics", topicFilterParams({ ...filters, department: "" }, 1)),
    });
  }

  if (filters.tag) {
    const name = tags.find((item) => item.slug === filters.tag)?.name ?? filters.tag;
    chips.push({
      key: "tag",
      label: `Thẻ: ${name}`,
      removeLabel: `Bỏ lọc thẻ ${name}`,
      href: buildHref("/topics", topicFilterParams({ ...filters, tag: "" }, 1)),
    });
  }

  if (filters.status !== "OPEN") {
    const label = STATUS_FILTER_LABEL[filters.status];
    chips.push({
      key: "status",
      label: `Trạng thái: ${label}`,
      removeLabel: "Đưa trạng thái về Đang nhận",
      href: buildHref("/topics", topicFilterParams({ ...filters, status: "OPEN" }, 1)),
    });
  }

  return (
    <ul aria-label="Bộ lọc đang áp dụng" className="mt-3 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Link
            href={chip.href}
            aria-label={chip.removeLabel}
            className="inline-flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <span>{chip.label}</span>
            <XIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
