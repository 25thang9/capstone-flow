"use client";

import { useState, type FormEvent } from "react";
import { FilePlusIcon, PlusIcon, SearchIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  isTopicFilterActive,
  normalizeKeyword,
  normalizeTopicStatus,
  type TopicStatusFilter,
} from "@/features/lecturer/ui-filters";

export function LecturerTopicsView() {
  const [draftKeyword, setDraftKeyword] = useState("");
  const [draftStatus, setDraftStatus] = useState<TopicStatusFilter>("ALL");
  const [filters, setFilters] = useState({ q: "", status: "ALL" as TopicStatusFilter });
  const filtering = isTopicFilterActive(filters.q, filters.status);

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters({ q: normalizeKeyword(draftKeyword), status: normalizeTopicStatus(draftStatus) });
  }

  function resetFilters() {
    setDraftKeyword("");
    setDraftStatus("ALL");
    setFilters({ q: "", status: "ALL" });
  }

  return (
    <>
      <PageHeader
        title="Đề tài của tôi"
        description="Bạn chỉ thấy và chỉ sửa được đề tài do chính mình đăng."
        actions={
          <Button disabled title="Chức năng thêm đề tài sẽ được thực hiện ở PR riêng">
            <PlusIcon aria-hidden="true" /> Thêm đề tài
          </Button>
        }
      />
      <form onSubmit={onFilter} className="flex flex-wrap items-end gap-3" aria-label="Lọc đề tài giảng viên">
        <div className="grid min-w-56 flex-1 gap-1.5 sm:max-w-sm">
          <Label htmlFor="lecturer-topic-q">Tìm theo tên đề tài</Label>
          <Input id="lecturer-topic-q" type="search" value={draftKeyword} maxLength={100} onChange={(e) => setDraftKeyword(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lecturer-topic-status">Trạng thái</Label>
          <NativeSelect id="lecturer-topic-status" value={draftStatus} onChange={(e) => setDraftStatus(normalizeTopicStatus(e.target.value))}>
            <NativeSelectOption value="ALL">Tất cả</NativeSelectOption>
            <NativeSelectOption value="OPEN">Đang nhận</NativeSelectOption>
            <NativeSelectOption value="CLOSED">Đã đóng</NativeSelectOption>
          </NativeSelect>
        </div>
        <Button type="submit" variant="outline"><SearchIcon aria-hidden="true" /> Lọc</Button>
        <Button type="button" variant="ghost" onClick={resetFilters}>Xóa bộ lọc</Button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
        {filtering ? `Đã chọn bộ lọc: ${filters.q || "mọi tên đề tài"} · ${filters.status === "OPEN" ? "Đang nhận" : filters.status === "CLOSED" ? "Đã đóng" : "Tất cả trạng thái"}.` : "Đang xem tất cả trạng thái."}
        {" "}Bộ lọc chỉ hoạt động trên giao diện, chưa truy vấn dữ liệu.
      </p>

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
            <TableRow>
              <TableCell colSpan={6} className="whitespace-normal p-6">
                <EmptyState
                  icon={FilePlusIcon}
                  title="Chưa kết nối danh sách đề tài"
                  description="Bảng và các thao tác quản lý sẽ dùng dữ liệu thật ở PR chức năng sau."
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
