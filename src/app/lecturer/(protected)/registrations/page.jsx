import RegistrationList from "@/components/lecturer/RegistrationList";
import { getLecturerFromPage } from "@/lib/auth";
import { getRegistrationsForLecturer } from "@/services/registration.service";

export const metadata = { title: "Sinh viên quan tâm" };

export default async function LecturerRegistrationsPage() {
  const lecturer = await getLecturerFromPage();
  const registrations = await getRegistrationsForLecturer(lecturer.id);
  return <><div className="page-heading"><div className="eyebrow">KẾT NỐI SINH VIÊN</div><h1>Sinh viên quan tâm</h1><p>Danh sách thông tin chỉ hiển thị cho giảng viên sở hữu đề tài.</p></div><RegistrationList registrations={registrations} /></>;
}
