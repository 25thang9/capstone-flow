# AI_LOG – Nhật ký sử dụng AI

**Dự án:** Capstone Flow – Đồ án nhóm PHY10615  
**Học kỳ:** HK1 2026–2027  
**Mức sử dụng AI:** Mức 4 – AI toàn phần có kiểm soát  
**Repository:** https://github.com/25thang9/capstone-flow

Nhật ký ghi nhận quá trình sử dụng AI trong việc phát triển và hoàn thiện dự án Capstone Flow. Mỗi thành viên cập nhật phần công việc của mình, bao gồm nội dung AI hỗ trợ, kết quả sử dụng, quá trình tự kiểm chứng và Commit/Pull Request tương ứng.

---

## 1. Thảo

### Nhật ký sử dụng AI

| Ngày | Công cụ | Việc nhờ AI | Prompt (tóm tắt) | Kết quả dùng thế nào | Đã tự kiểm chứng / sửa gì | Commit/PR |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | — | — | — | — | — | — |

### Tự đánh giá cuối bài

- **Phần tự làm hoàn toàn:** Chưa tổng kết.
- **Phần AI giúp nhiều nhất và cách đã hiểu nội dung đó:** Chưa tổng kết.
- **Một lần AI sai và cách phát hiện:** Chưa tổng kết.

---

## 2. Đăng

### Nhật ký sử dụng AI

| Ngày | Công cụ | Việc nhờ AI | Prompt (tóm tắt) | Kết quả dùng thế nào | Đã tự kiểm chứng / sửa gì | Commit/PR |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | — | — | — | — | — | — |

### Tự đánh giá cuối bài

- **Phần tự làm hoàn toàn:** Chưa tổng kết.
- **Phần AI giúp nhiều nhất và cách đã hiểu nội dung đó:** Chưa tổng kết.
- **Một lần AI sai và cách phát hiện:** Chưa tổng kết.

---

## 3. Châu

### Nhật ký sử dụng AI

| Ngày | Công cụ | Việc nhờ AI | Prompt (tóm tắt) | Kết quả dùng thế nào | Đã tự kiểm chứng / sửa gì | Commit/PR |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | — | — | — | — | — | — |

### Tự đánh giá cuối bài

- **Phần tự làm hoàn toàn:** Chưa tổng kết.
- **Phần AI giúp nhiều nhất và cách đã hiểu nội dung đó:** Chưa tổng kết.
- **Một lần AI sai và cách phát hiện:** Chưa tổng kết.

---

## 4. Linh - Giao diện khách

### Nhật ký sử dụng AI

| Ngày | Công cụ | Việc nhờ AI | Prompt (tóm tắt) | Kết quả dùng thế nào | Đã tự kiểm chứng / sửa gì | Commit/PR |
|---|---|---|---|---|---|---|
| 2026-11-20 | Gemini, Antigravity | Hướng dẫn nâng cấp nền móng dự án lên Next.js 16 + React 19 + TypeScript, thiết kế schema Prisma 7 kết nối Neon PostgreSQL và xây dựng tầng hạ tầng `src/lib/` | "Đóng vai trò là một lập trình viên chuyên nghiệp, hãy hướng dẫn tôi xây dựng khung dự án Next.js 16 + React 19 với Prisma 7, Better Auth 3 vai trò và các hàm tiện ích dùng chung" | Nắm được kiến trúc tổng thể và thiết lập nền móng Giai đoạn 1: xoá bản cũ `.js`/Prisma 6, cấu hình TypeScript/Prisma 7/Vitest, viết `prisma/` (schema 8 bảng, migration, seed dữ liệu Khoa Vật lý), tầng hạ tầng `src/lib/` (prisma, auth, dal, roles, pagination, action-state, labels, text, csv, utils), hàm kiểm tra trạng thái đề tài và unit test phân trang `tests/unit/pagination.test.ts` | Tự tạo DB Neon và cấu hình `.env`, chạy `npx prisma generate`, `npm run dev` kiểm tra `localhost:3000`, xác nhận `npm run lint` (0 lỗi), `npm run typecheck` (0 lỗi), `npx vitest run` (11/11 passed), rà soát `git status` không lộ `.env` và dọn thư mục thừa | `dang-hoang-linh` (PR #1) |
| 2026-11-20 | Gemini, Antigravity | Hỗ trợ xây dựng khung giao diện chung (`globals.css`, Header/Footer, chế độ Sáng/Tối, bộ component `ui`/`shared`), luồng xác thực (`/login`, `/register`, `proxy.ts`) và trang `/about` | "Đóng vai trò là một lập trình viên web chuyên nghiệp, hãy hướng dẫn và giải thích từng bước xây dựng giao diện nền với Tailwind v4, shadcn/ui, luồng đăng nhập/đăng ký Better Auth và component test" | Hoàn thành Giai đoạn 2: thiết lập `globals.css`, `SiteHeader`/`SiteFooter`, chuyển đổi Sáng/Tối, các component dùng chung (`FormField`, `FilterForm`, `PaginationNav`, `StatusBadge`, `ConfirmAction`, ...), trang lỗi (`error.tsx`, `not-found.tsx`), các trang `/about`, `/login`, `/register` kèm Server Actions xác thực và 3 file component test để cả nhóm gắn các phân hệ tiếp theo vào khung chung | Chạy `npm run lint` (0 lỗi), `npm run typecheck` (0 lỗi), `npx vitest run` (4 file / 22/22 tests passed); bật `npm run dev` kiểm thử trên trình duyệt: bắt lỗi Zod ở `/login` và `/register`, đăng nhập thử cả 3 vai trò (`sv.an`, `gv.khoa`, `admin`) kiểm tra menu Header và Đăng xuất, kiểm tra `proxy.ts` chặn `/my-registrations` khi chưa đăng nhập, kiểm tra trang `/about` và nút đổi chế độ Sáng/Tối | `feat/tinh-nang-2` (PR #2) |

### Tự đánh giá cuối bài

- **Phần tự làm hoàn toàn:** Chưa tổng kết.
- **Phần AI giúp nhiều nhất và mình đã hiểu nó thế nào:** Chưa tổng kết.
- **Một lần AI sai và cách mình phát hiện:** Chưa tổng kết.
