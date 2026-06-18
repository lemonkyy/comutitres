"use client";

import {
  Bell,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileCheck,
  GitBranch,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/actions/button/button";
import Icon from "@/components/assets/icon";
import { useUser } from "@/contexts/user-context";
import { ApiClientError } from "@/lib/api/ApiClientError";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import type { User } from "@/utils/types";

type Kpi = {
  id: string;
  label: string;
  value: number;
  delta: string;
  deltaTone: "default" | "success" | "warning";
  icon: typeof Users;
  tone: "blue" | "violet" | "amber" | "green";
};

type PendingDocument = {
  id: string;
  name: string;
  type: string;
  submittedAt: string;
};

type RecentUser = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
};

const baseKpis: ReadonlyArray<Kpi> = [
  {
    id: "subscriptions",
    label: "Abonnements en cours",
    value: 978,
    delta: "+1 cette semaine",
    deltaTone: "success",
    icon: CreditCard,
    tone: "violet",
  },
  {
    id: "documents",
    label: "Documents en attente",
    value: 24,
    delta: "A traiter",
    deltaTone: "warning",
    icon: FileCheck,
    tone: "amber",
  },
  {
    id: "workflows",
    label: "Workflows actifs",
    value: 7,
    delta: "Stables",
    deltaTone: "default",
    icon: GitBranch,
    tone: "green",
  },
];

const pendingDocuments: ReadonlyArray<PendingDocument> = [
  {
    id: "d-1",
    name: "Lea Fontaine",
    type: "Certificat de scolarite",
    submittedAt: "16/06/2026",
  },
  {
    id: "d-2",
    name: "Amina Ouedraogo",
    type: "Attestation de bourse",
    submittedAt: "15/06/2026",
  },
  {
    id: "d-3",
    name: "Karim Benali",
    type: "Justificatif de domicile",
    submittedAt: "14/06/2026",
  },
  {
    id: "d-4",
    name: "Pierre Leroy",
    type: "Photo d'identite",
    submittedAt: "14/06/2026",
  },
];

const kpiToneClasses: Record<Kpi["tone"], { icon: string; card: string }> = {
  amber: {
    icon: "bg-[color-mix(in_srgb,var(--profil-junior)_20%,white)] text-[#a87e00]",
    card: "border-[color-mix(in_srgb,var(--profil-junior)_40%,transparent)]",
  },
  blue: {
    icon: "bg-accent text-primary",
    card: "border-[color-mix(in_srgb,var(--bleu-focus)_28%,transparent)]",
  },
  green: {
    icon: "bg-[color-mix(in_srgb,var(--profil-senior)_18%,white)] text-[var(--profil-senior)]",
    card: "border-[color-mix(in_srgb,var(--profil-senior)_40%,transparent)]",
  },
  violet: {
    icon: "bg-[color-mix(in_srgb,var(--profil-etudiant)_18%,white)] text-[var(--profil-etudiant)]",
    card: "border-[color-mix(in_srgb,var(--profil-etudiant)_38%,transparent)]",
  },
};

const deltaToneClasses: Record<Kpi["deltaTone"], string> = {
  default: "text-muted-foreground",
  success: "text-[var(--profil-senior)]",
  warning: "text-[#a87e00]",
};

const roleClassName =
  "rounded-full bg-[color-mix(in_srgb,var(--profil-annuel)_16%,white)] px-2 py-1 text-xs font-bold text-[var(--bleu-focus)]";

function buildDisplayName(user: User) {
  const fullName = [user.givenName, user.familyName].filter(Boolean).join(" ").trim();
  return fullName || user.email || "Utilisateur sans nom";
}

function buildInitials(user: User) {
  const givenNameInitial = user.givenName?.trim()?.[0] ?? "";
  const familyNameInitial = user.familyName?.trim()?.[0] ?? "";
  const initials = `${givenNameInitial}${familyNameInitial}`.toUpperCase();

  return initials || "US";
}

function getMainRole(user: User) {
  const [firstRole] = user.roles ?? [];
  if (!firstRole) return "user";
  return firstRole.replace("ROLE_", "").toLowerCase();
}

