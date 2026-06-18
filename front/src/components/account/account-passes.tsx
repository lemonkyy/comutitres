import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Download,
  type LucideIcon,
  ReceiptText,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import type * as React from "react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type AccountPassSummary = {
  asset: string;
  description?: string;
  id: string;
  latestPaymentDate: string;
  name: string;
  paymentCount: string;
  totalPaid: string;
};

export type AccountPassPayment = {
  amount: string;
  date: string;
  id: string;
  invoiceHref?: string;
};

export type AccountPassesCopy = {
  downloadInvoiceLabel: string;
  emptyCtaLabel: string;
  emptyDescription: string;
  emptyTitle: string;
  errorDescription: string;
  errorTitle: string;
  invoiceLabel: string;
  latestPaymentLabel: string;
  noInvoiceLabel: string;
  paidStatusLabel: string;
  passListDescription: string;
  passListTitle: string;
  paymentAmountLabel: string;
  paymentDateLabel: string;
  paymentStatusLabel: string;
  paymentsTitle: string;
  selectedMissingDescription: string;
  selectedMissingTitle: string;
  summaryTitle: string;
  title: string;
  totalPaidLabel: string;
};

type AccountPassesProps = {
  copy: AccountPassesCopy;
  detailErrorMessage?: string;
  errorMessage?: string;
  passes: AccountPassSummary[];
  payments: AccountPassPayment[];
  selectedPassId?: string;
  selectedPassMissing?: boolean;
};

