"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/action-state";

type ActionButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  action: () => Promise<ActionState>;
  pendingLabel?: string;
};

export function ActionButton({ action, pendingLabel = "Đang xử lý…", children, disabled, ...props }: ActionButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={pending || disabled}
      aria-busy={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await action();
          if (result.status === "success") toast.success(result.message);
          else if (result.status === "error") toast.error(result.message);
        })
      }
      {...props}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
