"use client";

import { useState } from "react";

export default function StudentRegistrationForm({ topicId, isOpen }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(`/api/v1/topics/${topicId}/registrations`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể gửi thông tin");
      setMessage("Đã gửi thông tin thành công. Giảng viên sẽ chủ động liên hệ nếu phù hợp.");
      form.reset();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return <div className="notice">Đề tài hiện đã đóng nhận đăng ký. Bạn có thể xem các đề tài khác.</div>;

  return (
    <form className="registration-form stack" onSubmit={handleSubmit}>
      <h2>Gửi thông tin liên hệ</h2>
      <p className="muted">Để lại thông tin để giảng viên có thể trao đổi thêm với bạn.</p>
      <label>Họ và tên *<input required name="studentName" minLength={2} maxLength={150} placeholder="Nguyễn Văn A" /></label>
      <div className="form-two-columns">
        <label>Mã sinh viên<input name="studentCode" maxLength={30} placeholder="SE170001" /></label>
        <label>Lớp<input name="studentClass" maxLength={100} placeholder="SE1701" /></label>
      </div>
      <label>Email *<input type="email" required name="studentEmail" maxLength={255} placeholder="sinhvien@example.com" /></label>
      <label>Số điện thoại *<input type="tel" required name="studentPhone" maxLength={20} placeholder="0901234567" /></label>
      <label>Lời nhắn<textarea name="message" maxLength={3000} rows={4} placeholder="Bạn muốn trao đổi thêm điều gì?" /></label>
      {message ? <div className="notice success" role="status">{message}</div> : null}
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <button type="submit" disabled={submitting}>{submitting ? "Đang gửi..." : "Gửi thông tin"}</button>
      <p className="help-text">Gửi quan tâm không đồng nghĩa đã được nhận vào đề tài. Mỗi email chỉ gửi một lần cho cùng đề tài.</p>
    </form>
  );
}