export function AccountPasses({
  copy,
  detailErrorMessage,
  errorMessage,
  passes,
  payments,
  selectedPassId,
  selectedPassMissing = false,
}: AccountPassesProps) {
  if (errorMessage) {
    return (
      <AccountPassesStatus
        description={errorMessage || copy.errorDescription}
        icon={AlertTriangle}
        title={copy.errorTitle}
      />
    );
  }

  if (!passes.length) {
    return (
      <AccountPassesStatus
        action={
          <Button asChild className="w-full sm:w-fit">
            <Link href="/passes">
              {copy.emptyCtaLabel}
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Link>
          </Button>
        }
        description={copy.emptyDescription}
        icon={Ticket}
        title={copy.emptyTitle}
      />
    );
  }

  const selectedPass =
    passes.find((pass) => pass.id === selectedPassId) ?? passes[0];

  return (
    <div className="grid gap-5">
      <section aria-labelledby="account-passes-list-title">
        <Card
          className="overflow-hidden border-[color-mix(in_srgb,var(--primary)_16%,transparent)] shadow-[var(--idfm-card-shadow)]"
          padding="none"
          variant="outlined"
        >
          <div className="border-b border-[color-mix(in_srgb,var(--primary)_12%,transparent)] bg-white p-5">
            <p className="text-sm font-bold leading-5 text-primary">
              {copy.title}
            </p>
            <h2
              className="mt-1 text-[1.375rem] font-bold leading-[30.8px] text-foreground"
              id="account-passes-list-title"
            >
              {copy.passListTitle}
            </h2>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              {copy.passListDescription}
            </p>
          </div>

          <div className="grid gap-2 bg-[color-mix(in_srgb,var(--bleu-clair)_56%,white)] p-3">
            {passes.map((pass) => (
              <AccountPassListItem
                current={pass.id === selectedPass.id && !selectedPassMissing}
                key={pass.id}
                pass={pass}
              />
            ))}
          </div>
        </Card>
      </section>

      {selectedPassMissing ? (
        <AccountPassesStatus
          description={copy.selectedMissingDescription}
          icon={AlertTriangle}
          title={copy.selectedMissingTitle}
        />
      ) : (
        <section aria-labelledby="account-pass-details-title">
          <Card
            className="overflow-hidden border-[color-mix(in_srgb,var(--primary)_16%,transparent)] shadow-[var(--idfm-card-shadow)]"
            padding="none"
            variant="outlined"
          >
            <div className="grid min-h-60 bg-[linear-gradient(145deg,var(--bleu-clair),white)] lg:grid-cols-[minmax(0,1fr)_19rem]">
              <div className="flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-6 lg:p-[30px]">
                <div className="min-w-0">
                  <div className="inline-flex min-h-9 items-center rounded-[6px] bg-white px-3 text-sm font-bold leading-5 text-primary shadow-[var(--idfm-card-shadow)]">
                    {copy.summaryTitle}
                  </div>
                  <h2
                    className="mt-4 text-balance text-[1.75rem] font-bold leading-[36.4px] text-foreground"
                    id="account-pass-details-title"
                  >
                    {selectedPass.name}
                  </h2>
                  {selectedPass.description ? (
                    <p className="mt-2 max-w-[36rem] text-pretty text-base leading-6 text-muted-foreground">
                      {selectedPass.description}
                    </p>
                  ) : null}
                </div>

                <dl className="grid overflow-hidden rounded-[6px] border border-[color-mix(in_srgb,var(--primary)_12%,transparent)] bg-white/85 shadow-[0_1px_0_rgba(37,48,59,0.04)] divide-y divide-[color-mix(in_srgb,var(--primary)_10%,transparent)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  <AccountPassMetric
                    label={copy.latestPaymentLabel}
                    value={selectedPass.latestPaymentDate}
                  />
                  <AccountPassMetric
                    label={copy.totalPaidLabel}
                    value={selectedPass.totalPaid}
                  />
                  <AccountPassMetric
                    label={copy.paymentsTitle}
                    value={selectedPass.paymentCount}
                  />
                </dl>
              </div>

              <div className="flex h-48 items-end justify-center overflow-hidden border-t border-[color-mix(in_srgb,var(--primary)_10%,transparent)] bg-[color-mix(in_srgb,var(--bleu-moyen)_62%,white)] px-6 pt-6 lg:h-auto lg:border-t-0 lg:border-l">
                <Image
                  alt=""
                  className="h-40 w-auto max-w-full object-contain object-bottom drop-shadow-[0_18px_28px_rgba(37,48,59,0.18)] lg:h-64"
                  height={220}
                  src={selectedPass.asset}
                  style={{ width: "auto" }}
                  unoptimized
                  width={260}
                />
              </div>
            </div>

            <div className="border-t border-[color-mix(in_srgb,var(--primary)_12%,transparent)] bg-white p-5 sm:p-6 lg:p-[30px]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-[1.375rem] font-bold leading-[30.8px] text-foreground">
                    {copy.paymentsTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {selectedPass.paymentCount}
                  </p>
                </div>
              </div>

              {detailErrorMessage ? (
                <div className="mt-5 rounded-[6px] border border-destructive/25 bg-[color-mix(in_srgb,var(--rouge-clair)_10%,white)] p-4 text-sm font-semibold leading-5 text-destructive">
                  {detailErrorMessage}
                </div>
              ) : null}

              <ol className="relative mt-5 grid gap-4 before:absolute before:top-5 before:bottom-5 before:left-[0.5625rem] before:w-px before:bg-[color-mix(in_srgb,var(--primary)_24%,transparent)]">
                {payments.map((payment, index) => (
                  <li
                    className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-4"
                    key={payment.id}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative z-10 mt-4 grid size-5 place-items-center rounded-full border-2 border-white bg-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--bleu-moyen)_74%,white)]",
                        index === 0
                          ? "bg-[var(--profil-senior)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--profil-senior)_18%,white)]"
                          : null,
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-white" />
                    </span>

                    <div className="grid gap-4 rounded-[6px] border border-[color-mix(in_srgb,var(--primary)_12%,transparent)] bg-[var(--gris-clair-40)] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex min-h-8 items-center gap-2 rounded-[6px] bg-white px-3 text-sm font-bold leading-5 text-[var(--profil-senior)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--profil-senior)_28%,transparent)]">
                            <ReceiptText
                              aria-hidden="true"
                              className="size-4 stroke-[1.75]"
                            />
                            {copy.paymentStatusLabel} · {copy.paidStatusLabel}
                          </span>
                        </div>

                        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                          <div className="min-w-0">
                            <dt className="flex items-center gap-2 text-sm font-semibold leading-5 text-muted-foreground">
                              <CalendarDays
                                aria-hidden="true"
                                className="size-4 stroke-[1.75]"
                              />
                              {copy.paymentDateLabel}
                            </dt>
                            <dd className="mt-1 text-base font-bold leading-6 text-foreground">
                              {payment.date}
                            </dd>
                          </div>
                          <div className="min-w-0">
                            <dt className="text-sm font-semibold leading-5 text-muted-foreground">
                              {copy.paymentAmountLabel}
                            </dt>
                            <dd className="mt-1 text-base font-bold leading-6 text-foreground">
                              {payment.amount}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {payment.invoiceHref ? (
                        <Button
                          asChild
                          className="w-full sm:w-fit"
                          variant="outline"
                        >
                          <a download href={payment.invoiceHref}>
                            <Download
                              aria-hidden="true"
                              data-icon="inline-start"
                            />
                            {copy.downloadInvoiceLabel}
                          </a>
                        </Button>
                      ) : (
                        <span className="inline-flex min-h-11 w-full items-center justify-center rounded-[6px] border border-[var(--gris-moyen)] bg-white px-3 text-sm font-bold leading-5 text-muted-foreground sm:w-fit">
                          {copy.noInvoiceLabel}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}

function AccountPassListItem({
  current,
  pass,
}: {
  current: boolean;
  pass: AccountPassSummary;
}) {
  return (
    <Link
      aria-current={current ? "page" : undefined}
      className={cn(
        "group grid min-h-36 grid-cols-[8.75rem_minmax(0,1fr)] gap-4 rounded-[6px] border border-transparent bg-white p-3 text-left outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-primary/30 hover:shadow-[var(--idfm-card-shadow-hover)] active:scale-[0.99] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25",
        current
          ? "border-primary/40 bg-[color-mix(in_srgb,var(--bleu-moyen)_48%,white)] shadow-[var(--idfm-card-shadow)]"
          : null,
      )}
      href={{
        pathname: "/account/passes",
        query: { pass: pass.id },
      }}
    >
      <span className="flex h-32 items-end justify-center overflow-hidden rounded-[6px] bg-[var(--bleu-clair)] px-2 pt-3">
        <Image
          alt=""
          className="h-28 w-auto max-w-full object-contain object-bottom transition-transform duration-150 group-hover:-translate-y-0.5"
          height={126}
          src={pass.asset}
          style={{ width: "auto" }}
          unoptimized
          width={180}
        />
      </span>

      <span className="min-w-0 self-center">
        <span className="block truncate text-base font-bold leading-6 text-foreground">
          {pass.name}
        </span>
        <span className="mt-1 block text-sm font-semibold leading-5 text-muted-foreground">
          {pass.paymentCount}
        </span>
        <span className="mt-1 block truncate text-sm leading-5 text-primary">
          {pass.latestPaymentDate}
        </span>
      </span>
    </Link>
  );
}

function AccountPassMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 p-3 sm:px-4">
      <dt className="text-xs font-bold leading-4 text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-bold leading-6 text-foreground md:text-lg md:leading-[27px]">
        {value}
      </dd>
    </div>
  );
}

function AccountPassesStatus({
  action,
  description,
  icon: Icon,
  title,
}: {
  action?: React.ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <Card
      className="overflow-hidden border-[color-mix(in_srgb,var(--primary)_16%,transparent)] shadow-[var(--idfm-card-shadow)]"
      padding="none"
      variant="outlined"
    >
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:p-[30px]">
        <div className="flex min-w-0 gap-4">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-[6px] bg-[color-mix(in_srgb,var(--bleu-moyen)_68%,white)] text-primary"
          >
            <Icon className="size-6 stroke-[1.75]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[1.375rem] font-bold leading-[30.8px] text-foreground">
              {title}
            </h2>
            <p className="mt-1 max-w-[38rem] text-base leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Card>
  );
}
