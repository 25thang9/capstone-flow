import { Suspense } from "react";
import type { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";
import { LecturerDashboardView } from "@/features/lecturer/components/lecturer-dashboard-view";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "Tổng quan giảng viên" };

export default function LecturerDashboardPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ProtectedDashboard />
    </Suspense>
  );
}

async function ProtectedDashboard() {
  // Chỉ kiểm tra phiên và role có sẵn. Không truy vấn đề tài / đăng ký / thống kê.
  await requireRole("LECTURER");
  return <LecturerDashboardView />;
}
