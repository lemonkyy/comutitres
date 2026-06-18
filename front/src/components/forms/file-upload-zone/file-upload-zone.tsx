"use client";

import { FileUp, UploadCloud } from "lucide-react";
import type * as React from "react";
import { useId } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

type FileUploadZoneProps = Omit<
  React.ComponentProps<"input">,
  "children" | "onChange" | "type" | "value"
> & {
  browseLabel: string;
  description?: string;
  errorMessage?: string;
  invalid?: boolean;
  label: string;
  onFileChange?: (file: File | null) => void;
  selectedFileMeta?: string;
  selectedFileName?: string;
};

function FileUploadZone({
  accept,
  browseLabel,
  className,
  description,
  disabled,
  errorMessage,
  id,
  invalid = false,
  label,
  onFileChange,
  selectedFileMeta,
  selectedFileName,
  ...props
}: FileUploadZoneProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasSelectedFile = Boolean(selectedFileName);

  return (
    <Field data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <label
        className={cn(
          "group grid min-h-40 cursor-pointer place-items-center rounded-[6px] border border-dashed border-[color-mix(in_srgb,var(--primary)_34%,transparent)] bg-[color-mix(in_srgb,var(--bleu-clair)_62%,white)] p-4 text-center outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-primary hover:bg-[color-mix(in_srgb,var(--bleu-moyen)_58%,white)] has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/25",
          disabled
            ? "cursor-not-allowed border-[var(--gris-moyen)] bg-[var(--gris-clair-40)] text-muted-foreground"
            : null,
          invalid ? "border-destructive ring-[3px] ring-destructive/20" : null,
          className,
        )}
      >
        <input
          accept={accept}
          aria-invalid={invalid || undefined}
          className="sr-only"
          disabled={disabled}
          id={inputId}
          onChange={(event) => {
            onFileChange?.(event.target.files?.[0] ?? null);
          }}
          type="file"
          {...props}
        />
        <span className="flex min-w-0 flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-12 place-items-center rounded-[6px] bg-white text-primary shadow-[var(--idfm-card-shadow)] transition-transform duration-150 group-hover:-translate-y-0.5",
              disabled ? "text-muted-foreground shadow-none" : null,
            )}
          >
            {hasSelectedFile ? (
              <FileUp className="size-6 stroke-[1.75]" />
            ) : (
              <UploadCloud className="size-6 stroke-[1.75]" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-base font-bold leading-6 text-foreground">
              {hasSelectedFile ? selectedFileName : browseLabel}
            </span>
            {selectedFileMeta ? (
              <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                {selectedFileMeta}
              </span>
            ) : null}
          </span>
        </span>
      </label>
      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </Field>
  );
}

export { FileUploadZone };
