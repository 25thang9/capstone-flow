# CapstoneFlow — bản nền cho nhóm 4 người

Website quản lý kho đề tài đồ án và kết nối sinh viên với giảng viên. Bản nền ưu tiên **đủ chức năng, tên file dễ hiểu, dễ chia module**. Giao diện hướng đến **phần mềm quản lý đề tài thực tế**: bố cục học thuật, ít trang trí, nội dung và số liệu đọc từ database. Nhóm có thể chỉnh sửa CSS và từng trang sau khi thống nhất chức năng.

## Giao diện hiện tại — phong cách cổng học vụ gọn gàng

- Giữ header xanh HCMUS và logo Physics trắng do nhóm chọn; **không** đặt chữ CapstoneFlow lớn trên header.
- Trang chủ **không có banner, số thứ tự lớn hoặc cột card hướng dẫn**: người xem thấy ngay tiêu đề, ô tìm kiếm và danh sách đề tài.
- Nền trắng, link xanh dương, đường viền mảnh; dùng font hệ thống `Segoe UI`/Arial, nội dung khoảng 16–17px.
- Danh sách đề tài **không có chip công nghệ**; công nghệ được hiển thị thành dòng chữ bình thường.
- Form thêm/sửa đề tài chia 3 nhóm bằng đường kẻ, **không có huy hiệu 01/02/03**. Trang đăng nhập không dùng khối khẩu hiệu màu tối.
- Sửa nhanh màu/font/khoảng cách trong `src/app/site.css`. `src/app/globals.css` giữ style cơ sở và giao diện thông báo/hộp thư.
- Ảnh minh họa desktop/mobile ở `docs/xem-truoc/`. **Ảnh này dùng dữ liệu mẫu**, không phải website chạy với Neon thật.
- Hướng dẫn phân chia file và quyết định thiết kế ở `HUONG_DAN_GIAO_DIEN.md`.
- Nhóm cần xác nhận quyền sử dụng logo chính thức của Khoa trước khi triển khai công khai.

## Bổ sung: Thông báo · Hộp thư · Tìm kiếm

Bản cập nhật có **3 nút chức năng trên header**: tìm kiếm (cả công khai và giảng viên), chuông thông báo (giảng viên), hộp thư (giảng viên). Sinh viên ghi lời nhắn trong form quan tâm; giảng viên đọc trong `/lecturer/messages` và có thể trả lời bằng ứng dụng email. Chuông phản ánh những lượt quan tâm chưa được **xem**; hộp thư có trạng thái đã đọc riêng, trong khi trạng thái `NEW/CONTACTED` phản ánh việc đã **liên hệ** hay chưa.

Để giữ scope MVP 4 tuần, **không làm chat thời gian thực** hoặc thêm tài khoản sinh viên. Bộ ảnh giao diện hiện tại nằm trong `docs/xem-truoc/` (dữ liệu minh họa, không phải ảnh chạy với Neon thật). Xem `HUONG_DAN_THONG_BAO_VA_HOP_THU.md` để biết thao tác, API và checklist test.

**Chú ý schema:** `Registration` có hai cột `readAt` và `messageReadAt` mới. Với database đã khởi tạo từ bản cũ, chạy `npx prisma migrate dev --name add_read_status` sau khi cập nhật code. Với database trống, tạo migration `init` theo hướng dẫn phía dưới. Không thay schema production bằng tay.

## 1. Công nghệ và yêu cầu

- JavaScript (JSX), Next.js App Router, Route Handlers.
- Prisma **6.19.0** + Neon PostgreSQL. **Chủ động cố định Prisma 6** để khớp với kiểu `schema.prisma` trong kế hoạch; Prisma 7 có cách cấu hình khác.
- Node.js 20.9+ (khuyến nghị 22 LTS), npm.
- Dùng CSS thuần: `src/app/globals.css` chứa kiểu cơ sở; `src/app/site.css` chứa màu và bố cục mới. Chỉnh `site.css` trước để tránh ảnh hưởng API hoặc logic.

## 2. Chạy trên máy của bạn

1. Giải nén thư mục dự án, mở bằng VS Code, mở Terminal tại thư mục có `package.json`.
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

8. Logo đã nằm sẵn trong `public/images/logo-khoa-vat-ly.png`, không cần tải thêm. Kiểm tra header nền xanh hiện logo trắng và tên CapstoneFlow không còn hiển thị ở header.
9. Truy cập http://localhost:3000. Khi dev server đang chạy, mở terminal thứ hai chạy `npm run test:smoke` để kiểm tra các API cơ bản không cần đăng nhập.

**Lưu ý:** `.env` không được push lên GitHub. Khi deploy Vercel, nhập `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` trong Environment Variables. Tạo schema trên Neon trước khi truy cập trang chủ vì trang chủ đọc số liệu thật từ database.

Tài khoản demo sau khi chạy seed:

- `giangvien1@example.com`
- `giangvien2@example.com`
- Mật khẩu: giá trị `SEED_LECTURER_PASSWORD` trong file `.env` của bạn.

Không đưa mật khẩu demo lên trang đăng nhập và không sử dụng mật khẩu demo này cho tài khoản thật.

## 3. Đường dẫn giao diện

