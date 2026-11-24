import "server-only";

import { requireRole } from "@/lib/dal";
import { paginate } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { lecturerTopicWhere, type LecturerTopicFilters } from "./filters";

/**
 * Chuyển từ listMyTopics trong B3. Chỉ đọc đề tài của giảng viên trong session;
 * không nhận lecturerId từ URL hay từ client.
 */
export async function listMyTopics(filters: LecturerTopicFilters, pageSize = 10) {
  const currentUser = await requireRole("LECTURER");
  const where = lecturerTopicWhere(currentUser.id, filters);

  const total = await prisma.topic.count({ where });
  const pagination = paginate(total, filters.page, pageSize);

  const rows = await prisma.topic.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
    select: {
      id: true,
      title: true,
      status: true,
      maxStudents: true,
      updatedAt: true,
      department: { select: { name: true } },
      registrations: { select: { status: true } },
    },
  });

  // Chỉ chuyển trạng thái đăng ký thành số lượng, không trả thông tin sinh viên.
  const topics = rows.map(({ registrations, ...topic }) => ({
    ...topic,
    acceptedCount: registrations.filter((item) => item.status === "ACCEPTED").length,
    pendingCount: registrations.filter((item) => item.status === "PENDING").length,
    registrationCount: registrations.length,
  }));

  return { topics, pagination };
}

export type LecturerTopicRow = Awaited<ReturnType<typeof listMyTopics>>["topics"][number];


/** Chỉ tải đề tài thuộc giảng viên hiện tại để điền form sửa; id người khác → null. */
export async function getMyTopic(id: string) {
  const user = await requireRole("LECTURER");
  return prisma.topic.findFirst({
    where: { id, lecturerId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      objectives: true,
      requirements: true,
      maxStudents: true,
      status: true,
      departmentId: true,
      tags: { select: { id: true } },
      _count: { select: { registrations: { where: { status: "ACCEPTED" } } } },
    },
  });
}
