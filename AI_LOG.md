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
| 2026-11-23 | ChatGPT | Hỗ trợ phát triển giao diện và kiểm thử cho phân hệ giảng viên bằng Next.js 16, React và TypeScript | "Hỗ trợ xây dựng giao diện giảng viên gồm Tổng quan, Đề tài của tôi và Sinh viên đăng ký; sử dụng Header/Footer chung, phân quyền LECTURER, bổ sung bộ lọc và unit/component tests, chưa tích hợp dữ liệu nghiệp vụ" | Hoàn thiện giao diện 3 trang `/lecturer`, `/lecturer/topics`, `/lecturer/registrations`; xây dựng menu điều hướng, các thẻ thống kê, bảng danh sách, tìm kiếm và lọc trạng thái. Tổ chức component riêng cho giảng viên, bổ sung unit/component tests. Các chức năng thêm đề tài và xuất CSV được giữ ở trạng thái chưa kích hoạt để triển khai trong các PR tiếp theo | Kiểm tra trực tiếp 3 trang trên localhost bằng tài khoản có quyền LECTURER; xác nhận điều hướng, bố cục và khả năng sử dụng Header/Footer chung. Rà soát mã nguồn, điều chỉnh để tách giao diện khỏi truy vấn dữ liệu chưa triển khai; xử lý lỗi prerender Next.js 16 và cảnh báo SSL khi kết nối Neon. Sử dụng ESLint, TypeScript, Vitest và Next.js Build để kiểm tra trước khi tạo PR | `feature/thao-lecturer-foundation` (PR giao diện giảng viên) |
| 2026-11-24 | ChatGPT | Hỗ trợ phát triển chức năng xem danh sách đề tài giảng viên, truy vấn dữ liệu, tìm kiếm, lọc trạng thái, phân trang và kiểm thử | "Hỗ trợ hoàn thiện chức năng danh sách đề tài dành cho giảng viên trong CapstoneFlow bằng Next.js, Prisma và Neon PostgreSQL. Bổ sung truy vấn dữ liệu theo tài khoản đăng nhập, tìm kiếm theo tên đề tài, lọc trạng thái và phân trang. Giữ nguyên giao diện hiện có, bổ sung unit/component tests và đảm bảo không ảnh hưởng đến các chức năng khác của nhóm." | Tích hợp các phần mã AI hỗ trợ vào `/lecturer/topics`, hiển thị đề tài thuộc giảng viên đăng nhập, tìm kiếm, lọc trạng thái, phân trang và trạng thái không có kết quả. Giữ chức năng thêm, sửa, xóa đề tài cho các PR tiếp theo. | Kiểm tra trực tiếp trên local: tìm kiếm `ESP32`, kết hợp bộ lọc `Đã đóng`, xác nhận trạng thái không có kết quả và thao tác xóa bộ lọc. Chạy ESLint và typecheck thành công; Vitest đạt 11 file, 51/51 bài kiểm thử; Next.js production build thành công. | `feature/thao-lecturer-topics-list` (PR danh sách đề tài giảng viên) |


### Tự đánh giá cuối bài

