import { prisma } from "@/lib/prisma";

export async function registerInterest(topicId, studentData) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId }, select: { id: true, status: true },
  });
  if (!topic) return { error: "NOT_FOUND" };
  if (topic.status !== "OPEN") return { error: "CLOSED" };
  // Unique constraint (topicId, studentEmail) xử lý cả trường hợp hai request gửi đồng thời.
  const registration = await prisma.registration.create({
    data: { ...studentData, topicId },
    select: { id: true, createdAt: true },
  });
  return { registration };
}

export async function getRegistrationsForLecturer(lecturerId) {
  return prisma.registration.findMany({
    where: { topic: { lecturerId } },
    include: { topic: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateRegistrationForLecturer(registrationId, lecturerId, status) {
  const registration = await prisma.registration.findFirst({
    where: { id: registrationId, topic: { lecturerId } },
    select: { id: true },
  });
  if (!registration) return null;
  return prisma.registration.update({
    where: { id: registrationId }, data: { status, ...(status === "CONTACTED" ? { readAt: new Date(), messageReadAt: new Date() } : {}) },
    include: { topic: { select: { id: true, title: true } } },
  });
}

// Thông báo chỉ là những lượt quan tâm chưa được giảng viên xem.
// readAt độc lập với status (NEW/CONTACTED) để không đánh đồng đã đọc và đã liên hệ.
export async function getLecturerActivity(lecturerId) {
  const owned = { topic: { lecturerId } };
  const messageFilter = { ...owned, message: { not: null } };
  const [unreadCount, newMessageCount, notifications, messages] = await Promise.all([
    prisma.registration.count({ where: { ...owned, readAt: null } }),
    prisma.registration.count({ where: { ...messageFilter, messageReadAt: null } }),
    prisma.registration.findMany({
      where: owned,
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, studentName: true, createdAt: true, readAt: true,
        topic: { select: { title: true } },
      },
    }),
    prisma.registration.findMany({
      where: messageFilter,
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, studentName: true, message: true, createdAt: true, messageReadAt: true,
        topic: { select: { title: true } },
      },
    }),
  ]);
  return { unreadCount, newMessageCount, notifications, messages };
}

export async function markRegistrationRead(lecturerId, registrationId) {
  return prisma.registration.updateMany({
    where: { id: registrationId, topic: { lecturerId }, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function markAllRegistrationsRead(lecturerId) {
  return prisma.registration.updateMany({
    where: { topic: { lecturerId }, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function getStudentMessagesForLecturer(lecturerId) {
  return prisma.registration.findMany({
    where: { topic: { lecturerId }, message: { not: null } },
    include: { topic: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// Đọc lời nhắn không làm thay đổi thông báo; hai icon có bộ đếm độc lập.
export async function markStudentMessageRead(lecturerId, registrationId) {
  return prisma.registration.updateMany({
    where: { id: registrationId, topic: { lecturerId }, message: { not: null }, messageReadAt: null },
    data: { messageReadAt: new Date() },
  });
}
