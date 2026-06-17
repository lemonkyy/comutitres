"use client";

import { Check } from "lucide-react";
import type * as React from "react";
import { useId } from "react";

import { Card } from "@/components/ui/card/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type {
  CardOption,
  CardOptionTone,
} from "../radio-card-group/radio-card-group";

type CheckboxCardGroupProps = Omit<
  React.ComponentProps<typeof FieldGroup>,
  "defaultValue" | "onChange"
> & {
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  onValueChange?: (value: string[]) => void;
  options: CardOption[];
  value: string[];
};

const selectedCardToneClasses: Record<CardOptionTone, string> = {
  neutral: "border-muted-foreground/45",
  primary: "border-primary",
  profile: "border-[var(--profil-etudiant)]",
  success: "border-[var(--profil-senior)]",
  warning: "border-[var(--accompagnement-moteur)]",
};

const indicatorToneClasses: Record<CardOptionTone, string> = {
  neutral: "border-[var(--gris-moyen)] bg-card text-transparent",
  primary: "border-primary bg-primary text-primary-foreground",
  profile:
    "border-[var(--profil-etudiant)] bg-[var(--profil-etudiant)] text-primary-foreground",
  success:
    "border-[var(--profil-senior)] bg-[var(--profil-senior)] text-primary-foreground",
  warning:
    "border-[var(--accompagnement-moteur)] bg-[var(--accompagnement-moteur)] text-primary-foreground",
};

export function CheckboxCardGroup({
  className,
  disabled,
  id,
  invalid,
  name,
  onValueChange,
  options,
  value,
  ...props
}: CheckboxCardGroupProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const selectedValues = new Set(value);

  return (
    <FieldGroup
      aria-invalid={invalid || undefined}
      className={cn("gap-2", className)}
      data-slot="checkbox-group"
      id={id}
      role="group"
      {...props}
    >
      {options.map((option) => {
        const optionDisabled = disabled || option.disabled;
        const optionId = getOptionId(groupId, option.value);
        const selected = selectedValues.has(option.value);
        const tone = option.tone ?? "primary";

        return (
          <Field
            className="gap-0"
            data-disabled={optionDisabled || undefined}
            data-invalid={invalid || undefined}
            key={option.value}
          >
            <Checkbox
              aria-invalid={invalid || undefined}
              checked={selected}
              className="peer sr-only"
              disabled={optionDisabled}
              id={optionId}
              name={name}
              onCheckedChange={(checked) => {
                if (!optionDisabled) {
                  onValueChange?.(
                    getNextValues({
                      checked: checked === true,
                      options,
                      selectedValues,
                      value: option.value,
                    }),
                  );
                }
              }}
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
                  "min-h-[4.625rem] w-full cursor-pointer items-center justify-between gap-3 rounded-[6px] px-4 py-4 text-left transition-transform active:scale-[0.98] peer-disabled:opacity-100 group-data-[disabled=true]/field:opacity-100 peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/30",
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
                        "text-sm font-bold leading-tight text-foreground",
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
                    "grid size-5 shrink-0 place-items-center rounded border-2 transition-colors",
                    selected
                      ? indicatorToneClasses[tone]
                      : indicatorToneClasses.neutral,
                  )}
                >
                  {selected ? <Check className="size-3 stroke-[2.5]" /> : null}
                </span>
              </FieldLabel>
            </Card>
          </Field>
        );
      })}
    </FieldGroup>
  );
}

function getNextValues({
  checked,
  options,
  selectedValues,
  value,
}: {
  checked: boolean;
  options: CardOption[];
  selectedValues: Set<string>;
  value: string;
}) {
  const nextValues = new Set(selectedValues);

  if (checked) {
    nextValues.add(value);
  } else {
    nextValues.delete(value);
  }

  return options
    .map((option) => option.value)
    .filter((optionValue) => nextValues.has(optionValue));
}

function getOptionId(groupId: string, value: string) {
  return `${groupId}-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function renderLeading(
  leading: CardOption["leading"],
  state: { disabled: boolean; selected: boolean; tone: CardOptionTone },
) {
  return typeof leading === "function" ? leading(state) : leading;
}
