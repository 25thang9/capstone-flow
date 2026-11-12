import Link from "next/link";
import { TOPIC_STATUS_LABEL } from "@/lib/constants";

export default function TopicCard({ topic }) {
  const updated = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  }).format(new Date(topic.updatedAt));

  return (
    <article className="portal-topic-row">
      <div className="portal-topic-body">
        <div className="portal-topic-title">
          <Link href={`/topics/${topic.id}`}>{topic.title}</Link>
          <span className={`status-badge ${topic.status === "OPEN" ? "open" : "closed"}`}>
            {TOPIC_STATUS_LABEL[topic.status]}
          </span>
        </div>
        <p className="portal-topic-excerpt">{topic.description}</p>
        <div className="portal-topic-meta">
          <span>Giảng viên: <strong>{topic.lecturer.fullName}</strong></span>
          <span>Dự kiến: {topic.maxStudents} sinh viên</span>
          <span>Cập nhật: {updated}</span>
        </div>
        {topic.technologies ? <p className="portal-topic-tech">Công nghệ: {topic.technologies}</p> : null}
      </div>
      <Link href={`/topics/${topic.id}`} className="portal-topic-action" aria-label={`Xem chi tiết ${topic.title}`}>
        Chi tiết <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
