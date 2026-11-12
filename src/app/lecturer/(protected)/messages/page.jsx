import StudentMessageList from "@/components/lecturer/StudentMessageList";
import { getLecturerFromPage } from "@/lib/auth";
import { getStudentMessagesForLecturer } from "@/services/registration.service";

export const metadata = { title: "Hộp thư sinh viên" };

export default async function LecturerMessagesPage({ searchParams }) {
  const lecturer = await getLecturerFromPage();
  const params = await searchParams;
  const initialOpenId = Number(params?.open);
  const messages = await getStudentMessagesForLecturer(lecturer.id);

  return (
    <>
      <div className="page-heading"><h1>Hộp thư sinh viên</h1><p>Lời nhắn sinh viên gửi khi bày tỏ quan tâm đến đề tài của bạn.</p></div>
      <StudentMessageList messages={messages} initialOpenId={Number.isSafeInteger(initialOpenId) && initialOpenId > 0 ? initialOpenId : null} />
    </>
  );
}
