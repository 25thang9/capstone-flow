import { describe, expect, it } from "vitest";

import { hasActiveFilters, parseTopicFilters, topicFilterParams } from "@/features/topics/filters";

describe("parseTopicFilters", () => {
  it("không có tham số thì dùng mặc định: đề tài đang nhận, trang 1", () => {
    expect(parseTopicFilters({})).toEqual({ q: "", department: "", tag: "", status: "OPEN", page: 1 });
  });

  it("đọc đủ bộ lọc từ URL", () => {
    expect(
      parseTopicFilters({ q: "  esp32 ", department: "vat-ly-dien-tu", tag: "iot", status: "all", page: "2" }),
    ).toEqual({ q: "esp32", department: "vat-ly-dien-tu", tag: "iot", status: "ALL", page: 2 });
  });

  it("bỏ qua slug và trạng thái không hợp lệ thay vì báo lỗi", () => {
    const filters = parseTopicFilters({ department: "Vật lý'; DROP TABLE", tag: "../x", status: "HACK" });
    expect(filters).toMatchObject({ department: "", tag: "", status: "OPEN" });
  });

  it("cắt từ khoá quá dài và lấy giá trị đầu khi tham số lặp lại", () => {
    const filters = parseTopicFilters({ q: ["a".repeat(300), "b"] });
    expect(filters.q).toHaveLength(100);
  });
});

describe("hasActiveFilters / topicFilterParams", () => {
  it("bộ lọc mặc định không tính là đang lọc", () => {
    expect(hasActiveFilters(parseTopicFilters({}))).toBe(false);
    expect(hasActiveFilters(parseTopicFilters({ status: "ALL" }))).toBe(true);
    expect(hasActiveFilters(parseTopicFilters({ q: "laser" }))).toBe(true);
  });

  it("lược bỏ trạng thái mặc định khi dựng lại URL", () => {
    expect(topicFilterParams(parseTopicFilters({ q: "laser" })).status).toBe("");
    expect(topicFilterParams(parseTopicFilters({ status: "CLOSED" }), 3)).toMatchObject({ status: "CLOSED", page: 3 });
  });
});