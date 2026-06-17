import { MessageSquare } from "lucide-react";
import type * as React from "react";

import { Card } from "@/components/ui/card/card";
import { cn } from "@/lib/utils";

type MessagePrimitiveProps = Omit<React.ComponentProps<"article">, "role"> & {
  avatar?: React.ReactNode;
  avatarLabel?: string;
  sender: "assistant" | "user";
};

export type AssistantMessageProps = Omit<MessagePrimitiveProps, "sender">;
export type UserMessageProps = Omit<
  MessagePrimitiveProps,
  "avatar" | "avatarLabel" | "sender"
>;

export function AssistantMessage({
  avatar,
  avatarLabel = "Assistant",
  children,
  className,
  ...props
}: AssistantMessageProps) {
  return (
    <MessagePrimitive
      avatar={avatar}
      avatarLabel={avatarLabel}
      className={className}
      sender="assistant"
      {...props}
    >
      {children}
    </MessagePrimitive>
  );
}

export function UserMessage({
  children,
  className,
  ...props
}: UserMessageProps) {
  return (
    <MessagePrimitive className={className} sender="user" {...props}>
      {children}
    </MessagePrimitive>
  );
}

function MessagePrimitive({
  avatar,
  avatarLabel = "Assistant",
  children,
  className,
  sender,
  ...props
}: MessagePrimitiveProps) {
  const isAssistant = sender === "assistant";

  return (
    <article
      className={cn(
        "flex w-full gap-3",
        isAssistant ? "flex-row items-start" : "flex-col items-end",
        className,
      )}
      data-slot={`${sender}-message`}
      {...props}
    >
      {isAssistant ? (
        <span
          aria-label={avatarLabel}
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0.25rem_0.75rem_color-mix(in_srgb,var(--primary)_16%,transparent)]"
          role="img"
        >
          {avatar ?? <MessageSquare aria-hidden="true" className="size-4" />}
        </span>
      ) : null}

      <Card
        className={cn(
          "max-w-[78%] break-words text-[0.9375rem] leading-6 tracking-normal",
          isAssistant
            ? "rounded-[1.125rem] rounded-tl text-foreground"
            : "rounded-[1.125rem] rounded-tr bg-primary font-semibold text-primary-foreground shadow-none",
        )}
        padding="sm"
        variant={isAssistant ? "elevated" : "flat"}
      >
        {children}
      </Card>
    </article>
  );
}
