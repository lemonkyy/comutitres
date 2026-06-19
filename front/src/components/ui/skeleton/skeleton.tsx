import type * as React from "react";

import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-[6px] bg-[color-mix(in_srgb,var(--primary)_10%,white)]",
        className,
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}
