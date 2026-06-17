"use client";

import { Check } from "lucide-react";
import type * as React from "react";
import { useId } from "react";

import { Card } from "@/components/ui/card/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type CardOptionTone =
  | "neutral"
  | "primary"
  | "profile"
  | "success"
  | "warning";

export type CardOptionLeadingState = {
  disabled: boolean;
  selected: boolean;
  tone: CardOptionTone;
};

export type CardOption = {
  description?: React.ReactNode;
  dir?: React.ComponentProps<"span">["dir"];
  disabled?: boolean;
  leading?:
    | React.ReactNode
    | ((state: CardOptionLeadingState) => React.ReactNode);
  title: React.ReactNode;
  tone?: CardOptionTone;
  value: string;
};

type RadioCardGroupProps = Omit<
  React.ComponentProps<typeof RadioGroup>,
  "onValueChange"
> & {
  invalid?: boolean;
  onValueChange?: (value: string) => void;
  options: CardOption[];
};

const selectedCardToneClasses: Record<CardOptionTone, string> = {
  neutral: "border-muted-foreground/45",
  primary: "border-primary",
  profile: "border-[var(--profil-etudiant)]",
  success: "border-[var(--profil-senior)]",
  warning: "border-[var(--accompagnement-moteur)]",
};

const indicatorToneClasses: Record<CardOptionTone, string> = {
  neutral: "bg-muted-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  profile: "bg-[var(--profil-etudiant)] text-primary-foreground",
  success: "bg-[var(--profil-senior)] text-primary-foreground",
  warning: "bg-[var(--accompagnement-moteur)] text-primary-foreground",
};

export function RadioCardGroup({
  className,
  disabled,
  id,
  invalid,
  onValueChange,
  options,
  value,
  ...props
}: RadioCardGroupProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;

  return (
    <RadioGroup
      aria-invalid={invalid || undefined}
      className={cn("flex flex-col gap-2", className)}
      disabled={disabled}
      id={id}
      onValueChange={(nextValue) => {
        const selectedOption = options.find(
          (option) => option.value === nextValue,
        );

        if (!selectedOption?.disabled) {
          onValueChange?.(nextValue);
        }
      }}
      value={value}
      {...props}
    >
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled;
        const optionId = getOptionId(groupId, option.value);
        const selected = value === option.value;
        const tone = option.tone ?? "primary";

        return (
          <Field
            className="gap-0"
            data-disabled={optionDisabled || undefined}
            data-invalid={invalid || undefined}
            key={option.value}
          >
            <RadioGroupItem
              aria-invalid={invalid || undefined}
              className="peer sr-only"
              disabled={optionDisabled}
              id={optionId}
              value={option.value}
            />
            <Card
              asChild
              className={cn(
                "rounded-[6px] border-2 shadow-[var(--idfm-card-shadow)] transition-[border-color,box-shadow,transform,opacity]",
                selected
                  ? selectedCardToneClasses[tone]
                  : "border-[var(--input)]",
                invalid && "border-destructive",
                optionDisabled &&
                  "border-[var(--gris-moyen)] bg-card shadow-none",
              )}
              padding="none"
              variant="flat"
            >
              <FieldLabel
                aria-disabled={optionDisabled || undefined}
                className={cn(
                  "min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-[6px] px-4 py-3 text-left transition-transform active:scale-[0.98] peer-disabled:opacity-100 group-data-[disabled=true]/field:opacity-100 peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/30",
                  optionDisabled && "cursor-not-allowed",
                )}
                dir={option.dir}
                htmlFor={optionId}
              >
                <span className="flex min-w-0 items-center gap-3">
                  {option.leading ? (
                    <span aria-hidden="true" className="shrink-0">
                      {renderLeading(option.leading, {
                        disabled: Boolean(optionDisabled),
                        selected,
                        tone,
                      })}
                    </span>
                  ) : null}
                  <span className="flex min-w-0 flex-col gap-1">
                    <span
                      className={cn(
                        "text-[0.9375rem] font-bold leading-tight text-foreground",
                        optionDisabled && "text-muted-foreground",
                        selected && tone === "primary" && "text-primary",
                        selected &&
                          tone === "profile" &&
                          "text-[var(--profil-etudiant)]",
                        selected &&
                          tone === "success" &&
                          "text-[var(--profil-senior)]",
                        selected &&
                          tone === "warning" &&
                          "text-[var(--accompagnement-moteur)]",
                      )}
                    >
                      {option.title}
                    </span>
                    {option.description ? (
                      <FieldDescription className="text-xs font-normal leading-snug text-muted-foreground">
                        {option.description}
                      </FieldDescription>
                    ) : null}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full transition-opacity",
                    indicatorToneClasses[tone],
                    !selected && "opacity-0",
                  )}
                >
                  <Check className="size-3.5 stroke-[2.5]" />
                </span>
              </FieldLabel>
            </Card>
          </Field>
        );
      })}
    </RadioGroup>
  );
}

function getOptionId(groupId: string, value: string) {
  return `${groupId}-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function renderLeading(
  leading: CardOption["leading"],
  state: CardOptionLeadingState,
) {
  return typeof leading === "function" ? leading(state) : leading;
}
