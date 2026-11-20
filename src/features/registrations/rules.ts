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
