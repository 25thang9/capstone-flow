import { Suspense } from "react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { LecturerTopicForm } from "@/features/lecturer/components/lecturer-topic-form";
import { createTopicAction } from "@/features/lecturer/topics/actions";
import { listTopicFormOptions } from "@/features/lecturer/topics/catalog";
import { requireRole } from "@/lib/dal";

export const metadata: Metadata = { title: "Thêm đề tài" };

export default function NewLecturerTopicPage() {
  return (
    <>
      <PageHeader
        title="Đăng đề tài mới"
        description="Điền những gì sinh viên cần biết để quyết định đăng ký. Bạn sửa lại được bất cứ lúc nào."
        crumbs={[{ label: "Đề tài của tôi", href: "/lecturer/topics" }, { label: "Thêm đề tài" }]}
      />
      <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
        <NewTopicForm />
      </Suspense>
    </>
  );
}

async function NewTopicForm() {
  await requireRole("LECTURER");
  const { departments, tags } = await listTopicFormOptions();
  return (
    <LecturerTopicForm
      action={createTopicAction}
      departments={departments}
      tags={tags}
      submitLabel="Đăng đề tài"
    />
  );
}
