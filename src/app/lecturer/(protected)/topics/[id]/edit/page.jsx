import { notFound } from "next/navigation";
import TopicForm from "@/components/lecturer/TopicForm";
import { getLecturerFromPage } from "@/lib/auth";
import { getLecturerTopicById } from "@/services/topic.service";

export const metadata = { title: "Sửa đề tài" };

export default async function EditTopicPage({ params }) {
  const lecturer = await getLecturerFromPage();
  const { id } = await params;
  const topicId = Number(id);
  if (!Number.isSafeInteger(topicId) || topicId <= 0) notFound();
  const topic = await getLecturerTopicById(topicId, lecturer.id);
  if (!topic) notFound();
  return <><div className="page-heading"><div className="eyebrow">QUẢN LÝ ĐỀ TÀI</div><h1>Sửa đề tài</h1><p>Chỉnh sửa nội dung hoặc thay đổi trạng thái nhận đăng ký.</p></div><TopicForm initialTopic={topic} /></>;
}
