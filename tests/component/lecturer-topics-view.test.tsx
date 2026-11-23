import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LecturerTopicsView } from "@/features/lecturer/components/lecturer-topics-view";

describe("giao diện đề tài giảng viên", () => {
  it("hiện đúng cột của bảng B3 và trạng thái chưa kết nối dữ liệu", () => {
    render(<LecturerTopicsView />);
    expect(screen.getByRole("heading", { name: "Đề tài của tôi" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Đã nhận" })).toBeInTheDocument();
    expect(screen.getByText("Chưa kết nối danh sách đề tài")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thêm đề tài" })).toBeDisabled();
  });

  it("lọc và xóa bộ lọc chỉ thay đổi trạng thái giao diện", () => {
    render(<LecturerTopicsView />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Tìm theo tên đề tài" }), { target: { value: "  ESP32  " } });
    fireEvent.change(screen.getByRole("combobox", { name: "Trạng thái" }), { target: { value: "CLOSED" } });
    fireEvent.click(screen.getByRole("button", { name: "Lọc" }));
    expect(screen.getByText(/Đã chọn bộ lọc: ESP32 · Đã đóng/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
    expect(screen.getByRole("searchbox", { name: "Tìm theo tên đề tài" })).toHaveValue("");
    expect(screen.getByText(/Đang xem tất cả trạng thái/)).toBeInTheDocument();
  });
});
