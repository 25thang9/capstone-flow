import { describe, expect, it } from "vitest";
import {
  lecturerTopicFilterParams,
  lecturerTopicWhere,
  parseLecturerTopicFilters,
} from "@/features/lecturer/topics/filters";

describe("bộ lọc danh sách đề tài giảng viên theo B3", () => {
  it("chỉ nhận trạng thái hợp lệ, cắt từ khóa 100 ký tự", () => {
    expect(parseLecturerTopicFilters({ status: "INVALID", q: "  AI  " })).toEqual({ q: "AI", status: "ALL", page: 1 });
    expect(parseLecturerTopicFilters({ status: "closed", q: "x".repeat(120) }).q).toHaveLength(100);
    expect(parseLecturerTopicFilters({ status: "closed" }).status).toBe("CLOSED");
  });
  it("xử lý page sai hoặc mảng query string an toàn", () => {
    expect(parseLecturerTopicFilters({ page: "-6", status: ["OPEN", "CLOSED"] })).toEqual({ q: "", status: "OPEN", page: 1 });
    expect(parseLecturerTopicFilters({ page: "3" }).page).toBe(3);
  });
  it("lọc luôn gắn lecturerId do server cấp, không nhận từ URL", () => {
    const filters = parseLecturerTopicFilters({ q: "  ESP32 ", status: "OPEN", lecturerId: "attacker" });
    expect(lecturerTopicWhere("lecturer-real", filters)).toEqual({
      lecturerId: "lecturer-real",
      status: "OPEN",
      title: { contains: "ESP32", mode: "insensitive" },
    });
  });
  it("URL phân trang giữ lại bộ lọc và bỏ giá trị mặc định", () => {
    const filters = parseLecturerTopicFilters({ q: "robot", status: "CLOSED", page: "2" });
    expect(lecturerTopicFilterParams(filters, 3)).toEqual({ q: "robot", status: "CLOSED", page: 3 });
    expect(lecturerTopicFilterParams(parseLecturerTopicFilters({})).status).toBe("");
  });
});
