import "./globals.css";
import "./site.css";

export const metadata = {
  title: { default: "CapstoneFlow — Kho đề tài đồ án", template: "%s — CapstoneFlow" },
  description: "Tìm đề tài đồ án phù hợp và kết nối với giảng viên hướng dẫn.",
};

export default function RootLayout({ children }) {
  return <html lang="vi"><body>{children}</body></html>;
}
