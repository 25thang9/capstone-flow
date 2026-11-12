"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { REGISTRATION_STATUS_LABEL } from "@/lib/constants";

export default function RegistrationList({ registrations }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function toggleStatus(registration) {
    setBusyId(registration.id);
    setError("");
    try {
      const response = await fetch(`/api/v1/registrations/${registration.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: registration.status === "NEW" ? "CONTACTED" : "NEW" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể cập nhật trạng thái");
      window.dispatchEvent(new Event("capstoneflow:activity-changed"));
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId(null);
    }
  }

  if (registrations.length === 0) return <div className="empty-state">Chưa có sinh viên nào gửi thông tin quan tâm.</div>;
  return (
    <>
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>Sinh viên</th><th>Đề tài</th><th>Liên hệ</th><th>Ngày gửi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>{registrations.map((registration) => (
            <tr key={registration.id} id={`registration-${registration.id}`}>
              <td><strong>{registration.studentName}</strong><div className="muted small-text">{[registration.studentCode, registration.studentClass].filter(Boolean).join(" · ")}</div>{registration.message ? <div className="small-text note-text">{registration.message}</div> : null}</td>
              <td>{registration.topic.title}</td>
              <td><a href={`mailto:${registration.studentEmail}`}>{registration.studentEmail}</a><div className="small-text">{registration.studentPhone}</div></td>
              <td>{new Date(registration.createdAt).toLocaleDateString("vi-VN")}</td>
              <td><span className={`status-badge ${registration.status === "NEW" ? "closed" : "open"}`}>{REGISTRATION_STATUS_LABEL[registration.status]}</span></td>
              <td><button className="text-button" type="button" disabled={busyId === registration.id} onClick={() => toggleStatus(registration)}>{registration.status === "NEW" ? "Đã liên hệ" : "Đánh dấu mới"}</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