- **Phần tự làm hoàn toàn:** Chưa tổng kết.
- **Phần AI giúp nhiều nhất và cách đã hiểu nội dung đó:** Chưa tổng kết.
- **Một lần AI sai và cách phát hiện:** Trong quá trình phát triển, AI đề xuất tích hợp truy vấn dữ liệu vào Dashboard khi chức năng nghiệp vụ chưa được triển khai. Sau khi đối chiếu với phạm vi công việc, phần truy vấn được loại bỏ để tập trung hoàn thiện giao diện và kiểm thử trước khi phát triển các chức năng tiếp theo.

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
| 2026-11-20 | Gemini, Antigravity | Hỗ trợ xây dựng khung giao diện chung (`globals.css`, Header/Footer, chế độ Sáng/Tối, bộ component `ui`/`shared`), luồng xác thực (`/login`, `/register`, `proxy.ts`) và trang `/about` | "Đóng vai trò là một lập trình viên web chuyên nghiệp, hãy hướng dẫn và giải thích từng bước xây dựng giao diện nền với Tailwind v4, shadcn/ui, luồng đăng nhập/đăng ký Better Auth và component test" | Hoàn thành Giai đoạn 2: thiết lập `globals.css`, `SiteHeader`/`SiteFooter`, chuyển đổi Sáng/Tối, các component dùng chung (`FormField`, `FilterForm`, `PaginationNav`, `StatusBadge`, `ConfirmAction`, ...), trang lỗi (`error.tsx`, `not-found.tsx`), các trang `/about`, `/login`, `/register` kèm Server Actions xác thực và 3 file component test để cả nhóm gắn các phân hệ tiếp theo vào khung chung | Chạy `npm run lint` (0 lỗi), `npm run typecheck` (0 lỗi), `npx vitest run` (4 file / 22/22 tests passed); bật `npm run dev` kiểm thử trên trình duyệt: bắt lỗi Zod ở `/login` và `/register`, đăng nhập thử cả 3 vai trò (`sv.an`, `gv.khoa`, `admin`) kiểm tra menu Header và Đăng xuất, kiểm tra `proxy.ts` chặn `/my-registrations` khi chưa đăng nhập, kiểm tra trang `/about` và nút đổi chế độ Sáng/Tối | `feat/ xây dựng giao diện đăng nhập` (PR #2) |
| 2026-11-22 | Gemini, Antigravity | Hỗ trợ xây dựng và giải thích luồng dữ liệu cho Giai đoạn 3: Trang chủ công khai (`src/app/page.tsx`), component danh sách đề tài (`TopicList`, `CapacityBar`), các hàm truy vấn thống kê/đề tài công khai (`stats/queries.ts`, `topics/queries.ts`) và kiểm thử `topic-list.test.tsx` | "Chia 3 giai đoạn đầu tiên đóng vai trò: giảng viên, người phân tích thiết kế và một lập trình viên chuyên nghiệp để hỗ trợ hoàn thiện và giải thích bản chất Giai đoạn 3 theo luồng dữ liệu: tầng truy vấn (Promise.all, bảo mật select trong topicCardSelect), tầng component (TopicList, CapacityBar, getAvailability), tầng ghép trang chủ (Suspense + Skeleton) và tầng kiểm thử" | Hoàn thiện `page.tsx` (5 khu vực: Hero tìm kiếm, `StatsPanel`, `LatestTopics`, `DepartmentLinks`, quy trình 3 bước), `topic-list.tsx`, phần truy vấn công khai và 4 kịch bản component test; tự bổ sung thêm bộ môn Vật lý Địa cầu trong `seed.ts` và tinh chỉnh lại bộ font tiêu đề, cỡ chữ, độ bo góc trong `globals.css` | Chạy `npm run lint` (0 lỗi), `npm run typecheck` (0 lỗi), `npx vitest run` (5 file / 26/26 tests passed); bật `npm run dev` kiểm tra trực tiếp trên trình duyệt tại `http://localhost:3000/`: đối chiếu số liệu thống kê (đề tài đang mở, giảng viên, bộ môn), danh sách 5 đề tài mới nhất, thanh tiến độ chỗ trống và chế độ Sáng/Tối | `feat: xây dựng trang chủ công khai và danh sách đề tài` (PR #3) |
| 2026-11-23 | Gemini, Antigravity | Giải thích nguyên lý lọc URL (`searchParams`), phân trang server và tái sử dụng truy vấn cho API, đề xuất phương án tách `listTopicFilterOptions()` vào `topics/queries.ts` để tránh xung đột thư mục `catalog/` với thành viên Quản trị viên, hướng dẫn xây dựng thủ công từng bước Giai đoạn 4 (`filters.ts`, `queries.ts`, `topic-filter-form.tsx`, `topics/page.tsx`, `api/topics/route.ts`, `filters.test.ts`) kèm nâng cấp thẻ chip lọc đang bật (`ActiveFilterChips`) và khung chờ `TopicFilterSkeleton` | "Với vai trò giảng viên, người hướng dẫn và lập trình viên chuyên nghiệp, hãy giải thích giai đoạn 4, hướng dẫn tránh xung đột với thành viên Quản trị viên và hướng dẫn tôi làm thủ công từng bước, chỉ vị trí sửa và rà soát hoàn thiện" | Hoàn thành xây dựng `src/features/topics/filters.ts`, mở rộng `src/features/topics/queries.ts` (`publicTopicWhere`, `listPublicTopics`, `listTopicFilterOptions`), tạo `src/features/topics/components/topic-filter-form.tsx` (kèm icon kính lúp và `TopicFilterSkeleton`), `src/app/topics/page.tsx` (kèm `ActiveFilterChips` bấm gỡ từng tiêu chí lọc), `src/app/api/topics/route.ts` và 6 unit test trong `tests/unit/filters.test.ts` | Tự gõ và sửa lỗi trùng kiểu `TopicCardData` trong `queries.ts`, tự tạo `filters.ts`, `filters.test.ts`, `topic-filter-form.tsx`; rà soát `git status`, chạy `npm run lint` (0 lỗi), `npm run typecheck` (0 lỗi), `npx vitest run` (10 file / 45/45 tests passed), `npm run build` thành công, kiểm tra trực tiếp `/topics` (lọc, chip `×`, phân trang, bàn phím) và `/api/topics?q=ESP32` | `feat: xây dựng kho đề tài công khai` (PR #4) |

### Tự đánh giá cuối bài

- **Phần tự làm hoàn toàn:** Chưa tổng kết.
- **Phần AI giúp nhiều nhất và mình đã hiểu nó thế nào:** Chưa tổng kết.
- **Một lần AI sai và cách phát hiện:** Chưa tổng kết.
