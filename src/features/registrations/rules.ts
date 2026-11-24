import type { TopicStatus } from "@/generated/prisma/enums";

export type TopicCapacity = {
  status: TopicStatus;
  maxStudents: number;
  acceptedCount: number;
};

export type Availability = "OPEN" | "FULL" | "CLOSED";

export function remainingSlots(topic: Pick<TopicCapacity, "maxStudents" | "acceptedCount">): number {
  return Math.max(0, topic.maxStudents - topic.acceptedCount);
}

export function getAvailability(topic: TopicCapacity): Availability {
  if (remainingSlots(topic) === 0) return "FULL";
  return topic.status === "OPEN" ? "OPEN" : "CLOSED";
}

/** Kiểm tra sức chứa khi giảng viên sửa hoặc mở lại đề tài. */
export type TopicSaveBlock =
  | "BELOW_ACCEPTED"
  | "OPEN_WHILE_FULL";

export function checkTopicCapacity(
  topic: TopicCapacity,
): TopicSaveBlock | null {
  if (topic.maxStudents < topic.acceptedCount) {
    return "BELOW_ACCEPTED";
  }

  if (
    topic.status === "OPEN" &&
    topic.acceptedCount >= topic.maxStudents
  ) {
    return "OPEN_WHILE_FULL";
  }

  return null;
}
