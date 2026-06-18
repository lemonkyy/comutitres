"use client";

import { Bell, CreditCard, FolderOpen, HelpCircle, Zap } from "lucide-react";

import { Logo } from "@/components/assets/logo/logo";
import { useAssistantPanel } from "@/contexts/assistant-panel-context";
import { useAuth } from "@/contexts/auth-context";
import type { Me } from "@/utils/types";
import {
  AssistantPromoCard,
  HeroCtaGroup,
  NewsCard,
  QuickAccessCard,
  RegionPassCard,
} from "./home-cards";

export type QuickActionId = "folder" | "card" | "help";
export type NewsId = "renewal" | "solidarity";

export type HomeScreenCopy = {
  assistant: {
    ctaLabel: string;
    description: string;
    title: string;
  };
  hero: {
    anonymousGreeting: string;
    brand: string;
    description: string;
    greeting: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  news: {
    heading: string;
    items: Array<{
      body: string;
      id: NewsId;
      title: string;
    }>;
  };
  quickAccess: {
    heading: string;
    items: Array<{
      description: string;
      id: QuickActionId;
      title: string;
    }>;
  };
  region: {
    description: string;
    label: string;
    title: string;
  };
};

const quickActionConfig = {
  card: {
    href: "/passes",
    icon: CreditCard,
    tone: "profile",
  },
  folder: {
    href: "/account",
    icon: FolderOpen,
    tone: "primary",
  },
  help: {
    href: "/assistant",
    icon: HelpCircle,
    tone: "neutral",
  },
} as const;

const newsConfig = {
  renewal: {
    icon: Bell,
    tone: "primary",
  },
  solidarity: {
    icon: Zap,
    tone: "success",
  },
} as const;

type HomeScreenProps = {
  copy: HomeScreenCopy;
};

export function HomeScreen({ copy }: HomeScreenProps) {
  const { user } = useAuth();
  const { openAssistant } = useAssistantPanel();

  return (
    <main className="min-h-dvh bg-[var(--bleu-clair)]">
      <section className="relative overflow-hidden bg-[var(--anthracite)] px-5 pt-8 pb-24 text-white md:pt-14 md:pb-28">
        <div className="relative mx-auto flex max-w-[1080px]">
          <div className="flex w-full min-w-0 max-w-[42.5rem] flex-col gap-6">
            <Logo
              alt={copy.hero.brand}
              className="w-36 max-w-none min-[390px]:w-40 md:hidden"
              priority
              variant="blanc"
            />
            <div className="min-w-0">
              <h1 className="text-balance text-[2.5rem] font-bold leading-[1.12] md:text-5xl md:leading-[57.6px]">
                {getGreeting(copy, user)}
              </h1>
              <p className="mt-4 max-w-[38rem] text-pretty text-base leading-6 text-white/84 md:text-lg md:leading-[27px]">
                {copy.hero.description}
              </p>
            </div>
            <HeroCtaGroup
              assistantLabel={copy.hero.secondaryCtaLabel}
              onAssistantOpen={openAssistant}
              passesLabel={copy.hero.primaryCtaLabel}
            />
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-5 pb-10 md:gap-12 md:pb-14">
        <div className="-mt-14 md:-mt-16">
          <AssistantPromoCard
            ctaLabel={copy.assistant.ctaLabel}
            description={copy.assistant.description}
            href="/assistant"
            onAssistantOpen={openAssistant}
            title={copy.assistant.title}
          />
        </div>

        <section
          aria-labelledby="quick-access-title"
          className="flex flex-col gap-5"
        >
          <SectionHeading
            id="quick-access-title"
            title={copy.quickAccess.heading}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {copy.quickAccess.items.map((item) => {
              const config = quickActionConfig[item.id];

              return (
                <QuickAccessCard
                  description={item.description}
                  href={config.href}
                  icon={config.icon}
                  key={item.id}
                  onDesktopOpen={item.id === "help" ? openAssistant : undefined}
                  title={item.title}
                  tone={config.tone}
                />
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] md:items-start">
          <RegionPassCard
            description={copy.region.description}
            href="/passes"
            label={copy.region.label}
            title={copy.region.title}
          />

          <section aria-labelledby="news-title" className="flex flex-col gap-5">
            <SectionHeading id="news-title" title={copy.news.heading} />
            <div className="grid gap-4">
              {copy.news.items.map((item) => {
                const config = newsConfig[item.id];

                return (
                  <NewsCard
                    body={item.body}
                    icon={config.icon}
                    key={item.id}
                    title={item.title}
                    tone={config.tone}
                  />
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({
  description,
  id,
  title,
}: {
  description?: string;
  id: string;
  title: string;
}) {
  return (
    <div className="max-w-[42.5rem]">
      <h2
        className="text-balance text-[1.75rem] font-bold leading-[36.4px] text-foreground md:text-[2rem] md:leading-[38px]"
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-pretty text-base leading-6 text-muted-foreground md:text-lg md:leading-[27px]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function getGreeting(copy: HomeScreenCopy, user: Me | null) {
  if (!user) {
    return copy.hero.anonymousGreeting;
  }

  const name = user.givenName || user.familyName || user.email;

  if (!name) {
    return copy.hero.anonymousGreeting;
  }

  return `${copy.hero.greeting}, ${name}`;
}
