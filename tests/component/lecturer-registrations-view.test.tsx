import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LecturerRegistrationsView } from "@/features/lecturer/components/lecturer-registrations-view";

describe("giao diện đăng ký sinh viên cho giảng viên", () => {
  it("có các tab trạng thái và không bật xuất CSV khi chưa có backend", () => {
    render(<LecturerRegistrationsView />);
    expect(screen.getByRole("button", { name: "Tất cả" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Xuất CSV" })).toBeDisabled();
    expect(screen.getByText("Chưa kết nối danh sách đăng ký")).toBeInTheDocument();
  });

  it("có thể mở sẵn tab chờ phản hồi từ liên kết dashboard", () => {
    render(<LecturerRegistrationsView initialStatus="PENDING" />);
    expect(screen.getByRole("button", { name: "Chờ phản hồi" })).toHaveAttribute("aria-pressed", "true");
  });

  it("chuyển tab và xóa bộ lọc trên client", () => {
    render(<LecturerRegistrationsView />);
    fireEvent.click(screen.getByRole("button", { name: "Chờ phản hồi" }));
    expect(screen.getByRole("button", { name: "Chờ phản hồi" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByRole("searchbox", { name: "Tìm sinh viên hoặc mã số" }), { target: { value: "  SV001 " } });
    fireEvent.click(screen.getByRole("button", { name: "Lọc" }));
    expect(screen.getByText(/Đã chọn bộ lọc: SV001 · Chờ phản hồi/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
    expect(screen.getByRole("button", { name: "Tất cả" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("searchbox", { name: "Tìm sinh viên hoặc mã số" })).toHaveValue("");
  });
});