| Đường dẫn | Mục đích |
|---|---|
| `/` | Trang chủ; đề tài đang nhận |
| `/topics` | Sinh viên tìm kiếm/lọc đề tài |
| `/topics/[id]` | Xem chi tiết và gửi quan tâm |
| `/about` | Giới thiệu |
| `/lecturer/login` | Giảng viên đăng nhập |
| `/lecturer/dashboard` | Tổng quan |
| `/lecturer/topics` | Danh sách đề tài của giảng viên |
| `/lecturer/topics/new` | Thêm đề tài |
| `/lecturer/topics/[id]/edit` | Sửa đề tài |
| `/lecturer/registrations` | Danh sách sinh viên quan tâm |
| `/lecturer/messages` | Hộp thư lời nhắn từ sinh viên |

## 4. Danh sách API

| Method | API | Quyền |
|---|---|---|
| POST | `/api/v1/auth/login` | Công khai |
| POST | `/api/v1/auth/logout` | Giảng viên đăng nhập |
| GET | `/api/v1/auth/me` | Giảng viên đăng nhập |
| GET | `/api/v1/topics?search=&lecturer=&status=OPEN` | Công khai |
| GET | `/api/v1/topics/:id` | Công khai |
| POST | `/api/v1/topics` | Giảng viên |
| PATCH | `/api/v1/topics/:id` | Giảng viên sở hữu |
| DELETE | `/api/v1/topics/:id` | Giảng viên sở hữu |
| POST | `/api/v1/topics/:id/registrations` | Công khai, khi OPEN |
| GET | `/api/v1/registrations` | Giảng viên, chỉ thấy đề tài mình |
| PATCH | `/api/v1/registrations/:id` | Giảng viên sở hữu |
| GET | `/api/v1/lecturer/activity` | Giảng viên đăng nhập |
| PATCH | `/api/v1/lecturer/notifications` | Giảng viên đăng nhập |
| PATCH | `/api/v1/lecturer/messages` | Giảng viên đăng nhập |

Mọi API có dạng `{ "success": true/false, "message": "...", "data": ... }`. Request kiểm tra Zod tại server. API không công khai danh sách sinh viên quan tâm.

## 5. Phân công công việc nhóm 4 người

- **Thảo — Quản lý dự án & Backend Core:** quản lý GitHub, review Pull Request, cấu hình Neon/Vercel, kiểm tra tích hợp; phụ trách `prisma/`, `src/lib/prisma.js`, `src/lib/auth.js`, `.env.example` và `src/app/api/v1/auth/`.
- **Đăng — Business API & Kiểm thử:** phụ trách xử lý nghiệp vụ đề tài, đăng ký quan tâm, phân quyền truy cập và kiểm thử API; làm trong `src/services/`, `src/app/api/v1/topics/`, `src/app/api/v1/registrations/`, `src/app/api/v1/lecturer/`, `src/lib/validations.js` và `tests/`.
- **Châu — Giao diện sinh viên:** hoàn thiện trang chủ, danh sách/tìm kiếm đề tài, trang chi tiết và form gửi quan tâm; phụ trách `src/app/(public)/`, `src/components/topics/`, `src/components/layout/`.
- **Linh — Giao diện giảng viên:** hoàn thiện đăng nhập, dashboard, quản lý đề tài, hộp thư, thông báo và responsive; phụ trách `src/app/lecturer/` và `src/components/lecturer/`.
- **File cần phối hợp:** `src/components/shared/`, `src/app/globals.css` và `src/app/site.css` phải trao đổi giữa **Châu và Linh** trước khi sửa để tránh conflict. Mọi thay đổi `prisma/schema.prisma` (đặc biệt các trường `Registration.readAt`, `messageReadAt`) hoặc API contract cần **Thảo và Đăng** thống nhất trước; Linh/Châu được thông báo nếu thay đổi ảnh hưởng giao diện.

**Nguyên tắc:** Mỗi người tạo branch riêng từ `develop`, chỉ push lên branch của mình. Tạo Pull Request vào `develop` để người khác review; sau khi tích hợp và test ổn mới đề xuất merge `develop` vào `main`.

**Đừng sửa trực tiếp trên `main`.** Gợi ý luồng:

```bash
git init
git add .
git commit -m "feat: tao code nen capstoneflow"
git branch -M main
# Tạo repository trên GitHub rồi gắn remote (thay URL đúng repo của nhóm)
git remote add origin https://github.com/OWNER/REPO.git
git push -u origin main
# Tạo branch develop sau khi main chạy ổn
git switch -c develop
git push -u origin develop
```

Các branch đề xuất: `feature/student-ui`, `feature/lecturer-ui`, `feature/business-api`, `fix/topic-form`, `fix/registration-test`. PR vào `develop`; reviewer kiểm tra trước khi merge vào `main`.

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


## Điều chỉnh chữ và khả năng đọc (bản cập nhật 12/11/2026)

- Font thống nhất: Arial, fallback Helvetica / sans-serif; không cần tải font.
- Nội dung chính: khoảng 17px; nhãn biểu mẫu và dữ liệu bảng: 16px; thông tin phụ: khoảng 14–15px; tiêu đề từ 22px.
- CSS sửa trực tiếp tại `src/app/globals.css`; không thay đổi API, Prisma, session, dữ liệu hay routes.
- Cỡ chữ được cân đối lại trên màn hình desktop và điện thoại.
