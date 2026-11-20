import { Role } from "@/generated/prisma/enums";

export const ROLE_LABEL: Record<Role, string> = {
  STUDENT: "Sinh viên",
  LECTURER: "Giảng viên",
  ADMIN: "Quản trị viên",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in Role;
}

export function homePathFor(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "LECTURER":
      return "/lecturer";
    default:
      return "/topics";
  }
}

export function safeRedirectPath(next: unknown, fallback: string): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
