import { Prisma } from "@prisma/client";
import { registrationSchema, getValidationErrors } from "@/lib/validations";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";
import { registerInterest } from "@/services/registration.service";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const topicId = Number(id);
    if (!Number.isSafeInteger(topicId) || topicId <= 0) return sendError("Mã đề tài không hợp lệ", 400);
    const parsed = registrationSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Thông tin liên hệ không hợp lệ", 400, getValidationErrors(parsed));
    const result = await registerInterest(topicId, parsed.data);
    if (result.error === "NOT_FOUND") return sendError("Không tìm thấy đề tài", 404);
    if (result.error === "CLOSED") return sendError("Đề tài này đã đóng nhận đăng ký", 409);
    return sendSuccess(result.registration, "Đã gửi thông tin quan tâm", 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return sendError("Email này đã gửi quan tâm cho đề tài", 409);
    }
    return sendServerError(error);
  }
}
