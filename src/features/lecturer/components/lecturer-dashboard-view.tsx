import Link from "next/link";
import { ClockIcon, FileTextIcon, InboxIcon, PlusIcon, UserCheckIcon, UsersIcon } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

// Cấu trúc dashboard theo B3, chưa có nguồn dữ liệu được thống nhất.
const cards = [
  { label: "Đề tài", icon: FileTextIcon, href: "/lecturer/topics" },
  { label: "Chờ phản hồi", icon: ClockIcon, href: "/lecturer/registrations?status=PENDING" },
  { label: "Đã nhận", icon: UserCheckIcon, href: "/lecturer/registrations?status=ACCEPTED" },
  { label: "Tổng lượt đăng ký", icon: UsersIcon, href: "/lecturer/registrations" },
] as const;

export function LecturerDashboardView() {
  return (
    <>
      <PageHeader
        title="Tổng quan"
        description="Tình hình đề tài và đăng ký của bạn."
        actions={
          <Button asChild>
            <Link href="/lecturer/topics/new"><PlusIcon aria-hidden="true" /> Thêm đề tài</Link>
          </Button>
        }
      />

      <p className="mb-4 text-xs text-muted-foreground" role="status">
        Giao diện đang được hoàn thiện — chưa kết nối dữ liệu.
      </p>
      <dl className="grid animate-in grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border duration-500 fade-in lg:grid-cols-4">
        {cards.map(({ label, icon: Icon, href }) => (
          <div key={label} className="group relative bg-card p-5 transition-colors hover:bg-secondary/60">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-sm text-muted-foreground">
                <Link href={href} className="after:absolute after:inset-0 group-hover:text-link">{label}</Link>
              </dt>
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="size-4" />
              </span>
            </div>
            <dd className="mt-1 font-heading text-4xl font-semibold text-muted-foreground" aria-label={`${label}: chưa có dữ liệu`}>
              —
            </dd>
            <p className="mt-1 text-xs text-muted-foreground">Chưa kết nối dữ liệu</p>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section aria-labelledby="lecturer-chart-heading">
          <h2 id="lecturer-chart-heading" className="text-xl font-semibold">Đăng ký theo đề tài</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">Tối đa 6 đề tài có nhiều lượt đăng ký nhất.</p>
          <EmptyState
            icon={InboxIcon}
            title="Chưa kết nối dữ liệu thống kê"
            description="Biểu đồ sẽ hiển thị khi hoàn thiện chức năng thống kê."
          />
        </section>

        <section aria-labelledby="lecturer-recent-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="lecturer-recent-heading" className="text-xl font-semibold">Đăng ký gần đây</h2>
            <Link href="/lecturer/registrations" className="text-sm font-medium text-link hover:underline">Xem tất cả</Link>
          </div>
          <p className="mt-4 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Danh sách sẽ hiển thị khi chức năng đăng ký được kết nối.
          </p>
        </section>
      </div>
    </>
  );
}
