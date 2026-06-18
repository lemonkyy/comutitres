import { ChevronLeft, CreditCard, Ticket } from "lucide-react";
import Image from "next/image";

import {
  DesktopPageHeader,
  PageHeader,
  PageHeaderIconButton,
} from "@/components/layout/page-header/page-header";
import { AudienceCard } from "@/components/passes/audience-card";
import { PassesAssistantCta } from "@/components/passes/passes-assistant-cta";
import type { PassesScreenCopy } from "@/components/passes/passes-config";
import {
  frequencyConfigs,
  profileConfigs,
} from "@/components/passes/passes-config";
import { PassesEmptyState } from "@/components/passes/passes-empty-state";
import { ProductCardsGrid } from "@/components/passes/product-cards-grid";
import { SectionHeading } from "@/components/passes/section-heading";
import { Card } from "@/components/ui/card/card";

export type {
  PassFrequencyId,
  PassProfileId,
  PassesScreenCopy,
} from "@/components/passes/passes-config";
export {
  passFrequencyIds,
  passProfileIds,
} from "@/components/passes/passes-config";

export function PassesScreen({
  copy,
  highlightedPassId,
}: {
  copy: PassesScreenCopy;
  highlightedPassId?: string | null;
}) {
  return (
    <main className="min-h-dvh bg-white pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <PageHeader
        backButton={
          <PageHeaderIconButton
            className="size-9 [--button-icon-size:1.125rem]"
            href="/"
            icon={ChevronLeft}
            label={copy.backLabel}
          />
        }
        className="border-[var(--gris-moyen)] md:hidden"
        subtitle={copy.subtitle}
        subtitleClassName="max-w-[42.5rem] truncate text-sm md:text-base"
        title={copy.title}
      />

      <DesktopPageHeader
        breadcrumbAriaLabel={copy.breadcrumbAriaLabel}
        breadcrumbs={[
          { href: "/", id: "home", label: copy.homeLabel },
          { id: "passes", label: copy.title },
        ]}
        subtitle={copy.subtitle}
        title={copy.title}
      />

      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-5 py-6 md:gap-12 md:py-10">
        <section className="grid gap-5 md:grid-cols-[minmax(0,1fr)_19rem] lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Card
            className="overflow-hidden bg-[var(--anthracite)] text-white"
            padding="none"
            variant="flat"
          >
            <div className="flex min-h-full flex-col justify-between gap-8 p-5 md:p-8">
              <div className="max-w-[34rem]">
                <span className="inline-flex size-12 items-center justify-center rounded-[6px] bg-white/12 text-white">
                  <Ticket aria-hidden="true" className="size-6" />
                </span>
                <h2 className="mt-5 text-balance text-[2rem] font-bold leading-[1.15] md:text-[2.5rem]">
                  {copy.heroCardTitle}
                </h2>
                <p className="mt-3 text-pretty text-base leading-6 text-white/90 md:text-lg md:leading-[27px]">
                  {copy.heroCardDescription}
                </p>
              </div>

              <PassesAssistantCta label={copy.assistantCtaLabel} />
            </div>
          </Card>

          <Card
            className="relative min-h-[18rem] overflow-hidden border-primary bg-[linear-gradient(145deg,var(--bleu-clair),var(--bleu-moyen))]"
            padding="none"
            variant="outlined"
          >
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <span className="inline-flex min-h-9 items-center rounded-[6px] bg-white/80 px-3 text-sm font-bold text-primary shadow-[var(--idfm-card-shadow)]">
                {copy.heroZoneLabel}
              </span>
              <CreditCard
                aria-hidden="true"
                className="size-8 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <Image
              alt=""
              className="absolute right-4 bottom-[-4.5rem] h-[24rem] w-auto rotate-[10deg] drop-shadow-[0_22px_30px_rgba(25,114,210,0.28)]"
              height={678}
              src="/assets/passes/passe-navigo.svg"
              unoptimized
              width={430}
            />
          </Card>
        </section>

        <section aria-labelledby="popular-passes-title" className="grid gap-5">
          <SectionHeading
            description={copy.allHeading}
            id="popular-passes-title"
            title={copy.popularHeading}
          />
          {copy.products.length > 0 ? (
            <ProductCardsGrid
              highlightedPassId={highlightedPassId}
              missingPriceLabel={copy.missingPriceLabel}
              products={copy.products}
              purchaseErrorMessage={copy.purchaseErrorMessage}
              purchaseLabel={copy.purchaseLabel}
              purchaseLoadingLabel={copy.purchaseLoadingLabel}
            />
          ) : (
            <PassesEmptyState
              description={copy.productsEmptyDescription}
              title={copy.productsEmptyTitle}
            />
          )}
        </section>

        <section aria-labelledby="frequency-title" className="grid gap-5">
          <SectionHeading id="frequency-title" title={copy.frequencyHeading} />
          <div className="grid gap-4 md:grid-cols-2">
            {frequencyConfigs.map((item) => (
              <AudienceCard
                copy={copy.frequencies[item.id]}
                item={item}
                key={item.id}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="profile-title" className="grid gap-5">
          <SectionHeading id="profile-title" title={copy.profileHeading} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profileConfigs.map((item) => (
              <AudienceCard
                copy={copy.profiles[item.id]}
                item={item}
                key={item.id}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
