import Link from "next/link";
import { RotateCcwIcon, SearchIcon } from "lucide-react";

import { FilterForm } from "@/components/shared/filter-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";

import { type TopicFilters, hasActiveFilters } from "../filters";

type Option = { name: string; slug: string };

type TopicFilterFormProps = {
  filters: TopicFilters;
  departments: Option[];
  tags: Option[];
};

export function TopicFilterForm({ filters, departments, tags }: TopicFilterFormProps) {
  return (
    <FilterForm
      pathname="/topics"
      defaults={{ status: "OPEN" }}
      className="grid gap-3.5 rounded-lg border bg-card p-4 shadow-card sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto] lg:items-end"
    >
      <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="filter-q">Từ khoá</Label>
        <div className="relative">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={filters.q}
            maxLength={100}
            placeholder="Tên đề tài, giảng viên, công nghệ…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-department">Bộ môn</Label>
        <NativeSelect id="filter-department" name="department" defaultValue={filters.department} className="w-full">
          <NativeSelectOption value="">Tất cả bộ môn</NativeSelectOption>
          {departments.map((item) => (
            <NativeSelectOption key={item.slug} value={item.slug}>
              {item.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-tag">Thẻ</Label>
        <NativeSelect id="filter-tag" name="tag" defaultValue={filters.tag} className="w-full">
          <NativeSelectOption value="">Tất cả thẻ</NativeSelectOption>
          {tags.map((item) => (
            <NativeSelectOption key={item.slug} value={item.slug}>
              {item.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="filter-status">Trạng thái</Label>
        <NativeSelect id="filter-status" name="status" defaultValue={filters.status} className="w-full">
          <NativeSelectOption value="OPEN">Đang nhận</NativeSelectOption>
          <NativeSelectOption value="CLOSED">Đã đóng</NativeSelectOption>
          <NativeSelectOption value="ALL">Tất cả</NativeSelectOption>
        </NativeSelect>
      </div>

      <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-1">
        <Button type="submit" className="flex-1 sm:flex-none">
          <SearchIcon aria-hidden="true" />
          Lọc
        </Button>
        {hasActiveFilters(filters) ? (
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link href="/topics">
              <RotateCcwIcon aria-hidden="true" />
              Xoá lọc
            </Link>
          </Button>
        ) : null}
      </div>
    </FilterForm>
  );
}

export function TopicFilterSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-3.5 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))_auto] lg:items-end"
    >
      <div className="grid gap-1.5 sm:col-span-2 lg:col-span-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="grid gap-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
  );
}