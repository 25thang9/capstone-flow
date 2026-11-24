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
| 2026-11-23 | ChatGPT | Hỗ trợ xây dựng giao diện nền cho phân hệ giảng viên, bảo vệ các trang theo vai trò `LECTURER`, xử lý bộ lọc trên giao diện và viết unit/component tests | "Hỗ trợ hoàn thiện giao diện giảng viên gồm Tổng quan, Đề tài của tôi và Sinh viên đăng ký bằng Next.js; sử dụng Header/Footer chung, bảo vệ trang theo vai trò LECTURER và kiểm thử các thành phần giao diện. Chưa tích hợp dữ liệu nghiệp vụ." | **Đã hoàn thiện 12 file thuộc PR 1:** <br>1. `src/app/lecturer/layout.tsx`: tạo menu ba tab Tổng quan, Đề tài của tôi, Sinh viên đăng ký; tái sử dụng bố cục chung. <br>2. `src/app/lecturer/page.tsx`: tạo route Tổng quan, kiểm tra vai trò `LECTURER`, dùng `Suspense` và giao diện chờ tải. <br>3. `src/app/lecturer/topics/page.tsx`: tạo route Đề tài của tôi, kiểm tra vai trò và hiển thị giao diện danh sách chưa kết nối dữ liệu. <br>4. `src/app/lecturer/registrations/page.tsx`: tạo route Sinh viên đăng ký, kiểm tra vai trò, đọc trạng thái lọc ban đầu từ URL và dùng `Suspense`. <br>5. `src/features/lecturer/ui-filters.ts`: viết hàm chuẩn hóa từ khóa, trạng thái đề tài/đăng ký và xác định bộ lọc đang được dùng; chưa gọi database. <br>6. `src/features/lecturer/components/lecturer-dashboard-view.tsx`: tạo bốn ô thống kê (Đề tài, Chờ phản hồi, Đã nhận, Tổng lượt đăng ký), khu vực Đăng ký theo đề tài và Đăng ký gần đây; để trạng thái chưa có dữ liệu. <br>7. `src/features/lecturer/components/lecturer-topics-view.tsx`: tạo bảng đề tài với các cột trạng thái, đã nhận, đang chờ, cập nhật; ô tìm kiếm và lọc trạng thái chỉ hoạt động ở giao diện. <br>8. `src/features/lecturer/components/lecturer-registrations-view.tsx`: tạo bảng sinh viên đăng ký, bốn tab trạng thái, ô tìm kiếm, chọn đề tài, thông báo chưa kết nối dữ liệu; nút Xuất CSV chưa kích hoạt. <br>9. `tests/unit/lecturer-ui-filters.test.ts`: 5 bài kiểm thử chuẩn hóa từ khóa và trạng thái bộ lọc. <br>10. `tests/component/lecturer-dashboard-view.test.tsx`: 3 bài kiểm thử thẻ thống kê, trạng thái chờ dữ liệu, nút chưa kích hoạt và liên kết. <br>11. `tests/component/lecturer-topics-view.test.tsx`: 2 bài kiểm thử cấu trúc bảng, tìm kiếm/lọc/xóa lọc trên giao diện. <br>12. `tests/component/lecturer-registrations-view.test.tsx`: 3 bài kiểm thử tab trạng thái, lọc/xóa lọc và nút CSV. <br>13. `AI_LOG.md`: cập nhật nhật ký sử dụng AI cho công việc của Thảo trong PR 1; không thay đổi phần của các thành viên khác. <br>**Kết quả:** 3 trang giảng viên, 12 file mã nguồn/kiểm thử, 1 file nhật ký và 13 bài kiểm thử riêng của PR 1; tái sử dụng thành phần chung, không sửa module khách/sinh viên/quản trị. Chức năng dữ liệu thực, thêm/sửa đề tài và xử lý đăng ký để dành các PR sau. | Tích hợp mã AI hỗ trợ vào repo, đăng nhập tài khoản giảng viên và mở kiểm tra ba route trên local; kiểm tra các tab, nội dung thống kê ở trạng thái chờ dữ liệu, bộ lọc giao diện và nút chức năng chưa kích hoạt. Rà soát lỗi prerender với Next.js 16 và giữ phạm vi PR chỉ ở UI; chạy lint, typecheck, Vitest và build trước khi gửi PR. Không ghi nhận đã kiểm thử truy cập trái quyền bằng một tài khoản khác. | `feature/thao-lecturer-foundation` (PR giao diện giảng viên) |
| 2026-11-24 | ChatGPT | Hỗ trợ phát triển chức năng xem danh sách đề tài giảng viên, truy vấn dữ liệu, tìm kiếm, lọc trạng thái, phân trang và kiểm thử | "Hỗ trợ hoàn thiện chức năng danh sách đề tài dành cho giảng viên trong CapstoneFlow bằng Next.js, Prisma và Neon PostgreSQL. Bổ sung truy vấn dữ liệu theo tài khoản đăng nhập, tìm kiếm theo tên đề tài, lọc trạng thái và phân trang. Giữ nguyên giao diện hiện có, bổ sung unit/component tests và đảm bảo không ảnh hưởng đến các chức năng khác của nhóm." | Đã hoàn thiện 6 file thuộc PR 2: <br>1. `src/app/lecturer/topics/page.tsx`: xử lý tham số tìm kiếm, gọi truy vấn và hiển thị trang với Suspense. <br>2. `src/features/lecturer/components/lecturer-topics-view.tsx`: bảng đề tài, bộ lọc, phân trang, thông báo không có dữ liệu/kết quả. <br>3. `src/features/lecturer/topics/filters.ts`: chuẩn hóa từ khóa, trạng thái và trang; tạo điều kiện lọc theo giảng viên. <br>4. `src/features/lecturer/topics/queries.ts`: đọc đề tài thực tế từ Neon qua Prisma, giới hạn theo giảng viên đang đăng nhập; thống kê số đã nhận/đang chờ. <br>5. `tests/component/lecturer-topics-view.test.tsx`: kiểm thử hiển thị danh sách, trạng thái rỗng và thao tác tìm kiếm. <br>6. `tests/unit/lecturer-topic-filters.test.ts`: kiểm thử xử lý tham số, trạng thái, phân trang và điều kiện lọc theo giảng viên. <br>Hoàn thành danh sách đề tài, tìm kiếm, lọc trạng thái và logic phân trang (10 đề tài/trang); giữ nút Thêm/Sửa chưa kích hoạt, chưa triển khai thêm/sửa/xóa. | Kiểm tra trực tiếp trên local: tìm kiếm `ESP32`, kết hợp bộ lọc `Đã đóng`, xác nhận trạng thái không có kết quả và thao tác xóa bộ lọc. Chạy ESLint và typecheck thành công; Vitest đạt 11 file, 51/51 bài kiểm thử; Next.js production build thành công. | `feature/thao-lecturer-topics-list` (PR danh sách đề tài giảng viên) |


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
