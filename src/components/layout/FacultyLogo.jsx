"use client";

import { useState } from "react";

// Logo gốc trên website Khoa Vật lý. Ưu tiên file trong public/images/.
// Nếu chưa tải về máy, trình duyệt dùng ảnh từ trang chính thức.
const OFFICIAL_LOGO = "https://phys.hcmus.edu.vn/be/uploads/mirror/khoa-vat-ly/TUI_LA_NGU/1.LOGO_m%E1%BB%9Bi/Logo_Phys-blue.png";

export default function FacultyLogo({ className = "" }) {
  const [logoUrl, setLogoUrl] = useState("/images/logo-khoa-vat-ly.png");

  return (
    <img
      className={className}
      src={logoUrl}
      alt="Logo Khoa Vật lý - Vật lý kỹ thuật, HCMUS"
      loading="eager"
      onError={() => {
        if (logoUrl === "/images/logo-khoa-vat-ly.png") setLogoUrl(OFFICIAL_LOGO);
        else if (logoUrl === OFFICIAL_LOGO) setLogoUrl("/images/logo-khoa-du-phong.svg");
      }}
    />
  );
}
