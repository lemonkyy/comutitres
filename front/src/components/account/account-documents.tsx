"use client";

import { FileCheck2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  DocumentFileCard,
  type DocumentFileCardCopy,
  type DocumentFileCardFile,
} from "@/components/documents/document-file-card";
import { Notice } from "@/components/feedback/notice/notice";
import { Badge } from "@/components/ui/badge/badge";
import { Card } from "@/components/ui/card/card";
import { apiPaths } from "@/lib/api/paths";
import { normalizeMyDocuments } from "@/utils/documents";
import type {
  DocumentKind,
  DocumentProof,
  DocumentProofStatus,
  MyDocuments,
} from "@/utils/types";

export type AccountDocumentRequirement = {
  description: string;
  kind: DocumentKind;
  title: string;
};

export type AccountDocumentsCopy = {
  card: DocumentFileCardCopy;
  fileTooLargeError: string;
  infoNoticeDescription: string;
  infoNoticeTitle: string;
  invalidFileTypeError: string;
  introDescription: string;
  introTitle: string;
  loadErrorDescription: string;
  loadErrorTitle: string;
  requiredDocumentsLabel: string;
  statusSummaryLabels: {
    approved: string;
    pending: string;
    rejected: string;
  };
  submittedFileMeta: string;
  submittedFileName: string;
  successDescription: string;
  successTitle: string;
  title: string;
  uploadErrorMessage: string;
};

type AccountDocumentsProps = {
  copy: AccountDocumentsCopy;
  initialDocuments: MyDocuments;
  initialErrorMessage?: string;
  locale: string;
  requirements: AccountDocumentRequirement[];
};

type LocalFileSelection = DocumentFileCardFile & {
  file: File;
  objectUrl: string;
};

const maxFileSize = 8 * 1024 * 1024;
const acceptedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

