"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSearch from "@/components/shared/HeaderSearch";
import LecturerActivityToolbar from "@/components/lecturer/LecturerActivityToolbar";
import FacultyLogo from "@/components/layout/FacultyLogo";

const pages = [
  { href: "/lecturer/dashboard", label: "Tổng quan" },
  { href: "/lecturer/topics", label: "Đề tài của tôi" },
  { href: "/lecturer/registrations", label: "Lượt quan tâm" },
  { href: "/lecturer/messages", label: "Hộp thư" },
];

export default function LecturerNavigation({ fullName }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    setSigningOut(true);
    try {
      const response = await fetch("/api/v1/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Không thể đăng xuất, vui lòng thử lại.");
      router.replace("/lecturer/login");
      router.refresh();
    } catch (error) {
      window.alert(error.message);
      setSigningOut(false);
    }
  }

  return (
    <header className="portal-header lecturer-portal-header">
      <div className="portal-header-inner">
        <Link className="portal-brand" href="/lecturer/dashboard" aria-label="Về tổng quan giảng viên"><FacultyLogo className="portal-header-logo" /></Link>
        <nav className="portal-menu" aria-label="Điều hướng giảng viên">
          {pages.map((page) => {
            const active = pathname === page.href || (page.href === "/lecturer/topics" && pathname.startsWith("/lecturer/topics/"));
            return <Link key={page.href} href={page.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{page.label}</Link>;
          })}
        </nav>
        <div className="portal-header-actions">
          <HeaderSearch lecturer />
          <LecturerActivityToolbar />
          <div className="portal-lecturer-user">
            <span title={fullName}>{fullName}</span>
            <button type="button" disabled={signingOut} onClick={handleLogout}>{signingOut ? "Đang thoát..." : "Đăng xuất"}</button>
          </div>
        </div>
      </div>
    </header>
  );
}
