import { getTranslations } from "next-intl/server";

import {
  NotFoundScreen,
  type NotFoundScreenCopy,
} from "@/components/errors/not-found-screen";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  const copy: NotFoundScreenCopy = {
    actions: {
      assistant: {
        description: t("actions.assistant.description"),
        label: t("actions.assistant.label"),
      },
      home: {
        description: t("actions.home.description"),
        label: t("actions.home.label"),
      },
      passes: {
        description: t("actions.passes.description"),
        label: t("actions.passes.label"),
      },
    },
    description: t("description"),
    imageAlt: t("imageAlt"),
    kicker: t("kicker"),
    primaryCtaLabel: t("primaryCtaLabel"),
    secondaryCtaLabel: t("secondaryCtaLabel"),
    statusLabel: t("statusLabel"),
    title: t("title"),
  };

  return <NotFoundScreen copy={copy} />;
}
