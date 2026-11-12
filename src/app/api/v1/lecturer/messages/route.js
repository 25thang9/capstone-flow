import { z } from "zod";
import { getLecturerFromRequest } from "@/lib/auth";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";
import { markStudentMessageRead } from "@/services/registration.service";

const markMessageReadSchema = z.object({ registrationId: z.number().int().positive() }).strict();

export async function PATCH(request) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const parsed = markMessageReadSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Mã lời nhắn không hợp lệ", 400);
    const result = await markStudentMessageRead(user.id, parsed.data.registrationId);
    if (result.count === 0) return sendError("Không tìm thấy lời nhắn chưa đọc thuộc đề tài của bạn", 404);
    return sendSuccess({ updated: result.count }, "Đã đánh dấu lời nhắn đã đọc");
  } catch (error) {
    return sendServerError(error);
  }
}
