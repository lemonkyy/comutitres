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
    "min-h-12 w-full gap-3 rounded-[6px] px-5 text-base font-semibold [--button-icon-size:1.25rem] has-[>svg]:px-5";

  return (
    <Card className="max-[359px]:p-5" padding="lg" variant="buttonCard">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-start gap-4 min-[360px]:flex-row sm:gap-5">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-[6px] bg-accent text-primary min-[360px]:size-16 sm:size-20"
          >
            <MessageSquare className="size-6 stroke-[1.75] min-[360px]:size-7 sm:size-8" />
          </span>
          <div className="min-w-0">
            <h2 className="text-balance text-[1.375rem] font-bold leading-[1.4] text-foreground md:text-[1.75rem] md:leading-[36.4px]">
              {title}
            </h2>
            <p className="mt-3 max-w-[42.5rem] text-pretty text-base leading-6 text-foreground md:text-lg md:leading-[27px]">
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
      className="min-h-[7.5rem]"
      interactive
      padding="none"
      variant="buttonCard"
    >
      <Link
        href={href}
        className="flex h-full flex-row items-center justify-start gap-5 p-5 text-left"
      >
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
          <span className="text-[1.375rem] font-bold leading-[30.8px] text-foreground">
            {title}
          </span>
          <span className="text-base font-normal leading-6 text-foreground">
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
      <div className="flex min-h-32 items-center justify-center bg-[var(--bleu-clair)] px-5 py-10 text-primary">
        <div className="flex items-center gap-3 text-center">
          <MapPin
            aria-hidden="true"
            className="size-7 shrink-0 stroke-[1.75] min-[360px]:size-8"
          />
          <span className="text-[1.375rem] font-bold leading-[30.8px]">
            {label}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-5">
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
          <p className="mt-1 text-base leading-6 text-foreground">{body}</p>
        </div>
      </article>
    </Card>
  );
}
