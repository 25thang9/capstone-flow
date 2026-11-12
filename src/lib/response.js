import { NextResponse } from "next/server";

export function sendSuccess(data, message = "Thành công", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function sendError(message, status = 400, errors = undefined) {
  return NextResponse.json({ success: false, message, ...(errors ? { errors } : {}) }, { status });
}

export function sendServerError(error) {
  console.error("Lỗi API:", error);
  return sendError("Có lỗi xảy ra ở máy chủ. Vui lòng thử lại.", 500);
}

export async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
