"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderSearch from "@/components/shared/HeaderSearch";
import FacultyLogo from "@/components/layout/FacultyLogo";

const pages = [
  { href: "/", label: "Trang chủ" },
  { href: "/topics", label: "Kho đề tài" },
  { href: "/about", label: "Giới thiệu" },
];

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="portal-header">
      <div className="portal-header-inner">
        <Link href="/" className="portal-brand" aria-label="Về trang chủ">
          <FacultyLogo className="portal-header-logo" />
        </Link>
        <nav className="portal-menu" aria-label="Điều hướng chính">
          {pages.map((page) => {
            const active = page.href === "/" ? pathname === "/" : pathname === page.href || pathname.startsWith(`${page.href}/`);
            return <Link key={page.href} href={page.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>{page.label}</Link>;
          })}
        </nav>
        <div className="portal-header-actions">
          <HeaderSearch />
          <Link className="portal-login-link" href="/lecturer/login">Giảng viên <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </header>
  );
}
