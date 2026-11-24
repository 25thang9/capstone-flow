# CapstoneFlow

Kho đề tài đồ án của Khoa Vật lý – Vật lý Kỹ thuật: giảng viên công bố đề tài, sinh viên tìm kiếm và đăng ký trực tuyến, quản trị viên quản lý vai trò và danh mục.
Đồ án nhóm môn **Phát triển ứng dụng web (PHY10615, HK1 2026–2027)**.

> Dự án đang được xây dựng theo từng giai đoạn qua Pull Request. Xem tiến độ ở mục [Tiến độ](#tiến-độ).

## Phân công

| Thành viên | Phụ trách |
|---|---|
| Linh | Nền móng dự án (cấu hình, database, `src/lib`) + giao diện công khai cho Khách |
| Châu | Phần Sinh viên: gửi / rút đăng ký, `/my-registrations` |
| Đăng | Phần Giảng viên: `/lecturer`, quản lý đề tài, duyệt đăng ký, xuất CSV |
| Thảo | Phần Quản trị: `/admin`, người dùng, bộ môn và thẻ |

## Công nghệ

- Next.js 16 (App Router) · React 19 · TypeScript 5
- Tailwind CSS v4 · shadcn/ui (Radix) · next-themes
- Prisma ORM 7 + PostgreSQL (Neon), adapter `@prisma/adapter-pg`
- Better Auth (email + mật khẩu; 3 vai trò `STUDENT`, `LECTURER`, `ADMIN`)
- Zod 4 · Vitest 5 + Testing Library

## Chạy local

Cần **Node.js 24** và một database PostgreSQL (Neon bản Free là đủ).

```bash
npm ci
cp .env.example .env
```

Điền trong `.env`: `DATABASE_URL` (URL pooled), `DIRECT_URL` (URL direct), `BETTER_AUTH_SECRET` (≥ 32 ký tự), `SEED_PASSWORD` (≥ 10 ký tự). Sau đó:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Kiểm tra trước khi mở PR

```bash
npm run lint
npm run typecheck
npx vitest run
```

## Cấu trúc thư mục

```
prisma/                schema.prisma, migrations, seed.ts
src/app/               route (page, layout, route handler)
src/components/        ui/ (shadcn) · shared/ · layout/
src/features/<tên>/    mỗi nghiệp vụ: schema · rules · filters · queries · actions · components
src/lib/               hạ tầng: prisma, auth, dal (phiên + quyền), pagination, action-state, ...
src/proxy.ts           chuyển hướng khách chưa đăng nhập ở các đường dẫn cần quyền
tests/                 unit/ · component/
```

## Mô hình dữ liệu

4 bảng của Better Auth (`user`, `session`, `account`, `verification`) và 4 model nghiệp vụ:

| Model | Ý nghĩa | Quan hệ |
|---|---|---|
| `Department` | Bộ môn | 1–n với `Topic` |
| `Tag` | Thẻ lĩnh vực / công nghệ | n–n với `Topic` |
| `Topic` | Đề tài | n–1 `User` (giảng viên), n–1 `Department`, n–n `Tag`, 1–n `Registration` |
| `Registration` | Sinh viên đăng ký đề tài | n–1 `Topic`, n–1 `User` (sinh viên); unique `(topicId, studentId)` |

## Tiến độ

- [x] **Giai đoạn 1** – Nền móng: cấu hình TypeScript / Prisma 7 / Vitest, schema + migration + seed, tầng `src/lib`
- [x] **Giai đoạn 2** – Giao diện chung, đăng nhập / đăng ký, trang giới thiệu
- [x] **Giai đoạn 3** – Trang chủ công khai và hiện danh sách đề tài, bộ môn
- [x] **Giai đoạn 4** – Kho đề tài: tìm kiếm, lọc, phân trang
- [x] **Giai đoạn 5** – Chi tiết đề tài