export default function AdministrationHomePage() {
  const { userList, getAll } = useUser();
  console.log(userList);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    if (userList !== null) {
      return;
    }

    let isMounted = true;

    getAll()
      .then((result) => {
        if (!isMounted) {
          return;
        }

        if (result instanceof ApiClientError) {
          setUsersError(result.message || "Impossible de recuperer les utilisateurs");
          return;
        }

        setUsersError(null);
      });

    return () => {
      isMounted = false;
    };
  }, [getAll, userList]);

  const isLoadingUsers = userList === null && usersError === null;
  const usersCount = userList?.length ?? 0;

  const kpis = useMemo<ReadonlyArray<Kpi>>(
    () => [
      {
        id: "users",
        label: "Utilisateurs",
        value: usersCount,
        delta: isLoadingUsers ? "Chargement..." : "Synchro API",
        deltaTone: isLoadingUsers ? "default" : "success",
        icon: Users,
        tone: "blue",
      },
      ...baseKpis,
    ],
    [isLoadingUsers, usersCount],
  );

  const displayedUsers = useMemo<ReadonlyArray<RecentUser>>(() => {
    if (!userList || userList.length === 0) {
      return [];
    }

    return userList.slice(0, 5).map((user) => ({
      id: user.id,
      initials: buildInitials(user),
      name: buildDisplayName(user),
      email: user.email ?? "Email non renseigne",
      role: getMainRole(user),
    }));
  }, [userList]);

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-4 border-b border-border/70 bg-card px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Back-office
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Tableau de bord Administration
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Plateforme Comutitres - vue d&apos;ensemble
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm" variant="outline">
                <Bell data-icon="inline-start" />
                Notifications
              </Button>
              <Button asChild size="sm">
                <Link href="/my-folder">
                  <FileCheck data-icon="inline-start" />
                  Documents
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-2 md:grid-cols-4 md:gap-4 md:p-6">
            {kpis.map((kpi) => (
              <Card
                className={kpiToneClasses[kpi.tone].card}
                key={kpi.id}
                padding="md"
                variant="outlined"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${kpiToneClasses[kpi.tone].icon}`}
                  >
                    <kpi.icon className="size-5 stroke-[1.75]" />
                  </span>
                  <span
                    className={`text-xs font-bold ${deltaToneClasses[kpi.deltaTone]}`}
                  >
                    {kpi.delta}
                  </span>
                </div>
                <p className="mt-4 text-3xl leading-none font-extrabold text-foreground">
                  {kpi.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {kpi.label}
                </p>
              </Card>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <h2 className="text-lg font-extrabold text-foreground">
                Documents a valider
              </h2>
              <Button asChild size="sm" variant="ghost">
                <Link href="/my-folder">
                  Voir tout
                  <ChevronRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>

            <div className="p-4 md:p-5">
              <div className="flex flex-col gap-2.5">
                {pendingDocuments.map((document) => (
                  <article
                    className="flex flex-col gap-2 rounded-xl bg-accent/55 p-3 sm:flex-row sm:items-center sm:justify-between"
                    key={document.id}
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {document.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {document.type}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="rounded-full bg-card px-2 py-1 text-xs font-semibold text-muted-foreground">
                        {document.submittedAt}
                      </span>
                      <span className="rounded-full bg-[color-mix(in_srgb,var(--profil-junior)_22%,white)] px-2.5 py-1 text-xs font-bold text-[#a87e00]">
                        En attente
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <Button className="mt-4 w-full" variant="secondary">
                <CheckCircle2 data-icon="inline-start" />
                Lancer la revue des documents
              </Button>
            </div>
          </Card>

          <Card padding="none">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <h2 className="text-lg font-extrabold text-foreground">
                Derniers inscrits
              </h2>
              <Button asChild size="sm" variant="ghost">
                <Link href="/settings">
                  Gestion comptes
                  <ChevronRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>

            <div className="p-4 md:p-5">
              {usersError ? (
                <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
                  {usersError}
                </p>
              ) : null}

              {isLoadingUsers && !userList ? (
                <p className="text-sm text-muted-foreground">Chargement des utilisateurs...</p>
              ) : null}

              {!isLoadingUsers && displayedUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun utilisateur disponible.</p>
              ) : null}

              <div className="flex flex-col gap-2.5">
                {displayedUsers.map((user) => (
                  <article
                    className="flex flex-col gap-3 rounded-xl bg-accent/45 p-3 sm:flex-row sm:items-center"
                    key={user.id}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
                      {user.initials}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={roleClassName}>{user.role}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-[linear-gradient(135deg,var(--bleu-moyen)_0%,color-mix(in_srgb,var(--bleu-clair)_72%,white)_100%)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <ShieldAlert className="size-5 stroke-[1.75]" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">
                  Espace administration Comutitres
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Le module utilisateurs est branche au contexte et charge la liste
                  depuis l&apos;API a l&apos;arrivee sur cette page.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/">
                  <Icon name="house" className="[&_svg]:size-4 [&_svg]:stroke-[1.9]" />
                  Retour appli
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
