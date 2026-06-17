import { ChevronLeft, type LucideIcon } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/actions/button/button";
import { Link } from "@/i18n/navigation";
import type { pathnames } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = keyof typeof pathnames;
type SubtitleTone = "muted" | "primary" | "profile";
type IconButtonTone = "neutral" | "accent";

const subtitleToneClasses: Record<SubtitleTone, string> = {
  muted: "text-muted-foreground",
  primary: "text-primary",
  profile: "text-[var(--profil-etudiant)]",
};

const iconButtonToneClasses: Record<IconButtonTone, string> = {
  accent:
    "border-primary bg-white text-primary hover:bg-[var(--bleu-focus)] hover:text-white focus-visible:bg-white",
  neutral:
    "border-[var(--gris-moyen)] bg-white text-primary hover:border-[var(--bleu-focus)] hover:bg-[var(--bleu-focus)] hover:text-white",
};

export type PageHeaderIconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "size" | "variant"
> & {
  href?: AppHref;
  icon: LucideIcon;
  label: string;
  tone?: IconButtonTone;
};

export function PageHeaderIconButton({
  className,
  href,
  icon: Icon,
  label,
  tone = "neutral",
  type = "button",
  ...props
}: PageHeaderIconButtonProps) {
  const buttonClassName = cn(
    "size-11 rounded-[6px] border [--button-icon-size:1.25rem]",
    iconButtonToneClasses[tone],
    className,
  );

  const icon = <Icon aria-hidden="true" data-icon="inline-start" />;

  return href ? (
    <Button
      asChild
      className={buttonClassName}
      size={null}
      variant="secondary"
      {...props}
    >
      <Link aria-label={label} href={href}>
        {icon}
      </Link>
    </Button>
  ) : (
    <Button
      aria-label={label}
      className={buttonClassName}
      size={null}
      type={type}
      variant="secondary"
      {...props}
    >
      {icon}
    </Button>
  );
}

export type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  action?: React.ReactNode;
  backButton?: React.ReactNode;
  backHref?: AppHref;
  backLabel?: string;
  contentClassName?: string;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  subtitleTone?: SubtitleTone;
  title: React.ReactNode;
  titleClassName?: string;
};

export function PageHeader({
  action,
  backButton,
  backHref,
  backLabel = "Retour",
  children,
  className,
  contentClassName,
  subtitle,
  subtitleClassName,
  subtitleTone = "muted",
  title,
  titleClassName,
  ...props
}: PageHeaderProps) {
  const leading = backButton ?? getDefaultBackButton(backHref, backLabel);

  return (
    <header
      className={cn(
        "border-b border-[var(--gris-moyen)] bg-white px-5 pt-8 pb-5 md:px-5 md:pt-10 md:pb-8",
        className,
      )}
      data-slot="page-header"
      {...props}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1080px] flex-col gap-5",
          contentClassName,
        )}
      >
        <div className="flex min-w-0 items-center gap-6">
          {leading ? <div className="shrink-0">{leading}</div> : null}

          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                "truncate text-[1.75rem] font-bold leading-[36.4px] tracking-normal text-foreground md:text-5xl md:leading-[57.6px]",
                titleClassName,
              )}
            >
              {title}
            </h1>
            {subtitle ? (
              <p
                className={cn(
                  "mt-1 truncate text-base font-semibold leading-tight tracking-normal",
                  subtitleToneClasses[subtitleTone],
                  subtitleClassName,
                )}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        {children ? <div className="min-w-0">{children}</div> : null}
      </div>
    </header>
  );
}

function getDefaultBackButton(href: AppHref | undefined, label: string) {
  return href ? (
    <PageHeaderIconButton href={href} icon={ChevronLeft} label={label} />
  ) : null;
}
