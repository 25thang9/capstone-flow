import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/dal", () => ({
  getCurrentUser: vi.fn(),
}));

import { TopicRegistrationBoxView } from "@/features/topics/components/topic-registration-box";

const OPEN_CAPACITY = { status: "OPEN" as const, maxStudents: 3, acceptedCount: 1 };

describe("TopicRegistrationBoxView", () => {
  it("khách xem đề tài đang nhận thấy nút đăng nhập và đăng ký kèm tham số next", () => {
    render(
      <TopicRegistrationBoxView topicId="topic-1" lecturerId="lec-1" capacity={OPEN_CAPACITY} user={null} />,
    );

    expect(screen.getByRole("link", { name: "Đăng nhập để đăng ký" })).toHaveAttribute(
      "href",
      "/login?next=%2Ftopics%2Ftopic-1",
    );
    expect(screen.getByRole("link", { name: "Tạo tài khoản sinh viên" })).toHaveAttribute(
      "href",
      "/register?next=%2Ftopics%2Ftopic-1",
    );
  });

  it("đề tài đã đủ sinh viên hiện thông báo đã đủ và không mời đăng nhập", () => {
    render(
      <TopicRegistrationBoxView
        topicId="topic-1"
        lecturerId="lec-1"
        capacity={{ status: "OPEN", maxStudents: 2, acceptedCount: 2 }}
        user={null}
      />,
    );

    expect(screen.getByText("Đề tài đã đủ sinh viên")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Đăng nhập để đăng ký" })).not.toBeInTheDocument();
  });

  it("đề tài đã đóng hiện thông báo đã đóng", () => {
    render(
      <TopicRegistrationBoxView
        topicId="topic-1"
        lecturerId="lec-1"
        capacity={{ status: "CLOSED", maxStudents: 2, acceptedCount: 0 }}
        user={null}
      />,
    );

    expect(screen.getByText("Đề tài đã đóng")).toBeInTheDocument();
  });

  it("giảng viên chủ đề tài thấy nút điều hướng tới trang quản lý đề tài", () => {
    render(
      <TopicRegistrationBoxView
        topicId="topic-1"
        lecturerId="lec-1"
        capacity={OPEN_CAPACITY}
        user={{ id: "lec-1", name: "Trần Minh Khoa", email: "gv.khoa@example.com", role: "LECTURER" }}
      />,
    );

    expect(screen.getByText("Đề tài của bạn")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quản lý đề tài" })).toHaveAttribute("href", "/lecturer/topics");
  });

  it("tài khoản quản trị viên thấy thông báo chỉ dành cho sinh viên", () => {
    render(
      <TopicRegistrationBoxView
        topicId="topic-1"
        lecturerId="lec-1"
        capacity={OPEN_CAPACITY}
        user={{ id: "admin-1", name: "Quản trị Khoa", email: "admin@example.com", role: "ADMIN" }}
      />,
    );

    expect(screen.getByText("Chỉ dành cho sinh viên")).toBeInTheDocument();
  });
});
