"use client";

import { Bell, CreditCard, FolderOpen, HelpCircle, Zap } from "lucide-react";

import { Logo } from "@/components/assets/logo/logo";
import { useAuth } from "@/contexts/auth-context";
import type { Me } from "@/utils/types";
import {
  AssistantPromoCard,
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
    greeting: string;
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
    href: "/my-card",
    icon: CreditCard,
    tone: "profile",
  },
  folder: {
    href: "/my-folder",
    icon: FolderOpen,
    tone: "primary",
  },
  help: {
    href: "/account/settings",
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

  return (
    <main className="min-h-dvh bg-background">
      <section className="relative overflow-hidden bg-[var(--anthracite)] px-5 pt-12 pb-24 text-white md:px-8 md:pt-16 md:pb-28">
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-24 size-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--bleu-idf),var(--bleu-focus)_70%)] opacity-45 md:-top-28 md:right-[max(2rem,calc((100vw-64rem)/2))] md:size-96"
        />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8">
          <Logo
            alt={copy.hero.brand}
            className="w-36 drop-shadow-[0_0.5rem_1.5rem_color-mix(in_srgb,var(--anthracite)_24%,transparent)] min-[360px]:w-40 sm:w-48 md:w-56"
            priority
            variant="couleur"
          />

          <h1 className="max-w-[28rem] text-balance text-4xl font-extrabold leading-tight md:text-5xl">
            {getGreeting(copy, user)}
          </h1>
        </div>
      </section>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 md:px-8">
        <div className="-mt-16">
          <AssistantPromoCard
            ctaLabel={copy.assistant.ctaLabel}
            description={copy.assistant.description}
            href="/assistant"
            title={copy.assistant.title}
          />
        </div>

        <section
          aria-labelledby="quick-access-title"
          className="flex flex-col gap-4"
        >
          <h2
            className="text-base font-extrabold uppercase leading-none tracking-[0.14em] text-muted-foreground"
            id="quick-access-title"
          >
            {copy.quickAccess.heading}
          </h2>
          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-3 md:gap-5">
            {copy.quickAccess.items.map((item) => {
              const config = quickActionConfig[item.id];

              return (
                <QuickAccessCard
                  description={item.description}
                  href={config.href}
                  icon={config.icon}
                  key={item.id}
                  title={item.title}
                  tone={config.tone}
                />
              );
            })}
          </div>
        </section>

        <RegionPassCard
          description={copy.region.description}
          href="/assistant"
          label={copy.region.label}
          title={copy.region.title}
        />

        <section aria-labelledby="news-title" className="flex flex-col gap-4">
          <h2
            className="text-base font-extrabold uppercase leading-none tracking-[0.14em] text-muted-foreground"
            id="news-title"
          >
            {copy.news.heading}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
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
      </div>
    </main>
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
