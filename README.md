# CapstoneFlow — bản nền cho nhóm 4 người

Website quản lý kho đề tài đồ án và kết nối sinh viên với giảng viên. Bản nền ưu tiên **đủ chức năng, tên file dễ hiểu, dễ chia module**. Giao diện hướng đến **phần mềm quản lý đề tài thực tế**: bố cục học thuật, ít trang trí, nội dung và số liệu đọc từ database. Nhóm có thể chỉnh sửa CSS và từng trang sau khi thống nhất chức năng.


## 1. Công nghệ và yêu cầu

- JavaScript (JSX), Next.js App Router, Route Handlers.
- Prisma **6.19.0** + Neon PostgreSQL. **Chủ động cố định Prisma 6** để khớp với kiểu `schema.prisma` trong kế hoạch; Prisma 7 có cách cấu hình khác.
- Node.js 20.9+ (khuyến nghị 22 LTS), npm.
- Dùng CSS thuần: `src/app/globals.css` chứa kiểu cơ sở; `src/app/site.css` chứa màu và bố cục mới. Chỉnh `site.css` trước để tránh ảnh hưởng API hoặc logic.

## 2. Chạy trên máy của bạn

1. Tải hết dự án, mở bằng VS Code, mở Terminal tại thư mục có `package.json`.
2. Chạy `npm install`.
3. Tạo file `.env` từ `.env.example` (`cp .env.example .env` trên macOS/Linux; PowerShell: `Copy-Item .env.example .env`).
4. Trên Neon, tạo project database, lấy hai connection strings:
   - `DATABASE_URL` = pooled connection (hostname có `-pooler`).
   - `DIRECT_URL` = direct connection (hostname không có `-pooler`) dùng để migrate.
