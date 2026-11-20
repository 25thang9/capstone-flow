import { z } from "zod";

export type ActionState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
      values?: Record<string, string>;
    };

export const idleState: ActionState = { status: "idle" };

export function success(message: string): ActionState {
  return { status: "success", message };
}

export function failure(message: string, formData?: FormData): ActionState {
  return { status: "error", message, values: formData ? formValues(formData) : undefined };
}

export function validationFailure(error: z.ZodError, formData: FormData): ActionState {
  return {
    status: "error",
    message: "Vui lòng kiểm tra lại các ô được đánh dấu.",
    fieldErrors: z.flattenError(error).fieldErrors,
    values: formValues(formData),
  };
}

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || key.toLowerCase().includes("password")) continue;
    values[key] = key in values ? `${values[key]},${value}` : value;
  }
  return values;
}
