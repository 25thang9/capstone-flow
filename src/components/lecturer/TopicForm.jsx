"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TopicForm({ initialTopic = null }) {
  const router = useRouter();
  const isEditing = Boolean(initialTopic);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [technologies, setTechnologies] = useState(initialTopic?.technologies || "");
  const technologyTags = technologies.split(",").map((name) => name.trim()).filter(Boolean).slice(0, 12);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.maxStudents = Number(data.maxStudents);

    try {
      const response = await fetch(isEditing ? `/api/v1/topics/${initialTopic.id}` : "/api/v1/topics", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể lưu đề tài.");
      router.push("/lecturer/topics");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
      setSaving(false);
    }
  }

  return (
    <form className="editor-form topic-editor" onSubmit={handleSubmit}>
      <div className="editor-intro">
        <strong>{isEditing ? "Chỉnh sửa thông tin" : "Thông tin đề tài mới"}</strong>
        <span>Các ô đánh dấu * là bắt buộc.</span>
      </div>

      <section className="editor-section" aria-labelledby="editor-basic">
        <div className="editor-section-heading">
          
          <div><h2 id="editor-basic">Thông tin chung</h2><p>Tên đề tài và mô tả ngắn gọn.</p></div>
        </div>
        <div className="editor-section-fields">
          <label htmlFor="topic-title">Tên đề tài <span className="required-mark">*</span>
            <input id="topic-title" name="title" required minLength={5} maxLength={255} defaultValue={initialTopic?.title || ""} placeholder="Ví dụ: Website quản lý lịch đặt phòng học" />
          </label>
          <label htmlFor="topic-description">Mô tả đề tài <span className="required-mark">*</span>
            <textarea id="topic-description" name="description" required minLength={10} maxLength={20000} rows={5} defaultValue={initialTopic?.description || ""} placeholder="Mô tả bài toán, đối tượng sử dụng và chức năng chính..." />
          </label>
        </div>
      </section>

      <section className="editor-section" aria-labelledby="editor-scope">
        <div className="editor-section-heading">
          
          <div><h2 id="editor-scope">Nội dung thực hiện</h2><p>Mục tiêu, yêu cầu và công nghệ dự kiến.</p></div>
        </div>
        <div className="editor-section-fields">
          <label htmlFor="topic-objectives">Mục tiêu
            <textarea id="topic-objectives" name="objectives" maxLength={10000} rows={3} defaultValue={initialTopic?.objectives || ""} placeholder="Kết quả mong muốn sau khi hoàn thành đề tài..." />
          </label>
          <label htmlFor="topic-requirements">Yêu cầu đối với sinh viên
            <textarea id="topic-requirements" name="requirements" maxLength={10000} rows={3} defaultValue={initialTopic?.requirements || ""} placeholder="Kiến thức nền tảng, kỹ năng hoặc điều kiện tham gia..." />
          </label>
          <div className="field-block">
            <label htmlFor="topic-technologies">Công nghệ sử dụng <span className="field-optional">(nếu có)</span>
              <input id="topic-technologies" name="technologies" maxLength={2000} value={technologies} onChange={(event) => setTechnologies(event.target.value)} placeholder="Ví dụ: React, Node.js, PostgreSQL" aria-describedby="technology-help" />
            </label>
            <p id="technology-help" className="field-hint">Các công cụ hoặc ngôn ngữ dự kiến dùng trong đề tài. Viết cách nhau bằng dấu phẩy.</p>
            {technologyTags.length > 0 ? <div className="technology-preview" aria-label="Danh sách công nghệ đã nhập">{technologyTags.map((tag, index) => <span className="technology-chip" key={`${tag}-${index}`}>{tag}</span>)}</div> : null}
          </div>
        </div>
      </section>

      <section className="editor-section" aria-labelledby="editor-enrollment">
        <div className="editor-section-heading">
          
          <div><h2 id="editor-enrollment">Thông tin nhận sinh viên</h2><p>Số lượng dự kiến và trạng thái nhận quan tâm.</p></div>
        </div>
        <div className="editor-section-fields">
          <div className="form-two-columns">
            <div className="field-block">
              <label htmlFor="topic-students">Số sinh viên dự kiến tham gia <span className="required-mark">*</span>
                <input id="topic-students" type="number" name="maxStudents" min={1} max={30} required defaultValue={initialTopic?.maxStudents ?? 2} />
              </label>
              <p className="field-hint">Số lượng dự kiến, không phải số sinh viên đã được duyệt.</p>
            </div>
            <div className="field-block">
              <label htmlFor="topic-status">Trạng thái nhận quan tâm
                <select id="topic-status" name="status" defaultValue={initialTopic?.status || "OPEN"}>
                  <option value="OPEN">Đang nhận quan tâm</option>
                  <option value="CLOSED">Tạm đóng</option>
                </select>
              </label>
              <p className="field-hint">Khi tạm đóng, sinh viên không thể gửi form quan tâm mới.</p>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <div className="editor-footer">
        <p>Thông tin sẽ xuất hiện tại Kho đề tài sau khi lưu.</p>
        <div className="form-actions">
          <button type="button" className="outline" onClick={() => router.push("/lecturer/topics")}>Hủy</button>
          <button type="submit" disabled={saving}>{saving ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Đăng đề tài"}</button>
        </div>
      </div>
    </form>
  );
}
