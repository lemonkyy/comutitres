import { ArrowRight, ChevronLeft, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/actions/button/button";
import {
  DesktopPageHeader,
  PageHeader,
  PageHeaderIconButton,
} from "@/components/layout/page-header/page-header";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type PaymentResultTone = "error" | "success";

export type PaymentResultScreenCopy = {
  backLabel: string;
  breadcrumbAriaLabel: string;
  ctaLabel: string;
  description: string;
  homeLabel: string;
  invoiceCtaLabel?: string;
  passesLabel: string;
  purchaseAmountLabel?: string;
  purchaseDateLabel?: string;
  purchasePassLabel?: string;
  title: string;
};

export type PaymentResultPurchase = {
  amount: string;
  asset: string;
  date: string;
  invoiceHref?: string;
  passDescription?: string;
  passName: string;
};

type PaymentResultScreenProps = {
  copy: PaymentResultScreenCopy;
  icon: LucideIcon;
  purchase?: PaymentResultPurchase;
  tone: PaymentResultTone;
};

const toneClasses: Record<PaymentResultTone, string> = {
  error:
    "bg-[color-mix(in_srgb,var(--rouge-clair)_18%,white)] text-destructive",
  success:
    "bg-[color-mix(in_srgb,var(--profil-senior)_16%,white)] text-[var(--profil-senior)]",
};

export function PaymentResultScreen({
  copy,
  icon: Icon,
  purchase,
  tone,
}: PaymentResultScreenProps) {
  const purchaseDetails = tone === "success" ? purchase : undefined;

  return (
    <main className="min-h-dvh bg-white pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <PageHeader
        backButton={
          <PageHeaderIconButton
            className="size-9 [--button-icon-size:1.125rem]"
            href="/passes"
            icon={ChevronLeft}
            label={copy.backLabel}
          />
        }
        className="border-[var(--gris-moyen)] md:hidden"
        subtitle={copy.description}
        subtitleClassName="max-w-[42.5rem] text-sm md:text-base"
        title={copy.title}
      />

      <DesktopPageHeader
        breadcrumbAriaLabel={copy.breadcrumbAriaLabel}
        breadcrumbs={[
          { href: "/", id: "home", label: copy.homeLabel },
          { href: "/passes", id: "passes", label: copy.passesLabel },
          { id: "result", label: copy.title },
        ]}
        subtitle={copy.description}
        title={copy.title}
      />

      <div
        className={cn(
          "mx-auto grid w-full max-w-[1080px] gap-5 px-5 py-6 md:w-[calc(100%-2.5rem)] md:px-0 md:py-8",
          purchaseDetails
            ? "items-start lg:grid-cols-[minmax(0,32rem)_22rem] lg:justify-start lg:gap-6"
            : "items-start lg:grid-cols-[minmax(0,32rem)] lg:justify-start",
        )}
      >
        <Card
          className="flex min-w-0 flex-col gap-5 border-[var(--gris-moyen)] p-5 md:p-[30px]"
          variant="outlined"
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-14 place-items-center rounded-[6px]",
              toneClasses[tone],
            )}
          >
            <Icon className="size-7 stroke-[1.75]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-balance text-[1.75rem] font-bold leading-[36.4px] text-foreground">
              {copy.title}
            </h2>
            <p className="mt-2 max-w-[31rem] text-pretty text-base leading-6 text-muted-foreground md:text-lg md:leading-[27px]">
              {copy.description}
            </p>
          </div>
          <Button asChild className="w-full md:w-fit">
            <Link href="/passes">
              {copy.ctaLabel}
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Link>
          </Button>
        </Card>

        {purchaseDetails ? (
          <Card
            className="flex min-w-0 flex-col gap-5 overflow-hidden border-[color-mix(in_srgb,var(--profil-senior)_32%,var(--gris-moyen))]"
            padding="none"
            variant="outlined"
          >
            <div className="flex h-44 items-end justify-center overflow-hidden bg-[color-mix(in_srgb,var(--profil-senior)_13%,white)] px-5 pt-5">
              <Image
                alt=""
                className="h-36 w-auto max-w-full object-contain object-bottom drop-shadow-[0_16px_24px_rgba(37,48,59,0.18)]"
                height={180}
                src={purchaseDetails.asset}
                unoptimized
                width={240}
              />
            </div>

            <div className="flex flex-col gap-5 px-5 pb-5">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5 text-muted-foreground">
                  {copy.purchasePassLabel}
                </p>
                <h2 className="mt-1 text-[1.375rem] font-bold leading-[30.8px] text-foreground">
                  {purchaseDetails.passName}
                </h2>
                {purchaseDetails.passDescription ? (
                  <p className="mt-2 text-base leading-6 text-foreground">
                    {purchaseDetails.passDescription}
                  </p>
                ) : null}
              </div>

              <dl className="grid gap-3 border-[color-mix(in_srgb,var(--anthracite)_12%,transparent)] border-t pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm font-semibold leading-5 text-muted-foreground">
                    {copy.purchaseAmountLabel}
                  </dt>
                  <dd className="text-right text-base font-bold leading-6 text-foreground">
                    {purchaseDetails.amount}
                  </dd>
                </div>
                {purchaseDetails.date ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-sm font-semibold leading-5 text-muted-foreground">
                      {copy.purchaseDateLabel}
                    </dt>
                    <dd className="text-right text-sm font-semibold leading-5 text-foreground">
                      {purchaseDetails.date}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {purchaseDetails.invoiceHref ? (
                <Button asChild className="w-full" variant="outline">
                  <a download href={purchaseDetails.invoiceHref}>
                    {copy.invoiceCtaLabel}
                    <ArrowRight aria-hidden="true" data-icon="inline-end" />
                  </a>
                </Button>
              ) : null}
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
