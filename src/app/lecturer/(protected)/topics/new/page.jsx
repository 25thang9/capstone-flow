import TopicForm from "@/components/lecturer/TopicForm";

export const metadata = { title: "Thêm đề tài" };

export default function NewTopicPage() {
  return <><div className="page-heading"><div className="eyebrow">ĐỀ TÀI / TẠO MỚI</div><h1>Đăng đề tài mới</h1><p>Điền những thông tin sinh viên cần biết. Bạn có thể chỉnh sửa lại sau.</p></div><TopicForm /></>;
}
