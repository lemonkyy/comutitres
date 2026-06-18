"use client";

import { Eye, UserRound } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { useInvoice } from "@/contexts/invoice-context";
import { useUser } from "@/contexts/user-context";
import { Link } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { Purchase } from "@/utils/types";

function formatFullName(givenName?: string | null, familyName?: string | null) {
  const fullName = [givenName, familyName].filter(Boolean).join(" ").trim();
  return fullName || "Utilisateur sans nom";
}

export default function AdministrationUserDetailPage() {
  const locale = useLocale();
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const { userList, getAll } = useUser();
  const { getInvoicePdfUrl, getUserInvoices } = useInvoice();
  const [usersError, setUsersError] = useState<string | null>(null);
  const [invoicesByUserId, setInvoicesByUserId] = useState<{
    userId: string;
    invoices: Purchase[];
  } | null>(null);
  const [invoiceErrorByUserId, setInvoiceErrorByUserId] = useState<{
    userId: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (userList !== null) {
      return;
    }

    let isMounted = true;

    getAll().then((result) => {
      if (!isMounted) {
        return;
      }

      if (result instanceof ApiClientError) {
        setUsersError(result.message || "Impossible de recuperer l'utilisateur");
        return;
      }

      setUsersError(null);
    });

    return () => {
      isMounted = false;
    };
  }, [getAll, userList]);

  useEffect(() => {
    let isMounted = true;

    getUserInvoices(userId).then((result) => {
      if (!isMounted) {
        return;
      }

      if (result instanceof ApiClientError) {
        setInvoiceErrorByUserId({
          userId: String(userId),
          message: result.message || "Impossible de recuperer les factures",
        });
        return;
      }

      setInvoiceErrorByUserId(null);
      setInvoicesByUserId({
        userId: String(userId),
        invoices: result,
      });
    });

    return () => {
      isMounted = false;
    };
  }, [getUserInvoices, userId]);

  const currentInvoices = useMemo<Purchase[] | null>(() => {
    if (!invoicesByUserId) {
      return null;
    }

    return invoicesByUserId.userId === String(userId)
      ? invoicesByUserId.invoices
      : null;
  }, [invoicesByUserId, userId]);

  const invoicesError = useMemo<string | null>(() => {
    if (!invoiceErrorByUserId) {
      return null;
    }

    return invoiceErrorByUserId.userId === String(userId)
      ? invoiceErrorByUserId.message
      : null;
  }, [invoiceErrorByUserId, userId]);

  const user = useMemo(() => {
    if (!userList) {
      return null;
    }

    return userList.find((item) => String(item.id) === String(userId)) ?? null;
  }, [userId, userList]);

  const latestInvoices = useMemo<ReadonlyArray<Purchase>>(() => {
    if (!currentInvoices) {
      return [];
    }

    return [...currentInvoices].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  }, [currentInvoices]);

  const euroFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
      }),
    [locale],
  );

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
                Consultation utilisateur
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Détails du compte utilisateur sélectionné.
              </p>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href="/administration/utilisateurs">Retour à la liste</Link>
            </Button>
          </div>
        </Card>

        {usersError ? (
          <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
            {usersError}
          </p>
        ) : null}

        {!userList ? (
          <p className="text-sm text-muted-foreground">
            Chargement de l&apos;utilisateur...
          </p>
        ) : null}

        {userList && !user ? (
          <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            Utilisateur introuvable.
          </p>
        ) : null}

        {user ? (
          <>
            <Card>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                  <UserRound className="size-5 stroke-[1.75]" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground">
                    {formatFullName(user.givenName, user.familyName)}
                  </h2>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-accent/45 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {user.email || "Email non renseigné"}
                  </p>
                </div>

                <div className="rounded-xl bg-accent/45 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Rôles
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {(user.roles?.length ? user.roles : ["ROLE_USER"]).map((role) => (
                      <span
                        className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary"
                        key={role}
                      >
                        {role.replace("ROLE_", "")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-accent/45 p-3 md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    Adresse
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {typeof user.address === "string"
                      ? user.address
                      : user.address?.street || "Adresse non renseignée"}
                  </p>
                </div>
              </div>
            </Card>

            <Card padding="none">
              <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
                <h2 className="text-lg font-extrabold text-foreground">
                  Dernières factures
                </h2>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary">
                  {latestInvoices.length}
                </span>
              </div>
              <div className="p-4 md:p-5">
                {invoicesError ? (
                  <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
                    {invoicesError}
                  </p>
                ) : null}

                {!currentInvoices ? (
                  <p className="text-sm text-muted-foreground">
                    Chargement des factures...
                  </p>
                ) : null}

                {currentInvoices && latestInvoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucune facture disponible.
                  </p>
                ) : null}

                <div className="flex flex-col gap-2.5">
                  {latestInvoices.map((invoice) => (
                    <article
                      className="flex flex-col gap-2 rounded-xl bg-accent/45 p-3 sm:flex-row sm:items-center sm:justify-between"
                      key={invoice.id}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">
                          {invoice.pass.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {invoice.invoiceId
                            ? `Reference: #${invoice.invoiceId}`
                            : "Reference indisponible"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-card px-2 py-1 text-xs font-semibold text-muted-foreground">
                          {euroFormatter.format(invoice.total)}
                        </span>
                        {invoice.invoiceId ? (
                          <span className="rounded-full bg-[color-mix(in_srgb,var(--profil-senior)_16%,white)] px-2.5 py-1 text-xs font-bold text-(--profil-senior)">
                            {new Intl.DateTimeFormat(locale, {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(new Date(invoice.createdAt))}
                          </span>
                        ) : null}
                        {invoice.invoiceId ? (
                          <Button
                            onClick={() =>
                              window.open(
                                getInvoicePdfUrl(invoice.invoiceId ?? invoice.id),
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                            size="sm"
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                          >
                            <Eye className="size-4" />
                            Consulter PDF
                          </Button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </main>
  );
}
