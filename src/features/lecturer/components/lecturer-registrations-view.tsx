"use client";

import { useState, type FormEvent } from "react";
import { DownloadIcon, InboxIcon, SearchIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  isRegistrationFilterActive,
  normalizeKeyword,
  normalizeRegistrationStatus,
  type RegistrationStatusFilter,
} from "@/features/lecturer/ui-filters";

const statusTabs: { value: RegistrationStatusFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ phản hồi" },
  { value: "ACCEPTED", label: "Đã nhận" },
  { value: "REJECTED", label: "Từ chối" },
];

export function LecturerRegistrationsView({ initialStatus = "ALL" }: { initialStatus?: RegistrationStatusFilter }) {
  const [status, setStatus] = useState<RegistrationStatusFilter>(initialStatus);
  const [draftKeyword, setDraftKeyword] = useState("");
  const [keyword, setKeyword] = useState("");

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setKeyword(normalizeKeyword(draftKeyword));
  }

  function resetFilters() {
    setStatus("ALL");
    setDraftKeyword("");
    setKeyword("");
  }

  return (
    <>
      <PageHeader
        title="Sinh viên đăng ký"
        description="Thông tin liên hệ chỉ hiển thị cho giảng viên sở hữu đề tài."
        actions={
          <Button disabled variant="outline" title="Xuất CSV sẽ được bổ sung ở PR xử lý đăng ký">
            <DownloadIcon aria-hidden="true" /> Xuất CSV
          </Button>
        }
      />
      <nav aria-label="Lọc theo trạng thái" className="flex flex-wrap gap-1.5">
        {statusTabs.map((tab) => (
          <button
            type="button"
            key={tab.value}
            onClick={() => setStatus(normalizeRegistrationStatus(tab.value))}
            aria-pressed={status === tab.value}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${status === tab.value ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <form onSubmit={onFilter} className="mt-4 flex flex-wrap items-end gap-3" aria-label="Lọc đăng ký giảng viên">
        <div className="grid min-w-56 flex-1 gap-1.5 sm:max-w-sm">
          <Label htmlFor="lecturer-registration-q">Tìm sinh viên hoặc mã số</Label>
          <Input id="lecturer-registration-q" type="search" value={draftKeyword} maxLength={100} onChange={(e) => setDraftKeyword(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lecturer-registration-topic">Đề tài</Label>
          <NativeSelect id="lecturer-registration-topic" disabled value="" aria-label="Đề tài (chưa kết nối dữ liệu)">
            <NativeSelectOption value="">Tất cả đề tài</NativeSelectOption>
          </NativeSelect>
        </div>
        <Button type="submit" variant="outline"><SearchIcon aria-hidden="true" /> Lọc</Button>
        <Button type="button" variant="ghost" onClick={resetFilters}>Xóa bộ lọc</Button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
        {isRegistrationFilterActive(keyword, status) ? `Đã chọn bộ lọc: ${keyword || "mọi sinh viên"} · ${statusTabs.find((tab) => tab.value === status)?.label}.` : "Đang xem tất cả trạng thái."}
        {" "}Bộ lọc chỉ hoạt động trên giao diện, chưa truy vấn dữ liệu.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border bg-card">
        <Table className="min-w-[44rem]">
          <TableHeader>
            <TableRow>
              <TableHead>Sinh viên</TableHead>
              <TableHead>Đề tài</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead><span className="sr-only">Thao tác</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="whitespace-normal p-6">
                <EmptyState
                  icon={InboxIcon}
                  title="Chưa kết nối danh sách đăng ký"
                  description="Danh sách, phản hồi và xuất CSV sẽ được bổ sung ở PR chức năng sau."
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
