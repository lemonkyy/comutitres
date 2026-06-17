import Image from "next/image";

import { Card } from "@/components/ui/card/card";
import { cn } from "@/lib/utils";
import { toneClasses } from "./passes-card-tones";
import type { AudienceConfig, PassAudienceCopy } from "./passes-config";

type AudienceCardProps<TId extends string> = {
  copy: PassAudienceCopy;
  item: AudienceConfig<TId>;
};

export function AudienceCard<TId extends string>({
  copy,
  item,
}: AudienceCardProps<TId>) {
  return (
    <Card asChild className="overflow-hidden" padding="none" variant="outlined">
      <article className="flex min-h-32 items-center gap-4 p-4">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-16 shrink-0 place-items-center overflow-hidden rounded-[6px]",
            toneClasses[item.tone],
          )}
        >
          <Image
            alt=""
            className="h-12 w-12 object-contain"
            height={72}
            src={item.asset}
            unoptimized
            width={72}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1.375rem] font-bold leading-[30.8px] text-foreground">
            {copy.title}
          </span>
          <span className="mt-1 block text-base leading-6 text-muted-foreground">
            {copy.description}
          </span>
        </span>
      </article>
    </Card>
  );
}
