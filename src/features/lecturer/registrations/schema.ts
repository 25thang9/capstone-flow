import { z } from "zod";

export const respondSchema = z.object({
  registrationId: z.string().min(1, "Thiếu mã đăng ký."),
  status: z.enum(["ACCEPTED", "REJECTED"], { error: "Hãy chọn Nhận hoặc Từ chối." }),
  lecturerNote: z.string().trim().max(1000, "Phản hồi tối đa 1000 ký tự.")
    .transform((value) => (value === "" ? null : value)),
});
