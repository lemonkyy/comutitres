import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-8 w-fit max-w-full items-center gap-1.5 rounded-[6px] border px-2.5 py-1 text-sm font-bold leading-5",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-accent text-primary",
        neutral:
          "border-[color-mix(in_srgb,var(--anthracite)_14%,transparent)] bg-[var(--gris-clair-40)] text-muted-foreground",
        success:
          "border-[color-mix(in_srgb,var(--vert-fonce)_22%,transparent)] bg-[color-mix(in_srgb,var(--vert-clair)_16%,white)] text-[var(--vert-fonce)]",
        warning:
          "border-[color-mix(in_srgb,var(--orange-fonce)_28%,transparent)] bg-[color-mix(in_srgb,var(--orange-clair)_22%,white)] text-[color-mix(in_srgb,var(--orange-fonce)_72%,var(--anthracite))]",
        destructive:
          "border-destructive/20 bg-[color-mix(in_srgb,var(--rouge-clair)_12%,white)] text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
