import type * as React from "react";

import { Button } from "@/components/actions/button/button";
import { FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type ChoicePillOption = {
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
};

export type ChoicePillProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "variant"
>;

export type ChoicePillGroupProps = Omit<
  React.ComponentProps<typeof FieldSet>,
  "children"
> & {
  ariaLabel: string;
  disabled?: boolean;
  onValueSelect?: (value: string) => void;
  options: ChoicePillOption[];
};

export function ChoicePill({
  children,
  className,
  type = "button",
  ...props
}: ChoicePillProps) {
  return (
    <Button
      className={cn(
        "max-w-full shrink rounded-full bg-card font-semibold leading-tight whitespace-normal shadow-none hover:bg-muted",
        className,
      )}
      data-slot="choice-pill"
      type={type}
      variant="outline"
      {...props}
    >
      {children}
    </Button>
  );
}

export function ChoicePillGroup({
  ariaLabel,
  className,
  disabled,
  onValueSelect,
  options,
  ...props
}: ChoicePillGroupProps) {
  return (
    <FieldSet
      aria-label={ariaLabel}
      className={cn("flex-row flex-wrap gap-3", className)}
      data-slot="choice-pill-group"
      {...props}
    >
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled;

        return (
          <ChoicePill
            disabled={optionDisabled}
            key={option.value}
            onClick={() => {
              if (!optionDisabled) {
                onValueSelect?.(option.value);
              }
            }}
          >
            {option.label}
          </ChoicePill>
        );
      })}
    </FieldSet>
  );
}
