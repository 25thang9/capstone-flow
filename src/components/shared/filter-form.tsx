"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { buildHref } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type FilterFormProps = {
  pathname: string;
  defaults?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
};

export function FilterForm({ pathname, defaults = {}, className, children }: FilterFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function apply(form: HTMLFormElement) {
    const params: Record<string, string> = {};
    for (const [key, value] of new FormData(form).entries()) {
      const text = String(value).trim();
      if (text && text !== defaults[key]) params[key] = text;
    }
    startTransition(() => router.push(buildHref(pathname, params)));
  }

  return (
    <form
      action={pathname}
      method="get"
      role="search"
      aria-busy={pending}
      className={cn("transition-opacity", pending && "opacity-60", className)}
      onSubmit={(event) => {
        event.preventDefault();
        apply(event.currentTarget);
      }}
      onChange={(event) => {
        if (event.target instanceof HTMLSelectElement) apply(event.currentTarget);
      }}
    >
      {children}
    </form>
  );
}
