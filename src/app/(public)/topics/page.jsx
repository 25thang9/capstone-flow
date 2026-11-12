import Link from "next/link";
import TopicList from "@/components/topics/TopicList";

export const metadata = { title: "Kho đề tài" };

export default async function TopicsPage({ searchParams }) {
  const params = await searchParams;
  const initialSearch = typeof params?.search === "string" ? params.search.slice(0, 200) : "";

  return (
    <div className="portal-page-wrap">
      <div className="portal-paper portal-inner-page">
        <div className="portal-breadcrumb"><Link href="/">Trang chủ</Link><span>/</span> Kho đề tài</div>
        <h1>Danh sách đề tài</h1>
        <p className="portal-page-description">Lọc theo tên đề tài, giảng viên hoặc trạng thái. Nhấn vào tên đề tài để xem yêu cầu và gửi thông tin quan tâm.</p>
        <TopicList initialSearch={initialSearch} />
      </div>
    </div>
  );
}
