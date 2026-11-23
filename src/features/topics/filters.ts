import { parsePage } from "@/lib/pagination";

export type SearchParams = Record<string, string | string[] | undefined>;

export type TopicStatusFilter = "OPEN" | "CLOSED" | "ALL";

export type TopicFilters = {
  q: string;
  department: string;
  tag: string;
  status: TopicStatusFilter;
  page: number;
};

const SLUG_PATTERN = /^[a-z0-9-]{1,60}$/;

function first(params: SearchParams, key: string): string {
  const value = params[key];
  return ((Array.isArray(value) ? value[0] : value) ?? "").trim();
}

export function parseTopicFilters(params: SearchParams): TopicFilters {
  const status = first(params, "status").toUpperCase();
  const department = first(params, "department");
  const tag = first(params, "tag");

  return {
    q: first(params, "q").slice(0, 100),
    department: SLUG_PATTERN.test(department) ? department : "",
    tag: SLUG_PATTERN.test(tag) ? tag : "",
    status: status === "CLOSED" || status === "ALL" ? status : "OPEN",
    page: parsePage(params.page),
  };
}

export function hasActiveFilters(filters: TopicFilters): boolean {
  return Boolean(filters.q || filters.department || filters.tag || filters.status !== "OPEN");
}

export function topicFilterParams(filters: TopicFilters, page = filters.page) {
  return {
    q: filters.q,
    department: filters.department,
    tag: filters.tag,
    status: filters.status === "OPEN" ? "" : filters.status,
    page,
  };
}