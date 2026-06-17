import { LogIn } from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import type { pathnames } from "@/i18n/pathnames";

type AppHref = keyof typeof pathnames;

export type AuthPromptCopy = {
  ctaLabel: string;
  description: string;
  title: string;
};

type AuthPromptProps = {
  copy: AuthPromptCopy;
  returnTo?: AppHref;
};

export function AuthPrompt({ copy, returnTo = "/account" }: AuthPromptProps) {
  return (
    <Card className="overflow-hidden" padding="none" variant="outlined">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 gap-4">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"
          >
            <LogIn className="size-5 stroke-[1.75]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold leading-tight">
              {copy.title}
            </h2>
            <p className="mt-1 text-sm leading-normal text-muted-foreground">
              {copy.description}
            </p>
          </div>
        </div>

        <Button asChild className="w-full sm:w-fit">
          <Link
            href={{
              pathname: "/login",
              query: { retour: returnTo },
            }}
          >
            <LogIn data-icon="inline-start" />
            {copy.ctaLabel}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
