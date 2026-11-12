import { prisma } from "@/lib/prisma";

const publicTopicSelect = {
  id: true,
  title: true,
  description: true,
  objectives: true,
  requirements: true,
  technologies: true,
  maxStudents: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  lecturer: { select: { fullName: true } },
};

export async function getPublicTopics({ search = "", status = "OPEN", lecturer = "" } = {}) {
  const where = {
    ...(status !== "ALL" ? { status } : {}),
    ...(search ? { OR: [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { technologies: { contains: search, mode: "insensitive" } },
    ] } : {}),
    ...(lecturer ? { lecturer: { fullName: { contains: lecturer, mode: "insensitive" } } } : {}),
  };
  return prisma.topic.findMany({ where, orderBy: { updatedAt: "desc" }, take: 100, select: publicTopicSelect });
}

export async function getPublicTopicById(topicId) {
  return prisma.topic.findUnique({ where: { id: topicId }, select: publicTopicSelect });
}

export async function getLecturerTopics(lecturerId) {
  return prisma.topic.findMany({
    where: { lecturerId }, orderBy: { updatedAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });
}

export async function getLecturerTopicById(topicId, lecturerId) {
  return prisma.topic.findFirst({ where: { id: topicId, lecturerId } });
}

export async function createLecturerTopic(lecturerId, topicData) {
  return prisma.topic.create({ data: { ...topicData, lecturerId } });
}

export async function updateLecturerTopic(topicId, lecturerId, topicData) {
  const topic = await getLecturerTopicById(topicId, lecturerId);
  if (!topic) return null;
  return prisma.topic.update({ where: { id: topicId, lecturerId }, data: topicData });
}

export async function deleteLecturerTopic(topicId, lecturerId) {
  const topic = await getLecturerTopicById(topicId, lecturerId);
  if (!topic) return false;
  await prisma.topic.delete({ where: { id: topicId, lecturerId } });
  return true;
}
