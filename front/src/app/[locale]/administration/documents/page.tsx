"use client";

import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { useDocument } from "@/contexts/document-context";
import { Link } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type {
  DocumentEnum,
  DocumentProof,
  DocumentProofStatusEnum,
} from "@/utils/types";

const typeChipByValue: Record<
  DocumentEnum,
  { className: string; label: string }
> = {
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

export default function AdministrationDocumentsPage() {
  const locale = useLocale();
  const { allUsersDocuments, getAllUsersDocuments } = useDocument();
  const [documentsError, setDocumentsError] = useState<string | null>(null);

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
        setDocumentsError(
          result.message || "Impossible de recuperer les documents",
        );
        return;
      }

      setDocumentsError(null);
    });

    return () => {
      isMounted = false;
    };
  }, [allUsersDocuments, getAllUsersDocuments]);

  const sortedDocuments = useMemo(() => {
    if (!allUsersDocuments) {
      return [];
    }

    return [...allUsersDocuments].sort((left, right) => {
      const leftTime = getDateTime(left.uploadedAt);
      const rightTime = getDateTime(right.uploadedAt);

      return rightTime - leftTime;
    });
  }, [allUsersDocuments]);

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Documents utilisateurs
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Liste complete des documents et consultation detaillee.
              </p>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href="/administration">Retour au dashboard</Link>
            </Button>
          </div>

          <div className="p-4 md:p-6">
            {documentsError ? (
              <p className="mb-4 rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
                {documentsError}
              </p>
            ) : null}

            {!allUsersDocuments ? (
              <p className="text-sm text-muted-foreground">
                Chargement des documents...
              </p>
            ) : null}

            {allUsersDocuments && sortedDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun document disponible.
              </p>
            ) : null}

            <div className="flex flex-col gap-2.5">
              {sortedDocuments.map((document) => {
                const typeChip = typeChipByValue[document.type];
                const statusChip = statusChipByValue[document.status];

                return (
                  <article
                    className="flex flex-col gap-3 rounded-xl bg-accent/55 p-3 md:flex-row md:items-center md:justify-between"
                    key={document.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">
                        {formatUserName(document)}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {document.user?.email || "Email non renseigne"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${typeChip.className}`}
                      >
                        {typeChip.label}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusChip.className}`}
                      >
                        {statusChip.label}
                      </span>
                      <span className="rounded-full bg-card px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {formatDate(document.uploadedAt, locale)}
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={{
                            pathname: "/administration/documents/[documentId]",
                            params: { documentId: String(document.id) },
                          }}
                        >
                          Consulter
                        </Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

function getDateTime(value: string | null | undefined) {
  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}
