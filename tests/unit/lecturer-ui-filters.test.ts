import { describe, expect, it } from "vitest";

import {
  isRegistrationFilterActive,
  isTopicFilterActive,
  normalizeKeyword,
  normalizeRegistrationStatus,
  normalizeTopicStatus,
} from "@/features/lecturer/ui-filters";

describe("bộ lọc giao diện giảng viên (không gọi API/database)", () => {
  it("loại khoảng trắng và giới hạn từ khóa 100 ký tự", () => {
    expect(normalizeKeyword("  đề tài  ")).toBe("đề tài");
    expect(normalizeKeyword("x".repeat(105))).toHaveLength(100);
  });

  it("mặc định bộ lọc đề tài là tất cả", () => {
    expect(normalizeTopicStatus("INVALID")).toBe("ALL");
    expect(normalizeTopicStatus("OPEN")).toBe("OPEN");
    expect(normalizeTopicStatus("CLOSED")).toBe("CLOSED");
  });

  it("chỉ chấp nhận trạng thái đăng ký hợp lệ", () => {
    expect(normalizeRegistrationStatus("PENDING")).toBe("PENDING");
    expect(normalizeRegistrationStatus("ACCEPTED")).toBe("ACCEPTED");
    expect(normalizeRegistrationStatus("REJECTED")).toBe("REJECTED");
    expect(normalizeRegistrationStatus("UNKNOWN")).toBe("ALL");
  });

  it("phát hiện đúng bộ lọc đề tài đang hoạt động", () => {
    expect(isTopicFilterActive("   ", "ALL")).toBe(false);
    expect(isTopicFilterActive("laser", "ALL")).toBe(true);
    expect(isTopicFilterActive("", "OPEN")).toBe(true);
  });

  it("phát hiện đúng bộ lọc đăng ký đang hoạt động", () => {
    expect(isRegistrationFilterActive("", "ALL")).toBe(false);
    expect(isRegistrationFilterActive("  ESP32  ", "ALL")).toBe(true);
    expect(isRegistrationFilterActive("", "PENDING")).toBe(true);
  });
});
