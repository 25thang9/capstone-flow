import type { TopicStatus } from "@/generated/prisma/enums";

/**
 * Luật nghiệp vụ của việc đăng ký đề tài, viết thành hàm thuần (không đụng database)
 * để giao diện và Server Action dùng chung một bộ luật, và để unit test dễ dàng.
 */

export type TopicCapacity = {
  status: TopicStatus;
  maxStudents: number;
  /** Số đăng ký đang ở trạng thái ACCEPTED. */
  acceptedCount: number;
};

export type Availability = "OPEN" | "FULL" | "CLOSED";

export function remainingSlots(topic: Pick<TopicCapacity, "maxStudents" | "acceptedCount">): number {
  return Math.max(0, topic.maxStudents - topic.acceptedCount);
}

/** "Đã đủ" được ưu tiên hơn "Đã đóng" vì nó cho sinh viên biết lý do rõ hơn. */
export function getAvailability(topic: TopicCapacity): Availability {
  if (remainingSlots(topic) === 0) return "FULL";
  return topic.status === "OPEN" ? "OPEN" : "CLOSED";
}
