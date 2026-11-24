"use server";

import { revalidatePath } from "next/cache";

import { Prisma } from "@/generated/prisma/client";
import { type ActionState, failure, success, validationFailure } from "@/lib/action-state";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

import { readTopicForm, topicSchema } from "./schema";

/** Tạo đề tài. lecturerId chỉ lấy từ session – không nhận từ form hay URL. */
export async function createTopicAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireRole("LECTURER");

  const parsed = topicSchema.safeParse(readTopicForm(formData));
  if (!parsed.success) return validationFailure(parsed.error, formData);
  const { tagIds, ...data } = parsed.data;

  try {
    await prisma.topic.create({
      data: {
        ...data,
        lecturerId: user.id,
        tags: { connect: tagIds.map((id) => ({ id })) },
      },
    });
  } catch (error) {
    // B3: báo lỗi dễ hiểu nếu bộ môn/thẻ bị xoá trước lúc bấm Đăng.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2025")
    ) {
      return failure("Bộ môn hoặc thẻ vừa chọn không còn tồn tại. Hãy tải lại trang.", formData);
    }
    throw error;
  }

  revalidatePath("/", "layout");
  return success("Đã đăng đề tài.");
}
