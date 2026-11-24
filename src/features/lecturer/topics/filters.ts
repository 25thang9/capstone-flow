import type { Prisma } from "@/generated/prisma/client";
import { parsePage } from "@/lib/pagination";

/** Bộ lọc danh sách đề tài riêng của giảng viên, dựa trên logic B3. */
export type SearchParams = Record<string, string | string[] | undefined>;
export type LecturerTopicStatus = "ALL" | "OPEN" | "CLOSED";
export type LecturerTopicFilters = { q: string; status: LecturerTopicStatus; page: number };

function first(params: SearchParams, key: string): string {
  const value = params[key];
  return ((Array.isArray(value) ? value[0] : value) ?? "").trim();
}

export function parseLecturerTopicFilters(params: SearchParams): LecturerTopicFilters {
  const status = first(params, "status").toUpperCase();
  return {
    q: first(params, "q").slice(0, 100),
    status: status === "OPEN" || status === "CLOSED" ? status : "ALL",
    page: parsePage(params.page),
  };
}

/** User ID luôn lấy từ session phía server, KHÔNG lấy từ query string. */
export function lecturerTopicWhere(lecturerId: string, filters: LecturerTopicFilters): Prisma.TopicWhereInput {
  return {
    lecturerId,
    ...(filters.status === "ALL" ? {} : { status: filters.status }),
    ...(filters.q ? { title: { contains: filters.q, mode: "insensitive" as const } } : {}),
  };
}

export function lecturerTopicFilterParams(filters: LecturerTopicFilters, page = filters.page) {
  return {
    q: filters.q,
    status: filters.status === "ALL" ? "" : filters.status,
    page,
  };
}
