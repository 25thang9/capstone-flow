import Link from "next/link";
import TopicCard from "@/components/topics/TopicCard";
import { prisma } from "@/lib/prisma";
import { getPublicTopics } from "@/services/topic.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [topics, lecturerCount, openCount] = await Promise.all([
    getPublicTopics({ status: "OPEN" }),
    prisma.user.count(),
    prisma.topic.count({ where: { status: "OPEN" } }),
  ]);

  return (
    <main className="portal-page-wrap">
      <div className="portal-paper">
        <header className="portal-page-intro">
          <h1>Kho đề tài tốt nghiệp</h1>
          <p>Tra cứu đề tài do giảng viên công bố và gửi thông tin quan tâm.</p>
          <div className="portal-overview-meta">
            <span><strong>{openCount}</strong> đề tài đang nhận</span>
            <span><strong>{lecturerCount}</strong> giảng viên</span>
          </div>
        </header>

        <form action="/topics" method="get" className="portal-home-search" role="search">
          <label htmlFor="topic-keyword">Tìm kiếm đề tài</label>
          <div className="portal-search-fields">
            <input id="topic-keyword" name="search" autoComplete="off" placeholder="Nhập tên đề tài hoặc công nghệ" />
            <button type="submit">Tìm kiếm</button>
            <Link className="portal-advanced-link" href="/topics">Bộ lọc nâng cao</Link>
          </div>
        </form>

        <section className="portal-home-main" aria-labelledby="recent-heading">
          <div className="portal-section-head">
            <h2 id="recent-heading">Đề tài đang nhận sinh viên</h2>
            <Link href="/topics">Xem tất cả đề tài</Link>
          </div>
          {topics.length > 0 ? (
            <div className="portal-topic-list">
              {topics.slice(0, 6).map((topic) => <TopicCard key={topic.id} topic={topic} />)}
            </div>
          ) : <p className="portal-empty">Hiện chưa có đề tài đang nhận sinh viên.</p>}
        </section>

        <div className="portal-usage-note">
          <strong>Thông tin dành cho sinh viên:</strong> Không cần đăng nhập để gửi quan tâm. Giảng viên sẽ chủ động liên hệ nếu cần trao đổi thêm.
          <Link href="/about">Hướng dẫn sử dụng</Link>
        </div>
      </div>
    </main>
  );
}
