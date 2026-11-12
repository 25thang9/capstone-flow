"use client";

export default function ErrorPage({ reset }) {
  return <main className="container section-space"><h1>Không tải được dữ liệu</h1><p>Vui lòng kiểm tra kết nối hoặc thử lại.</p><button type="button" onClick={() => reset()}>Thử lại</button></main>;
}
