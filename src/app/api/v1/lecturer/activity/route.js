import { getLecturerFromRequest } from "@/lib/auth";
import { sendSuccess, sendError, sendServerError } from "@/lib/response";
import { getLecturerActivity } from "@/services/registration.service";

// Chỉ giảng viên đã đăng nhập mới xem được lượt quan tâm của chính mình.
export async function GET(request) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const response = sendSuccess(await getLecturerActivity(user.id));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    return sendServerError(error);
  }
}
