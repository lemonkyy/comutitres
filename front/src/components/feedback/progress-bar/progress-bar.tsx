import type * as React from "react";

import { cn } from "@/lib/utils";

export type ProgressBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: string;
  max?: number;
  value: number;
};

export function ProgressBar({
  className,
  label = "Progression",
  max = 100,
  value,
  ...props
}: ProgressBarProps) {
  const progress = getProgressPercentage(value, max);

  return (
    <div
      aria-label={label}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value}
      className={cn("h-1.5 overflow-hidden rounded-[6px] bg-muted", className)}
      data-slot="progress-bar"
      role="progressbar"
      {...props}
    >
      <span
        className="assistant-progress-motion block h-full rounded-[6px] bg-primary"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function getProgressPercentage(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / max) * 100));
}
