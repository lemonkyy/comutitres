import {
  ChevronRight,
  type LucideIcon,
  MapPin,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import type { pathnames } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = keyof typeof pathnames;

type IconTone = "primary" | "profile" | "neutral" | "success";

const iconToneClasses: Record<IconTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-accent text-primary",
  profile:
    "bg-[color-mix(in_srgb,var(--profil-etudiant)_18%,white)] text-[var(--profil-etudiant)]",
  success:
    "bg-[color-mix(in_srgb,var(--profil-senior)_16%,white)] text-[var(--profil-senior)]",
};

type AssistantPromoCardProps = {
  ctaLabel: string;
  description: string;
  href: AppHref;
  title: string;
};

export function AssistantPromoCard({
  ctaLabel,
  description,
  href,
  title,
}: AssistantPromoCardProps) {
  return (
    <Card
      className="border-[var(--bleu-moyen)]"
      padding="lg"
      variant="elevated"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4 sm:gap-5">
          <span
            aria-hidden="true"
            className="grid size-16 shrink-0 place-items-center rounded-[1.25rem] bg-background text-primary sm:size-20"
          >
            <MessageSquare className="size-7 stroke-[1.75] sm:size-8" />
          </span>
          <div className="min-w-0">
            <h2 className="text-balance text-2xl font-extrabold leading-tight text-foreground md:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-[38rem] text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
              {description}
            </p>
          </div>
        </div>

        <Button
          asChild
          size={null}
          className="min-h-14 w-full gap-3 rounded-[1.25rem] px-4 text-base font-extrabold [--button-icon-size:1.25rem] has-[>svg]:px-4 sm:min-h-16 sm:text-xl sm:[--button-icon-size:1.5rem]"
        >
          <Link href={href}>
            <MessageSquare data-icon="inline-start" />
            <span>{ctaLabel}</span>
            <ChevronRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

type QuickAccessCardProps = {
  description: string;
  href: AppHref;
  icon: LucideIcon;
  title: string;
  tone: IconTone;
};

export function QuickAccessCard({
  description,
  href,
  icon: Icon,
  title,
  tone,
}: QuickAccessCardProps) {
  return (
    <Card
      asChild
      className="min-h-[8.75rem] rounded-[1.25rem]"
      interactive
      padding="none"
    >
      <Link
        href={href}
        className="flex h-full flex-col items-center justify-center gap-3 p-3 text-center sm:p-4"
      >
        <span
          aria-hidden="true"
          className={cn(
            "grid size-14 place-items-center rounded-[1.25rem]",
            iconToneClasses[tone],
          )}
        >
          <Icon className="size-7 stroke-[1.75]" />
        </span>
        <span className="flex min-w-0 flex-col gap-2">
          <span className="text-base font-extrabold leading-tight text-foreground sm:text-lg">
            {title}
          </span>
          <span className="text-sm font-bold leading-tight text-muted-foreground">
            {description}
          </span>
        </span>
      </Link>
    </Card>
  );
}

type RegionPassCardProps = {
  description: string;
  href: AppHref;
  label: string;
  title: string;
};

export function RegionPassCard({
  description,
  href,
  label,
  title,
}: RegionPassCardProps) {
  return (
    <Card
      asChild
      className="overflow-hidden rounded-[1.5rem]"
      interactive
      padding="none"
    >
      <Link href={href} className="block">
        <div className="flex min-h-32 items-center justify-center bg-[linear-gradient(135deg,var(--bleu-moyen)_0%,var(--bleu-clair)_100%)] px-5 py-10 text-primary">
          <div className="flex items-center gap-3 text-center">
            <MapPin
              aria-hidden="true"
              className="size-8 shrink-0 stroke-[1.75]"
            />
            <span className="text-xl font-extrabold leading-tight sm:text-2xl">
              {label}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <span className="min-w-0">
            <span className="block text-xl font-extrabold leading-tight text-foreground">
              {title}
            </span>
            <span className="mt-1 block text-lg leading-tight text-muted-foreground">
              {description}
            </span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className="size-7 shrink-0 stroke-[1.75] text-primary"
          />
        </div>
      </Link>
    </Card>
  );
}

type NewsCardProps = {
  body: string;
  icon: LucideIcon;
  title: string;
  tone: IconTone;
};

export function NewsCard({ body, icon: Icon, title, tone }: NewsCardProps) {
  return (
    <Card
      asChild
      className={cn(
        "rounded-[1.25rem]",
        tone === "primary" && "bg-accent",
        tone === "success" &&
          "bg-[color-mix(in_srgb,var(--profil-senior)_14%,white)]",
      )}
      padding="md"
      variant="flat"
    >
      <article className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-[1rem] bg-card/80",
            iconToneClasses[tone],
          )}
        >
          <Icon className="size-6 stroke-[1.75]" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold leading-snug text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      </article>
    </Card>
  );
}