5. Thay `SESSION_SECRET` bằng chuỗi ngẫu nhiên **ít nhất 32 ký tự** (gợi ý lệnh: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
6. Đặt `SEED_LECTURER_PASSWORD` là mật khẩu demo riêng của nhóm (ít nhất 10 ký tự).
7. Chạy các lệnh:

```bash
npx prisma validate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```
Mọi người tạo neon riêng vs .env riêng rồi test code trên máy mình nha, sau đó push lên nhánh gihub ib tui vô kiểm tra.
8. Logo đã nằm sẵn trong `public/images/logo-khoa-vat-ly.png`, không cần tải thêm. Kiểm tra header nền xanh hiện logo trắng và tên CapstoneFlow không còn hiển thị ở header.
9. Truy cập http://localhost:3000. Khi dev server đang chạy, mở terminal thứ hai chạy `npm run test:smoke` để kiểm tra các API cơ bản không cần đăng nhập.

**Lưu ý:** `.env` không được push lên GitHub. Khi deploy Vercel, nhập `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` trong Environment Variables. Tạo schema trên Neon trước khi truy cập trang chủ vì trang chủ đọc số liệu thật từ database.

Tài khoản demo sau khi chạy seed:

- `giangvien1@example.com`
- `giangvien2@example.com`
- Mật khẩu: giá trị `SEED_LECTURER_PASSWORD` trong file `.env` của bạn.
- Cái tui gửi trong nhóm mk tui đặt là 1234567890, mn test thử nha, xong tự tạo .env vs neon riêng để chạy bài sửa riêng.

Không đưa mật khẩu demo lên trang đăng nhập và không sử dụng mật khẩu demo này cho tài khoản thật.

## 3. Đường dẫn giao diện 
Đăng phụ trách đăng nhập và API đề tài; Châu phụ trách giao diện sinh viên và API gửi quan tâm; Linh phụ trách giao diện giảng viên (trừ đăng nhập) và API lượt quan tâm/thông báo/hộp thư.

| Đường dẫn | Mục đích | Phụ trách | File trang chính |
|---|---|---|---|
| `/` | Trang chủ; đề tài đang nhận | **Châu** | `src/app/(public)/page.jsx` |
| `/topics` | Sinh viên tìm kiếm/lọc đề tài | **Châu** | `src/app/(public)/topics/page.jsx` |
| `/topics/[id]` | Xem chi tiết và gửi quan tâm | **Châu** | `src/app/(public)/topics/[id]/page.jsx` |
| `/about` | Giới thiệu | **Châu** | `src/app/(public)/about/page.jsx` |
| `/lecturer/login` | Giảng viên đăng nhập | **Đăng** | `src/app/lecturer/login/page.jsx` |
| `/lecturer/dashboard` | Tổng quan | **Linh** | `src/app/lecturer/(protected)/dashboard/page.jsx` |
| `/lecturer/topics` | Danh sách đề tài của giảng viên | **Linh** | `src/app/lecturer/(protected)/topics/page.jsx` |
| `/lecturer/topics/new` | Thêm đề tài | **Linh** | `src/app/lecturer/(protected)/topics/new/page.jsx` |
| `/lecturer/topics/[id]/edit` | Sửa đề tài | **Linh** | `src/app/lecturer/(protected)/topics/[id]/edit/page.jsx` |
| `/lecturer/registrations` | Danh sách sinh viên quan tâm | **Linh** | `src/app/lecturer/(protected)/registrations/page.jsx` |
| `/lecturer/messages` | Hộp thư lời nhắn từ sinh viên | **Linh** | `src/app/lecturer/(protected)/messages/page.jsx` |

Lưu ý: Thư mục `(protected)` là **route group** của Next.js, **không xuất hiện trong URL** khi truy cập trình duyệt.

## 4. Danh sách API và phân công

| Method | API | Quyền | Phụ trách | File xử lý |
|---|---|---|---|---|
| POST | `/api/v1/auth/login` | Công khai | **Đăng** | `src/app/api/v1/auth/login/route.js` |
| POST | `/api/v1/auth/logout` | Giảng viên đăng nhập | **Đăng** | `src/app/api/v1/auth/logout/route.js` |
| GET | `/api/v1/auth/me` | Giảng viên đăng nhập | **Đăng** | `src/app/api/v1/auth/me/route.js` |
| GET | `/api/v1/topics?search=&lecturer=&status=OPEN` | Công khai | **Đăng** | `src/app/api/v1/topics/route.js` |
| GET | `/api/v1/topics/:id` | Công khai | **Đăng** | `src/app/api/v1/topics/[id]/route.js` |
| POST | `/api/v1/topics` | Giảng viên | **Đăng** | `src/app/api/v1/topics/route.js` |
| PATCH | `/api/v1/topics/:id` | Giảng viên sở hữu | **Đăng** | `src/app/api/v1/topics/[id]/route.js` |
| DELETE | `/api/v1/topics/:id` | Giảng viên sở hữu | **Đăng** | `src/app/api/v1/topics/[id]/route.js` |
| POST | `/api/v1/topics/:id/registrations` | Công khai, khi OPEN | **Châu** | `src/app/api/v1/topics/[id]/registrations/route.js` |
| GET | `/api/v1/registrations` | Giảng viên, chỉ thấy đề tài mình | **Linh** | `src/app/api/v1/registrations/route.js` |
| PATCH | `/api/v1/registrations/:id` | Giảng viên sở hữu | **Linh** | `src/app/api/v1/registrations/[id]/route.js` |
| GET | `/api/v1/lecturer/activity` | Giảng viên đăng nhập | **Linh** | `src/app/api/v1/lecturer/activity/route.js` |
| PATCH | `/api/v1/lecturer/notifications` | Giảng viên đăng nhập | **Linh** | `src/app/api/v1/lecturer/notifications/route.js` |
| PATCH | `/api/v1/lecturer/messages` | Giảng viên đăng nhập | **Linh** | `src/app/api/v1/lecturer/messages/route.js` |

**Quy tắc dùng chung API:** Mọi API trả về dạng `{ "success": true/false, "message": "...", "data": ... }`; dữ liệu đầu vào phải được kiểm tra ở server; API riêng tư phải xác thực và kiểm tra quyền sở hữu đề tài. Châu phụ trách endpoint POST gửi quan tâm nhưng **không tự sửa** phần quản lý thông báo/lượt quan tâm của Linh. Châu và Linh trao đổi trước khi đổi cấu trúc request/response liên quan đến `Registration`.

**Nguyên tắc:** Mỗi trang và API chỉ có **một người phụ trách chính** theo đúng mục 3 và mục 4. Phân công ở đây áp dụng cho giai đoạn **Đăng, Châu, Linh chỉnh sửa, kiểm thử và gửi Pull Request**.

### 5.1. Thảo — ĐÃ HOÀN THÀNH CODE NỀN

Thảo đã khởi tạo Next.js, Prisma, Neon, bộ code nền, GitHub và Vercel.

- Xem kết quả, **review/duyệt Pull Request**, quyết định merge `develop` → `main`.
- Chốt và cấu hình **Neon chính/Vercel production** sau khi nhóm kiểm thử xong; không cho các bạn chỉnh trực tiếp dữ liệu chính.
- Theo dõi các thay đổi schema do nhóm đề xuất. Chỉ áp dụng migration vào Neon chính **sau khi đã được kiểm thử**, không tự ý reset database chính.

Các file nền như `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.mjs`, `src/lib/prisma.js`, `.env.example`, `.gitignore`, `next.config.mjs` **giữ nguyên mặc định**. Nếu thật sự cần thay đổi, Đăng đề xuất trong PR và Thảo duyệt.

### 5.2. Đăng — Trang đăng nhập giảng viên + Auth + API đề tài (8 API)

**Giao diện Đăng phụ trách:**

- `src/app/lecturer/login/page.jsx` — trang `/lecturer/login`: chỉnh form, hiển thị lỗi, loading, trạng thái đăng nhập và responsive.

**Auth/API Đăng phụ trách:**

- `src/app/api/v1/auth/login/route.js` — `POST /api/v1/auth/login`.
- `src/app/api/v1/auth/logout/route.js` — `POST /api/v1/auth/logout`.
- `src/app/api/v1/auth/me/route.js` — `GET /api/v1/auth/me`.
- `src/app/api/v1/topics/route.js` — `GET /api/v1/topics` và `POST /api/v1/topics` (chung 1 file).
- `src/app/api/v1/topics/[id]/route.js` — `GET`, `PATCH`, `DELETE /api/v1/topics/:id` (chung 1 file).

**Logic, validation và test:**

- `src/lib/auth.js` — xác thực, session, kiểm tra giảng viên; giữ tương thích cookie/session đã có.
- `src/lib/validations.js`, `src/lib/response.js` — validation và response chuẩn cho API. Nếu Châu/Linh cần sửa validation, gửi yêu cầu Đăng xử lý.
- `src/services/topic.service.js` — nghiệp vụ tạo, tìm kiếm, sửa, xóa, đóng/mở đề tài.
- `tests/` — Đăng phụ trách tổ chức và tổng hợp test API; Châu và Linh cung cấp ca kiểm thử thuộc API mình phụ trách.

**Tiêu chí hoàn thành:** Đăng nhập/đăng xuất ổn định; API đề tài đúng quyền và dữ liệu; giảng viên A không thể sửa/xóa đề tài B; xử lý lỗi 400/401/403/404/409 phù hợp. Đăng **không sở hữu** các API đăng ký, thông báo, hộp thư được phân cho Châu/Linh.

### 5.3. Châu — Giao diện sinh viên + API gửi quan tâm (1 API)

**Trang Châu phụ trách:**

- `src/app/(public)/page.jsx` — trang chủ `/`.
- `src/app/(public)/topics/page.jsx` — kho đề tài `/topics`, tìm kiếm/lọc.
- `src/app/(public)/topics/[id]/page.jsx` — chi tiết đề tài `/topics/[id]`.
- `src/app/(public)/about/page.jsx` — trang giới thiệu `/about`.
- `src/app/(public)/layout.jsx` — bố cục chung khu sinh viên.

**Component Châu phụ trách:**

- `src/components/topics/TopicCard.jsx`, `TopicList.jsx`, `StudentRegistrationForm.jsx` — danh sách/chi tiết/form gửi quan tâm.
- `src/components/layout/PublicHeader.jsx`, `PublicFooter.jsx`, `FacultyLogo.jsx` — menu, footer và logo khu công khai.
- `src/components/shared/HeaderSearch.jsx` — tìm kiếm dùng chung; Linh cần báo Châu nếu thay đổi component này.

**API Châu phụ trách:**

- `src/app/api/v1/topics/[id]/registrations/route.js` — `POST /api/v1/topics/:id/registrations`.

**Tiêu chí hoàn thành:** Tìm/lọc được đề tài; xem chi tiết; form kiểm tra dữ liệu, gửi thành công; không gửi trùng email cùng đề tài hoặc vào đề tài đóng; có loading, empty, error và responsive. API này sử dụng `registration.service.js` (Linh phụ trách), vì vậy **Châu và Linh phải thống nhất đầu vào/đầu ra**, không tự sửa service của nhau.

### 5.4. Linh — Giao diện giảng viên trừ login + API đăng ký/thông báo/hộp thư (5 API)

**Trang Linh phụ trách:**

- `src/app/lecturer/(protected)/layout.jsx` — bố cục giảng viên sau đăng nhập.
- `src/app/lecturer/(protected)/dashboard/page.jsx` — `/lecturer/dashboard`.
- `src/app/lecturer/(protected)/topics/page.jsx` — `/lecturer/topics`.
- `src/app/lecturer/(protected)/topics/new/page.jsx` — `/lecturer/topics/new`.
- `src/app/lecturer/(protected)/topics/[id]/edit/page.jsx` — `/lecturer/topics/[id]/edit`.
- `src/app/lecturer/(protected)/registrations/page.jsx` — `/lecturer/registrations`.
- `src/app/lecturer/(protected)/messages/page.jsx` — `/lecturer/messages`.

**Component Linh phụ trách:**

- `src/components/lecturer/LecturerNavigation.jsx`, `LecturerActivityToolbar.jsx` — menu, chuông, tìm kiếm, hộp thư trên thanh giảng viên.
- `src/components/lecturer/LecturerTopicList.jsx`, `TopicForm.jsx` — danh sách/form thêm/sửa đề tài.
- `src/components/lecturer/RegistrationList.jsx`, `StudentMessageList.jsx` — lượt quan tâm/hộp thư.
- `src/components/shared/PortalIcons.jsx` — icon dùng chung, Châu báo Linh trước khi sửa.

**API Linh phụ trách:**

- `src/app/api/v1/registrations/route.js` — `GET /api/v1/registrations`.
- `src/app/api/v1/registrations/[id]/route.js` — `PATCH /api/v1/registrations/:id`.
- `src/app/api/v1/lecturer/activity/route.js` — `GET /api/v1/lecturer/activity`.
- `src/app/api/v1/lecturer/notifications/route.js` — `PATCH /api/v1/lecturer/notifications`.
- `src/app/api/v1/lecturer/messages/route.js` — `PATCH /api/v1/lecturer/messages`.
- `src/services/registration.service.js` — nghiệp vụ danh sách quan tâm, trạng thái `NEW/CONTACTED`, `readAt`, `messageReadAt` và truy vấn hộp thư; phối hợp Châu ở endpoint gửi quan tâm.

**Tiêu chí hoàn thành:** Dashboard đọc dữ liệu đúng; CRUD form UI kết nối API Đăng; nhận quan tâm, đọc thông báo/hộp thư, đánh dấu đã xem/đã liên hệ; giảng viên chỉ thấy dữ liệu thuộc đề tài mình; responsive và sửa lỗi tương phản chữ trong hộp thư. **Linh không phụ trách trang `/lecturer/login` hoặc các API auth/topics của Đăng.**

### 5.5. Các file giao diện dùng chung — chốt người phụ trách

| File hoặc nhóm file | Người phụ trách chính | Cách phối hợp |
|---|---|---|
| `src/components/topics/*` | **Châu** | Linh chỉ dùng dữ liệu/API tương thích, không tự sửa component Châu. |
| `src/components/lecturer/*` | **Linh** | Đăng hỗ trợ hợp đồng API, không tự chỉnh giao diện Linh. |
| `src/components/layout/*` | **Châu** | Châu sửa header/footer/logo công khai; thay đổi logo dùng chung báo Linh. |
| `src/components/shared/HeaderSearch.jsx` | **Châu** | Linh yêu cầu thay đổi qua Châu. |
| `src/components/shared/PortalIcons.jsx` | **Linh** | Châu yêu cầu thay đổi qua Linh. |
| `src/app/globals.css` | **Châu** | CSS nền dùng chung: chỉ Châu chỉnh trong PR riêng, trao đổi với Linh trước khi đổi style toàn cục. |
| `src/app/site.css` — selector `.portal-*` cho sinh viên | **Châu** | Chỉ sửa phần Public UI, không thay nhóm `.lecturer-*`. |
| `src/app/site.css` — selector `.lecturer-*`, `.editor-*` cho giảng viên | **Linh** | Chỉ sửa phần Lecturer UI; phần `.portal-*` dùng chung header cần trao đổi với Châu. |
| `src/app/site.css` — `:root`, `body`, `button`, `input` và selector chung | **Châu (đầu mối)** | Châu/Linh không sửa đồng thời; khi cần đổi style chung, Linh đề xuất và Châu phối hợp merge. |
| `src/app/layout.jsx`, `src/app/error.jsx`, `src/app/loading.jsx`, `src/app/not-found.jsx` | **Châu (đầu mối giao diện)** | Châu trao đổi với Linh vì các trang này ảnh hưởng toàn site. |
| `src/lib/auth.js`, API auth và trang login | **Đăng** | Đăng chịu trách nhiệm end-to-end luồng đăng nhập, thông báo Linh nếu thay session/route. |
| `src/lib/prisma.js`, `prisma/schema.prisma`, `prisma/migrations/` | **Giữ nền Thảo đã chốt** | Nếu cần sửa, Đăng đề xuất migration bằng PR; Thảo chỉ duyệt và quyết định áp dụng Neon chính sau cùng. |

**Lưu ý về CSS:** Hiện cả Public UI và Lecturer UI vẫn dùng chung `site.css`, vì vậy phải **pull `develop` mới nhất trước khi sửa**, tránh hai PR ghi đè. Nếu sau này muốn tách thành `public.css` và `lecturer.css` thì cần một PR riêng thống nhất import, tránh thay đổi cấu trúc giữa chừng.

### 5.6. Branch, Pull Request và nghiệm thu

- **Đăng:** `feature/auth-topic-api` — login UI, 8 API, logic và test.
- **Châu:** `feature/student-ui` — 4 trang sinh viên và POST gửi quan tâm.
- **Linh:** `feature/lecturer-ui` — 6 trang giảng viên và 5 API.
- Mỗi người **clone repo, tạo `.env` Neon riêng trên máy, làm trên branch của mình**; không commit `.env`, `.next/`, `node_modules/`.
- Tạo PR **feature → `develop`** với ảnh trước/sau và bằng chứng test. Chỉ chỉnh file của phần mình; nếu cần sửa file chung, trao đổi và nêu rõ trong PR.
- **Thảo** đọc PR và duyệt/merge. Khi cả ba phần được kiểm thử, mới tạo PR **`develop` → `main`** và chốt Neon production trên Vercel. Không tự push thẳng lên `main`.

## 6. Checklist test cơ bản trước khi giao nhóm

- [ ] Database Neon kết nối được, có đủ 4 bảng.
- [ ] Seed tạo được giảng viên và đề tài mẫu.
- [ ] Sinh viên xem danh sách, tìm kiếm tên/công nghệ, lọc trạng thái.
- [ ] Xem chi tiết đề tài và gửi thông tin quan tâm thành công.
- [ ] Cùng email không gửi trùng đề tài (409).
- [ ] Đề tài `CLOSED` không nhận đăng ký mới (409).
- [ ] Giảng viên đăng nhập, đăng xuất thành công.
- [ ] Tạo, sửa, xóa, mở/đóng đề tài thành công.
- [ ] Giảng viên 1 không thể sửa/xóa đề tài của giảng viên 2.
- [ ] Giảng viên chỉ nhìn thấy thông tin sinh viên thuộc đề tài của mình.
- [ ] Cập nhật `NEW` thành `CONTACTED` và ngược lại.
- [ ] Gửi quan tâm có lời nhắn → giảng viên thấy thông báo và hộp thư.
- [ ] Đánh dấu đã xem không tự đổi trạng thái `NEW` thành `CONTACTED`.
- [ ] Giảng viên B không xem được thông báo/lời nhắn thuộc đề tài của giảng viên A.
- [ ] Nút tìm kiếm trên header công khai và header giảng viên hoạt động.
- [ ] Dùng mobile: trang sinh viên, dashboard, form không bị vỡ bố cục.
- [ ] Thử nhập dữ liệu sai và thao tác nhầm quyền để xem các lỗi 400, 401, 403, 404, 409.

## 7. Giới hạn và lưu ý khi demo

- `maxStudents` chỉ là số lượng sinh viên dự kiến; không tự đóng đề tài theo số lượt quan tâm.
- Gửi quan tâm **không phải** được nhận vào nhóm.
- Không có login cho sinh viên, upload, quy trình duyệt, tiến độ đồ án, chat hai chiều hoặc thông báo real-time. Header đọc lại dữ liệu khi focus/mở panel và mỗi 60 giây.
- Mã nền là điểm bắt đầu, **chưa được kiểm chứng end-to-end với Neon/Vercel của bạn**. Khi có database thực tế, chạy checklist ở mục 6 và sửa lỗi tích hợp nếu có.
- Trước khi dùng thực tế ngoài demo, bổ sung rate limiting ở endpoint đăng nhập/đăng ký, chống bot, kiểm thử bảo mật và chính sách lưu giữ dữ liệu cá nhân.

Sau lần `npm install` đầu tiên, hãy commit thêm `package-lock.json` được npm tạo ra để cả nhóm cài đúng bộ phiên bản đã chốt.


