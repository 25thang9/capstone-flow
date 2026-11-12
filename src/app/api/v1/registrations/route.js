import { getLecturerFromRequest } from "@/lib/auth";
import { getRegistrationsForLecturer } from "@/services/registration.service";
import { sendSuccess, sendError, sendServerError } from "@/lib/response";

export async function GET(request) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const response = sendSuccess(await getRegistrationsForLecturer(user.id));
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return sendServerError(error);
  }
}
