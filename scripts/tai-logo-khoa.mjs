import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Ảnh lấy trực tiếp từ website chính thức của Khoa Vật lý - Vật lý kỹ thuật.
const LOGO_URL = "https://phys.hcmus.edu.vn/be/uploads/mirror/khoa-vat-ly/TUI_LA_NGU/1.LOGO_m%E1%BB%9Bi/Logo_Phys-blue.png";
const output = join(process.cwd(), "public/images/logo-khoa-vat-ly.png");
try {
  const response = await fetch(LOGO_URL, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < 1000 || data[0] !== 0x89 || data[1] !== 0x50) {
    throw new Error("Tệp nhận được không phải PNG hợp lệ");
  }
  await mkdir(join(process.cwd(), "public/images"), { recursive: true });
  await writeFile(output, data);
  console.log("Đã lưu logo của khoa tại:", output);
} catch (error) {
  console.error("Chưa tải được logo:", error.message);
  console.error("Có thể tải thủ công và đặt vào public/images/logo-khoa-vat-ly.png");
  process.exitCode = 1;
}
