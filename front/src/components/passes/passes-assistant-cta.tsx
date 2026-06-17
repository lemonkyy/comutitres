"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { useAssistantPanel } from "@/contexts/assistant-panel-context";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type PassesAssistantCtaProps = {
  className?: string;
  label: string;
};

export function PassesAssistantCta({
  className,
  label,
}: PassesAssistantCtaProps) {
  const { openAssistant } = useAssistantPanel();
  const buttonClassName = cn(
    "assistant-pressable-motion w-full gap-2 bg-white text-primary hover:bg-[var(--bleu-moyen)] hover:text-[var(--bleu-focus)] md:w-fit",
    className,
  );

  return (
    <>
      <Button asChild className={cn(buttonClassName, "md:hidden")} size="lg">
        <Link href="/assistant">
          <Search aria-hidden="true" className="size-5" />
          <span>{label}</span>
        </Link>
      </Button>
      <Button
        className={cn(buttonClassName, "hidden md:inline-flex")}
        onClick={(event) => {
          openAssistant(event.currentTarget);
        }}
        size="lg"
        type="button"
      >
        <Search aria-hidden="true" className="size-5" />
        <span>{label}</span>
      </Button>
    </>
  );
}
