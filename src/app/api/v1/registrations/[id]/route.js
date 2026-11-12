import { getLecturerFromRequest } from "@/lib/auth";
import { updateRegistrationSchema, getValidationErrors } from "@/lib/validations";
import { updateRegistrationForLecturer } from "@/services/registration.service";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";

export async function PATCH(request, { params }) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const { id } = await params;
    const registrationId = Number(id);
    if (!Number.isSafeInteger(registrationId) || registrationId <= 0) return sendError("Mã lượt quan tâm không hợp lệ", 400);
    const parsed = updateRegistrationSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Trạng thái không hợp lệ", 400, getValidationErrors(parsed));
    const updated = await updateRegistrationForLecturer(registrationId, user.id, parsed.data.status);
    if (!updated) return sendError("Không tìm thấy lượt quan tâm thuộc đề tài của bạn", 404);
    return sendSuccess(updated, "Đã cập nhật trạng thái liên hệ");
  } catch (error) {
    return sendServerError(error);
  }
}
