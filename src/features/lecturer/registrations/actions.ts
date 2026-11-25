"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { type ActionState, failure, validationFailure, success } from "@/lib/action-state";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { checkCanRespond, RESPOND_BLOCK_MESSAGE, willFillTopic } from "./rules";
import { respondSchema } from "./schema";

function isPrismaError(error: unknown, code: string): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

/** Nhận/từ chối đăng ký: xác thực quyền chủ đề tài và cập nhật trong giao dịch Serializable. */
export async function respondAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const lecturer = await requireRole("LECTURER");
  const parsed = respondSchema.safeParse({
    registrationId: String(formData.get("registrationId") ?? ""),
    status: String(formData.get("status") ?? ""),
    lecturerNote: String(formData.get("lecturerNote") ?? ""),
  });
  if (!parsed.success) return validationFailure(parsed.error, formData);

  const { registrationId, status, lecturerNote } = parsed.data;
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Không bao giờ tin lecturerId của form. ID lấy từ session và lọc trong DB.
      const registration = await tx.registration.findFirst({
        where: { id: registrationId, topic: { lecturerId: lecturer.id } },
        select: { status: true, topicId: true, topic: { select: { maxStudents: true } } },
      });
      if (!registration) return { kind: "notFound" } as const;

      const acceptedCount = await tx.registration.count({
        where: { topicId: registration.topicId, status: "ACCEPTED", id: { not: registrationId } },
      });
      const topic = { maxStudents: registration.topic.maxStudents, acceptedCount };
      const block = checkCanRespond({ current: registration.status, next: status, topic });
      if (block) return { kind: "blocked", block } as const;

      await tx.registration.update({
        where: { id: registrationId },
        data: { status, lecturerNote, respondedAt: new Date() },
      });
      const filled = willFillTopic({ next: status, topic });
      if (filled) {
        await tx.topic.update({ where: { id: registration.topicId }, data: { status: "CLOSED" } });
      }
      return { kind: "done", filled } as const;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    if (result.kind === "notFound") return failure("Không tìm thấy đăng ký thuộc đề tài của bạn.", formData);
    if (result.kind === "blocked") return failure(RESPOND_BLOCK_MESSAGE[result.block], formData);

    revalidatePath("/lecturer/registrations");
    revalidatePath("/lecturer/topics");
    revalidatePath("/lecturer");
    revalidatePath("/", "layout");
    if (status === "REJECTED") return success("Đã từ chối đăng ký.");
    return success(filledMessage(result.filled));
  } catch (error) {
    if (isPrismaError(error, "P2034")) {
      return failure("Có thao tác khác vừa thay đổi dữ liệu. Vui lòng thử lại.", formData);
    }
    throw error;
  }
}

function filledMessage(filled: boolean): string {
  return filled
    ? "Đã nhận sinh viên. Đề tài đủ số lượng nên đã tự đóng."
    : "Đã nhận sinh viên.";
}
