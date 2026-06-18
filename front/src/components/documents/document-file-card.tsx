"use client";

import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileQuestion,
  FileText,
  LoaderCircle,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { DocumentViewerDialog } from "@/components/documents/document-viewer-dialog";
import { FileUploadZone } from "@/components/forms/file-upload-zone/file-upload-zone";
import { Badge } from "@/components/ui/badge/badge";
import { Card } from "@/components/ui/card/card";
import { cn } from "@/lib/utils";
import type { DocumentProofStatus } from "@/utils/types";

export type DocumentFileCardCopy = {
  acceptedFormatsLabel: string;
  browseLabel: string;
  downloadLabel: string;
  replaceLabel: string;
  statusLabels: Record<DocumentProofStatus, string>;
  submitLabel: string;
  submittingLabel: string;
  unavailableFileLabel: string;
  uploadLabel: string;
  viewDialogDescription: string;
  viewLabel: string;
};

export type DocumentFileCardFile = {
  downloadName?: string;
  meta?: string;
  name: string;
  url?: string;
};

type DocumentFileCardProps = {
  copy: DocumentFileCardCopy;
  description: string;
  disabled?: boolean;
  errorMessage?: string;
  file?: DocumentFileCardFile;
  id: string;
  isSubmitting?: boolean;
  onFileChange: (file: File | null) => void;
  onSubmit: () => void;
  selectedFile?: DocumentFileCardFile;
  status: DocumentProofStatus;
  title: string;
};

const statusVariants: Record<
  DocumentProofStatus,
  "destructive" | "neutral" | "success" | "warning"
> = {
  approved: "success",
  missing: "neutral",
  pending: "warning",
  rejected: "destructive",
};

const statusIcons = {
  approved: CheckCircle2,
  missing: FileQuestion,
  pending: Clock3,
  rejected: XCircle,
} satisfies Record<DocumentProofStatus, typeof CheckCircle2>;

function DocumentFileCard({
  copy,
  description,
  disabled = false,
  errorMessage,
  file,
  id,
  isSubmitting = false,
  onFileChange,
  onSubmit,
  selectedFile,
  status,
  title,
}: DocumentFileCardProps) {
  const visibleFile = selectedFile ?? file;
  const hasSelectedFile = Boolean(selectedFile);
  const showUploadControls =
    status === "missing" || status === "rejected" || hasSelectedFile;
  const StatusIcon = statusIcons[status];
  const inputId = `${id}-file`;

  return (
    <Card
      className={cn(
        "overflow-hidden border-[color-mix(in_srgb,var(--primary)_16%,transparent)] shadow-[var(--idfm-card-shadow)]",
        status === "rejected"
          ? "border-[color-mix(in_srgb,var(--rouge-fonce)_24%,var(--gris-moyen))]"
          : null,
      )}
      padding="none"
      variant="outlined"
    >
      <div
        className={cn(
          "grid gap-5 p-5 sm:p-6 lg:p-[30px]",
          showUploadControls ? "lg:grid-cols-[minmax(0,1fr)_18rem]" : null,
        )}
      >
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-[1.375rem] font-bold leading-[30.8px] text-foreground">
                {title}
              </h2>
              <p className="mt-2 text-pretty text-base leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

            <Badge className="shrink-0" variant={statusVariants[status]}>
              <StatusIcon aria-hidden="true" className="size-4" />
              {copy.statusLabels[status]}
            </Badge>
          </div>

          <div className="mt-5 rounded-[6px] border border-[color-mix(in_srgb,var(--primary)_12%,transparent)] bg-[var(--gris-clair-40)] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-[6px] bg-white text-primary shadow-[var(--idfm-card-shadow)]"
                >
                  <FileText className="size-5 stroke-[1.75]" />
                </span>
                <div className="min-w-0">
                  <p className="break-words text-base font-bold leading-6 text-foreground">
                    {visibleFile?.name ?? copy.unavailableFileLabel}
                  </p>
                  {visibleFile?.meta ? (
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {visibleFile.meta}
                    </p>
                  ) : null}
                </div>
              </div>

              {visibleFile ? (
                <div className="grid gap-2 sm:flex sm:shrink-0">
                  {visibleFile.url ? (
                    <DocumentViewerDialog
                      description={copy.viewDialogDescription}
                      title={title}
                      url={visibleFile.url}
                    >
                      <Button type="button" variant="outline">
                        <Eye aria-hidden="true" data-icon="inline-start" />
                        {copy.viewLabel}
                      </Button>
                    </DocumentViewerDialog>
                  ) : (
                    <Button disabled type="button" variant="outline">
                      <Eye aria-hidden="true" data-icon="inline-start" />
                      {copy.viewLabel}
                    </Button>
                  )}
                  {visibleFile.url ? (
                    <Button asChild variant="outline">
                      <a
                        download={visibleFile.downloadName}
                        href={visibleFile.url}
                      >
                        <Download aria-hidden="true" data-icon="inline-start" />
                        {copy.downloadLabel}
                      </a>
                    </Button>
                  ) : (
                    <Button disabled type="button" variant="outline">
                      <Download aria-hidden="true" data-icon="inline-start" />
                      {copy.downloadLabel}
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {showUploadControls ? (
          <div className="grid min-w-0 content-start gap-3">
            <FileUploadZone
              accept="application/pdf,image/png,image/jpeg"
              browseLabel={copy.browseLabel}
              description={copy.acceptedFormatsLabel}
              disabled={disabled || isSubmitting}
              errorMessage={errorMessage}
              id={inputId}
              invalid={Boolean(errorMessage)}
              label={
                status === "missing" ? copy.uploadLabel : copy.replaceLabel
              }
              onFileChange={onFileChange}
              selectedFileMeta={selectedFile?.meta}
              selectedFileName={selectedFile?.name}
            />
            <Button
              aria-busy={isSubmitting ? "true" : undefined}
              disabled={disabled || isSubmitting || !hasSelectedFile}
              onClick={onSubmit}
              type="button"
            >
              {isSubmitting ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  data-icon="inline-start"
                />
              ) : (
                <FileText aria-hidden="true" data-icon="inline-start" />
              )}
              {isSubmitting ? copy.submittingLabel : copy.submitLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export { DocumentFileCard };
