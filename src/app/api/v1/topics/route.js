import { getLecturerFromRequest } from "@/lib/auth";
import { topicSchema, getValidationErrors } from "@/lib/validations";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";
import { getPublicTopics, createLecturerTopic } from "@/services/topic.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "OPEN";
    if (!["OPEN", "CLOSED", "ALL"].includes(status)) return sendError("Trạng thái không hợp lệ", 400);
    const data = await getPublicTopics({
      search: (searchParams.get("search") || "").trim().slice(0, 150),
      status,
      lecturer: (searchParams.get("lecturer") || "").trim().slice(0, 150),
    });
    return sendSuccess(data);
  } catch (error) {
    return sendServerError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const parsed = topicSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Thông tin đề tài không hợp lệ", 400, getValidationErrors(parsed));
    const topic = await createLecturerTopic(user.id, parsed.data);
    return sendSuccess(topic, "Đã tạo đề tài", 201);
  } catch (error) {
    return sendServerError(error);
  }
}
