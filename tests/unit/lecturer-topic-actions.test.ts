import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { deleteTopicAction, setTopicStatusAction, updateTopicAction } from "@/features/lecturer/topics/actions";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/dal", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    topic: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const findFirst = prisma.topic.findFirst as unknown as Mock;
const updateMany = prisma.topic.updateMany as unknown as Mock;
const deleteMany = prisma.topic.deleteMany as unknown as Mock;
const count = prisma.topic.count as unknown as Mock;
const transaction = prisma.$transaction as unknown as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireRole).mockResolvedValue({ id: "gv-1" } as never);
});

describe("Server Actions quản lý đề tài PR4", () => {
  it("đóng đề tài theo id và lecturerId của phiên", async () => {
    findFirst.mockResolvedValue({ maxStudents: 2, _count: { registrations: 1 } });
    updateMany.mockResolvedValue({ count: 1 });

    const result = await setTopicStatusAction("topic-1", "CLOSED");

    expect(result.status).toBe("success");
    expect(requireRole).toHaveBeenCalledWith("LECTURER");
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "topic-1", lecturerId: "gv-1" },
    }));
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "topic-1", lecturerId: "gv-1" },
      data: { status: "CLOSED" },
    });
  });

  it("không mở đề tài đã đủ chỗ", async () => {
    findFirst.mockResolvedValue({ maxStudents: 1, _count: { registrations: 1 } });
    const result = await setTopicStatusAction("topic-1", "OPEN");
    expect(result.status).toBe("error");
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("không thao tác đề tài ngoài quyền quản lý", async () => {
    findFirst.mockResolvedValue(null);
    const result = await setTopicStatusAction("topic-other", "CLOSED");
    expect(result.status).toBe("error");
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("không xóa đề tài đã nhận sinh viên", async () => {
    deleteMany.mockResolvedValue({ count: 0 });
    count.mockResolvedValue(1);
    const result = await deleteTopicAction("topic-1");
    expect(result.status).toBe("error");
    expect(deleteMany).toHaveBeenCalledWith({ where: {
      id: "topic-1",
      lecturerId: "gv-1",
      registrations: { none: { status: "ACCEPTED" } },
    } });
  });

  it("xóa đề tài chưa nhận sinh viên bằng deleteMany có lọc quyền", async () => {
    deleteMany.mockResolvedValue({ count: 1 });
    const result = await deleteTopicAction("topic-1");
    expect(result.status).toBe("success");
    expect(deleteMany).toHaveBeenCalledWith({ where: {
      id: "topic-1",
      lecturerId: "gv-1",
      registrations: { none: { status: "ACCEPTED" } },
    } });
  });

  it("không xóa được đề tài không thuộc giảng viên", async () => {
    deleteMany.mockResolvedValue({ count: 0 });
    count.mockResolvedValue(0);
    const result = await deleteTopicAction("topic-other");
    expect(result.status).toBe("error");
    expect(count).toHaveBeenCalledWith({ where: { id: "topic-other", lecturerId: "gv-1" } });
  });

  it("không cho giảm số sinh viên nhỏ hơn số đã nhận khi sửa", async () => {
    transaction.mockImplementation(async (work: (tx: unknown) => Promise<unknown>) => work({
      registration: { count: vi.fn().mockResolvedValue(3) },
      topic: { updateMany: vi.fn(), update: vi.fn() },
    }));
    const data = new FormData();
    data.set("title", "Thiết kế hệ thống ESP32");
    data.set("description", "Đề tài thiết kế hệ thống kết nối cảm biến và giao diện điều khiển từ xa.");
    data.set("departmentId", "dep-1");
    data.set("status", "CLOSED");
    data.set("maxStudents", "2");
    const result = await updateTopicAction("topic-1", { status: "idle" }, data);
    expect(result.status).toBe("error");
    if (result.status === "error") expect(result.fieldErrors?.maxStudents).toBeDefined();
  });
});
