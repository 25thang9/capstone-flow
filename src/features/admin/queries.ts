
import "server-only";

import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

/** Tổng quan toàn hệ thống cho quản trị viên. */
export async function getAdminOverview() {
    await requireRole("ADMIN");

    const [
        usersByRole,
        topicsByStatus,
        registrationsByStatus,
        departments,
    ] = await Promise.all([
        prisma.user.groupBy({
            by: ["role"],
            _count: { _all: true },
        }),

        prisma.topic.groupBy({
            by: ["status"],
            _count: { _all: true },
        }),

        prisma.registration.groupBy({
            by: ["status"],
            _count: { _all: true },
        }),

        prisma.department.findMany({
            orderBy: { name: "asc" },
            select: {
                name: true,
                topics: {
                    select: { status: true },
                },
            },
        }),
    ]);

    // Các nhóm không có dữ liệu được tính là 0.
    const byRole = new Map(
        usersByRole.map((row) => [row.role, row._count._all])
    );

    const byTopicStatus = new Map(
        topicsByStatus.map((row) => [
            row.status,
            row._count._all,
        ])
    );

    const byRegistrationStatus = new Map(
        registrationsByStatus.map((row) => [
            row.status,
            row._count._all,
        ])
    );

    return {
        users: {
            students: byRole.get("STUDENT") ?? 0,
            lecturers: byRole.get("LECTURER") ?? 0,
            admins: byRole.get("ADMIN") ?? 0,
        },

        topics: {
            open: byTopicStatus.get("OPEN") ?? 0,
            closed: byTopicStatus.get("CLOSED") ?? 0,
        },

        registrations: {
            pending: byRegistrationStatus.get("PENDING") ?? 0,
            accepted: byRegistrationStatus.get("ACCEPTED") ?? 0,
            rejected: byRegistrationStatus.get("REJECTED") ?? 0,
        },

        topicsByDepartment: departments.map((department) => ({
            name: department.name,
            open: department.topics.filter(
                (topic) => topic.status === "OPEN"
            ).length,
            closed: department.topics.filter(
                (topic) => topic.status === "CLOSED"
            ).length,
        })),
    };
}
