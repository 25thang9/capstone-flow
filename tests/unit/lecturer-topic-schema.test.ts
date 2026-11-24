import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  MAX_STUDENTS_PER_TOPIC,
  MAX_TAGS_PER_TOPIC,
  readTopicForm,
  topicSchema,
} from "@/features/lecturer/topics/schema";

const valid = {
  title: "Hệ đo nhiệt độ dùng ESP32",
  description: "Thu thập nhiệt độ, độ ẩm và hiển thị dữ liệu trong phòng thí nghiệm.",
  objectives: "",
  requirements: "",
  departmentId: "department-1",
  maxStudents: "3",
  status: "OPEN",
  tagIds: ["tag-1"],
};

describe("tạo đề tài giảng viên – schema PR3", () => {
  it("chuẩn hóa dữ liệu hợp lệ như B3", () => {
    const result = topicSchema.parse(valid);
    expect(result.maxStudents).toBe(3);
    expect(result.objectives).toBeNull();
    expect(result.requirements).toBeNull();
    expect(result.status).toBe("OPEN");
  });

  it("kiểm tra độ dài tiêu đề, mô tả và bắt buộc chọn bộ môn", () => {
    const result = topicSchema.safeParse({ ...valid, title: "Ngắn", description: "Ngắn", departmentId: "" });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errors = z.flattenError(result.error).fieldErrors;
    expect(errors.title?.[0]).toBe("Tên đề tài cần ít nhất 10 ký tự.");
    expect(errors.description?.[0]).toBe("Mô tả cần ít nhất 30 ký tự để sinh viên hiểu đề tài.");
    expect(errors.departmentId?.[0]).toBe("Hãy chọn bộ môn.");
  });

  it("chỉ nhận số nguyên 1–10 và trạng thái OPEN/CLOSED", () => {
    expect(MAX_STUDENTS_PER_TOPIC).toBe(10);
    expect(topicSchema.safeParse({ ...valid, maxStudents: "0" }).success).toBe(false);
    expect(topicSchema.safeParse({ ...valid, maxStudents: "11" }).success).toBe(false);
    expect(topicSchema.safeParse({ ...valid, maxStudents: "2.5" }).success).toBe(false);
    expect(topicSchema.safeParse({ ...valid, status: "ARCHIVED" }).success).toBe(false);
    expect(topicSchema.safeParse({ ...valid, status: "CLOSED" }).success).toBe(true);
  });

  it("giới hạn tối đa 6 thẻ công nghệ", () => {
    expect(MAX_TAGS_PER_TOPIC).toBe(6);
    expect(topicSchema.safeParse({ ...valid, tagIds: Array.from({ length: 7 }, (_, i) => `tag-${i}`) }).success).toBe(false);
  });

  it("đọc nhiều checkbox tagIds từ FormData", () => {
    const formData = new FormData();
    formData.set("title", valid.title);
    formData.append("tagIds", "tag-1");
    formData.append("tagIds", "tag-2");
    expect(readTopicForm(formData)).toMatchObject({
      title: valid.title,
      tagIds: ["tag-1", "tag-2"],
      departmentId: "",
    });
  });
});
