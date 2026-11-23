import "server-only";

import { prisma } from "@/lib/prisma";

export async function getPublicStats() {
  const [openTopics, lecturers, departments] = await Promise.all([
    prisma.topic.count({ where: { status: "OPEN" } }),
    prisma.user.count({ where: { role: "LECTURER" } }),
    prisma.department.count(),
  ]);
  return { openTopics, lecturers, departments };
}

export async function listDepartmentsWithOpenTopics() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      _count: { select: { topics: { where: { status: "OPEN" } } } },
    },
  });
  return departments.map((item) => ({ name: item.name, slug: item.slug, openTopics: item._count.topics }));
}
