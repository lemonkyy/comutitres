"use client";

import { FileText } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { useApiClient } from "@/contexts/api-client";
import { useDocument } from "@/contexts/document-context";
import { Link } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { DocumentEnum, DocumentProof, DocumentProofStatusEnum } from "@/utils/types";

const typeChipByValue: Record<DocumentEnum, { className: string; label: string }> = {
  grant_certificate: {
    className:
      "bg-[color-mix(in_srgb,var(--profil-senior)_20%,white)] text-[var(--profil-senior)]",
    label: "Attestation de bourse",
  },
  identity_photo: {
    className: "bg-accent text-primary",
    label: "Photo d'identite",
  },
  proof_of_residence: {
    className:
      "bg-[color-mix(in_srgb,var(--profil-annuel)_18%,white)] text-[var(--bleu-focus)]",
    label: "Justificatif de domicile",
  },
  school_certificate: {
    className:
      "bg-[color-mix(in_srgb,var(--profil-etudiant)_18%,white)] text-[var(--profil-etudiant)]",
    label: "Certificat de scolarite",
  },
};

const statusChipByValue: Record<
  DocumentProofStatusEnum,
  { className: string; label: string }
> = {
  approved: {
    className:
      "bg-[color-mix(in_srgb,var(--profil-senior)_20%,white)] text-[var(--profil-senior)]",
    label: "Valide",
  },
  missing: {
    className: "bg-muted text-muted-foreground",
    label: "Manquant",
  },
  pending: {
    className:
      "bg-[color-mix(in_srgb,var(--profil-junior)_24%,white)] text-[#a87e00]",
    label: "En attente",
  },
  rejected: {
    className:
      "bg-[color-mix(in_srgb,var(--destructive)_16%,white)] text-destructive",
    label: "Refuse",
  },
};

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "Date inconnue";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function formatUserName(document: DocumentProof) {
  const fullName = [document.user?.givenName, document.user?.familyName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || document.user?.email || "Utilisateur inconnu";
}

export default function AdministrationDocumentDetailPage() {
  const locale = useLocale();
  const params = useParams<{ documentId: string }>();
  const documentId = params.documentId;
  const { apiClient } = useApiClient();
  const { allUsersDocuments, getAllUsersDocuments, updateDocumentStatus } =
    useDocument();
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (allUsersDocuments !== null) {
      return;
    }

    let isMounted = true;

    getAllUsersDocuments().then((result) => {
      if (!isMounted) {
        return;
      }

      if (result instanceof ApiClientError) {
        setDocumentsError(result.message || "Impossible de recuperer le document");
        return;
      }

      setDocumentsError(null);
    });

    return () => {
      isMounted = false;
    };
  }, [allUsersDocuments, getAllUsersDocuments]);

  const document = useMemo(() => {
    if (!allUsersDocuments) {
      return null;
    }

    return (
      allUsersDocuments.find(
        (item) => String(item.id) === String(documentId),
      ) ?? null
    );
  }, [allUsersDocuments, documentId]);

  const documentContentUrl = useMemo(() => {
    if (!document) {
      return null;
    }

    return apiClient.document.getDocumentContentUrl(String(document.id));
  }, [apiClient, document]);

  const handleStatusUpdate = async (status: DocumentProofStatusEnum) => {
    if (!document) {
      return;
    }

    setIsUpdatingStatus(true);
    setActionError(null);

    const result = await updateDocumentStatus(String(document.id), status);

    if (result instanceof ApiClientError) {
      setActionError(result.message || "Impossible de mettre a jour le statut.");
      setIsUpdatingStatus(false);
      return;
    }

    const refreshedDocuments = await getAllUsersDocuments();
    if (refreshedDocuments instanceof ApiClientError) {
      setActionError(
        refreshedDocuments.message ||
          "Statut mis a jour, mais impossible de rafraichir les documents.",
      );
    }

    setIsUpdatingStatus(false);
  };

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Consultation document
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Details du document selectionne.
              </p>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href="/administration/documents">Retour a la liste</Link>
            </Button>
          </div>
        </Card>

        {documentsError ? (
          <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
            {documentsError}
          </p>
        ) : null}

        {!allUsersDocuments ? (
          <p className="text-sm text-muted-foreground">Chargement du document...</p>
        ) : null}

        {allUsersDocuments && !document ? (
          <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            Document introuvable.
          </p>
        ) : null}

        {document ? (
          <Card>
            {(() => {
              const finalDecisionLabel =
                document.status === "approved"
                  ? "Approuvé"
                  : document.status === "rejected"
                    ? "Refusé"
                    : null;
              const finalDecisionClassName =
                document.status === "approved"
                  ? "bg-[color-mix(in_srgb,var(--profil-senior)_20%,white)] text-(--profil-senior)"
                  : "bg-[color-mix(in_srgb,var(--destructive)_16%,white)] text-destructive";

              return (
            <div className="flex flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                  <FileText className="size-5 stroke-[1.75]" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">Document #{document.id}</h2>
                  <p className="text-sm text-muted-foreground">
                    Consulte les informations techniques et metier.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {finalDecisionLabel ? (
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${finalDecisionClassName}`}>
                    {finalDecisionLabel}
                  </span>
                ) : (
                  <>
                    <Button
                      className="cursor-pointer disabled:cursor-not-allowed"
                      disabled={isUpdatingStatus}
                      onClick={() => {
                        void handleStatusUpdate("approved");
                      }}
                      size="sm"
                    >
                      Approuver
                    </Button>
                    <Button
                      className="cursor-pointer disabled:cursor-not-allowed"
                      disabled={isUpdatingStatus}
                      onClick={() => {
                        void handleStatusUpdate("rejected");
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      Refuser
                    </Button>
                  </>
                )}
                {isUpdatingStatus ? (
                  <span className="text-sm text-muted-foreground">
                    Mise a jour en cours...
                  </span>
                ) : null}
              </div>
            </div>
              );
            })()}

            {actionError ? (
              <p className="mt-3 rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
                {actionError}
              </p>
            ) : null}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-accent/45 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Utilisateur
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {formatUserName(document)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {document.user?.email || "Email non renseigne"}
                </p>
              </div>

              <div className="rounded-xl bg-accent/45 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Date d&apos;envoi
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {formatDate(document.uploadedAt, locale)}
                </p>
              </div>

              <div className="rounded-xl bg-accent/45 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Type
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${typeChipByValue[document.type].className}`}
                >
                  {typeChipByValue[document.type].label}
                </span>
              </div>

              <div className="rounded-xl bg-accent/45 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Statut
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusChipByValue[document.status].className}`}
                >
                  {statusChipByValue[document.status].label}
                </span>
              </div>
            </div>
            {documentContentUrl ? (
              <div className="mt-3">
                <Button asChild size="sm" variant="outline">
                  <a href={documentContentUrl} rel="noreferrer" target="_blank">
                    Ouvrir dans un nouvel onglet
                  </a>
                </Button>
              </div>
            ) : null}

            {documentContentUrl ? (
              <div className="mt-4 rounded-xl border border-border/70 bg-card p-2">
                <iframe
                  className="h-[70vh] w-full rounded-lg"
                  src={documentContentUrl}
                  title={`Document ${document.id}`}
                />
              </div>
            ) : null}
          </Card>
        ) : null}
      </div>
    </main>
  );
}
