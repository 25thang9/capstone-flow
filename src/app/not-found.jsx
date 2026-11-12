import Link from "next/link";

export default function NotFound() {
  return <main className="container section-space"><h1>Không tìm thấy trang</h1><p>Đường dẫn không tồn tại hoặc bạn không có quyền xem nội dung này.</p><Link className="button" href="/">Về trang chủ</Link></main>;
}
