"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { useUser } from "@/contexts/user-context";
import { Link } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/ApiClientError";

export default function AdministrationUsersPage() {
  const { userList, getAll } = useUser();
  const [usersError, setUsersError] = useState<string | null>(null);

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
        setUsersError(result.message || "Impossible de recuperer les utilisateurs");
        return;
      }

      setUsersError(null);
    });

    return () => {
      isMounted = false;
    };
  }, [getAll, userList]);

  const sortedUsers = useMemo(() => {
    if (!userList) {
      return [];
    }

    return [...userList].sort((left, right) => {
      const leftName = `${left.givenName || ""} ${left.familyName || ""}`.trim();
      const rightName = `${right.givenName || ""} ${right.familyName || ""}`.trim();

      return leftName.localeCompare(rightName);
    });
  }, [userList]);

  return (
    <main className="min-h-dvh bg-background px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <Card className="overflow-hidden" padding="none">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-foreground md:text-3xl">
                Utilisateurs
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Liste des comptes utilisateurs de la plateforme.
              </p>
            </div>

            <Button asChild size="sm" variant="outline">
              <Link href="/administration">Retour au dashboard</Link>
            </Button>
          </div>
        </Card>

        {usersError ? (
          <p className="rounded-xl bg-[color-mix(in_srgb,var(--destructive)_14%,white)] p-3 text-sm font-semibold text-destructive">
            {usersError}
          </p>
        ) : null}

        {!userList ? (
          <p className="text-sm text-muted-foreground">Chargement des utilisateurs...</p>
        ) : null}

        <Card padding="none">
          <div className="flex flex-col divide-y divide-border/70">
            {sortedUsers.map((user) => {
              const fullName = [user.givenName, user.familyName]
                .filter(Boolean)
                .join(" ")
                .trim();

              return (
                <article
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  key={user.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {fullName || "Utilisateur sans nom"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email || "Email non renseigne"}
                    </p>
                  </div>

                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-primary">
                    {(user.roles?.[0] || "ROLE_USER").replace("ROLE_", "").toLowerCase()}
                  </span>
                </article>
              );
            })}
          </div>
        </Card>
      </div>
    </main>
  );
}
