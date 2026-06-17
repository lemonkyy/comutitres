import { getTranslations } from "next-intl/server";

import { HomeScreen, type HomeScreenCopy } from "@/components/home/home-screen";

export default async function Home() {
  const t = await getTranslations("home");

  const copy: HomeScreenCopy = {
    assistant: {
      ctaLabel: t("assistant.ctaLabel"),
      description: t("assistant.description"),
      title: t("assistant.title"),
    },
    hero: {
      anonymousGreeting: t("hero.anonymousGreeting"),
      brand: t("hero.brand"),
      greeting: t("hero.greeting"),
    },
    news: {
      heading: t("news.heading"),
      items: [
        {
          body: t("news.items.renewal.body"),
          id: "renewal",
          title: t("news.items.renewal.title"),
        },
        {
          body: t("news.items.solidarity.body"),
          id: "solidarity",
          title: t("news.items.solidarity.title"),
        },
      ],
    },
    quickAccess: {
      heading: t("quickAccess.heading"),
      items: [
        {
          description: t("quickAccess.items.folder.description"),
          id: "folder",
          title: t("quickAccess.items.folder.title"),
        },
        {
          description: t("quickAccess.items.card.description"),
          id: "card",
          title: t("quickAccess.items.card.title"),
        },
        {
          description: t("quickAccess.items.help.description"),
          id: "help",
          title: t("quickAccess.items.help.title"),
        },
      ],
    },
    region: {
      description: t("region.description"),
      label: t("region.label"),
      title: t("region.title"),
    },
  };

  return <HomeScreen copy={copy} />;
}
