import type { RegistrationStatus } from "@/generated/prisma/enums";

type Capacity = { maxStudents: number; acceptedCount: number };

export type RespondBlock = "SAME_STATUS" | "TOPIC_FULL";

export const RESPOND_BLOCK_MESSAGE: Record<RespondBlock, string> = {
  SAME_STATUS: "Đăng ký này đã ở trạng thái đó.",
  TOPIC_FULL: "Đề tài đã nhận đủ số sinh viên. Hãy tăng số lượng nếu muốn nhận thêm.",
};

/** Trả lý do không phản hồi được hoặc null. Không đếm chính đăng ký đang chuyển trạng thái. */
export function checkCanRespond(input: {
  current: RegistrationStatus;
  next: "ACCEPTED" | "REJECTED";
  topic: Capacity;
}): RespondBlock | null {
  if (input.current === input.next) return "SAME_STATUS";
  if (input.next === "ACCEPTED" && input.topic.acceptedCount >= input.topic.maxStudents) {
    return "TOPIC_FULL";
  }
  return null;
}

/** Đã nhận đủ người thì đóng đề tài để không tiếp tục nhận đăng ký mới. */
export function willFillTopic(input: {
  next: "ACCEPTED" | "REJECTED";
  topic: Capacity;
}): boolean {
  return input.next === "ACCEPTED" && input.topic.acceptedCount + 1 >= input.topic.maxStudents;
}
