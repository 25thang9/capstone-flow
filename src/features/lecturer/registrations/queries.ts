import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { requireRole } from "@/lib/dal";
import { paginate } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import type { RegistrationFilters } from "./filters";

// ───────────── Giảng viên ─────────────

const lecturerRegistrationSelect = {
  id: true,
  studentCode: true,
  className: true,
  phone: true,
  message: true,
  status: true,
  lecturerNote: true,
  respondedAt: true,
  createdAt: true,
  student: { select: { name: true, email: true } },
  topic: { select: { id: true, title: true, maxStudents: true } },
} satisfies Prisma.RegistrationSelect;

export type LecturerRegistration = Prisma.RegistrationGetPayload<{
  select: typeof lecturerRegistrationSelect;
}>;

function myRegistrationWhere(lecturerId: string, filters: Omit<RegistrationFilters, "page">) {
  const contains = { contains: filters.q, mode: "insensitive" } as const;
  return {
    // Điều kiện sở hữu: chỉ đăng ký thuộc đề tài của giảng viên đang đăng nhập.
    topic: { lecturerId },
    ...(filters.status !== "ALL" ? { status: filters.status } : {}),
    ...(filters.topicId ? { topicId: filters.topicId } : {}),
    ...(filters.q ? { OR: [{ student: { name: contains } }, { studentCode: contains }] } : {}),
  } satisfies Prisma.RegistrationWhereInput;
}

export async function listRegistrationsForMyTopics(filters: RegistrationFilters, pageSize = 10) {
  const user = await requireRole("LECTURER");
  const where = myRegistrationWhere(user.id, filters);

  const total = await prisma.registration.count({ where });
  const pagination = paginate(total, filters.page, pageSize);

  const registrations = await prisma.registration.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
    select: lecturerRegistrationSelect,
  });

  return { registrations, pagination };
}

/** Toàn bộ kết quả theo bộ lọc (không phân trang) để xuất CSV. Giới hạn 2000 dòng. */
export async function listRegistrationsForExport(lecturerId: string, filters: Omit<RegistrationFilters, "page">) {
  return prisma.registration.findMany({
    where: myRegistrationWhere(lecturerId, filters),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 2000,
    select: lecturerRegistrationSelect,
  });
}

/** Số đăng ký đang chờ phản hồi – hiển thị trên thanh điều hướng của giảng viên. */
export async function countMyPendingRegistrations() {
  const user = await requireRole("LECTURER");
  return prisma.registration.count({
    where: { status: "PENDING", topic: { lecturerId: user.id } },
  });
}

/** Danh sách đề tài của giảng viên đang đăng nhập cho bộ lọc đăng ký. */
export async function listMyTopicOptions() {
  const user = await requireRole("LECTURER");
  return prisma.topic.findMany({
    where: { lecturerId: user.id },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });
}
