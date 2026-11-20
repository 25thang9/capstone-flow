## Mô tả
<!-- Liệt kê ngắn gọn các thay đổi chính trong PR này -->
- 

## Ảnh chụp / video (nếu thay đổi giao diện)
<!-- Dán ảnh chụp màn hình / video minh họa tại đây, hoặc ghi chú nếu PR này chỉ xử lý logic/hạ tầng -->

## Cách kiểm tra
<!-- Các bước để reviewer kéo nhánh về kiểm tra trên máy -->
1. `git checkout <ten-nhanh-cua-ban>`
2. 

## Checklist
- [ ] `npm run lint`, `npm run typecheck`, `npx vitest run`, `npm run build` đều qua
- [ ] Server Action/Route Handler mới đều kiểm tra session và lọc theo userId
- [ ] Input được validate bằng Zod
- [ ] Có hoặc đã cập nhật test cho logic thay đổi
- [ ] Không có secret trong code; biến mới đã thêm vào .env.example
- [ ] UI mới dùng được bằng bàn phím, có nhãn, đủ tương phản

## Sử dụng AI
- Mức AI: <!-- Ví dụ: Mức 4 – AI hoàn toàn có kiểm soát -->
- Công cụ & phần AI hỗ trợ: <!-- Tên công cụ và phần việc đã dùng AI -->
- Mình đã kiểm chứng bằng: <!-- Cách bạn tự kiểm tra, chạy test hoặc rà soát lại code -->
