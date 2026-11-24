import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { PAGE_SIZE, paginate } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import type { TopicFilters } from "./filters";

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
function publicTopicWhere(filters: TopicFilters): Prisma.TopicWhereInput {
  const contains = { contains: filters.q, mode: "insensitive" } as const;
  return {
    ...(filters.status !== "ALL" ? { status: filters.status } : {}),
    ...(filters.department ? { department: { slug: filters.department } } : {}),
    ...(filters.tag ? { tags: { some: { slug: filters.tag } } } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: contains },
            { description: contains },
            { lecturer: { name: contains } },
            { tags: { some: { name: contains } } },
          ],
        }
      : {}),
  };
}
export async function listPublicTopics(filters: TopicFilters, pageSize = PAGE_SIZE) {
  const where = publicTopicWhere(filters);
  const total = await prisma.topic.count({ where });
  const pagination = paginate(total, filters.page, pageSize);
  const topics = await prisma.topic.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
    select: topicCardSelect,
  });
  return { topics, pagination };
}
export async function listTopicFilterOptions() {
  const [departments, tags] = await Promise.all([
    prisma.department.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);
  return { departments, tags };
}
export async function listLatestOpenTopics(take: number) {
  return prisma.topic.findMany({
    where: { status: "OPEN" },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take,
    select: topicCardSelect,
  });
}
