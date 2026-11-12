import Link from "next/link";
import FacultyLogo from "@/components/layout/FacultyLogo";

export default function PublicFooter() {
  return (
    <footer className="portal-footer">
      <div className="portal-footer-inner">
        <div>
          <strong>CapstoneFlow</strong>
          <p>Ứng dụng tìm kiếm và quản lý đề tài đồ án do nhóm sinh viên xây dựng.</p>
          <p className="portal-disclaimer">Đây không phải hệ thống chính thức do Trường hoặc Khoa vận hành.</p>
        </div>
        <div className="portal-footer-actions">
          <Link href="/topics">Kho đề tài</Link>
          <Link href="/about">Giới thiệu</Link>
          <a href="https://phys.hcmus.edu.vn/vi" target="_blank" rel="noreferrer" title="Liên kết website Khoa Vật lý - Vật lý kỹ thuật">
            <FacultyLogo className="portal-faculty-logo" />
          </a>
          <small>Liên kết tham khảo: Khoa Vật lý - Vật lý kỹ thuật</small>
        </div>
      </div>
    </footer>
  );
}
