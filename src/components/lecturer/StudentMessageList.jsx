"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function formatDate(date) {
  return new Date(date).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function StudentMessageList({ messages, initialOpenId = null }) {
  const router = useRouter();
  const [openId, setOpenId] = useState(initialOpenId);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const autoOpenedRef = useRef(null);

  // Đến từ nút tin nhắn trên header: mở nội dung cũng đồng thời đánh dấu đã xem.
  useEffect(() => {
    if (!initialOpenId || autoOpenedRef.current === initialOpenId) return;
    autoOpenedRef.current = initialOpenId;
    const item = messages.find((message) => message.id === initialOpenId);
    if (!item || item.messageReadAt) return;
    fetch("/api/v1/lecturer/messages", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: initialOpenId }),
    }).then((response) => {
      if (response.ok) {
        setReadIds((current) => [...current, initialOpenId]);
        window.dispatchEvent(new Event("capstoneflow:activity-changed"));
        router.refresh();
      }
    }).catch(() => { /* Người dùng vẫn có thể mở thư và thử lại. */ });
  }, [initialOpenId, messages, router]);
  const filtered = messages.filter((item) =>
    `${item.studentName} ${item.topic.title} ${item.message}`.toLocaleLowerCase("vi-VN").includes(search.trim().toLocaleLowerCase("vi-VN"))
  );

  async function markRead(id) {
    if (readIds.includes(id)) return;
    setBusyId(id);
    setError("");
    try {
      const response = await fetch("/api/v1/lecturer/messages", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: id }),
      });
      const result = await response.json();
      if (!response.ok && response.status !== 404) throw new Error(result.message || "Không đánh dấu đã xem được");
      setReadIds((current) => [...current, id]);
      window.dispatchEvent(new Event("capstoneflow:activity-changed"));
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  function openMessage(item) {
    const nextId = openId === item.id ? null : item.id;
    setOpenId(nextId);
    if (nextId && !item.messageReadAt) markRead(item.id);
  }

  async function markContacted(item) {
    setBusyId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/v1/registrations/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONTACTED" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không cập nhật được trạng thái");
      window.dispatchEvent(new Event("capstoneflow:activity-changed"));
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  if (messages.length === 0) return <div className="empty-state">Chưa có lời nhắn nào. Khi sinh viên điền ô “Lời nhắn” trong form quan tâm, nội dung sẽ xuất hiện tại đây.</div>;

  return (
    <section className="portal-inbox" aria-label="Danh sách lời nhắn của sinh viên">
      <div className="portal-inbox-toolbar"><label htmlFor="message-search">Tìm lời nhắn</label><input type="search" id="message-search" placeholder="Tên sinh viên hoặc đề tài..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      {filtered.length === 0 ? <p className="portal-panel-empty">Không tìm thấy lời nhắn phù hợp.</p> : null}
      <div className="portal-inbox-list">
        {filtered.map((item) => {
          const expanded = openId === item.id;
          const isUnread = !item.messageReadAt && !readIds.includes(item.id);
          return (
            <article className={`portal-inbox-item ${isUnread ? "unread" : ""}`} key={item.id} id={`message-${item.id}`}>
              <button type="button" className="portal-inbox-summary" aria-expanded={expanded} aria-controls={`message-details-${item.id}`} onClick={() => openMessage(item)}>
                <span className="portal-inbox-author">{isUnread ? <span className="portal-unread-dot" aria-label="Chưa xem" /> : null}<strong>{item.studentName}</strong><span className="portal-inbox-time">{formatDate(item.createdAt)}</span></span>
                <span className="portal-inbox-topic">{item.topic.title}</span>
                <span className="portal-inbox-excerpt">{item.message}</span>
                <span className="portal-inbox-chevron">{expanded ? "Thu gọn ↑" : "Xem nội dung ↓"}</span>
              </button>
              {expanded ? (
                <div className="portal-inbox-detail" id={`message-details-${item.id}`}>
                  <p className="portal-inbox-message">{item.message}</p>
                  <div className="portal-inbox-contacts">
                    <span><strong>Email:</strong> <a href={`mailto:${item.studentEmail}`}>{item.studentEmail}</a></span>
                    <span><strong>Điện thoại:</strong> {item.studentPhone}</span>
                    {item.studentCode ? <span><strong>MSSV:</strong> {item.studentCode}</span> : null}
                  </div>
                  <div className="portal-inbox-actions">
                    <a className="button" href={`mailto:${item.studentEmail}?subject=${encodeURIComponent(`Trao đổi về đề tài: ${item.topic.title}`)}`}>Trả lời qua email</a>
                    {item.status !== "CONTACTED" ? <button type="button" className="button outline" disabled={busyId === item.id} onClick={() => markContacted(item)}>Đã liên hệ</button> : <span className="status-badge open">Đã liên hệ</span>}
                    <Link className="text-link" href={`/topics/${item.topicId}`}>Xem đề tài</Link>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <p className="help-text">Hộp thư chỉ nhận lời nhắn gửi cùng form quan tâm. Trả lời được thực hiện qua email của giảng viên, chưa có chat hai chiều trong website.</p>
    </section>
  );
}
