"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TOPIC_STATUS_LABEL } from "@/lib/constants";

export default function LecturerTopicList({ topics, initialSearch = "" }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialSearch);
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  const filteredTopics = topics.filter((topic) => topic.title.toLocaleLowerCase("vi-VN").includes(search.trim().toLocaleLowerCase("vi-VN")));

  async function updateTopic(topic, action) {
    if (action === "DELETE" && !window.confirm(`Xóa đề tài "${topic.title}"? Các lượt quan tâm liên quan cũng bị xóa.`)) return;
    setBusyId(topic.id);
    setError("");
    try {
      const response = await fetch(`/api/v1/topics/${topic.id}`, {
        method: action === "DELETE" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        ...(action === "PATCH" ? { body: JSON.stringify({ status: topic.status === "OPEN" ? "CLOSED" : "OPEN" }) } : {}),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không cập nhật được đề tài");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  if (topics.length === 0) return <div className="empty-state">Bạn chưa có đề tài nào. <Link href="/lecturer/topics/new">Tạo đề tài đầu tiên</Link>.</div>;
  return (
    <>
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <div className="portal-lecturer-search"><label htmlFor="lecturer-topic-search">Tìm đề tài</label><input id="lecturer-topic-search" type="search" placeholder="Nhập tên đề tài..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      {filteredTopics.length === 0 ? <p className="portal-panel-empty">Không tìm thấy đề tài phù hợp.</p> : null}
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>Đề tài</th><th>Trạng thái</th><th>Lượt quan tâm</th><th>Thao tác</th></tr></thead>
          <tbody>{filteredTopics.map((topic) => (
            <tr key={topic.id}>
              <td><strong>{topic.title}</strong><div className="muted small-text">{topic.maxStudents} sinh viên dự kiến</div></td>
              <td><span className={`status-badge ${topic.status === "OPEN" ? "open" : "closed"}`}>{TOPIC_STATUS_LABEL[topic.status]}</span></td>
              <td>{topic._count.registrations}</td>
              <td><div className="table-actions">
                <Link className="text-link" href={`/lecturer/topics/${topic.id}/edit`}>Sửa</Link>
                <button type="button" className="text-button" disabled={busyId === topic.id} onClick={() => updateTopic(topic, "PATCH")}>{topic.status === "OPEN" ? "Đóng" : "Mở"}</button>
                <button type="button" className="text-button danger" disabled={busyId === topic.id} onClick={() => updateTopic(topic, "DELETE")}>Xóa</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
