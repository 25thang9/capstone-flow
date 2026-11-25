import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { respondAction } from "@/features/lecturer/registrations/actions";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/dal", () => ({ requireRole: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { $transaction: vi.fn() } }));

const findFirst = vi.fn();
const count = vi.fn();
const updateRegistration = vi.fn();
const updateTopic = vi.fn();
const transaction = prisma.$transaction as unknown as Mock;
const tx = {
  registration: { findFirst, count, update: updateRegistration },
  topic: { update: updateTopic },
};

function form(next: string, id = "reg-1", note = "") {
  const data = new FormData();
  data.set("registrationId", id);
  data.set("status", next);
  data.set("lecturerNote", note);
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireRole).mockResolvedValue({ id: "lecturer-1", role: "LECTURER" } as never);
  transaction.mockImplementation(async (work: (transaction: typeof tx) => Promise<unknown>) => work(tx));
  findFirst.mockResolvedValue({ status: "PENDING", topicId: "topic-1", topic: { maxStudents: 2 } });
  count.mockResolvedValue(0);
  updateRegistration.mockResolvedValue({});
  updateTopic.mockResolvedValue({});
});

describe("PR5: Server Action giảng viên nhận/từ chối đăng ký", () => {
  it("xác thực role và chỉ đọc đăng ký thuộc đề tài của giảng viên trong session", async () => {
    const result = await respondAction({ status: "idle" }, form("ACCEPTED"));
    expect(result.status).toBe("success");
    expect(requireRole).toHaveBeenCalledWith("LECTURER");
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "reg-1", topic: { lecturerId: "lecturer-1" } },
    }));
  });
  it("nhận sinh viên và tự đóng đề tài khi đủ số lượng", async () => {
    count.mockResolvedValue(1);
    const result = await respondAction({ status: "idle" }, form("ACCEPTED", "reg-1", "Chúc mừng"));
    expect(result.status).toBe("success");
    expect(updateRegistration).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "reg-1" },
      data: expect.objectContaining({ status: "ACCEPTED", lecturerNote: "Chúc mừng" }),
    }));
    expect(updateTopic).toHaveBeenCalledWith({ where: { id: "topic-1" }, data: { status: "CLOSED" } });
  });
  it("nhận khi còn chỗ không tự đóng đề tài", async () => {
    const result = await respondAction({ status: "idle" }, form("ACCEPTED"));
    expect(result.status).toBe("success");
    expect(updateTopic).not.toHaveBeenCalled();
  });
  it("từ chối đăng ký và không tăng số đã nhận", async () => {
    count.mockResolvedValue(2);
    const result = await respondAction({ status: "idle" }, form("REJECTED"));
    expect(result.status).toBe("success");
    expect(updateRegistration).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: "REJECTED" }),
    }));
    expect(updateTopic).not.toHaveBeenCalled();
  });
  it("không sửa đăng ký thuộc giảng viên khác", async () => {
    findFirst.mockResolvedValue(null);
    const result = await respondAction({ status: "idle" }, form("ACCEPTED", "reg-other"));
    expect(result.status).toBe("error");
    expect(updateRegistration).not.toHaveBeenCalled();
  });
  it("không nhận sinh viên nếu đã đủ chỗ", async () => {
    count.mockResolvedValue(2);
    const result = await respondAction({ status: "idle" }, form("ACCEPTED"));
    expect(result.status).toBe("error");
    expect(updateRegistration).not.toHaveBeenCalled();
  });
  it("không gửi phản hồi trùng trạng thái", async () => {
    findFirst.mockResolvedValue({ status: "ACCEPTED", topicId: "topic-1", topic: { maxStudents: 2 } });
    const result = await respondAction({ status: "idle" }, form("ACCEPTED"));
    expect(result.status).toBe("error");
    expect(updateRegistration).not.toHaveBeenCalled();
  });
  it("kiểm tra Zod trước khi thao tác với dữ liệu", async () => {
    const result = await respondAction({ status: "idle" }, form("ADMIN"));
    expect(result.status).toBe("error");
    expect(transaction).not.toHaveBeenCalled();
  });
});
