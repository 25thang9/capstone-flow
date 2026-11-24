import Link from "next/link";
import { FilePlusIcon, PlusIcon, SearchIcon, SearchXIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterForm } from "@/components/shared/filter-form";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationNav } from "@/components/shared/pagination-nav";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAvailability } from "@/features/registrations/rules";
import {
  lecturerTopicFilterParams,
  type LecturerTopicFilters,
} from "@/features/lecturer/topics/filters";
import type { LecturerTopicRow } from "@/features/lecturer/topics/queries";
import type { Pagination } from "@/lib/pagination";
import { formatDate } from "@/lib/text";

export type LecturerTopicsViewProps = {
  filters: LecturerTopicFilters;
  topics: LecturerTopicRow[];
  pagination: Pagination;
};

/** Trang đề tài: PR3 mở chức năng tạo mới; sửa/xóa/đóng mở tiếp tục ở PR4. */
export function LecturerTopicsView({ filters, topics, pagination }: LecturerTopicsViewProps) {
  const filtering = Boolean(filters.q) || filters.status !== "ALL";

  return (
    <>
      <PageHeader
        title="Đề tài của tôi"
        description="Bạn chỉ thấy và chỉ sửa được đề tài do chính mình đăng."
        actions={
          <Button asChild>
            <Link href="/lecturer/topics/new"><PlusIcon aria-hidden="true" /> Thêm đề tài</Link>
          </Button>
        }
      />

      <FilterForm
        pathname="/lecturer/topics"
        defaults={{ status: "ALL" }}
        className="flex flex-wrap items-end gap-3"
      >
        <div className="grid min-w-56 flex-1 gap-1.5 sm:max-w-sm">
          <Label htmlFor="lecturer-topic-q">Tìm theo tên đề tài</Label>
          <Input id="lecturer-topic-q" name="q" type="search" defaultValue={filters.q} maxLength={100} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lecturer-topic-status">Trạng thái</Label>
          <NativeSelect id="lecturer-topic-status" name="status" defaultValue={filters.status}>
            <NativeSelectOption value="ALL">Tất cả</NativeSelectOption>
            <NativeSelectOption value="OPEN">Đang nhận</NativeSelectOption>
            <NativeSelectOption value="CLOSED">Đã đóng</NativeSelectOption>
          </NativeSelect>
        </div>
        <Button type="submit" variant="outline"><SearchIcon aria-hidden="true" /> Lọc</Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/lecturer/topics">Xóa bộ lọc</Link>
        </Button>
      </FilterForm>
      <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
        {filtering ? "Đang hiển thị kết quả theo bộ lọc đã chọn." : "Đang xem tất cả đề tài của bạn."}
      </p>

      {topics.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={filtering ? SearchXIcon : FilePlusIcon}
            title={filtering ? "Không có đề tài khớp bộ lọc" : "Bạn chưa đăng đề tài nào"}
            description={filtering
              ? "Thử thay đổi từ khóa hoặc trạng thái để tìm đề tài khác."
              : "Danh sách sẽ hiển thị khi tài khoản giảng viên có đề tài được tạo."}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-card">
          <Table className="min-w-[46rem]">
            <TableHeader>
              <TableRow>
                <TableHead>Đề tài</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Đã nhận</TableHead>
                <TableHead className="text-right">Đang chờ</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead><span className="sr-only">Thao tác</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="max-w-sm whitespace-normal">
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-xs text-muted-foreground">{topic.department.name}</p>
                  </TableCell>
                  <TableCell>
                    <AvailabilityBadge availability={getAvailability(topic)} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{topic.acceptedCount}/{topic.maxStudents}</TableCell>
                  <TableCell className="text-right tabular-nums">{topic.pendingCount}</TableCell>
                  <TableCell>{formatDate(topic.updatedAt)}</TableCell>
                  <TableCell><Button type="button" size="sm" variant="outline" disabled title="Chỉnh sửa ở PR tiếp theo">Sửa</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PaginationNav
        pagination={pagination}
        pathname="/lecturer/topics"
        params={lecturerTopicFilterParams(filters)}
      />
    </>
  );
}
