import { clearSessionCookie, deleteSessionFromRequest } from "@/lib/auth";
import { sendSuccess, sendServerError } from "@/lib/response";

export async function POST(request) {
  try {
    await deleteSessionFromRequest(request);
    return clearSessionCookie(sendSuccess(null, "Đăng xuất thành công"));
  } catch (error) {
    return sendServerError(error);
  }
}
