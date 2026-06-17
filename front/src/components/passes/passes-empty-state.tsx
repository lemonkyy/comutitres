import { Ticket } from "lucide-react";

import { Card } from "@/components/ui/card/card";

type PassesEmptyStateProps = {
  description: string;
  title: string;
};

export function PassesEmptyState({
  description,
  title,
}: PassesEmptyStateProps) {
  return (
    <Card className="border-dashed" padding="lg" variant="outlined">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-[6px] bg-accent text-primary"
        >
          <Ticket className="size-6" />
        </span>
        <span className="min-w-0">
          <span className="block text-[1.375rem] font-bold leading-[30.8px] text-foreground">
            {title}
          </span>
          <span className="mt-1 block text-base leading-6 text-muted-foreground">
            {description}
          </span>
        </span>
      </div>
    </Card>
  );
}
