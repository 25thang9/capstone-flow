"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FacultyLogo from "@/components/layout/FacultyLogo";

export default function LecturerLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Đăng nhập thất bại.");
      router.replace("/lecturer/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
      setLoading(false);
    }
  }

  return (
    <main className="portal-login-page">
      <header className="portal-header">
        <div className="portal-header-inner portal-login-header">
          <Link href="/" className="portal-brand" aria-label="Về trang chủ"><FacultyLogo className="portal-header-logo" /></Link>
          <Link className="portal-login-link" href="/topics">← Kho đề tài</Link>
        </div>
      </header>

      <div className="portal-login-shell">
        
        <section className="portal-login-card" aria-labelledby="login-title">
          <div className="portal-login-columns">
            <div className="portal-login-main">
              <div className="portal-login-heading">
                <h1 id="login-title">Đăng nhập giảng viên</h1>
                <p>Sử dụng tài khoản giảng viên được cấp để truy cập khu vực quản lý.</p>
              </div>
              <form onSubmit={handleLogin} className="portal-login-form">
                <label htmlFor="lecturer-email">Email giảng viên</label>
                <input id="lecturer-email" required name="email" type="email" autoComplete="username" placeholder="ten.giangvien@example.edu.vn" />
                <label htmlFor="lecturer-password">Mật khẩu</label>
                <input id="lecturer-password" required name="password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" />
                {error ? <div role="alert" className="notice error">{error}</div> : null}
                <button type="submit" disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
              </form>
            </div>
            <aside className="portal-login-info">
              <h2>Thông tin truy cập</h2>
              <p>Trang này chỉ dành cho giảng viên quản lý đề tài, xem lượt quan tâm và đọc lời nhắn.</p>
              <div className="portal-login-info-divider" />
              <h3>Dành cho sinh viên</h3>
              <p>Sinh viên có thể xem đề tài và gửi thông tin quan tâm mà không cần tài khoản.</p>
              <Link href="/topics">Mở kho đề tài →</Link>
            </aside>
          </div>
        </section>
        <p className="portal-login-footer">Đồ án nhóm sinh viên · Không phải cổng đăng nhập chính thức của HCMUS.</p>
      </div>
    </main>
  );
}
