import {
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
  XCircle,
} from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

type NoticeVariant = "default" | "warning" | "success" | "destructive";

const noticeClasses: Record<
  NoticeVariant,
  {
    container: string;
    icon: string;
    iconComponent: LucideIcon;
  }
> = {
  default: {
    container:
      "border-primary/20 bg-[color-mix(in_srgb,var(--bleu-moyen)_45%,white)]",
    icon: "bg-white text-primary shadow-[var(--idfm-card-shadow)]",
    iconComponent: Info,
  },
  warning: {
    container:
      "border-[color-mix(in_srgb,var(--orange-fonce)_30%,transparent)] bg-[color-mix(in_srgb,var(--orange-clair)_18%,white)]",
    icon: "bg-white text-[color-mix(in_srgb,var(--orange-fonce)_76%,var(--anthracite))] shadow-[var(--idfm-card-shadow)]",
    iconComponent: AlertTriangle,
  },
  success: {
    container:
      "border-[color-mix(in_srgb,var(--vert-fonce)_24%,transparent)] bg-[color-mix(in_srgb,var(--vert-clair)_14%,white)]",
    icon: "bg-white text-[var(--vert-fonce)] shadow-[var(--idfm-card-shadow)]",
    iconComponent: CheckCircle2,
  },
  destructive: {
    container:
      "border-destructive/24 bg-[color-mix(in_srgb,var(--rouge-clair)_11%,white)]",
    icon: "bg-white text-destructive shadow-[var(--idfm-card-shadow)]",
    iconComponent: XCircle,
  },
};

type NoticeProps = React.ComponentProps<"section"> & {
  action?: React.ReactNode;
  children: React.ReactNode;
  icon?: LucideIcon;
  title: string;
  variant?: NoticeVariant;
};

function Notice({
  action,
  children,
  className,
  icon,
  title,
  variant = "default",
  ...props
}: NoticeProps) {
  const tone = noticeClasses[variant];
  const Icon = icon ?? tone.iconComponent;

  return (
    <section
      data-slot="notice"
      className={cn(
        "grid gap-4 rounded-[6px] border p-4 text-foreground shadow-[0_1px_0_rgba(37,48,59,0.04)] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-5",
        tone.container,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-[6px]",
          tone.icon,
        )}
      >
        <Icon className="size-5 stroke-[1.9]" />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-bold leading-6 text-foreground">
          {title}
        </h2>
        <div className="mt-1 text-sm leading-5 text-muted-foreground">
          {children}
        </div>
      </div>
      {action ? <div className="sm:justify-self-end">{action}</div> : null}
    </section>
  );
}

export { Notice };
