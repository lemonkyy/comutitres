import {
  ChevronRight,
  type LucideIcon,
  MessageSquare,
  Search,
} from "lucide-react";
import Image from "next/image";

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

type HeroCtaGroupProps = {
  assistantLabel: string;
  onAssistantOpen?: (restoreElement?: HTMLElement | null) => void;
  passesLabel: string;
};

export function HeroCtaGroup({
  assistantLabel,
  onAssistantOpen,
  passesLabel,
}: HeroCtaGroupProps) {
  const assistantClassName =
    "h-12 border-white/70 bg-transparent px-5 text-white hover:border-white hover:bg-white hover:text-primary focus-visible:ring-white/70 active:bg-white active:text-primary";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild className="h-12 px-5" size={null}>
        <Link href="/passes">
          <Search aria-hidden="true" data-icon="inline-start" />
          <span>{passesLabel}</span>
        </Link>
      </Button>
      {onAssistantOpen ? (
        <>
          <Button
            asChild
            className={cn(assistantClassName, "md:hidden")}
            size={null}
            variant="secondary"
          >
            <Link href="/assistant">
              <MessageSquare aria-hidden="true" data-icon="inline-start" />
              <span>{assistantLabel}</span>
            </Link>
          </Button>
          <Button
            className={cn(assistantClassName, "hidden md:inline-flex")}
            onClick={(event) => {
              onAssistantOpen(event.currentTarget);
            }}
            size={null}
            type="button"
            variant="secondary"
          >
            <MessageSquare aria-hidden="true" data-icon="inline-start" />
            <span>{assistantLabel}</span>
          </Button>
        </>
      ) : (
        <Button
          asChild
          className={assistantClassName}
          size={null}
          variant="secondary"
        >
          <Link href="/assistant">
            <MessageSquare aria-hidden="true" data-icon="inline-start" />
            <span>{assistantLabel}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}

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
    "min-h-12 w-full gap-3 rounded-[6px] px-5 text-base font-semibold [--button-icon-size:1.25rem] has-[>svg]:px-5 md:w-fit";

  return (
    <Card
      className="overflow-hidden border-primary/10 max-[359px]:p-5"
      padding="none"
      variant="buttonCard"
    >
      <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-[30px]">
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-[6px] bg-accent text-primary sm:size-20"
        >
          <MessageSquare className="size-7 stroke-[1.75] sm:size-8" />
        </span>
        <div className="flex flex-col gap-5 md:min-w-0 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="min-w-0">
            <h2 className="text-balance text-[1.375rem] font-bold leading-[1.4] text-foreground md:text-[1.75rem] md:leading-[36.4px]">
              {title}
            </h2>
            <p className="mt-3 max-w-[42.5rem] text-pretty text-base leading-6 text-foreground md:text-lg md:leading-[27px]">
              {description}
            </p>
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
  onDesktopOpen?: (restoreElement?: HTMLElement | null) => void;
  title: string;
  tone: IconTone;
};

export function QuickAccessCard({
  description,
  href,
  icon: Icon,
  onDesktopOpen,
  title,
  tone,
}: QuickAccessCardProps) {
  const content = (
    <QuickAccessCardContent
      description={description}
      icon={Icon}
      title={title}
      tone={tone}
    />
  );

  if (onDesktopOpen) {
    return (
      <>
        <Card
          asChild
          className="min-h-[7.5rem] overflow-hidden md:hidden"
          interactive
          padding="none"
          variant="buttonCard"
        >
          <Link href={href} className="block h-full text-left">
            {content}
          </Link>
        </Card>
        <Card
          asChild
          className="hidden min-h-[7.5rem] overflow-hidden md:block"
          interactive
          padding="none"
          variant="buttonCard"
        >
          <button
            className="block h-full w-full appearance-none text-left"
            onClick={(event) => {
              onDesktopOpen(event.currentTarget);
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
      className="min-h-[7.5rem] overflow-hidden"
      interactive
      padding="none"
      variant="buttonCard"
    >
      <Link href={href} className="block h-full text-left">
        {content}
      </Link>
    </Card>
  );
}

function QuickAccessCardContent({
  description,
  icon: Icon,
  title,
  tone,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
  tone: IconTone;
}) {
  return (
    <span className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 p-5">
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-[6px] min-[360px]:size-14",
          iconToneClasses[tone],
        )}
      >
        <Icon className="size-6 stroke-[1.75] min-[360px]:size-7" />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-[1.25rem] font-bold leading-7 text-foreground min-[390px]:text-[1.375rem] min-[390px]:leading-[30.8px]">
          {title}
        </span>
        <span className="text-base font-normal leading-6 text-muted-foreground">
          {description}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-6 shrink-0 stroke-[1.75] text-primary"
      />
    </span>
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
          className="overflow-hidden md:hidden"
          interactive
          padding="none"
          variant="elevated"
        >
          <Link href={href} className="block">
            {content}
          </Link>
        </Card>
        <Card
          asChild
          className="hidden overflow-hidden md:block"
          interactive
          padding="none"
          variant="elevated"
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
      className="overflow-hidden"
      interactive
      padding="none"
      variant="elevated"
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
      <div className="flex min-h-32 items-center justify-center overflow-hidden bg-[var(--bleu-clair)] px-5 py-10 text-primary">
        <div className="relative h-44 w-full max-w-[32rem]">
          <Image
            alt=""
            className="absolute bottom-0 left-2 h-32 w-auto drop-shadow-[0_16px_22px_rgba(37,48,59,0.12)]"
            height={121}
            src="/assets/fares/audiences/actif.svg"
            unoptimized
            width={168}
          />
          <Image
            alt=""
            className="absolute top-1/2 right-6 h-40 w-auto -translate-y-1/2 drop-shadow-[0_18px_24px_rgba(25,114,210,0.22)]"
            height={678}
            src="/assets/passes/passe-navigo-full.svg"
            unoptimized
            width={430}
          />
          <span className="absolute top-0 left-0 inline-flex min-h-9 items-center rounded-[6px] bg-white px-3 text-sm font-bold text-primary shadow-[var(--idfm-card-shadow)]">
            {label}
          </span>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between gap-4 bg-card px-5 py-5">
        <span className="min-w-0">
          <span className="block text-[1.375rem] font-bold leading-[30.8px] text-foreground">
            {title}
          </span>
          <span className="mt-1 block text-base leading-6 text-foreground">
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
        "",
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
            "grid size-12 shrink-0 place-items-center rounded-[6px] bg-card/80",
            iconToneClasses[tone],
          )}
        >
          <Icon className="size-6 stroke-[1.75]" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[1.375rem] font-bold leading-[30.8px] text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-base leading-6 text-muted-foreground">
            {body}
          </p>
        </div>
      </article>
    </Card>
  );
}
