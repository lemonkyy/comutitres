import { Card } from "@/components/ui/card/card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

export function RouteLoadingFallback() {
  return (
    <main
      aria-busy="true"
      className="min-h-dvh bg-[var(--bleu-clair)] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      <span className="sr-only">Chargement</span>

      <header className="border-b border-[var(--gris-moyen)] bg-white px-5 pt-8 pb-5 md:hidden">
        <div className="flex min-w-0 items-center gap-6">
          <Skeleton className="size-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-8 w-52 max-w-full" />
            <Skeleton className="mt-2 h-4 w-64 max-w-full" />
          </div>
        </div>
      </header>

      <header className="hidden bg-white px-5 pt-10 pb-4 md:block">
        <div className="mx-auto w-full max-w-[1080px]">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="mt-6 h-12 w-[26rem] max-w-full" />
          <Skeleton className="mt-3 h-5 w-[34rem] max-w-full" />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1080px] gap-5 px-5 py-6 md:py-10">
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
            <aside className="border-t bg-accent p-5 lg:border-t-0 lg:border-l lg:p-6">
              <Skeleton className="h-10 w-full bg-white/80" />
              <Skeleton className="mt-4 h-24 w-full bg-white/80" />
            </aside>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["first", "second", "third"].map((item) => (
            <Card
              className="border-primary/10 shadow-[var(--idfm-card-shadow)]"
              key={item}
              variant="outlined"
            >
              <Skeleton className="h-5 w-28" />
              <Skeleton className="mt-4 h-6 w-full" />
              <Skeleton className="mt-3 h-4 w-4/5" />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
