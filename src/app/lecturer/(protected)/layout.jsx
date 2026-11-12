import { redirect } from "next/navigation";
import LecturerNavigation from "@/components/lecturer/LecturerNavigation";
import { getLecturerFromPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedLecturerLayout({ children }) {
  const lecturer = await getLecturerFromPage();
  if (!lecturer) redirect("/lecturer/login");
  return (
    <div className="lecturer-layout">
      <LecturerNavigation fullName={lecturer.fullName} />
      <main className="lecturer-main">{children}</main>
    </div>
  );
}
