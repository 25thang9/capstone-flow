import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { LecturerTopicForm } from "@/features/lecturer/components/lecturer-topic-form";
import { updateTopicAction } from "@/features/lecturer/topics/actions";
import { listTopicFormOptions } from "@/features/lecturer/topics/catalog";
import { getMyTopic } from "@/features/lecturer/topics/queries";

export const metadata: Metadata = { title: "Sửa đề tài" };

export default function EditLecturerTopicPage({ params }: PageProps<"/lecturer/topics/[id]/edit">) {
  return (
    <>
      <PageHeader
        title="Sửa đề tài"
        description="Thay đổi có hiệu lực ngay trong Kho đề tài sau khi lưu."
        crumbs={[{ label: "Đề tài của tôi", href: "/lecturer/topics" }, { label: "Sửa đề tài" }]}
      />
      <Suspense fallback={<Skeleton className="h-[40rem] w-full" />}>
        <EditTopicForm params={params} />
      </Suspense>
    </>
  );
}

async function EditTopicForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [topic, { departments, tags }] = await Promise.all([getMyTopic(id), listTopicFormOptions()]);
  if (!topic) notFound();

  return (
    <LecturerTopicForm
      action={updateTopicAction.bind(null, topic.id)}
      departments={departments}
      tags={tags}
      acceptedCount={topic._count.registrations}
      submitLabel="Lưu thay đổi"
      topic={{
        title: topic.title,
        description: topic.description,
        objectives: topic.objectives ?? "",
        requirements: topic.requirements ?? "",
        departmentId: topic.departmentId,
        maxStudents: topic.maxStudents,
        status: topic.status,
        tagIds: topic.tags.map((tag) => tag.id),
      }}
    />
  );
}
