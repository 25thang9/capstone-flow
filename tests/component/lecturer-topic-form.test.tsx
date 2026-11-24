
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LecturerTopicForm } from "@/features/lecturer/components/lecturer-topic-form";
import type { ActionState } from "@/lib/action-state";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const action = vi.fn(
  async (): Promise<ActionState> => ({
    status: "success",
    message: "OK",
  }),
);

const departments = [
  { id: "dep1", name: "Vật lý Điện tử" },
];

const tags = [
  { id: "tag1", name: "ESP32" },
  { id: "tag2", name: "Robotics" },
];

function renderForm() {
  return render(
    <LecturerTopicForm
      action={action}
      departments={departments}
      tags={tags}
      submitLabel="Đăng đề tài"
    />,
  );
}

describe("form Thêm đề tài của giảng viên PR3", () => {
  it("hiển thị đủ 4 nhóm thông tin và các trường", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: "Thông tin chung" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Nội dung thực hiện" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Phân loại" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Nhận sinh viên" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /Tên đề tài/ }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /Mô tả/ }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Đăng đề tài" }),
    ).toBeInTheDocument();
  });

  it("đổ bộ môn, thẻ công nghệ và trạng thái vào form", () => {
    renderForm();

    expect(
      screen.getByRole("option", { name: "Vật lý Điện tử" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", { name: "ESP32" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("checkbox", { name: "Robotics" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Đang nhận đăng ký" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Đã đóng" }),
    ).toBeInTheDocument();
  });

  it("mặc định tối đa 2 sinh viên và có đường dẫn hủy về danh sách", () => {
    renderForm();

    expect(
      screen.getByRole("spinbutton", {
        name: /Số sinh viên tối đa/,
      }),
    ).toHaveValue(2);

    expect(
      screen.getByRole("link", { name: "Huỷ" }),
    ).toHaveAttribute("href", "/lecturer/topics");
  });
});
