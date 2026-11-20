# CapstoneFlow

Kho đề tài đồ án của Khoa Vật lý – Vật lý Kỹ thuật: giảng viên công bố đề tài, sinh viên tìm kiếm và đăng ký trực tuyến, quản trị viên quản lý vai trò và danh mục.
Đồ án nhóm môn **Phát triển ứng dụng web (PHY10615, HK1 2026–2027)**.

> Dự án đang được xây dựng theo từng giai đoạn qua Pull Request. Xem tiến độ ở mục [Tiến độ](#tiến-độ).

## Phân công

| Thành viên | Phụ trách |
|---|---|
| (Thành viên 1) | Nền móng dự án (cấu hình, database, `src/lib`) + giao diện công khai cho Khách |
| (Thành viên 2) | Phần Sinh viên: gửi / rút đăng ký, `/my-registrations` |
| (Thành viên 3) | Phần Giảng viên: `/lecturer`, quản lý đề tài, duyệt đăng ký, xuất CSV |
| (Thành viên 4) | Phần Quản trị: `/admin`, người dùng, bộ môn và thẻ |

## Công nghệ

- Next.js 16 (App Router) · React 19 · TypeScript 5
- Tailwind CSS v4
- Prisma ORM 7 + PostgreSQL (Neon), adapter `@prisma/adapter-pg`
- Better Auth (email + mật khẩu; 3 vai trò `STUDENT`, `LECTURER`, `ADMIN`)
- Zod 4 · Vitest 5

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
src/features/<tên>/    mỗi nghiệp vụ: schema · rules · filters · queries · actions · components
src/lib/               hạ tầng: prisma, auth, dal (phiên + quyền), pagination, action-state, ...
tests/unit/            unit test
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
- [ ] Giai đoạn 2 – Giao diện chung, đăng nhập / đăng ký, trang giới thiệu
- [ ] Giai đoạn 3 – Trang chủ
- [ ] Giai đoạn 4 – Kho đề tài: tìm kiếm, lọc, phân trang
- [ ] Giai đoạn 5 – Chi tiết đề tài, E2E test, CI
