import Link from "next/link";
import { getLecturerFromPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tổng quan giảng viên" };

export default async function DashboardPage() {
  const lecturer = await getLecturerFromPage();
  const [topicCount, openCount, registrationCount, newCount, latestRegistrations] = await Promise.all([
    prisma.topic.count({ where: { lecturerId: lecturer.id } }),
    prisma.topic.count({ where: { lecturerId: lecturer.id, status: "OPEN" } }),
    prisma.registration.count({ where: { topic: { lecturerId: lecturer.id } } }),
    prisma.registration.count({ where: { topic: { lecturerId: lecturer.id }, status: "NEW" } }),
    prisma.registration.findMany({
      where: { topic: { lecturerId: lecturer.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, studentName: true, status: true, createdAt: true, topic: { select: { title: true } } },
    }),
  ]);

  return (
    <div className="portal-dashboard">
      <div className="portal-dashboard-heading">
        <div><h1>Tổng quan</h1><p>Xin chào, {lecturer.fullName}. Đây là thông tin đề tài do bạn quản lý.</p></div>
        <Link className="button" href="/lecturer/topics/new">+ Thêm đề tài</Link>
      </div>
      <div className="portal-dashboard-stats">
        <div><span>Tổng số đề tài</span><strong>{topicCount}</strong></div>
        <div><span>Đề tài đang nhận</span><strong>{openCount}</strong></div>
        <div><span>Lượt quan tâm</span><strong>{registrationCount}</strong></div>
        <div><span>Chưa liên hệ</span><strong>{newCount}</strong></div>
      </div>
      <section className="portal-dashboard-section">
        <div className="portal-section-head"><h2>Lượt quan tâm gần đây</h2><Link href="/lecturer/registrations">Xem tất cả</Link></div>
        {latestRegistrations.length ? (
          <div className="table-scroll"><table className="data-table"><thead><tr><th>Sinh viên</th><th>Đề tài</th><th>Ngày gửi</th><th>Trạng thái</th></tr></thead><tbody>
            {latestRegistrations.map((registration) => <tr key={registration.id}>
              <td><strong>{registration.studentName}</strong></td><td>{registration.topic.title}</td>
              <td>{new Date(registration.createdAt).toLocaleDateString("vi-VN")}</td>
              <td><span className={`status-badge ${registration.status === "NEW" ? "closed" : "open"}`}>{registration.status === "NEW" ? "Chưa liên hệ" : "Đã liên hệ"}</span></td>
            </tr>)}
          </tbody></table></div>
        ) : <div className="portal-empty">Chưa có sinh viên gửi thông tin quan tâm.</div>}
      </section>
      <div className="portal-dashboard-bottom">
        <Link href="/lecturer/topics">Quản lý đề tài của tôi →</Link>
        <Link href="/lecturer/registrations">Xem danh sách sinh viên quan tâm →</Link>
      </div>
    </div>
  );
}
