import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type TopicCapacity, getAvailability } from "@/features/registrations/rules";
import { type CurrentUser, getCurrentUser } from "@/lib/dal";

type TopicRegistrationBoxProps = {
  topicId: string;
  lecturerId: string;
  capacity: TopicCapacity;
};

type TopicRegistrationBoxViewProps = TopicRegistrationBoxProps & {
  user: CurrentUser | null;
};

export async function TopicRegistrationBox(props: TopicRegistrationBoxProps) {
  const user = await getCurrentUser();
  return <TopicRegistrationBoxView {...props} user={user} />;
}

export function TopicRegistrationBoxView({ topicId, lecturerId, capacity, user }: TopicRegistrationBoxViewProps) {
  const availability = getAvailability(capacity);

  if (user?.role === "LECTURER" && user.id === lecturerId) {
    return (
      <section aria-labelledby="registration-box-heading" className="rounded-lg border bg-card p-5">
        <h2 id="registration-box-heading" className="text-lg font-semibold">
          Đề tài của bạn
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn là giảng viên hướng dẫn đề tài này. Hãy quản lý đề tài và theo dõi sinh viên đăng ký trong khu giảng viên.
        </p>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href="/lecturer/topics">Quản lý đề tài</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (user && user.role !== "STUDENT") {
    return (
      <section aria-labelledby="registration-box-heading" className="rounded-lg border bg-card p-5">
        <h2 id="registration-box-heading" className="text-lg font-semibold">
          Chỉ dành cho sinh viên
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tài khoản giảng viên và quản trị viên không dùng để gửi đăng ký đề tài.
        </p>
      </section>
    );
  }

  if (availability === "FULL") {
    return (
      <section aria-labelledby="registration-box-heading" className="rounded-lg border bg-card p-5">
        <h2 id="registration-box-heading" className="text-lg font-semibold">
          Đề tài đã đủ sinh viên
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Giảng viên đã nhận đủ số lượng sinh viên cho đề tài này. Bạn hãy tham khảo các đề tài khác đang mở.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/topics">Xem đề tài khác</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (availability === "CLOSED") {
    return (
      <section aria-labelledby="registration-box-heading" className="rounded-lg border bg-card p-5">
        <h2 id="registration-box-heading" className="text-lg font-semibold">
          Đề tài đã đóng
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Giảng viên hiện không nhận thêm đăng ký mới cho đề tài này.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/topics">Xem đề tài đang nhận</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!user) {
    const next = encodeURIComponent(`/topics/${topicId}`);
    return (
      <section aria-labelledby="registration-box-heading" className="rounded-lg border bg-card p-5">
        <h2 id="registration-box-heading" className="text-lg font-semibold">
          Đăng ký đề tài
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Đăng nhập bằng tài khoản sinh viên để gửi đăng ký và theo dõi phản hồi của giảng viên.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button asChild>
            <Link href={`/login?next=${next}`}>Đăng nhập để đăng ký</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/register?next=${next}`}>Tạo tài khoản sinh viên</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="registration-box-heading" className="rounded-lg border bg-card p-5">
      <h2 id="registration-box-heading" className="text-lg font-semibold">
        Đăng ký đề tài
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Đề tài đang nhận sinh viên. Chức năng gửi đăng ký trực tuyến sẽ được tích hợp ở phân hệ Sinh viên.
      </p>
    </section>
  );
}
