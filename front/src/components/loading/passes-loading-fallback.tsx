import { CreditCard, Ticket } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card/card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

export function PassesLoadingFallback() {
  return (
    <main
      aria-busy="true"
      className="min-h-dvh bg-white pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      <span className="sr-only">Chargement</span>

      <header className="border-b border-[var(--gris-moyen)] bg-white px-5 pt-8 pb-5 md:hidden">
        <div className="flex min-w-0 items-center gap-6">
          <Skeleton className="size-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-8 w-52 max-w-full" />
            <Skeleton className="mt-2 h-4 w-64 max-w-full" />
          </div>
        </div>
      </header>

      <header className="hidden bg-white px-5 pt-10 pb-4 md:block">
        <div className="mx-auto w-full max-w-[1080px]">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="mt-6 h-12 w-80 max-w-full" />
          <Skeleton className="mt-3 h-5 w-[34rem] max-w-full" />
        </div>
      </header>

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
                <Skeleton className="mt-5 h-10 w-full max-w-md bg-white/18" />
                <Skeleton className="mt-3 h-5 w-full max-w-lg bg-white/18" />
                <Skeleton className="mt-2 h-5 w-4/5 max-w-md bg-white/18" />
              </div>

              <Skeleton className="h-11 w-56 bg-white/18" />
            </div>
          </Card>

          <Card
            className="relative min-h-[18rem] overflow-hidden border-primary bg-[linear-gradient(145deg,var(--bleu-clair),var(--bleu-moyen))]"
            padding="none"
            variant="outlined"
          >
            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
              <Skeleton className="h-9 w-28 bg-white/80" />
              <CreditCard
                aria-hidden="true"
                className="size-8 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <Image
              alt=""
              className="absolute right-4 bottom-[-4.5rem] h-[24rem] w-auto rotate-[10deg] opacity-55 drop-shadow-[0_22px_30px_rgba(25,114,210,0.2)]"
              height={678}
              src="/assets/passes/passe-navigo.svg"
              unoptimized
              width={430}
            />
          </Card>
        </section>

        <Card
          className="border-primary/10 bg-[color-mix(in_srgb,var(--bleu-clair)_56%,white)] shadow-none"
          variant="outlined"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-6 w-56 max-w-full" />
              <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
            </div>
            <Skeleton className="h-11 w-full sm:w-40" />
          </div>
        </Card>

        <section className="grid gap-5">
          <LoadingSectionHeading />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {["annual", "monthly", "daily"].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          <LoadingSectionHeading compact />
          <div className="grid gap-4 md:grid-cols-2">
            {["frequent", "occasional"].map((item) => (
              <AudienceSkeleton key={item} />
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          <LoadingSectionHeading compact />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["active", "young", "senior"].map((item) => (
              <AudienceSkeleton key={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function LoadingSectionHeading({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-hidden="true">
      <Skeleton className={compact ? "h-7 w-56" : "h-8 w-72 max-w-full"} />
      {compact ? null : <Skeleton className="mt-3 h-4 w-96 max-w-full" />}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <Card
      className="overflow-hidden border-primary/10 shadow-[var(--idfm-card-shadow)]"
      padding="none"
      variant="outlined"
    >
      <div className="flex h-36 items-end justify-center bg-[var(--bleu-clair)] px-5 pt-5">
        <Skeleton className="h-28 w-36 bg-white/85" />
      </div>
      <div className="p-5">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="mt-5 h-11 w-full" />
      </div>
    </Card>
  );
}

function AudienceSkeleton() {
  return (
    <Card
      className="overflow-hidden border-primary/10 shadow-[var(--idfm-card-shadow)]"
      padding="none"
      variant="outlined"
    >
      <div className="grid min-h-36 grid-cols-[6rem_minmax(0,1fr)] gap-4 p-4">
        <Skeleton className="h-full min-h-28 bg-[var(--bleu-clair)]" />
        <div className="min-w-0 self-center">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/5" />
        </div>
      </div>
    </Card>
  );
}
