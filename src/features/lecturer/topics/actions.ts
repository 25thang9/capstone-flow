"use server";

import { revalidatePath } from "next/cache";

import { Prisma } from "@/generated/prisma/client";
import { checkTopicCapacity } from "@/features/registrations/rules";
import { type ActionState, failure, formValues, success, validationFailure } from "@/lib/action-state";
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


const CAPACITY_MESSAGE = {
  BELOW_ACCEPTED: "Số sinh viên không được nhỏ hơn số đã nhận.",
  OPEN_WHILE_FULL: "Đề tài đã nhận đủ sinh viên. Hãy tăng số lượng trước khi mở lại.",
} as const;

/** Chỉnh sửa đề tài thuộc tài khoản giảng viên đang đăng nhập. */
export async function updateTopicAction(
  topicId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole("LECTURER");
  const parsed = topicSchema.safeParse(readTopicForm(formData));
  if (!parsed.success) return validationFailure(parsed.error, formData);
  const { tagIds, ...data } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const acceptedCount = await tx.registration.count({
        where: { topicId, status: "ACCEPTED", topic: { lecturerId: user.id } },
      });
      const block = checkTopicCapacity({ ...data, acceptedCount });
      if (block) return { kind: "blocked", block } as const;

      // updateMany kiểm tra lecturerId ngay trong điều kiện cập nhật.
      const { count } = await tx.topic.updateMany({
        where: { id: topicId, lecturerId: user.id },
        data,
      });
      if (count === 0) return { kind: "notFound" } as const;

      // Quan hệ nhiều-nhiều tags được thay sau khi đã chứng minh quyền sở hữu.
      await tx.topic.update({
        where: { id: topicId },
        data: { tags: { set: tagIds.map((id) => ({ id })) } },
      });
      return { kind: "done" } as const;
    });

    if (result.kind === "notFound") return failure("Không tìm thấy đề tài thuộc quyền của bạn.", formData);
    if (result.kind === "blocked") {
      const message = CAPACITY_MESSAGE[result.block];
      return {
        status: "error",
        message,
        fieldErrors: { [result.block === "BELOW_ACCEPTED" ? "maxStudents" : "status"]: [message] },
        values: formValues(formData),
      };
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2025")
    ) {
      return failure("Bộ môn hoặc thẻ vừa chọn không còn tồn tại. Hãy tải lại trang.", formData);
    }
    throw error;
  }

  revalidatePath("/", "layout");
  return success("Đã lưu thay đổi.");
}

/** Đóng hoặc mở lại đăng ký của một đề tài thuộc giảng viên hiện tại. */
export async function setTopicStatusAction(topicId: string, status: "OPEN" | "CLOSED"): Promise<ActionState> {
  const user = await requireRole("LECTURER");
  const topic = await prisma.topic.findFirst({
    where: { id: topicId, lecturerId: user.id },
    select: {
      maxStudents: true,
      _count: { select: { registrations: { where: { status: "ACCEPTED" } } } },
    },
  });
  if (!topic) return failure("Không tìm thấy đề tài thuộc quyền của bạn.");

  const block = checkTopicCapacity({
    status,
    maxStudents: topic.maxStudents,
    acceptedCount: topic._count.registrations,
  });
  if (block) return failure(CAPACITY_MESSAGE[block]);

  const { count } = await prisma.topic.updateMany({
    where: { id: topicId, lecturerId: user.id },
    data: { status },
  });
  if (count === 0) return failure("Không tìm thấy đề tài thuộc quyền của bạn.");

  revalidatePath("/", "layout");
  return success(status === "OPEN" ? "Đã mở nhận đăng ký." : "Đã đóng nhận đăng ký.");
}

/** Chỉ xóa được đề tài chưa nhận sinh viên; đăng ký còn chờ sẽ bị xóa theo (cascade). */
export async function deleteTopicAction(topicId: string): Promise<ActionState> {
  const user = await requireRole("LECTURER");
  const { count } = await prisma.topic.deleteMany({
    where: {
      id: topicId,
      lecturerId: user.id,
      registrations: { none: { status: "ACCEPTED" } },
    },
  });

  if (count === 0) {
    const exists = await prisma.topic.count({ where: { id: topicId, lecturerId: user.id } });
    return failure(exists
      ? "Đề tài đã nhận sinh viên nên không xóa được. Bạn có thể đóng đề tài thay vì xóa."
      : "Không tìm thấy đề tài thuộc quyền của bạn.");
  }
  revalidatePath("/", "layout");
  return success("Đã xóa đề tài.");
}
