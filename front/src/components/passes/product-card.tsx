import Image from "next/image";

import { Card } from "@/components/ui/card/card";
import { cn } from "@/lib/utils";
import { toneClasses } from "./passes-card-tones";
import type { PassProductCopy, ProductPresentation } from "./passes-config";

type ProductCardProps = {
  className?: string;
  copy: PassProductCopy;
  presentation: ProductPresentation;
  unavailableLabel: string;
};

export function ProductCard({
  className,
  copy,
  presentation,
  unavailableLabel,
}: ProductCardProps) {
  return (
    <Card
      className={cn("flex min-h-[21rem] flex-col overflow-hidden", className)}
      padding="none"
      variant="elevated"
    >
      <div
        className={cn(
          "flex h-36 items-end justify-center overflow-hidden px-5 pt-6",
          toneClasses[presentation.tone],
        )}
      >
        <Image
          alt=""
          className="h-28 w-auto max-w-full object-contain object-bottom drop-shadow-[0_14px_20px_rgba(37,48,59,0.18)]"
          height={150}
          src={presentation.asset}
          unoptimized
          width={220}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="min-w-0">
          <h3 className="text-balance text-[1.375rem] font-bold leading-[30.8px] text-foreground">
            {copy.title}
          </h3>
        </div>
        {copy.description ? (
          <p className="text-pretty text-base leading-6 text-foreground">
            {copy.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 border-[color-mix(in_srgb,var(--anthracite)_12%,transparent)] border-t pt-4">
          {copy.price ? (
            <span className="text-[1.125rem] font-bold leading-7 text-foreground">
              {copy.price}
            </span>
          ) : null}
          <span className="inline-flex min-h-10 items-center justify-center rounded-[6px] border border-border bg-[var(--gris-clair-40)] px-3 text-sm font-semibold leading-5 text-muted-foreground">
            {unavailableLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}
