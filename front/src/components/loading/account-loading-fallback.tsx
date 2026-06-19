import { Card } from "@/components/ui/card/card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

const navItems = ["account", "passes", "documents", "settings"] as const;

export function AccountLoadingFallback() {
  return (
    <main
      aria-busy="true"
      className="min-h-dvh bg-[var(--bleu-clair)] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      <span className="sr-only">Chargement</span>

      <div className="md:hidden">
        <header className="border-b border-[var(--gris-moyen)] bg-white px-5 pt-8 pb-5">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-5">
            <div className="flex min-w-0 items-center gap-6">
              <Skeleton className="size-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-8 w-44 max-w-full" />
                <Skeleton className="mt-2 h-4 w-64 max-w-full" />
              </div>
            </div>

            <nav
              aria-label="Chargement de la navigation du compte"
              className="relative -mx-5 -mb-5 overflow-hidden border-[var(--gris-moyen)] border-b px-5"
            >
              <div className="flex min-w-max items-end gap-4 py-3">
                {navItems.map((item) => (
                  <Skeleton className="h-5 w-20" key={item} />
                ))}
              </div>
            </nav>
          </div>
        </header>
      </div>

      <header className="hidden bg-[var(--bleu-clair)] px-5 pt-10 pb-4 md:block">
        <div className="mx-auto w-full max-w-[1240px]">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="mt-6 h-12 w-72" />
          <Skeleton className="mt-3 h-5 w-[34rem] max-w-full" />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1240px] gap-6 px-5 py-5 md:w-[calc(100%-2.5rem)] md:grid-cols-[15rem_minmax(0,1fr)] md:px-0 md:py-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8 lg:py-10">
        <aside className="hidden md:block">
          <nav
            aria-label="Chargement de la navigation du compte"
            className="sticky top-6 rounded-[6px] border border-[color-mix(in_srgb,var(--primary)_14%,transparent)] bg-white p-2 shadow-[var(--idfm-card-shadow)]"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <div
                  className="flex min-h-12 items-center gap-3 rounded-[6px] px-3"
                  key={item}
                >
                  <Skeleton className="size-9 shrink-0 bg-[var(--bleu-clair)]" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </nav>
        </aside>

        <div className="min-w-0">
          <AccountContentSkeleton />
        </div>
      </div>
    </main>
  );
}

function AccountContentSkeleton() {
  return (
    <div className="grid gap-5">
      <Card
        className="overflow-hidden border-primary/10 shadow-[var(--idfm-card-shadow)]"
        padding="none"
        variant="outlined"
      >
        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="p-5 sm:p-6 lg:p-[30px]">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="mt-5 h-8 w-80 max-w-full" />
            <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
            <Skeleton className="mt-2 h-4 w-3/5 max-w-lg" />
          </section>

          <aside className="border-t bg-[var(--gris-clair-40)] p-5 lg:border-t-0 lg:border-l lg:p-6">
            <div className="grid content-start gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </aside>
        </div>
      </Card>

      <div className="grid gap-4">
        {["primary", "secondary", "tertiary"].map((item) => (
          <Card
            className="overflow-hidden border-primary/10 shadow-[var(--idfm-card-shadow)]"
            key={item}
            padding="none"
            variant="outlined"
          >
            <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center sm:p-6">
              <div className="min-w-0">
                <Skeleton className="h-6 w-64 max-w-full" />
                <Skeleton className="mt-3 h-4 w-full max-w-xl" />
                <Skeleton className="mt-2 h-4 w-3/5 max-w-md" />
              </div>
              <Skeleton className="h-11 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
