import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Role } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { homePathFor, isRole } from "@/lib/roles";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { id, name, email, role } = session.user;
  return { id, name, email, role: isRole(role) ? role : "STUDENT" };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(...allowed: Role[]): Promise<CurrentUser> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) redirect(homePathFor(user.role));
  return user;
}
