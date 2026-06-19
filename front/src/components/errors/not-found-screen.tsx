import {
  ArrowRight,
  Home,
  type LucideIcon,
  MessageSquare,
  Search,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/actions/button/button";
import { Card } from "@/components/ui/card/card";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/pathnames";
import { cn } from "@/lib/utils";

type AppHref = StaticPathname;
type RecoveryActionId = "assistant" | "home" | "passes";

export type NotFoundScreenCopy = {
  actions: Record<
    RecoveryActionId,
    {
      description: string;
      label: string;
    }
  >;
  description: string;
  imageAlt: string;
  kicker: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  statusLabel: string;
  title: string;
};

type NotFoundScreenProps = {
  copy: NotFoundScreenCopy;
};

const recoveryActions: Array<{
  href: AppHref;
  icon: LucideIcon;
  id: RecoveryActionId;
  tone: "accent" | "neutral" | "primary";
}> = [
  {
    href: "/",
    icon: Home,
    id: "home",
    tone: "primary",
  },
  {
    href: "/passes",
    icon: Search,
    id: "passes",
    tone: "accent",
  },
  {
    href: "/assistant",
    icon: MessageSquare,
    id: "assistant",
    tone: "neutral",
  },
];

const actionToneClasses = {
  accent:
    "bg-[color-mix(in_srgb,var(--profil-etudiant)_18%,white)] text-[var(--profil-etudiant)]",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-accent text-primary",
} satisfies Record<(typeof recoveryActions)[number]["tone"], string>;

export function NotFoundScreen({ copy }: NotFoundScreenProps) {
  return (
    <main className="min-h-dvh bg-[var(--bleu-clair)]">
      <section className="relative overflow-hidden bg-[var(--anthracite)] px-5 py-10 text-white max-[359px]:py-7 md:py-16">
        <div className="relative mx-auto grid w-full max-w-[1080px] gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-center">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase leading-5 text-[var(--bleu-idf)]">
              {copy.kicker}
            </p>
            <h1 className="mt-3 max-w-[40rem] text-balance text-[2.5rem] font-bold leading-[1.12] max-[359px]:text-[2rem] max-[359px]:leading-[1.08] md:text-5xl md:leading-[57.6px]">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[38rem] text-pretty text-base leading-6 text-white/84 md:text-lg md:leading-[27px]">
              {copy.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-5" size={null}>
                <Link href="/">
                  <Home aria-hidden="true" data-icon="inline-start" />
                  <span>{copy.primaryCtaLabel}</span>
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 border-white/70 bg-transparent px-5 text-white hover:border-white hover:bg-white hover:text-primary focus-visible:ring-white/70 active:bg-white active:text-primary"
                size={null}
                variant="secondary"
              >
                <Link href="/passes">
                  <Search aria-hidden="true" data-icon="inline-start" />
                  <span>{copy.secondaryCtaLabel}</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[17rem] overflow-hidden rounded-[6px] border border-white/16 bg-white/8 p-5 shadow-[0_22px_48px_rgba(0,0,0,0.18)] max-[359px]:min-h-[13rem] max-[359px]:p-4">
            <div
              aria-hidden="true"
              className="absolute top-11 right-6 left-6 h-1 rounded-full bg-white/22 max-[359px]:top-10 max-[359px]:right-5 max-[359px]:left-5"
            >
              <span className="absolute -top-1 left-[12%] size-3 rounded-full bg-[var(--bleu-idf)]" />
              <span className="absolute -top-1 left-[47%] size-3 rounded-full bg-white" />
              <span className="absolute -top-1 right-[12%] size-3 rounded-full bg-[var(--rouge-clair)]" />
            </div>
            <div className="relative flex h-full min-h-[14.5rem] flex-col justify-between gap-6 max-[359px]:min-h-[10.75rem]">
              <div>
                <p className="text-sm font-semibold leading-5 text-white/72">
                  {copy.statusLabel}
                </p>
                <p className="mt-2 text-[4rem] font-bold leading-none text-white max-[359px]:text-[3.5rem] min-[390px]:text-[4.5rem] md:text-[6rem]">
                  404
                </p>
              </div>
              <Image
                alt={copy.imageAlt}
                className="ml-auto h-24 w-auto max-w-[72%] object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.28)] max-[359px]:h-16 max-[359px]:max-w-[58%] md:h-32"
                height={154}
                priority
                src="/assets/passes/passe-navigo-full.svg"
                unoptimized
                width={240}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label={copy.kicker}
        className="mx-auto grid w-full max-w-[1080px] gap-4 px-5 pt-24 pb-6 max-[359px]:pt-28 md:grid-cols-3 md:py-8"
      >
        {recoveryActions.map((action) => (
          <RecoveryActionCard
            description={copy.actions[action.id].description}
            href={action.href}
            icon={action.icon}
            key={action.id}
            label={copy.actions[action.id].label}
            tone={action.tone}
          />
        ))}
      </section>
    </main>
  );
}

function RecoveryActionCard({
  description,
  href,
  icon: Icon,
  label,
  tone,
}: {
  description: string;
  href: AppHref;
  icon: LucideIcon;
  label: string;
  tone: keyof typeof actionToneClasses;
}) {
  return (
    <Card
      asChild
      className="min-h-[8rem] overflow-hidden"
      interactive
      padding="none"
      variant="buttonCard"
    >
      <Link href={href} className="flex h-full min-w-0 gap-4 p-5 text-left">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-[6px]",
            actionToneClasses[tone],
          )}
        >
          <Icon className="size-6 stroke-[1.75]" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex items-start justify-between gap-3 text-[1.125rem] font-bold leading-[27px] text-foreground">
            <span>{label}</span>
            <ArrowRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-primary"
            />
          </span>
          <span className="text-pretty text-sm leading-5 text-muted-foreground">
            {description}
          </span>
        </span>
      </Link>
    </Card>
  );
}
