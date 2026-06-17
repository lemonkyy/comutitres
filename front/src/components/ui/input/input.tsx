import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "flex h-12 w-full min-w-0 rounded-[6px] border border-input bg-input-background px-3 py-3 text-sm font-semibold leading-[21px] text-foreground shadow-none outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:border-[var(--bleu-focus)] focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:border-[var(--gris-moyen)] disabled:bg-[var(--gris-clair-40)] disabled:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
