import type * as React from "react";

import { ProgressBar } from "@/components/feedback/progress-bar/progress-bar";
import { PageHeader } from "@/components/layout/page-header/page-header";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ChatProps = Omit<React.ComponentProps<"main">, "title"> & {
  action?: React.ReactNode;
  as?: "main" | "section";
  backButton?: React.ReactNode;
  footer?: React.ReactNode;
  layout?: "page" | "panel";
  progressLabel?: string;
  progressMax?: number;
  progressValue?: number;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
};

export function Chat({
  action,
  as: Component = "main",
  backButton,
  children,
  className,
  footer,
  layout = "page",
  progressLabel,
  progressMax = 100,
  progressValue,
  subtitle,
  title,
  ...props
}: ChatProps) {
  const isPanel = layout === "panel";

  return (
    <Component
      className={cn(
        isPanel
          ? "flex h-full min-h-0 w-full flex-col overflow-hidden bg-background"
          : "mx-auto flex h-dvh min-h-0 w-full max-w-md flex-col overflow-hidden bg-background md:max-w-4xl lg:max-w-5xl",
        className,
      )}
      data-slot="assistant-chat"
      {...props}
    >
      <PageHeader
        action={action}
        backButton={backButton}
        className={cn(
          "shrink-0 border-[color-mix(in_srgb,var(--anthracite)_10%,transparent)] px-4 pb-3",
          isPanel ? "pt-4" : "pt-12 md:px-8 md:pt-6 md:pb-4",
        )}
        contentClassName={cn("max-w-none gap-3", !isPanel && "md:gap-4")}
        subtitle={subtitle}
        subtitleClassName={cn("text-xs font-normal", !isPanel && "md:text-sm")}
        title={title}
        titleClassName={cn(
          "text-[0.9375rem] font-bold",
          !isPanel && "md:text-lg",
        )}
      >
        {typeof progressValue === "number" ? (
          <ProgressBar
            label={progressLabel}
            max={progressMax}
            value={progressValue}
          />
        ) : null}
      </PageHeader>

      <section
        aria-live="polite"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4",
          !isPanel && "md:gap-4 md:px-8 md:py-6",
        )}
        data-slot="assistant-chat-conversation"
      >
        {children}
      </section>

      {footer ? (
        <footer
          className="assistant-footer-motion shrink-0 bg-card"
          data-slot="assistant-chat-footer"
        >
          <Separator />
          <div className={cn("px-4 py-4", !isPanel && "md:px-8 md:py-5")}>
            {footer}
          </div>
        </footer>
      ) : null}
    </Component>
  );
}
