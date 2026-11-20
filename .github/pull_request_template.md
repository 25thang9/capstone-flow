## Mô tả
- Dọn sạch mã nguồn nền cũ viết bằng JavaScript (.js/.jsx) và Prisma 6.
- Thiết lập bộ khung cấu hình chuẩn: Next.js 16.4, React 19, TypeScript 5, Tailwind CSS v4, ESLint, Vitest 5.
- Thiết kế cơ sở dữ liệu Prisma 7 với 8 model (4 bảng Better Auth + 4 bảng nghiệp vụ), nạp migration khởi tạo và dữ liệu mẫu (seed 13 tài khoản, 22 đề tài).
- Xây dựng hoàn chỉnh 10 file hạ tầng dùng chung trong `src/lib/` (kết nối Prisma, Better Auth, kiểm soát quyền `dal.ts`, phân trang, định dạng văn bản, xử lý action state).
- Định nghĩa 23 dòng đầu của `src/features/registrations/rules.ts` (kiểu dữ liệu sức chứa và trạng thái chỗ trống) phục vụ cho `src/lib/labels.ts`.
- Dựng khung `src/app/layout.tsx` và `src/app/page.tsx` tối giản để dự án biên dịch thành công; thêm 11 unit test cho phân trang (`tests/unit/pagination.test.ts`).

## Ảnh chụp / video (nếu thay đổi giao diện)
> Giai đoạn 1 tập trung xây dựng nền móng hạ tầng và database, giao diện hiện tại để khung tạm tối giản `<main>CapstoneFlow</main>`, chưa có thay đổi giao diện người dùng (phần giao diện hoàn chỉnh sẽ được đưa lên từ PR #2 và PR #3).

## Cách kiểm tra
Các bước để reviewer kéo nhánh về kiểm tra trên máy:
1. `git checkout feat/stage1-foundation-prisma`
2. `npm ci`
3. `npx prisma generate`
4. `npm run lint` (đảm bảo 0 lỗi)
5. `npm run typecheck` (đảm bảo 0 lỗi kiểu dữ liệu)
6. `npx vitest run` (11/11 bài test phân trang đều passed)
7. `npm run dev` và mở `http://localhost:3000` kiểm tra server khởi động bình thường.

## Checklist
- [x] `npm run lint`, `npm run typecheck`, `npx vitest run`, `npm run build` đều qua
- [x] Server Action/Route Handler mới đều kiểm tra session và lọc theo userId *(Đã dựng sẵn chốt chặn `requireUser()` / `requireRole()` trong `src/lib/dal.ts` cho các giai đoạn sau dùng)*
- [x] Input được validate bằng Zod *(Đã cấu hình thư viện và chuẩn bị cho các schema)*
- [x] Có hoặc đã cập nhật test cho logic thay đổi *(11 unit test trong `tests/unit/pagination.test.ts`)*
- [x] Không có secret trong code; biến mới đã thêm vào .env.example
- [x] UI mới dùng được bằng bàn phím, có nhãn, đủ tương phản *(Giai đoạn 1 chưa có UI người dùng, sẽ thực hiện và kiểm tra ở PR #2, #3, #4)*

## Sử dụng AI
- Mức AI: Mức 4 – AI hoàn toàn có kiểm soát.
- Công cụ & phần AI hỗ trợ: Gemini – Hỗ trợ phân tích cấu hình, hướng dẫn kết nối PostgreSQL Neon, viết script chuyển đổi dọn dẹp bản JS cũ và chuyển các file nền tảng Giai đoạn 1 sang repo chính thức.
- Mình đã kiểm chứng bằng: Tự tạo database Neon, cấu hình và bảo mật file `.env` cá nhân, rà soát `git status` đảm bảo không lộ file bí mật, chạy và xác nhận trực tiếp các lệnh `npm run lint`, `npm run typecheck`, `npx vitest run` đều đạt kết quả xanh (0 lỗi).