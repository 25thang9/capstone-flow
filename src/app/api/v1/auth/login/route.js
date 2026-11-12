import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import { loginSchema, getValidationErrors } from "@/lib/validations";
import { sendSuccess, sendError, sendServerError, parseJson } from "@/lib/response";

export async function POST(request) {
  try {
    const parsed = loginSchema.safeParse(await parseJson(request));
    if (!parsed.success) return sendError("Thông tin đăng nhập không hợp lệ", 400, getValidationErrors(parsed));

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
      return sendError("Email hoặc mật khẩu không đúng", 401);
    }

    const { token, expiresAt } = await createSession(user.id);
    const response = sendSuccess({ id: user.id, fullName: user.fullName, email: user.email }, "Đăng nhập thành công");
    return setSessionCookie(response, token, expiresAt);
  } catch (error) {
    return sendServerError(error);
  }
}
