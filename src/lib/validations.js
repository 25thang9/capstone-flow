import { z } from "zod";

const optionalText = (max) => z.union([z.string().trim().max(max), z.literal("")]).optional()
  .transform((value) => value || null);

export const loginSchema = z.object({
  email: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export const topicSchema = z.object({
  title: z.string().trim().min(5, "Tên đề tài ít nhất 5 ký tự").max(255),
  description: z.string().trim().min(10, "Mô tả ít nhất 10 ký tự").max(20000),
  objectives: optionalText(10000),
  requirements: optionalText(10000),
  technologies: optionalText(2000),
  maxStudents: z.coerce.number().int().min(1).max(30),
  status: z.enum(["OPEN", "CLOSED"]),
});

export const updateTopicSchema = topicSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Cần ít nhất một trường để cập nhật",
);

export const registrationSchema = z.object({
  studentName: z.string().trim().min(2).max(150),
  studentCode: optionalText(30),
  studentEmail: z.string().trim().email().max(255).transform((value) => value.toLowerCase()),
  studentPhone: z.string().trim().min(9).max(20).regex(/^[0-9+().\-\s]+$/, "Số điện thoại không hợp lệ"),
  studentClass: optionalText(100),
  message: optionalText(3000),
});

export const updateRegistrationSchema = z.object({
  status: z.enum(["NEW", "CONTACTED"]),
});

export function getValidationErrors(result) {
  return z.flattenError(result.error).fieldErrors;
}
