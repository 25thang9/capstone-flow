import { describe, expect, it } from "vitest";
import { parseRegistrationFilters, registrationFilterParams } from "@/features/lecturer/registrations/filters";

describe("PR5: bộ lọc đăng ký giảng viên", () => {
  it("mặc định trạng thái ALL, trang 1 và không có từ khóa", () => {
    expect(parseRegistrationFilters({})).toEqual({ q: "", status: "ALL", topicId: "", page: 1 });
  });
  it("đọc đúng trạng thái, mã đề tài, MSSV và trang", () => {
    expect(parseRegistrationFilters({ status: "pending", topic: "abc123", q: "  SV001  ", page: "2" }))
      .toEqual({ q: "SV001", status: "PENDING", topicId: "abc123", page: 2 });
  });
  it("không tin trạng thái và mã đề tài không hợp lệ", () => {
    const result = parseRegistrationFilters({ status: "ADMIN", topic: "id OR 1=1", page: "-5" });
    expect(result).toEqual({ q: "", status: "ALL", topicId: "", page: 1 });
  });
  it("giới hạn từ khóa tìm kiếm ở 100 ký tự", () => {
    expect(parseRegistrationFilters({ q: "a".repeat(130) }).q).toHaveLength(100);
  });
  it("tạo tham số URL đúng và giữ trạng thái khi lọc", () => {
    expect(registrationFilterParams({ q: "An", status: "ACCEPTED", topicId: "t1", page: 2 }))
      .toEqual({ q: "An", status: "ACCEPTED", topic: "t1", page: 2 });
  });
});
