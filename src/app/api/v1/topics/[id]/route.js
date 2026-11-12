import { getLecturerFromRequest } from "@/lib/auth";
import { updateTopicSchema, getValidationErrors } from "@/lib/validations";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";
import { getPublicTopicById, updateLecturerTopic, deleteLecturerTopic } from "@/services/topic.service";

async function readTopicId(params) {
  const { id } = await params;
  const topicId = Number(id);
  return Number.isSafeInteger(topicId) && topicId > 0 ? topicId : null;
}

export async function GET(_request, { params }) {
  try {
    const topicId = await readTopicId(params);
    if (!topicId) return sendError("Mã đề tài không hợp lệ", 400);
    const topic = await getPublicTopicById(topicId);
    if (!topic) return sendError("Không tìm thấy đề tài", 404);
    return sendSuccess(topic);
  } catch (error) {
    return sendServerError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const topicId = await readTopicId(params);
    if (!topicId) return sendError("Mã đề tài không hợp lệ", 400);
    const parsed = updateTopicSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Thông tin cập nhật không hợp lệ", 400, getValidationErrors(parsed));
    const existing = await getPublicTopicById(topicId);
    if (!existing) return sendError("Không tìm thấy đề tài", 404);
    const updated = await updateLecturerTopic(topicId, user.id, parsed.data);
    if (!updated) return sendError("Bạn không có quyền sửa đề tài này", 403);
    return sendSuccess(updated, "Đã cập nhật đề tài");
  } catch (error) {
    return sendServerError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getLecturerFromRequest(request);
    if (!user) return sendError("Bạn chưa đăng nhập", 401);
    const topicId = await readTopicId(params);
    if (!topicId) return sendError("Mã đề tài không hợp lệ", 400);
    const existing = await getPublicTopicById(topicId);
    if (!existing) return sendError("Không tìm thấy đề tài", 404);
    const deleted = await deleteLecturerTopic(topicId, user.id);
    if (!deleted) return sendError("Bạn không có quyền xóa đề tài này", 403);
    return sendSuccess(null, "Đã xóa đề tài và các lượt quan tâm liên quan");
  } catch (error) {
    return sendServerError(error);
  }
}
