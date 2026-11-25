import { describe, expect, it } from "vitest";
import { escapeCsvCell, toCsv } from "@/lib/csv";

describe("PR5: CSV xuất đăng ký giảng viên", () => {
  it("thêm BOM UTF-8 để Excel đọc tiếng Việt", () => {
    expect(toCsv(["Họ tên"], [["Trần Minh Khoa"]]).startsWith("\uFEFF")).toBe(true);
  });
  it("escape dấu phẩy, nháy kép, xuống dòng", () => {
    expect(escapeCsvCell('An, "Bình"')).toBe('"An, ""Bình"""');
  });
  it("chặn dữ liệu do sinh viên nhập bị Excel hiểu là công thức", () => {
    expect(escapeCsvCell("=1+1")).toBe("'=1+1");
  });
});
