/** Bộ lọc giao diện chưa kết nối database; logic thuần để có thể unit test. */
export type TopicStatusFilter = "ALL" | "OPEN" | "CLOSED";
export type RegistrationStatusFilter = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED";

export function normalizeKeyword(input: string): string {
  return input.trim().slice(0, 100);
}

export function normalizeTopicStatus(input: string): TopicStatusFilter {
  return input === "OPEN" || input === "CLOSED" ? input : "ALL";
}

export function normalizeRegistrationStatus(input: string): RegistrationStatusFilter {
  return input === "PENDING" || input === "ACCEPTED" || input === "REJECTED" ? input : "ALL";
}

export function isTopicFilterActive(query: string, status: TopicStatusFilter): boolean {
  return Boolean(normalizeKeyword(query)) || status !== "ALL";
}

export function isRegistrationFilterActive(query: string, status: RegistrationStatusFilter): boolean {
  return Boolean(normalizeKeyword(query)) || status !== "ALL";
}
