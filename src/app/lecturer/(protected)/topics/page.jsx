import Link from "next/link";
import LecturerTopicList from "@/components/lecturer/LecturerTopicList";
import { getLecturerFromPage } from "@/lib/auth";
import { getLecturerTopics } from "@/services/topic.service";

export const metadata = { title: "Quản lý đề tài" };

export default async function LecturerTopicsPage({ searchParams }) {
  const params = await searchParams;
  const initialSearch = typeof params?.search === "string" ? params.search.slice(0, 200) : "";
  const lecturer = await getLecturerFromPage();
  const topics = await getLecturerTopics(lecturer.id);
  return (
    <>
      <div className="section-heading"><div><div className="eyebrow">QUẢN LÝ ĐỀ TÀI</div><h1>Đề tài của tôi</h1><p className="muted">Bạn chỉ có thể sửa và xóa đề tài do mình tạo.</p></div><Link className="button" href="/lecturer/topics/new">+ Thêm đề tài</Link></div>
      <LecturerTopicList topics={topics} initialSearch={initialSearch} />
    </>
  );
}
