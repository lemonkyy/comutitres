"use client";

import {
  LogOut,
  type LucideIcon,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { AuthPrompt, type AuthPromptCopy } from "@/components/auth/auth-prompt";
import { Card } from "@/components/ui/card/card";
import { useAuth } from "@/contexts/auth-context";
import type { Address, Me } from "@/utils/types";

export type AccountOverviewCopy = {
  authPrompt: AuthPromptCopy;
  detailsTitle: string;
  fields: {
    address: string;
    email: string;
    name: string;
  };
  loading: string;
  logoutLabel: string;
  missingAddress: string;
  missingName: string;
  sessionLabel: string;
  summary: string;
  title: string;
};

type AccountOverviewProps = {
  copy: AccountOverviewCopy;
};

export function AccountOverview({ copy }: AccountOverviewProps) {
  const { loading, logout, user } = useAuth();

  if (loading) {
    return <AccountOverviewSkeleton label={copy.loading} />;
  }

  if (!user) {
    return <AuthPrompt copy={copy.authPrompt} returnTo="/account" />;
  }

  const displayName = getUserDisplayName(user, copy.missingName);
  const addressLabel = getAddressLabel(user.address, copy.missingAddress);

  return (
    <Card
      className="overflow-hidden shadow-[var(--idfm-card-shadow)]"
      padding="none"
      variant="outlined"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="p-5 sm:p-6 lg:p-8">
          <p className="text-sm font-semibold leading-none text-primary">
            {copy.title}
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              aria-hidden="true"
              className="grid size-20 shrink-0 place-items-center rounded-[6px] bg-primary text-2xl font-bold leading-none text-primary-foreground"
            >
              {getUserInitials(user, copy.missingName)}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-[1.75rem] font-bold leading-[36.4px] tracking-normal text-foreground">
                {displayName}
              </h2>
              <p className="mt-2 max-w-[42rem] text-base font-normal leading-6 text-foreground">
                {copy.summary}
              </p>
            </div>
          </div>
        </section>

        <aside className="border-t bg-accent p-5 lg:border-t-0 lg:border-l lg:p-6">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[6px] bg-card px-3 py-2 text-sm font-semibold text-primary shadow-[inset_0_0_0_1px_var(--primary)]">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-4 stroke-[1.9]"
                />
                {copy.sessionLabel}
              </div>
              <p className="mt-4 break-all text-sm font-bold leading-relaxed text-foreground">
                {user.email || "-"}
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                void logout();
              }}
              type="button"
              variant="outline"
            >
              <LogOut data-icon="inline-start" />
              {copy.logoutLabel}
            </Button>
          </div>
        </aside>
      </div>

      <section className="border-t px-5 py-5 sm:px-6 lg:px-8 lg:py-7">
        <h3 className="text-[1.375rem] font-bold leading-[30.8px] text-foreground">
          {copy.detailsTitle}
        </h3>

        <dl className="mt-4 overflow-hidden rounded-[6px] border border-border bg-card">
          <AccountField
            icon={UserRound}
            label={copy.fields.name}
            value={displayName}
          />
          <AccountField
            icon={Mail}
            label={copy.fields.email}
            value={user.email || "-"}
          />
          <AccountField
            icon={MapPin}
            isMuted={!user.address}
            label={copy.fields.address}
            value={addressLabel}
          />
        </dl>
      </section>
    </Card>
  );
}

type AccountFieldProps = {
  icon: LucideIcon;
  isMuted?: boolean;
  label: string;
  value: string;
};

function AccountField({
  icon: Icon,
  isMuted = false,
  label,
  value,
}: AccountFieldProps) {
  return (
    <div className="grid gap-3 border-b border-border p-4 last:border-b-0 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:p-5">
      <dt className="flex min-w-0 items-center gap-3 text-sm font-semibold leading-tight text-muted-foreground">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-[6px] bg-muted text-primary"
        >
          <Icon className="size-5 stroke-[1.75]" />
        </span>
        <span className="min-w-0">{label}</span>
      </dt>
      <dd
        className={[
          "min-w-0 break-words text-base font-bold leading-relaxed",
          isMuted ? "text-muted-foreground" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function AccountOverviewSkeleton({ label }: { label: string }) {
  return (
    <Card
      aria-busy="true"
      className="overflow-hidden border-primary/10"
      padding="none"
      variant="outlined"
    >
      <span className="sr-only">{label}</span>
      <div className="grid animate-pulse lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="p-5 sm:p-6 lg:p-8">
          <div className="h-4 w-40 rounded-[6px] bg-muted" />
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="size-20 rounded-[6px] bg-muted" />
            <div className="min-w-0 flex-1">
              <div className="h-8 w-56 max-w-full rounded-[6px] bg-muted" />
              <div className="mt-3 h-4 w-full max-w-md rounded-[6px] bg-muted" />
              <div className="mt-2 h-4 w-3/5 rounded-[6px] bg-muted" />
            </div>
          </div>
        </section>

        <aside className="border-t bg-accent p-5 lg:border-t-0 lg:border-l lg:p-6">
          <div className="h-9 w-36 rounded-[6px] bg-card" />
          <div className="mt-4 h-4 w-full rounded-[6px] bg-card" />
          <div className="mt-8 h-11 w-full rounded-[6px] bg-card" />
        </aside>
      </div>

      <section className="border-t px-5 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="h-6 w-36 rounded-[6px] bg-muted" />
        <div className="mt-4 overflow-hidden rounded-[6px] border border-border">
          <div className="h-20 border-b bg-muted/70" />
          <div className="h-20 border-b bg-muted/70" />
          <div className="h-20 bg-muted/70" />
        </div>
      </section>
    </Card>
  );
}

function getUserDisplayName(user: Me, fallback: string) {
  const fullName = [user.givenName, user.familyName].filter(Boolean).join(" ");

  return fullName || user.email || fallback;
}

function getUserInitials(user: Me, fallback: string) {
  const source = getUserDisplayName(user, fallback);
  const parts = source.split(/[.\s@_-]+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase())
    .join("");

  return initials || fallback[0]?.toLocaleUpperCase() || "?";
}

function getAddressLabel(
  address: Address | string | null | undefined,
  fallback: string,
) {
  if (!address) {
    return fallback;
  }

  if (typeof address === "string") {
    return address;
  }

  return (
    [address.street, address.postalCode, address.city]
      .filter(Boolean)
      .join(", ") || fallback
  );
}