export function AccountDocuments({
  copy,
  initialDocuments,
  initialErrorMessage,
  locale,
  requirements,
}: AccountDocumentsProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [errors, setErrors] = useState<Partial<Record<DocumentKind, string>>>(
    {},
  );
  const [selections, setSelections] = useState<
    Partial<Record<DocumentKind, LocalFileSelection>>
  >({});
  const [submittingKind, setSubmittingKind] = useState<DocumentKind | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const selectionsRef = useRef(selections);

  useEffect(() => {
    selectionsRef.current = selections;
  }, [selections]);

  useEffect(() => {
    return () => {
      for (const selection of Object.values(selectionsRef.current)) {
        if (selection?.objectUrl) {
          URL.revokeObjectURL(selection.objectUrl);
        }
      }
    };
  }, []);

  const summary = useMemo(
    () => getDocumentSummary(requirements, documents),
    [documents, requirements],
  );

  const handleFileChange = useCallback(
    (kind: DocumentKind, file: File | null) => {
      setSuccessMessage(null);

      setSelections((current) => {
        const previous = current[kind];

        if (previous?.objectUrl) {
          URL.revokeObjectURL(previous.objectUrl);
        }

        if (!file) {
          const next = { ...current };
          delete next[kind];
          return next;
        }

        const validationError = validateFile(file, copy);

        if (validationError) {
          setErrors((currentErrors) => ({
            ...currentErrors,
            [kind]: validationError,
          }));

          const next = { ...current };
          delete next[kind];
          return next;
        }

        setErrors((currentErrors) => {
          if (!(kind in currentErrors)) {
            return currentErrors;
          }

          const nextErrors = { ...currentErrors };
          delete nextErrors[kind];
          return nextErrors;
        });

        const objectUrl = URL.createObjectURL(file);

        return {
          ...current,
          [kind]: {
            downloadName: file.name,
            file,
            meta: formatFileSize(file.size, locale),
            name: file.name,
            objectUrl,
            url: objectUrl,
          },
        };
      });
    },
    [copy, locale],
  );

  const uploadDocument = useCallback(
    async (kind: DocumentKind) => {
      const selection = selections[kind];

      if (!selection || submittingKind) {
        return;
      }

      setSubmittingKind(kind);
      setSuccessMessage(null);

      try {
        const file = await readFileAsBase64(selection.file);
        const uploadResponse = await fetch(
          `/api/backend${apiPaths.document.upload}`,
          {
            body: JSON.stringify({ file, type: kind }),
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              "Accept-Language": locale,
              "Content-Language": locale,
              "Content-Type": "application/json",
            },
            method: "POST",
          },
        );

        if (!uploadResponse.ok) {
          throw new Error(await readApiErrorMessage(uploadResponse));
        }

        const refreshedDocuments = await fetchDocuments(locale);
        setDocuments(refreshedDocuments);
        setSuccessMessage(copy.successDescription);
        setSelections((current) => {
          const previous = current[kind];

          if (previous?.objectUrl) {
            URL.revokeObjectURL(previous.objectUrl);
          }

          const next = { ...current };
          delete next[kind];
          return next;
        });
        setErrors((current) => {
          if (!(kind in current)) {
            return current;
          }

          const next = { ...current };
          delete next[kind];
          return next;
        });
      } catch (error) {
        setErrors((current) => ({
          ...current,
          [kind]:
            error instanceof Error && error.message
              ? error.message
              : copy.uploadErrorMessage,
        }));
      } finally {
        setSubmittingKind(null);
      }
    },
    [copy, locale, selections, submittingKind],
  );

  return (
    <div className="grid gap-5">
      <Card
        className="overflow-hidden border-[color-mix(in_srgb,var(--primary)_16%,transparent)] shadow-[var(--idfm-card-shadow)]"
        padding="none"
        variant="outlined"
      >
        <div className="grid gap-5 bg-white p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:p-[30px]">
          <div className="min-w-0">
            <span className="inline-flex min-h-9 items-center rounded-[6px] bg-[color-mix(in_srgb,var(--bleu-moyen)_62%,white)] px-3 text-sm font-bold leading-5 text-primary">
              {copy.title}
            </span>
            <h2 className="mt-4 text-balance text-[1.75rem] font-bold leading-[36.4px] text-foreground">
              {copy.introTitle}
            </h2>
            <p className="mt-2 max-w-[42rem] text-pretty text-base leading-6 text-muted-foreground">
              {copy.introDescription}
            </p>
          </div>

          <dl className="grid content-start gap-2 rounded-[6px] border border-[color-mix(in_srgb,var(--primary)_12%,transparent)] bg-[var(--gris-clair-40)] p-4">
            <DocumentSummaryMetric
              label={copy.requiredDocumentsLabel}
              value={summary.missing.toString()}
            />
            <DocumentSummaryMetric
              label={copy.statusSummaryLabels.approved}
              value={summary.approved.toString()}
            />
            <DocumentSummaryMetric
              label={copy.statusSummaryLabels.pending}
              value={summary.pending.toString()}
            />
            <DocumentSummaryMetric
              label={copy.statusSummaryLabels.rejected}
              value={summary.rejected.toString()}
            />
          </dl>
        </div>
      </Card>

      <Notice icon={FileCheck2} title={copy.infoNoticeTitle}>
        {copy.infoNoticeDescription}
      </Notice>

      {initialErrorMessage ? (
        <Notice title={copy.loadErrorTitle} variant="destructive">
          {initialErrorMessage || copy.loadErrorDescription}
        </Notice>
      ) : null}

      {successMessage ? (
        <Notice title={copy.successTitle} variant="success">
          {successMessage}
        </Notice>
      ) : null}

      <section aria-labelledby="account-documents-title" className="grid gap-4">
        <h2 className="sr-only" id="account-documents-title">
          {copy.introTitle}
        </h2>
        {requirements.map((requirement) => {
          const document = documents[requirement.kind] ?? null;
          const status = getDocumentStatus(document);
          const file = getDocumentFile(document, requirement, copy);
          const selection = selections[requirement.kind];

          return (
            <DocumentFileCard
              copy={copy.card}
              description={requirement.description}
              disabled={Boolean(submittingKind)}
              errorMessage={errors[requirement.kind]}
              file={file}
              id={`account-${requirement.kind}`}
              isSubmitting={submittingKind === requirement.kind}
              key={requirement.kind}
              onFileChange={(file) => {
                handleFileChange(requirement.kind, file);
              }}
              onSubmit={() => {
                void uploadDocument(requirement.kind);
              }}
              selectedFile={selection}
              status={status}
              title={requirement.title}
            />
          );
        })}
      </section>
    </div>
  );
}

function DocumentSummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-border border-b pb-2 last:border-b-0 last:pb-0">
      <dt className="text-sm font-semibold leading-5 text-muted-foreground">
        {label}
      </dt>
      <dd>
        <Badge variant="default">{value}</Badge>
      </dd>
    </div>
  );
}

function getDocumentSummary(
  requirements: AccountDocumentRequirement[],
  documents: MyDocuments,
) {
  return requirements.reduce(
    (summary, requirement) => {
      const status = getDocumentStatus(documents[requirement.kind] ?? null);

      if (status === "approved") {
        summary.approved += 1;
      }

      if (status === "pending") {
        summary.pending += 1;
      }

      if (status === "rejected") {
        summary.rejected += 1;
      }

      if (status === "missing") {
        summary.missing += 1;
      }

      return summary;
    },
    { approved: 0, missing: 0, pending: 0, rejected: 0 },
  );
}

function getDocumentStatus(
  document: DocumentProof | null | undefined,
): DocumentProofStatus {
  const status = document?.status;

  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }

  return document ? "pending" : "missing";
}

function getDocumentFile(
  document: DocumentProof | null,
  requirement: AccountDocumentRequirement,
  copy: AccountDocumentsCopy,
): DocumentFileCardFile | undefined {
  if (!document?.id) {
    return undefined;
  }

  return {
    downloadName: `${requirement.title}.pdf`,
    meta: copy.submittedFileMeta,
    name: copy.submittedFileName.replace("%document%", requirement.title),
    url: `/api/backend${apiPaths.document.item.replace(
      ":id",
      encodeURIComponent(String(document.id)),
    )}`,
  };
}

function validateFile(file: File, copy: AccountDocumentsCopy) {
  if (file.size > maxFileSize) {
    return copy.fileTooLargeError;
  }

  if (file.type && !acceptedMimeTypes.has(file.type)) {
    return copy.invalidFileTypeError;
  }

  return null;
}

function formatFileSize(size: number, locale: string) {
  const isMegabyte = size >= 1024 * 1024;
  const value = size / (isMegabyte ? 1024 * 1024 : 1024);
  const formattedValue = new Intl.NumberFormat(locale, {
    maximumFractionDigits: size >= 1024 * 1024 ? 1 : 0,
    minimumFractionDigits: 0,
  }).format(value);

  return `${formattedValue} ${isMegabyte ? "Mo" : "Ko"}`;
}

async function fetchDocuments(locale: string): Promise<MyDocuments> {
  const response = await fetch(`/api/backend${apiPaths.document.mine}`, {
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Accept-Language": locale,
      "Content-Language": locale,
    },
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response));
  }

  return normalizeMyDocuments(await response.json());
}

async function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.includes(",") ? result.split(",")[1] : result);
    });
    reader.addEventListener("error", () => {
      reject(reader.error ?? new Error("File read failed."));
    });
    reader.readAsDataURL(file);
  });
}

async function readApiErrorMessage(response: Response) {
  const fallback = response.statusText || "Une erreur est survenue.";
  const body = await response.json().catch(() => null);

  if (body && typeof body === "object") {
    if ("message" in body && typeof body.message === "string") {
      return body.message;
    }

    if ("detail" in body && typeof body.detail === "string") {
      return body.detail;
    }
  }

  return fallback;
}
