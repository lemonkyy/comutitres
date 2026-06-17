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
  onAssistantOpen?: (restoreElement?: HTMLElement | null) => void;
  title: string;
};

export function AssistantPromoCard({
  ctaLabel,
  description,
  href,
  onAssistantOpen,
  title,
}: AssistantPromoCardProps) {
  const buttonClassName =
    "min-h-14 w-full gap-3 rounded-[1.25rem] px-4 text-base font-extrabold [--button-icon-size:1.25rem] has-[>svg]:px-4 sm:min-h-16 sm:text-xl sm:[--button-icon-size:1.5rem]";

  return (
    <Card
      className="border-[var(--bleu-moyen)] max-[359px]:p-5"
      padding="lg"
      variant="elevated"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-start gap-4 min-[360px]:flex-row sm:gap-5">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-[1.125rem] bg-background text-primary min-[360px]:size-16 min-[360px]:rounded-[1.25rem] sm:size-20"
          >
            <MessageSquare className="size-6 stroke-[1.75] min-[360px]:size-7 sm:size-8" />
          </span>
          <div className="min-w-0">
            <h2 className="text-balance text-[1.375rem] font-extrabold leading-tight text-foreground min-[360px]:text-2xl md:text-3xl">
              {title}
            </h2>
            <p className="mt-3 max-w-[38rem] text-pretty text-base leading-7 text-muted-foreground min-[360px]:text-lg min-[360px]:leading-8 md:text-xl">
              {description}
            </p>
          </div>
        </div>

        {onAssistantOpen ? (
          <>
            <Button
              asChild
              className={cn(buttonClassName, "md:hidden")}
              size={null}
            >
              <Link href={href}>
                <AssistantCtaContent label={ctaLabel} />
              </Link>
            </Button>
            <Button
              className={cn(buttonClassName, "hidden md:inline-flex")}
              onClick={(event) => {
                onAssistantOpen(event.currentTarget);
              }}
              size={null}
              type="button"
            >
              <AssistantCtaContent label={ctaLabel} />
            </Button>
          </>
        ) : (
          <Button asChild className={buttonClassName} size={null}>
            <Link href={href}>
              <AssistantCtaContent label={ctaLabel} />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}

function AssistantCtaContent({ label }: { label: string }) {
  return (
    <>
      <MessageSquare data-icon="inline-start" />
      <span>{label}</span>
      <ChevronRight data-icon="inline-end" />
    </>
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
      className="min-h-[4.75rem] rounded-[1.25rem] min-[360px]:min-h-[8.75rem]"
      interactive
      padding="none"
    >
      <Link
        href={href}
        className="flex h-full flex-row items-center justify-start gap-3 p-4 text-left min-[360px]:flex-col min-[360px]:justify-center min-[360px]:p-3 min-[360px]:text-center sm:p-4"
      >
        <span
          aria-hidden="true"
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-[1rem] min-[360px]:size-14 min-[360px]:rounded-[1.25rem]",
            iconToneClasses[tone],
          )}
        >
          <Icon className="size-6 stroke-[1.75] min-[360px]:size-7" />
        </span>
        <span className="flex min-w-0 flex-col gap-1 min-[360px]:gap-2">
          <span className="text-base font-extrabold leading-tight text-foreground sm:text-lg">
            {title}
          </span>
          <span className="text-sm font-bold leading-snug text-muted-foreground">
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
  onAssistantOpen?: (restoreElement?: HTMLElement | null) => void;
  title: string;
};

export function RegionPassCard({
  description,
  href,
  label,
  onAssistantOpen,
  title,
}: RegionPassCardProps) {
  const content = (
    <RegionPassCardContent
      description={description}
      label={label}
      title={title}
    />
  );

  if (onAssistantOpen) {
    return (
      <>
        <Card
          asChild
          className="overflow-hidden rounded-[1.5rem] md:hidden"
          interactive
          padding="none"
        >
          <Link href={href} className="block">
            {content}
          </Link>
        </Card>
        <Card
          asChild
          className="hidden overflow-hidden rounded-[1.5rem] md:block"
          interactive
          padding="none"
        >
          <button
            className="block w-full appearance-none text-left"
            onClick={(event) => {
              onAssistantOpen(event.currentTarget);
            }}
            type="button"
          >
            {content}
          </button>
        </Card>
      </>
    );
  }

  return (
    <Card
      asChild
      className="overflow-hidden rounded-[1.5rem]"
      interactive
      padding="none"
    >
      <Link href={href} className="block">
        {content}
      </Link>
    </Card>
  );
}

function RegionPassCardContent({
  description,
  label,
  title,
}: {
  description: string;
  label: string;
  title: string;
}) {
  return (
    <>
      <div className="flex min-h-32 items-center justify-center bg-[linear-gradient(135deg,var(--bleu-moyen)_0%,var(--bleu-clair)_100%)] px-5 py-10 text-primary">
        <div className="flex items-center gap-3 text-center">
          <MapPin
            aria-hidden="true"
            className="size-7 shrink-0 stroke-[1.75] min-[360px]:size-8"
          />
          <span className="text-lg font-extrabold leading-tight min-[360px]:text-xl sm:text-2xl">
            {label}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-5">
        <span className="min-w-0">
          <span className="block text-xl font-extrabold leading-tight text-foreground">
            {title}
          </span>
          <span className="mt-1 block text-base leading-tight text-muted-foreground min-[360px]:text-lg">
            {description}
          </span>
        </span>
        <ChevronRight
          aria-hidden="true"
          className="size-7 shrink-0 stroke-[1.75] text-primary"
        />
      </div>
    </>
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
