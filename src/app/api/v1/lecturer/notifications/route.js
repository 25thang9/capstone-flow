import { z } from "zod";
import { getLecturerFromRequest } from "@/lib/auth";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";
import { markRegistrationRead, markAllRegistrationsRead } from "@/services/registration.service";

const markReadSchema = z.union([
  z.object({ registrationId: z.number().int().positive() }).strict(),
  z.object({ all: z.literal(true) }).strict(),
]);

export async function PATCH(request) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const parsed = markReadSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Yêu cầu đánh dấu đã xem không hợp lệ", 400);
    const result = "all" in parsed.data
      ? await markAllRegistrationsRead(user.id)
      : await markRegistrationRead(user.id, parsed.data.registrationId);
    // Nếu không thuộc quyền sở hữu, không tiết lộ có tồn tại bản ghi hay không.
    if (!("all" in parsed.data) && result.count === 0) {
      return sendError("Không tìm thấy thông báo chưa xem thuộc đề tài của bạn", 404);
    }
    return sendSuccess({ updated: result.count }, "Đã đánh dấu đã xem");
  } catch (error) {
    return sendServerError(error);
  }
}
