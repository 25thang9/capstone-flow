import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LecturerDashboardView } from "@/features/lecturer/components/lecturer-dashboard-view";

describe("giao diện tổng quan giảng viên", () => {
  it("hiển thị đủ bốn ô thống kê theo B3 nhưng không dựng số liệu", () => {
    render(<LecturerDashboardView />);
    expect(screen.getByRole("heading", { name: "Tổng quan" })).toBeInTheDocument();
    expect(screen.getAllByText("Chưa kết nối dữ liệu")).toHaveLength(4);
    expect(screen.getAllByText("—")).toHaveLength(4);
  });

  it("nút chức năng chưa triển khai phải bị vô hiệu hóa", () => {
    render(<LecturerDashboardView />);
    expect(screen.getByRole("button", { name: "Thêm đề tài" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "Xem tất cả" })).toHaveAttribute("href", "/lecturer/registrations");
    expect(screen.getByRole("link", { name: "Chờ phản hồi" })).toHaveAttribute("href", "/lecturer/registrations?status=PENDING");
    expect(screen.getByRole("link", { name: "Đã nhận" })).toHaveAttribute("href", "/lecturer/registrations?status=ACCEPTED");
  });

  it("có trạng thái chờ kết nối cho biểu đồ và đăng ký", () => {
    render(<LecturerDashboardView />);
    expect(screen.getByText("Chưa kết nối dữ liệu thống kê")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Đăng ký gần đây" })).toBeInTheDocument();
  });
});
