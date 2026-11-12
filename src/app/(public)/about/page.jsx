import Link from "next/link";

export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="portal-page-wrap">
      <div className="portal-paper portal-inner-page portal-text-page">
        <div className="portal-breadcrumb"><Link href="/">Trang chủ</Link><span>/</span> Giới thiệu</div>
        <h1>Giới thiệu CapstoneFlow</h1>
        <p>CapstoneFlow là dự án của nhóm sinh viên nhằm hỗ trợ tìm kiếm đề tài đồ án và kết nối sinh viên với giảng viên hướng dẫn.</p>
        <h2>Sinh viên sử dụng như thế nào?</h2>
        <ol>
          <li>Vào <Link href="/topics">Kho đề tài</Link>, nhập từ khóa hoặc lọc giảng viên.</li>
          <li>Mở trang chi tiết để đọc mô tả, mục tiêu và yêu cầu.</li>
          <li>Với đề tài đang nhận, điền biểu mẫu liên hệ và nhấn <strong>Gửi thông tin</strong>.</li>
        </ol>
        <div className="portal-note-simple">Sinh viên không cần tạo tài khoản. Mỗi email chỉ có thể gửi một lượt quan tâm cho cùng một đề tài. Việc gửi thông tin không đồng nghĩa đã được nhận vào đề tài.</div>
        <h2>Giảng viên làm gì?</h2>
        <p>Giảng viên <Link href="/lecturer/login">đăng nhập</Link> để tạo, sửa, xóa đề tài, thay đổi trạng thái nhận sinh viên và xem danh sách sinh viên quan tâm đến đề tài của mình.</p>
        <h2>Phạm vi dự án</h2>
        <p>Đây là bản MVP phục vụ học phần. Hệ thống chưa hỗ trợ tự đăng ký tài khoản sinh viên, xác nhận trúng tuyển, quản lý tiến độ đồ án hoặc tích hợp với tài khoản Moodle của trường.</p>
        <Link className="button" href="/topics">Xem danh sách đề tài</Link>
      </div>
    </div>
  );
}
