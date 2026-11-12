import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_LECTURER_PASSWORD;
  if (!password || password.length < 10 || password.startsWith("REPLACE_")) {
    throw new Error("Đặt SEED_LECTURER_PASSWORD ít nhất 10 ký tự trong file .env trước khi seed.");
  }
  const passwordHash = await hash(password, 12);
  const lecturers = [
    { email: "giangvien1@example.com", fullName: "Nguyễn Đăng Duy" },
    { email: "giangvien2@example.com", fullName: "Vũ Chí Hưng" },
  ];
  const accounts = [];
  for (const lecturer of lecturers) {
    const account = await prisma.user.upsert({
      where: { email: lecturer.email },
      update: { fullName: lecturer.fullName, passwordHash },
      create: { ...lecturer, passwordHash },
    });
    accounts.push(account);
  }

  // Chỉ tạo dữ liệu ví dụ khi database chưa có đề tài; chạy lại seed không nhân bản đề tài.
  if ((await prisma.topic.count()) === 0) {
    await prisma.topic.createMany({ data: [
      {
        lecturerId: accounts[0].id,
        title: "Website quản lý câu lạc bộ sinh viên",
        description: "Quản lý thông tin thành viên, hoạt động và lịch sinh hoạt của câu lạc bộ.",
        objectives: "Thiết kế cơ sở dữ liệu; xây dựng phân quyền; triển khai website.",
        requirements: "Biết JavaScript cơ bản và SQL.",
        technologies: "Next.js, PostgreSQL, Prisma",
        maxStudents: 3,
        status: "OPEN",
      },
      {
        lecturerId: accounts[0].id,
        title: "Hệ thống đặt lịch sử dụng phòng học",
        description: "Cho phép tra cứu phòng trống và gửi yêu cầu đặt lịch.",
        objectives: "Có trang tìm lịch trống và kiểm tra trùng lịch.",
        requirements: "Nắm vững React và API REST.",
        technologies: "React, Next.js, PostgreSQL",
        maxStudents: 2,
        status: "OPEN",
      },
      {
        lecturerId: accounts[1].id,
        title: "Phân loại phản hồi của sinh viên",
        description: "Tạo giao diện tập hợp phản hồi và phân loại nội dung theo nhóm.",
        objectives: "Xử lý dữ liệu đầu vào và xây dựng báo cáo cơ bản.",
        requirements: "Có kiến thức Python và xử lý dữ liệu.",
        technologies: "Python, NLP, PostgreSQL",
        maxStudents: 3,
        status: "OPEN",
      },
      {
        lecturerId: accounts[1].id,
        title: "Ứng dụng quản lý thư viện nội bộ",
        description: "Theo dõi sách, người mượn và hạn trả sách.",
        objectives: "Hoàn thiện các chức năng quản lý sách và người mượn.",
        requirements: "Biết CRUD và thiết kế database.",
        technologies: "JavaScript, Prisma, PostgreSQL",
        maxStudents: 2,
        status: "CLOSED",
      },
    ]});
  }
  console.log("Seed hoàn tất. Tài khoản demo: giangvien1@example.com và giangvien2@example.com");
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
