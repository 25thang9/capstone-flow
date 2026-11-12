import Link from "next/link";
import { notFound } from "next/navigation";
import StudentRegistrationForm from "@/components/topics/StudentRegistrationForm";
import { getPublicTopicById } from "@/services/topic.service";
import { TOPIC_STATUS_LABEL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function TopicDetailPage({ params }) {
  const { id } = await params;
  const topicId = Number(id);
  if (!Number.isSafeInteger(topicId) || topicId <= 0) notFound();
  const topic = await getPublicTopicById(topicId);
  if (!topic) notFound();
  const technologies = (topic.technologies || "").split(",").map((item) => item.trim()).filter(Boolean);

  return (
    <div className="portal-page-wrap">
      <div className="portal-paper portal-inner-page portal-detail-page">
        <div className="portal-breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/topics">Kho đề tài</Link><span>/</span> Chi tiết đề tài</div>
        <div className="portal-detail-heading">
          <span className={`status-badge ${topic.status === "OPEN" ? "open" : "closed"}`}>{TOPIC_STATUS_LABEL[topic.status]}</span>
          <h1>{topic.title}</h1>
          <p>Giảng viên: <strong>{topic.lecturer.fullName}</strong> · Dự kiến {topic.maxStudents} sinh viên · Cập nhật {new Date(topic.updatedAt).toLocaleDateString("vi-VN")}</p>
        </div>
        <div className="portal-detail-columns">
          <article className="portal-detail-info">
            <h2>Mô tả đề tài</h2><p className="pre-line">{topic.description}</p>
            {topic.objectives ? <><h2>Mục tiêu</h2><p className="pre-line">{topic.objectives}</p></> : null}
            {topic.requirements ? <><h2>Yêu cầu</h2><p className="pre-line">{topic.requirements}</p></> : null}
            {technologies.length ? <><h2>Công nghệ</h2><p>{technologies.join(", ")}</p></> : null}
          </article>
          <aside className="portal-detail-form"><StudentRegistrationForm topicId={topic.id} isOpen={topic.status === "OPEN"} /></aside>
        </div>
      </div>
    </div>
  );
}
