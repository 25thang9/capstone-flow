import "server-only";

import { prisma } from "@/lib/prisma";

/** Chỉ tải danh mục cần cho form của giảng viên, không sửa module catalog của nhóm. */
export async function listTopicFormOptions() {
  const [departments, tags] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return { departments, tags };
}
