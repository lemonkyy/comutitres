"use client";
import { useTranslations } from "next-intl";

import IconsUi from "@/components/mockups/icons-mockup";

export default function UiPage() {
  const t = useTranslations("ui");
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl">UI Playground</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </header>
      <IconsUi />
    </div>
  );
}
