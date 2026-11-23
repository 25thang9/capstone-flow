import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const topicCardSelect = {
  id: true,
  title: true,
  description: true,
  maxStudents: true,
  status: true,
  updatedAt: true,
  lecturer: { select: { name: true } },
  department: { select: { name: true, slug: true } },
  tags: { select: { name: true, slug: true }, orderBy: { name: "asc" } },
  _count: { select: { registrations: { where: { status: "ACCEPTED" } } } },
} satisfies Prisma.TopicSelect;

export type TopicCardData = Prisma.TopicGetPayload<{ select: typeof topicCardSelect }>;

export async function listLatestOpenTopics(take: number) {
  return prisma.topic.findMany({
    where: { status: "OPEN" },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take,
    select: topicCardSelect,
  });
}
