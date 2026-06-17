import type * as React from "react";

import { ProgressBar } from "@/components/feedback/progress-bar/progress-bar";
import { PageHeader } from "@/components/layout/page-header/page-header";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ChatProps = Omit<React.ComponentProps<"main">, "title"> & {
  action?: React.ReactNode;
  backButton?: React.ReactNode;
  footer?: React.ReactNode;
  progressLabel: string;
  progressMax?: number;
  progressValue: number;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
};

export function Chat({
  action,
  backButton,
  children,
  className,
  footer,
  progressLabel,
  progressMax = 100,
  progressValue,
  subtitle,
  title,
  ...props
}: ChatProps) {
  return (
    <main
      className={cn(
        "mx-auto flex h-dvh min-h-0 w-full max-w-md flex-col overflow-hidden bg-background",
        className,
      )}
      data-slot="assistant-chat"
      {...props}
    >
      <PageHeader
        action={action}
        backButton={backButton}
        className="shrink-0 border-[color-mix(in_srgb,var(--anthracite)_10%,transparent)] px-4 pt-12 pb-3 md:px-4"
        contentClassName="max-w-none gap-3"
        subtitle={subtitle}
        subtitleClassName="text-xs font-normal"
        title={title}
        titleClassName="text-[0.9375rem] font-bold"
      >
        <ProgressBar
          label={progressLabel}
          max={progressMax}
          value={progressValue}
        />
      </PageHeader>

      <section
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
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
          <div className="px-4 py-4">{footer}</div>
        </footer>
      ) : null}
    </main>
  );
}
