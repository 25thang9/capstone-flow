import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LecturerRegistrationsView } from "@/features/lecturer/components/lecturer-registrations-view";
import type { LecturerRegistration } from "@/features/lecturer/registrations/queries";
import type { RegistrationFilters } from "@/features/lecturer/registrations/filters";
import { paginate } from "@/lib/pagination";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/features/lecturer/components/respond-registration-dialog", () => ({
  RespondDialog: () => <button type="button">Phản hồi</button>,
}));

const filters = { q: "", status: "ALL" as const, topicId: "", page: 1 };
const registration = {
  id: "reg1", status: "PENDING", studentCode: "SV000001", className: "21VL", phone: "0912345678",
  message: "Em muốn tham gia", lecturerNote: null, respondedAt: null, createdAt: new Date("2026-11-24T03:00:00Z"),
  student: { name: "Nguyễn Văn An", email: "an@example.com" },
  topic: { id: "topic1", title: "Ứng dụng ESP32", maxStudents: 2 },
} as LecturerRegistration;

function renderView(rows: LecturerRegistration[] = [registration], status: RegistrationFilters["status"] = filters.status) {
  return render(<LecturerRegistrationsView
    filters={{ ...filters, status }} topics={[{ id: "topic1", title: "Ứng dụng ESP32" }]}
    registrations={rows} pagination={paginate(rows.length, 1, 10)}
  />);
}

describe("PR5: danh sách sinh viên đăng ký của giảng viên", () => {
  it("hiển thị tab trạng thái và bộ lọc đề tài/MSSV", () => {
    renderView();
    expect(screen.getByRole("navigation", { name: "Lọc theo trạng thái" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Chờ phản hồi" })).toHaveAttribute("href", "/lecturer/registrations?status=PENDING");
    expect(screen.getByRole("searchbox", { name: "Tìm sinh viên hoặc mã số" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ứng dụng ESP32" })).toBeInTheDocument();
  });
  it("hiển thị họ tên, MSSV, liên hệ, đề tài và nút phản hồi", () => {
    renderView();
    expect(screen.getByText("Nguyễn Văn An")).toBeInTheDocument();
    expect(screen.getByText("SV000001")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "an@example.com" })).toHaveAttribute("href", "mailto:an@example.com");
    expect(screen.getByRole("link", { name: "0912345678" })).toHaveAttribute("href", "tel:0912345678");
    expect(screen.getByRole("button", { name: "Phản hồi" })).toBeInTheDocument();
  });
  it("bật CSV khi có dữ liệu và giữ bộ lọc trạng thái", () => {
    renderView([registration], "PENDING");
    expect(screen.getByRole("link", { name: "Xuất CSV" })).toHaveAttribute("href", "/api/lecturer/registrations/export?status=PENDING");
    expect(screen.getByRole("link", { name: "Xóa bộ lọc" })).toHaveAttribute("href", "/lecturer/registrations");
  });
  it("có empty state khi không có dữ liệu và không hiện CSV", () => {
    renderView([]);
    expect(screen.getByText("Không có đăng ký nào")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Xuất CSV" })).not.toBeInTheDocument();
  });
});
