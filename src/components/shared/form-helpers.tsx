"use client";

import { useEffect, useEffectEvent } from "react";
import { CircleAlertIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ActionState } from "@/lib/action-state";

export function useSuccessToast(state: ActionState, onSuccess?: () => void) {
  const handleSuccess = useEffectEvent(() => onSuccess?.());

  useEffect(() => {
    if (state.status !== "success") return;
    toast.success(state.message);
    handleSuccess();
  }, [state]);
}

export function useFocusFirstInvalid(state: ActionState, formRef: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state, formRef]);
}

export function FormError({ state }: { state: ActionState }) {
  if (state.status !== "error" || state.fieldErrors) return null;
  return (
    <Alert variant="destructive" role="alert" className="bg-danger-soft">
      <CircleAlertIcon aria-hidden="true" />
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}

export function fieldState(state: ActionState, name: string) {
  if (state.status !== "error") return { error: undefined, value: undefined };
  return { error: state.fieldErrors?.[name]?.[0], value: state.values?.[name] };
}
