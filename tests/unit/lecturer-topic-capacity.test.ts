import { describe, expect, it } from "vitest";
import { checkTopicCapacity } from "@/features/registrations/rules";

describe("quy tắc sức chứa khi sửa/đóng/mở đề tài PR4", () => {
  it("không cho giảm sức chứa dưới số sinh viên đã nhận", () => {
    expect(checkTopicCapacity({ status: "CLOSED", maxStudents: 1, acceptedCount: 2 })).toBe("BELOW_ACCEPTED");
  });

  it("không mở lại đề tài đã nhận đủ sinh viên", () => {
    expect(checkTopicCapacity({ status: "OPEN", maxStudents: 2, acceptedCount: 2 })).toBe("OPEN_WHILE_FULL");
  });

  it("được đóng đề tài đã đủ chỗ", () => {
    expect(checkTopicCapacity({ status: "CLOSED", maxStudents: 2, acceptedCount: 2 })).toBeNull();
  });

  it("mở lại hợp lệ khi còn chỗ", () => {
    expect(checkTopicCapacity({ status: "OPEN", maxStudents: 3, acceptedCount: 2 })).toBeNull();
  });
});
