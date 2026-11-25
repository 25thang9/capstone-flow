import { describe, expect, it } from "vitest";
import { checkCanRespond, willFillTopic } from "@/features/lecturer/registrations/rules";

describe("PR5: quy tắc giảng viên phản hồi đăng ký", () => {
  it("không phản hồi lặp trạng thái", () => {
    expect(checkCanRespond({ current: "ACCEPTED", next: "ACCEPTED", topic: { acceptedCount: 1, maxStudents: 2 } }))
      .toBe("SAME_STATUS");
  });
  it("chặn nhận sinh viên khi đề tài đã đủ số lượng", () => {
    expect(checkCanRespond({ current: "PENDING", next: "ACCEPTED", topic: { acceptedCount: 2, maxStudents: 2 } }))
      .toBe("TOPIC_FULL");
  });
  it("vẫn cho từ chối khi đề tài đã đủ", () => {
    expect(checkCanRespond({ current: "PENDING", next: "REJECTED", topic: { acceptedCount: 2, maxStudents: 2 } }))
      .toBeNull();
  });
  it("nhận được khi vẫn còn chỗ", () => {
    expect(checkCanRespond({ current: "PENDING", next: "ACCEPTED", topic: { acceptedCount: 1, maxStudents: 2 } }))
      .toBeNull();
  });
  it("nhận đủ người cuối cùng làm đề tài tự đóng", () => {
    expect(willFillTopic({ next: "ACCEPTED", topic: { acceptedCount: 1, maxStudents: 2 } })).toBe(true);
  });
  it("từ chối không làm tự đóng đề tài", () => {
    expect(willFillTopic({ next: "REJECTED", topic: { acceptedCount: 1, maxStudents: 2 } })).toBe(false);
  });
});
