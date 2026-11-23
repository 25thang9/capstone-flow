import type { ReactNode } from "react";

import { SectionTabs } from "@/components/layout/section-tabs";

// Menu theo bố cục B3. Chưa lấy số đăng ký chờ từ database.
// Quyền truy cập được kiểm tra riêng trong từng page, không chỉ ở layout.
export default function LecturerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SectionTabs
        label="Khu giảng viên"
        tabs={[
          { href: "/lecturer", label: "Tổng quan", exact: true },
          { href: "/lecturer/topics", label: "Đề tài của tôi" },
          { href: "/lecturer/registrations", label: "Sinh viên đăng ký" },
        ]}
      />
      <div className="container-page py-8">{children}</div>
    </>
  );
}
