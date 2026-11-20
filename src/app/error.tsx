"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Đã có lỗi xảy ra</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Hệ thống chưa tải được dữ liệu. Bạn thử lại sau ít phút; nếu vẫn lỗi, hãy báo cho nhóm phát triển
        {error.digest ? ` kèm mã ${error.digest}` : ""}.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Thử lại
      </Button>
    </div>
  );
}
