import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LecturerTopicsView } from "@/features/lecturer/components/lecturer-topics-view";
import { paginate } from "@/lib/pagination";
import type { LecturerTopicFilters } from "@/features/lecturer/topics/filters";
import type { LecturerTopicRow } from "@/features/lecturer/topics/queries";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const defaults: LecturerTopicFilters = { q: "", status: "ALL", page: 1 };
const topic: LecturerTopicRow = {
  id: "t1",
  title: "Robot vận chuyển thuốc",
  status: "OPEN",
  maxStudents: 3,
  updatedAt: new Date("2026-11-20T00:00:00Z"),
  department: { name: "Vật lý ứng dụng" },
  acceptedCount: 1,
  pendingCount: 2,
};

function renderList(options?: { topics?: LecturerTopicRow[]; filters?: LecturerTopicFilters }) {
  const topics = options?.topics ?? [];
  render(<LecturerTopicsView filters={options?.filters ?? defaults} topics={topics} pagination={paginate(topics.length, 1, 10)} />);
}

describe("danh sách đề tài giảng viên PR3", () => {
  beforeEach(() => push.mockClear());

  it("hiển thị bảng rỗng khi giảng viên chưa có đề tài", () => {
    renderList();
    expect(screen.getByRole("heading", { name: "Đề tài của tôi" })).toBeInTheDocument();
    expect(screen.getByText("Bạn chưa đăng đề tài nào")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Thêm đề tài" })).toHaveAttribute("href", "/lecturer/topics/new");
  });

  it("phân biệt không có dữ liệu với không tìm thấy theo bộ lọc", () => {
    renderList({ filters: { q: "không tồn tại", status: "ALL", page: 1 } });
    expect(screen.getByText("Không có đề tài khớp bộ lọc")).toBeInTheDocument();
  });

  it("hiển thị đề tài, trạng thái, số sinh viên và bộ môn", () => {
    renderList({ topics: [topic] });
    expect(screen.getByText("Robot vận chuyển thuốc")).toBeInTheDocument();
    expect(screen.getByText("Vật lý ứng dụng")).toBeInTheDocument();
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sửa" })).toBeDisabled();
  });

  it("nhập bộ lọc, nhấn Lọc sẽ chuyển URL đúng", () => {
    renderList();
    fireEvent.change(screen.getByRole("searchbox", { name: "Tìm theo tên đề tài" }), { target: { value: "ESP32" } });
    fireEvent.click(screen.getByRole("button", { name: "Lọc" }));
    expect(push).toHaveBeenCalledWith("/lecturer/topics?q=ESP32");
  });
});
