import { createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "@/lib/constants";

function getHashedSessionId(token) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32 || secret.startsWith("REPLACE_")) {
    throw new Error("SESSION_SECRET chưa được cấu hình đúng.");
  }
  return createHmac("sha256", secret).update(token).digest("hex");
}

export async function createSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 86400 * 1000);
  await prisma.session.create({
    data: { id: getHashedSessionId(token), userId, expiresAt },
  });
  return { token, expiresAt };
}

export function setSessionCookie(response, token, expiresAt) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}

export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

async function findLecturerByToken(token) {
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const session = await prisma.session.findUnique({
    where: { id: getHashedSessionId(token) },
    include: { user: { select: { id: true, fullName: true, email: true } } },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function getLecturerFromRequest(request) {
  return findLecturerByToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

export async function getLecturerFromPage() {
  const cookieStore = await cookies();
  return findLecturerByToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function deleteSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token && /^[0-9a-f]{64}$/.test(token)) {
    await prisma.session.deleteMany({ where: { id: getHashedSessionId(token) } });
  }
}
