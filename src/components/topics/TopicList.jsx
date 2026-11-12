"use client";

import { useEffect, useState } from "react";
import TopicCard from "@/components/topics/TopicCard";

export default function TopicList({ initialSearch = "" }) {
  const [search, setSearch] = useState(initialSearch);
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  const [lecturer, setLecturer] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const query = new URLSearchParams({ search, lecturer, status });
        const response = await fetch(`/api/v1/topics?${query}`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Không tải được danh sách đề tài.");
        setTopics(result.data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [search, lecturer, status]);

  return (
    <>
      <div className="portal-filter-panel">
        <div className="portal-filter-fields">
          <label>Từ khóa
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tên đề tài, công nghệ..." />
          </label>
          <label>Giảng viên
            <input value={lecturer} onChange={(event) => setLecturer(event.target.value)} placeholder="Tên giảng viên" />
          </label>
          <label>Trạng thái
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="OPEN">Đang nhận</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="ALL">Tất cả</option>
            </select>
          </label>
        </div>
        <button type="button" className="text-button portal-clear-filter" onClick={() => { setSearch(""); setLecturer(""); setStatus("OPEN"); }}>Xóa bộ lọc</button>
      </div>
      <div className="portal-list-heading" aria-live="polite">{loading ? "Đang tải danh sách..." : `${topics.length} đề tài được tìm thấy`}</div>
      {loading ? <div className="portal-loading" role="status">Đang lấy dữ liệu từ hệ thống...</div> : null}
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      {!loading && !error && topics.length === 0 ? <div className="portal-empty">Không có đề tài phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc.</div> : null}
      {!loading && !error && topics.length > 0 ? <div className="portal-topic-list">{topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}</div> : null}
    </>
  );
}
