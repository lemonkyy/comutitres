"use client";

import { Bell, CreditCard, FolderOpen, HelpCircle, Zap } from "lucide-react";

import { Logo } from "@/components/assets/logo/logo";
import { useAssistantPanel } from "@/contexts/assistant-panel-context";
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
  const { openAssistant } = useAssistantPanel();

  return (
    <main className="min-h-dvh bg-white">
      <section className="relative overflow-hidden bg-[var(--anthracite)] px-5 pt-12 pb-20 text-white md:px-8 md:pt-16 md:pb-24">
        <div className="relative mx-auto flex max-w-[1080px] flex-col gap-8">
          <Logo
            className="h-10 w-auto max-w-none md:hidden"
            priority
            variant="blanc"
          />
          <h1 className="max-w-[42.5rem] text-balance text-[2.5rem] font-bold leading-[1.2] md:text-5xl md:leading-[57.6px]">
            {getGreeting(copy, user)}
          </h1>
        </div>
      </section>

      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-5 pb-10 md:px-5">
        <div className="-mt-16">
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
          className="flex flex-col gap-4"
        >
          <h2
            className="text-[1.75rem] font-bold leading-[36.4px] text-foreground"
            id="quick-access-title"
          >
            {copy.quickAccess.heading}
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-10">
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
          onAssistantOpen={openAssistant}
          title={copy.region.title}
        />

        <section aria-labelledby="news-title" className="flex flex-col gap-4">
          <h2
            className="text-[1.75rem] font-bold leading-[36.4px] text-foreground"
            id="news-title"
          >
            {copy.news.heading}
          </h2>
          <div className="grid gap-5 md:grid-cols-2 md:gap-10">
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
