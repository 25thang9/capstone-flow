"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, CloseIcon, MessageIcon } from "@/components/shared/PortalIcons";

function formatDate(date) {
  return new Date(date).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function LecturerActivityToolbar() {
  const router = useRouter();
  const root = useRef(null);
  const [panel, setPanel] = useState(null);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/lecturer/activity", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không tải được thông báo");
      setActivity(result.data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    window.addEventListener("capstoneflow:activity-changed", onFocus);
    const interval = window.setInterval(refresh, 60000);
    return () => { window.removeEventListener("focus", onFocus); window.removeEventListener("capstoneflow:activity-changed", onFocus); window.clearInterval(interval); };
  }, [refresh]);

  useEffect(() => {
    if (!panel) return;
    refresh();
    const onOutside = (event) => {
      if (!root.current?.contains(event.target)) setPanel(null);
    };
    const onEscape = (event) => { if (event.key === "Escape") setPanel(null); };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [panel, refresh]);

  async function markRead(registrationId) {
    setBusy(true);
    try {
      const response = await fetch("/api/v1/lecturer/notifications", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationId ? { registrationId } : { all: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không cập nhật được thông báo");
      await refresh();
      router.refresh();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function openNotification(item) {
    if (!item.readAt) await markRead(item.id);
    setPanel(null);
    router.push(`/lecturer/registrations#registration-${item.id}`);
  }

  function toggle(name) { setPanel((current) => current === name ? null : name); }

  const unread = activity?.unreadCount || 0;
  const newMessages = activity?.newMessageCount || 0;

  return (
    <div className="portal-activity-toolbar" ref={root}>
      <div className="portal-tool">
        <button type="button" className={`portal-icon-button ${panel === "notifications" ? "is-open" : ""}`} aria-label={`Thông báo, ${unread} chưa xem`} aria-expanded={panel === "notifications"} aria-controls="notifications-panel" onClick={() => toggle("notifications")}>
          <BellIcon />{unread > 0 ? <span className="portal-count">{unread > 99 ? "99+" : unread}</span> : null}
        </button>
      </div>
      <div className="portal-tool">
        <button type="button" className={`portal-icon-button ${panel === "messages" ? "is-open" : ""}`} aria-label={`Lời nhắn sinh viên, ${newMessages} chưa xem`} aria-expanded={panel === "messages"} aria-controls="messages-panel" onClick={() => toggle("messages")}>
          <MessageIcon />{newMessages > 0 ? <span className="portal-count">{newMessages > 99 ? "99+" : newMessages}</span> : null}
        </button>
      </div>
      {panel ? (
        <div className="portal-toolbar-panel portal-activity-panel" id={panel === "notifications" ? "notifications-panel" : "messages-panel"}>
          <div className="portal-panel-title"><div><strong>{panel === "notifications" ? "Thông báo" : "Lời nhắn từ sinh viên"}</strong><span>{panel === "notifications" ? `${unread} lượt quan tâm chưa xem` : `${newMessages} lời nhắn chưa xem`}</span></div><button type="button" className="portal-panel-close" aria-label="Đóng bảng" onClick={() => setPanel(null)}><CloseIcon /></button></div>
          {error ? <p className="portal-panel-error" role="alert">{error}</p> : null}
          {panel === "notifications" ? (
            <>
              <div className="portal-panel-feed">
                {activity?.notifications?.length ? activity.notifications.map((item) => (
                  <button key={item.id} type="button" className={`portal-feed-row ${!item.readAt ? "unread" : ""}`} onClick={() => openNotification(item)}>
                    <span className="portal-feed-title">{!item.readAt ? <span className="portal-unread-dot" aria-label="Chưa xem" /> : null}<strong>{item.studentName}</strong> quan tâm đề tài</span>
                    <span className="portal-feed-description">{item.topic.title}</span>
                    <span className="portal-feed-date">{formatDate(item.createdAt)}</span>
                  </button>
                )) : <p className="portal-panel-empty">Chưa có lượt quan tâm nào.</p>}
              </div>
              {unread > 0 ? <button type="button" disabled={busy} className="portal-mark-all" onClick={() => markRead(null)}>Đánh dấu tất cả đã xem</button> : null}
              <Link className="portal-panel-footer" href="/lecturer/registrations" onClick={() => setPanel(null)}>Xem danh sách lượt quan tâm</Link>
            </>
          ) : (
            <>
              <div className="portal-panel-feed">
                {activity?.messages?.length ? activity.messages.map((item) => (
                  <Link className={`portal-feed-row ${!item.messageReadAt ? "unread" : ""}`} href={`/lecturer/messages?open=${item.id}`} key={item.id} onClick={() => setPanel(null)}>
                    <span className="portal-feed-title">{!item.messageReadAt ? <span className="portal-unread-dot" aria-label="Chưa xem" /> : null}<strong>{item.studentName}</strong> · {item.topic.title}</span>
                    <span className="portal-feed-description portal-message-preview">{item.message}</span>
                    <span className="portal-feed-date">{formatDate(item.createdAt)}</span>
                  </Link>
                )) : <p className="portal-panel-empty">Chưa có lời nhắn nào. Sinh viên có thể gửi qua form quan tâm đề tài.</p>}
              </div>
              <Link className="portal-panel-footer" href="/lecturer/messages" onClick={() => setPanel(null)}>Mở hộp thư</Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
